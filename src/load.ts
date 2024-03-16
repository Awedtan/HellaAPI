import { BaseZod, CCStageZod, DefinitionZod, EnemyZod, GameEventZod, GridRangeZod, ItemZod, ModuleZod, OperatorZod, ParadoxZod, RogueThemeZod, SandboxActZod, SkillZod, SkinZod, StageZod } from "hella-types";
import getDb from "./db";
import * as fs from 'fs';
import 'dotenv/config'

const dataPath = 'https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData_YoStar/main/en_US/gamedata';
const backupPath = 'https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/5ba509ad5a07f17b7e220a25f1ff66794dd79af1/en_US/gamedata'; // last commit before removing en_US folder
const cnDataPath = 'https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/zh_CN/gamedata';

const archetypeDict = {};       // Archetype id -> archetype name
const baseDict = {};            // Base skill id -> Base object
const moduleDict = {};          // Module id -> Module object
const operatorDict = {};        // Operator id -> Operator object
const paradoxDict = {};         // Operator id -> Paradox object
const rangeDict = {};           // Range id -> Range object
const skillDict = {};           // Skill id -> Skill object
const skinDict = {};            // Operator id -> Skin object array

const cnArchetypeDict = {};
const cnBaseDict = {};
const cnModuleDict = {};
const cnParadoxDict = {};
const cnRangeDict = {};
const cnSkillDict = {};
const cnSkinDict = {};

const log = (msg: string) => fs.appendFileSync('log.txt', msg + '\n');

const writeToDb = true;
const opOnly = false;

async function main() {
    const start = Date.now();
    const db = await getDb();

    if (!db) {
        console.error('Failed to connect to database');
        return;
    }

    fs.writeFileSync('log.txt', '');

    try {
        // this is passed here because this used to be javascript which did not allow top-level awaits but now its typescript and i could move it out of here but i dont really feel like changing everything so it will stay here
        const { gameConsts } = await (await fetch('https://raw.githubusercontent.com/Awedtan/HellaBot/main/src/constants.json')).json();

        await loadArchetypes(db, gameConsts).catch(console.error);
        await loadBases(db, gameConsts).catch(console.error);
        if (!opOnly) await loadCC(db, gameConsts).catch(console.error);
        if (!opOnly) await loadDefinitions(db, gameConsts).catch(console.error);
        if (!opOnly) await loadEnemies(db, gameConsts).catch(console.error);
        if (!opOnly) await loadEvents(db, gameConsts).catch(console.error);
        if (!opOnly) await loadItems(db, gameConsts).catch(console.error);
        await loadModules(db, gameConsts).catch(console.error);
        await loadParadoxes(db, gameConsts).catch(console.error);
        await loadRanges(db, gameConsts).catch(console.error);
        if (!opOnly) await loadRogueThemes(db, gameConsts).catch(console.error);
        if (!opOnly) await loadSandboxes(db, gameConsts).catch(console.error);
        await loadSkills(db, gameConsts).catch(console.error);
        await loadSkins(db, gameConsts).catch(console.error);
        if (!opOnly) await loadStages(db, gameConsts).catch(console.error);
        await loadOperators(db, gameConsts).catch(console.error);

        await loadCnArchetypes(db, gameConsts).catch(console.error);
        await loadCnBases(db, gameConsts).catch(console.error);
        await loadCnModules(db, gameConsts).catch(console.error);
        await loadCnParadoxes(db, gameConsts).catch(console.error);
        await loadCnRanges(db, gameConsts).catch(console.error);
        await loadCnSkills(db, gameConsts).catch(console.error);
        await loadCnSkins(db, gameConsts).catch(console.error);
        await loadCnOperators(db, gameConsts).catch(console.error);

        console.log(`Finished loading data in ${(Date.now() - start) / 1000}s`);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

function readOperatorIntoArr(opId, file, charEquip, charBaseBuffs, gameConsts) {
    const arr: any[] = [];

    if (['char_512_aprot'].includes(opId)) return []; // why are there two shalems???

    // ID AND DATA
    const opData = file[opId];
    if (opData.tagList === null) return []; // Summons and deployables dont have tags, skip them

    // RECRUIT ID
    const rarityId = gameConsts.tagValues[opData.rarity] ?? 1;
    const positionId = gameConsts.tagValues[opData.position.toLowerCase()] ?? 1;
    const classId = gameConsts.tagValues[gameConsts.professions[opData.profession].toLowerCase()] ?? 1;
    let tagId = 1;
    for (const tag of opData.tagList) {
        tagId *= gameConsts.tagValues[tag.toLowerCase()] ?? 1;
    }
    // Robot is not explicitly defined as a tag, infer from operator description instead
    if (opData.itemDesc !== null && opData.itemDesc.includes('robot')) {
        tagId *= gameConsts.tagValues['robot'];
    }
    const recruitId = rarityId * positionId * classId * tagId;

    // ARCHETYPE
    const opArchetype = archetypeDict[opData.subProfessionId] ?? cnArchetypeDict[opData.subProfessionId];

    // RANGE
    const opRange = rangeDict[opData.phases[opData.phases.length - 1].rangeId] ?? cnRangeDict[opData.phases[opData.phases.length - 1]];

    // SKILLS
    const opSkills = opData.skills.map(s => skillDict[s.skillId] ?? cnSkillDict[s.skillId]);

    // MODULES
    const opModules: any[] = [];
    if (charEquip.hasOwnProperty(opId)) {
        for (const module of charEquip[opId]) {
            if (module.includes('uniequip_001')) continue;
            opModules.push(moduleDict[module] ?? cnModuleDict[module]);
        }
    }

    // SKINS
    const opSkins = skinDict[opId] ?? cnSkinDict[opId] ?? [];

    // BASE SKILLS
    const opBases: any[] = [];
    if (charBaseBuffs.hasOwnProperty(opId)) {
        for (const buff of charBaseBuffs[opId].buffChar) {
            for (const baseData of buff.buffData) {
                opBases.push({ condition: baseData, skill: baseDict[baseData.buffId] ?? cnBaseDict[baseData.buffId] });
            }
        }
    }

    // PARADOX SIMULATION
    const opParadox = paradoxDict[opId] ?? cnParadoxDict[opId] ?? null;

    const opName = opData.name.toLowerCase();
    const keyArr = [opId, opName, opName.split('\'').join('')];
    if (opId === 'char_4055_bgsnow') keyArr.push('Pozemka', 'pozemka');
    if (opId === 'char_4064_mlynar') keyArr.push('Mlynar', 'mlynar');

    arr.push({
        keys: keyArr,
        value: {
            id: opId, recruit: recruitId,
            data: opData,
            archetype: opArchetype,
            range: opRange,
            skills: opSkills,
            modules: opModules,
            skins: opSkins,
            bases: opBases,
            paradox: opParadox
        }
    });

    return arr;
}

async function loadArchetypes(db, gameConsts) {
    const start = Date.now();
    const moduleTable = await (await fetch(`${dataPath}/excel/uniequip_table.json`)).json();
    const subProfDict: { [key: string]: any } = moduleTable.subProfDict;

    const dataArr: any[] = [];
    for (const subProf of Object.values(subProfDict)) {
        archetypeDict[subProf.subProfessionId] = subProf.subProfessionName;
        dataArr.push({ keys: [subProf.subProfessionId], value: subProf.subProfessionName });
    }

    if (writeToDb) {
        console.log(`Writing ${dataArr.length} Archetypes to DB...`);
        await db.collection("archetype").deleteMany({});
        await db.collection("archetype").insertMany(dataArr);
    }
    console.log(`${dataArr.length} Archetypes loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadBases(db, gameConsts) {
    const start = Date.now();

    const buildingData = await (await fetch(`${dataPath}/excel/building_data.json`)).json();
    const buffs: { [key: string]: any } = buildingData.buffs;

    const dataArr: any[] = [];
    for (const buff of Object.values(buffs)) {
        baseDict[buff.buffId] = buff;
        dataArr.push({ keys: [buff.buffId], value: buff });
    }

    for (const datum of Object.values(dataArr)) {
        try {
            BaseZod.parse(datum.value);
        } catch (e: any) {
            log('\nBase type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    if (writeToDb) {
        console.log(`Writing ${dataArr.length} Base skills to DB...`);
        await db.collection("base").deleteMany({});
        await db.collection("base").insertMany(dataArr);
    }
    console.log(`${dataArr.length} Base skills loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadCC(db, gameConsts) {
    const start = Date.now();
    const ccStages = gameConsts.ccStages;

    const dataArr: any[] = [];
    for (const stage of ccStages) {
        const levels = await (await fetch(`${dataPath}/levels/${stage.levelId.toLowerCase()}.json`)).json();
        dataArr.push({ keys: [stage.name.toLowerCase(), stage.levelId.split('/')[2].toLowerCase()], value: { const: stage, levels: levels } })
    }

    for (const datum of Object.values(dataArr)) {
        try {
            CCStageZod.parse(datum.value);
        } catch (e: any) {
            log('\nCC type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    if (writeToDb) {
        console.log(`Writing ${dataArr.length} CC stages to DB...`);
        await db.collection("cc").deleteMany({});
        await db.collection("cc").insertMany(dataArr);
    }
    console.log(`${dataArr.length} CC stages loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadDefinitions(db, gameConsts) {
    const start = Date.now();

    const gamedataConst = await (await fetch(`${dataPath}/excel/gamedata_const.json`)).json();
    const termDescriptionDict: { [key: string]: any } = gamedataConst.termDescriptionDict;

    const dataArr: any[] = [];
    for (const definition of Object.values(termDescriptionDict)) {
        dataArr.push({ keys: [definition.termName.toLowerCase()], value: definition });
    }

    for (const datum of Object.values(dataArr)) {
        try {
            DefinitionZod.parse(datum.value);
        } catch (e: any) {
            log('\nDefinition type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    if (writeToDb) {
        console.log(`Writing ${dataArr.length} Definitions to DB...`);
        await db.collection("define").deleteMany({});
        await db.collection("define").insertMany(dataArr);
    }
    console.log(`${dataArr.length} Definitions loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadEnemies(db, gameConsts) {
    const start = Date.now();

    // Brute force matches between enemy_handbook_table and enemy_database
    // Stores data in enemyDict[enemy] = {excel, levels}
    //      excel = /excel/enemy_handbook_table.json
    //          Contains name, ID, category, description
    //      levels = /levels/enemydata/enemy_database.json
    //          Contains stats, skills, range
    // Unique enemy key is enemyId (enemy_1007_slime)
    // Additional keys are name (originium slug) and enemyIndex (b1)

    const enemyHandbook = await (await fetch(`${dataPath}/excel/enemy_handbook_table.json`)).json();
    const enemyDatabase = await (await fetch(`${dataPath}/levels/enemydata/enemy_database.json`)).json();
    const enemyData: { [key: string]: any } = enemyHandbook.enemyData;
    const enemies = enemyDatabase.enemies;

    const dataArr: any[] = [];
    for (const excel of Object.values(enemyData)) {
        for (const levels of enemies) {
            if (levels.Key !== excel.enemyId) continue; // Brute force matches

            const enemyId = excel.enemyId.toLowerCase();
            const enemyName = excel.name.toLowerCase();
            const keyArr = [enemyId, enemyName, enemyName.split('\'').join(''), excel.enemyIndex.toLowerCase()];

            dataArr.push({ keys: keyArr, value: { excel: excel, levels: levels } });

            break;
        }
    }

    for (const datum of Object.values(dataArr)) {
        try {
            EnemyZod.parse(datum.value);
        } catch (e: any) {
            log('\nEnemy type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    if (writeToDb) {
        console.log(`Writing ${dataArr.length} Enemies to DB...`);
        await db.collection("enemy").deleteMany({});
        await db.collection("enemy").insertMany(dataArr);
    }
    console.log(`${dataArr.length} Enemies loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadEvents(db, gameConsts) {
    const start = Date.now();

    const activityTable = await (await fetch(`${dataPath}/excel/activity_table.json`)).json();
    const basicInfo: { [key: string]: any } = activityTable.basicInfo;

    const dataArr: any[] = [];
    for (const event of Object.values(basicInfo)) {
        dataArr.push({ keys: [event.id], value: event });
    }

    for (const datum of Object.values(dataArr)) {
        try {
            GameEventZod.parse(datum.value);
        } catch (e: any) {
            log('\nGame event type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    if (writeToDb) {
        console.log(`Writing ${dataArr.length} Events to DB...`);
        await db.collection("event").deleteMany({});
        await db.collection("event").insertMany(dataArr);
    }
    console.log(`${dataArr.length} Events loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadItems(db, gameConsts) {
    const start = Date.now();

    const itemTable = await (await fetch(`${dataPath}/excel/item_table.json`)).json();
    const buildingData = await (await fetch(`${dataPath}/excel/building_data.json`)).json();
    const items: { [key: string]: any } = itemTable.items;
    const manufactFormulas = buildingData.manufactFormulas; // Factory formulas
    const workshopFormulas = buildingData.workshopFormulas; // Workshop formulas

    const dataArr: any[] = [];
    for (const data of Object.values(items)) {
        let formula = null;
        if (data.buildingProductList.length > 0) {
            // Factory and workshop formulas can have same id, need to check item craft type
            if (data.buildingProductList[0].roomType === 'MANUFACTURE') {
                formula = manufactFormulas[data.buildingProductList[0].formulaId];
            }
            else if (data.buildingProductList[0].roomType === 'WORKSHOP') {
                formula = workshopFormulas[data.buildingProductList[0].formulaId];
            }
        }

        const itemName = data.name.toLowerCase();
        const keyArr = [data.itemId, itemName, itemName.split('\'').join('')]

        dataArr.push({ keys: keyArr, value: { data: data, formula: formula } });
    }

    for (const datum of Object.values(dataArr)) {
        try {
            ItemZod.parse(datum.value);
        } catch (e: any) {
            log('\nItem type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    if (writeToDb) {
        console.log(`Writing ${dataArr.length} Items to DB...`);
        await db.collection("item").deleteMany({});
        await db.collection("item").insertMany(dataArr);
    }
    console.log(`${dataArr.length} Items loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadModules(db, gameConsts) {
    const start = Date.now();

    const moduleTable = await (await fetch(`${dataPath}/excel/uniequip_table.json`)).json();
    const equipDict: { [key: string]: any } = moduleTable.equipDict;
    const battleDict = await (await fetch(`${dataPath}/excel/battle_equip_table.json`)).json();

    const dataArr: any[] = [];
    for (const module of Object.values(equipDict)) {
        const moduleId = module.uniEquipId.toLowerCase();
        moduleDict[moduleId] = { info: module, data: battleDict[moduleId] };
        dataArr.push({ keys: [moduleId], value: { info: module, data: battleDict[moduleId] ?? null } });
    }

    for (const datum of Object.values(dataArr)) {
        try {
            ModuleZod.parse(datum.value);
        } catch (e: any) {
            log('\nModule type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    if (writeToDb) {
        console.log(`Writing ${dataArr.length} Modules to DB...`);
        await db.collection("module").deleteMany({});
        await db.collection("module").insertMany(dataArr);
    }
    console.log(`${dataArr.length} Modules loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadOperators(db, gameConsts) {
    const start = Date.now();

    const operatorTable = await (await fetch(`${dataPath}/excel/character_table.json`)).json();
    const patchChars = (await (await fetch(`${dataPath}/excel/char_patch_table.json`)).json()).patchChars;
    const charEquip = (await (await fetch(`${dataPath}/excel/uniequip_table.json`)).json()).charEquip;
    const charBaseBuffs = (await (await fetch(`${dataPath}/excel/building_data.json`)).json()).chars;

    const dataArr: any[] = [];
    for (const opId of Object.keys(operatorTable)) {
        dataArr.push(...readOperatorIntoArr(opId, operatorTable, charEquip, charBaseBuffs, gameConsts));
    }
    for (const opId of Object.keys(patchChars)) {
        dataArr.push(...readOperatorIntoArr(opId, patchChars, charEquip, charBaseBuffs, gameConsts));
    }

    for (const datum of dataArr) {
        for (const key of datum.keys) {
            operatorDict[key] = datum.value;
        }
    }

    for (const datum of dataArr) {
        try {
            OperatorZod.parse(datum.value);
        } catch (e: any) {
            log('\nOperator type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    if (writeToDb) {
        console.log(`Writing ${dataArr.length} Operators to DB...`);
        await db.collection("operator").deleteMany({});
        await db.collection("operator").insertMany(dataArr);
    }
    console.log(`${dataArr.length} Operators loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadParadoxes(db, gameConsts) {
    const start = Date.now();

    const handbookTable = await (await fetch(`${dataPath}/excel/handbook_info_table.json`)).json();
    const stages: { [key: string]: any } = handbookTable.handbookStageData;

    const dataArr: any[] = [];
    for (const excel of Object.values(stages)) {
        const levelId = excel.levelId.toLowerCase();
        const levels = await (await fetch(`${dataPath}/levels/${levelId}.json`)).json();
        paradoxDict[excel.charId] = { excel: excel, levels: levels };
        dataArr.push({ keys: [excel.charId], value: { excel: excel, levels: levels } })
    }

    for (const datum of Object.values(dataArr)) {
        try {
            ParadoxZod.parse(datum.value);
        } catch (e: any) {
            log('\nParadox type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    if (writeToDb) {
        console.log(`Writing ${dataArr.length} Paradoxes to DB...`);
        await db.collection("paradox").deleteMany({});
        await db.collection("paradox").insertMany(dataArr);
    }
    console.log(`${dataArr.length} Paradoxes loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadRanges(db, gameConsts) {
    const start = Date.now();
    const rangeTable: { [key: string]: any } = await (await fetch(`${dataPath}/excel/range_table.json`)).json();

    const dataArr: any[] = [];
    for (const range of Object.values(rangeTable)) {
        rangeDict[range.id.toLowerCase()] = range;
        dataArr.push({ keys: [range.id.toLowerCase()], value: range })
    }

    for (const datum of Object.values(dataArr)) {
        try {
            GridRangeZod.parse(datum.value);
        } catch (e: any) {
            log('\nGrid range type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    if (writeToDb) {
        console.log(`Writing ${dataArr.length} Ranges to DB...`);
        await db.collection("range").deleteMany({});
        await db.collection("range").insertMany(dataArr);
    }
    console.log(`${dataArr.length} Ranges loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadRogueThemes(db, gameConsts) {
    const start = Date.now();

    const rogueTable = await (await fetch(`${dataPath}/excel/roguelike_topic_table.json`)).json();
    const rogueDetails: { [key: string]: any } = rogueTable.details;
    const rogueTopics: { [key: string]: any } = rogueTable.topics;
    const dataArr: any[] = [];

    for (let i = 0; i < Object.keys(rogueDetails).length; i++) {
        const rogueName = Object.values(rogueTopics)[i].name;
        const rogueTheme = Object.values(rogueDetails)[i];
        const rogueStages: { [key: string]: any } = rogueTheme.stages;
        const stageDict = {};
        const toughStageDict = {};
        const rogueRelics: { [key: string]: any } = rogueTheme.items;
        const relicDict = {};
        const rogueVariations: { [key: string]: any } = rogueTheme.variationData; // Variations are floor effects
        const variationDict = {};

        for (const excel of Object.values(rogueStages)) {
            const levelId = excel.levelId.toLowerCase();
            const stageName = excel.name.toLowerCase();

            if (excel.difficulty === 'FOUR_STAR') {
                const levels = await (await fetch(`${dataPath}/levels/${levelId}.json`)).json();
                toughStageDict[stageName] = { excel: excel, levels: levels };
            }
            else if (excel.difficulty === 'NORMAL') {
                const levels = await (await fetch(`${dataPath}/levels/${levelId}.json`)).json();
                stageDict[stageName] = { excel: excel, levels: levels };
            }
        }

        for (const relic of Object.values(rogueRelics)) {
            if (relic.type === 'BAND' || relic.type == 'CAPSULE') continue; // Bands are squads, capsules are IS2 plays, skip these
            const relicName = relic.name.toLowerCase();
            relicDict[relicName] = relic;
        }

        for (const variation of Object.values(rogueVariations)) {
            variationDict[variation.outerName.toLowerCase()] = variation;
        }

        dataArr[i] = { keys: [i, i.toString()], value: { name: rogueName, stageDict: stageDict, toughStageDict: toughStageDict, relicDict: relicDict, variationDict: variationDict } };
    }

    const rogueStageArr: any[] = [];
    const rogueToughStageArr: any[] = [];
    for (let i = 0; i < dataArr.length; i++) {
        rogueStageArr[i] = [];
        rogueToughStageArr[i] = [];

        const theme = dataArr[i];
        const stageDict = theme.value.stageDict;
        const toughStageDict = theme.value.toughStageDict;

        for (const key of Object.keys(stageDict)) {
            const stage = stageDict[key];
            rogueStageArr[i].push({ keys: [key, stage.excel.id, stage.excel.code], value: stage });
        }
        for (const key of Object.keys(toughStageDict)) {
            const stage = toughStageDict[key];
            rogueToughStageArr[i].push({ keys: [key, stage.excel.id, stage.excel.code], value: stage });
        }
    }

    for (const datum of Object.values(dataArr)) {
        try {
            RogueThemeZod.parse(datum.value);
        } catch (e: any) {
            log('\nRogue theme type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    if (writeToDb) {
        console.log(`Writing ${dataArr.length} Rogue themes to DB...`)
        await db.collection("rogue").deleteMany({});
        await db.collection("rogue").insertMany(dataArr);
        for (let i = 0; i < dataArr.length; i++) {
            await db.collection(`roguestage/${i}`).deleteMany({});
            await db.collection(`roguestage/${i}`).insertMany(rogueStageArr[i]);
            await db.collection(`roguetoughstage/${i}`).deleteMany({});
            await db.collection(`roguetoughstage/${i}`).insertMany(rogueToughStageArr[i]);
        }
    }
    console.log(`${dataArr.length} Rogue themes loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadSandboxes(db, gameConsts) {
    const start = Date.now();

    const sandboxTable = await (await fetch(`${dataPath}/excel/sandbox_table.json`)).json();
    const sandboxActTables: { [key: string]: any } = sandboxTable.sandboxActTables;
    const dataArr: any[] = [];

    for (let i = 0; i < Object.keys(sandboxActTables).length; i++) {
        const sandboxAct = Object.values(sandboxActTables)[i];
        const stageDatas: { [key: string]: any } = sandboxAct.stageDatas;
        const stageDict = {};

        for (const excel of Object.values(stageDatas)) {
            const levelId = excel.levelId.toLowerCase();
            const stageName = excel.name.toLowerCase();
            const levels = await (await fetch(`${dataPath}/levels/${levelId}.json`)).json();
            stageDict[stageName] = { excel, levels };
        }

        dataArr[i] = { keys: [i, i.toString()], value: { stageDict } };
    }

    for (const datum of Object.values(dataArr)) {
        try {
            SandboxActZod.parse(datum.value);
        } catch (e: any) {
            log('\nSandbox act type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    if (writeToDb) {
        console.log(`Writing ${dataArr.length} Sandboxes to DB...`);
        await db.collection("sandbox").deleteMany({});
        await db.collection("sandbox").insertMany(dataArr);
    }
    console.log(`${dataArr.length} Sandbox acts loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadSkills(db, gameConsts) {
    const start = Date.now();

    const skillTable: { [key: string]: any } = await (await fetch(`${dataPath}/excel/skill_table.json`)).json();

    const dataArr: any[] = [];
    for (const skill of Object.values(skillTable)) {
        skillDict[skill.skillId.toLowerCase()] = skill;
        dataArr.push({ keys: [skill.skillId.toLowerCase()], value: skill });
    }

    for (const datum of Object.values(dataArr)) {
        try {
            SkillZod.parse(datum.value);
        } catch (e: any) {
            log('\nSkill type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    if (writeToDb) {
        console.log(`Writing ${dataArr.length} Skills to DB...`);
        await db.collection("skill").deleteMany({});
        await db.collection("skill").insertMany(dataArr);
    }
    console.log(`${dataArr.length} Skills loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadSkins(db, gameConsts) {
    const start = Date.now();

    const skinTable = await (await fetch(`${dataPath}/excel/skin_table.json`)).json();
    const charSkins: { [key: string]: any } = skinTable.charSkins;

    const dataArr: any[] = [];
    for (const skin of Object.values(charSkins)) {
        const opId = skin.charId;

        if (!skinDict.hasOwnProperty(opId)) {
            skinDict[opId] = []; // Create an empty array if it's the first skin for that op
        }
        skinDict[opId].push(skin);

        if (!dataArr.find(data => data.keys.includes(opId))) {
            dataArr.push({ keys: [opId], value: [] });
        }
        dataArr.find(data => data.keys.includes(opId)).value.push(skin);
    }

    for (const datumArr of Object.values(dataArr)) {
        for (const datum of datumArr) {
            try {
                SkinZod.parse(datum.value);
            } catch (e: any) {
                log('\nSkin type conformity error: ' + datum.keys);
                log(e);
                break;
            }
        }
    }

    if (writeToDb) {
        console.log(`Writing ${dataArr.length} Skins to DB...`);
        await db.collection("skin").deleteMany({});
        await db.collection("skin").insertMany(dataArr);
    }
    console.log(`${dataArr.length} Skins loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadStages(db, gameConsts) {
    const start = Date.now();

    const stageTable = await (await fetch(`${dataPath}/excel/stage_table.json`)).json();
    const stages: { [key: string]: any } = stageTable.stages;

    const dataArr: any[] = [];
    const toughArr: any[] = [];

    for (const excel of Object.values(stages)) {
        if (excel.isStoryOnly || excel.stageType === 'GUIDE') continue; // Skip story and cutscene levels

        // Il Siracusano (act21side) levels have _m and _t variants
        // _t variants have their own level file in a separate 'mission' folder, but _m variants share data with normal levels
        // Check for if level is a _m variant, if so get the right level file
        const levelRegex = /\S+_m$/;
        let levelId = excel.levelId.toLowerCase();
        if (levelId.match(levelRegex)) {
            levelId = levelId.substring(0, excel.levelId.length - 2).split('mission/').join('');
        }

        // Skip easy levels cause no one cares, basically the same as normal anyways
        if (levelId.includes('easy_sub') || levelId.includes('easy')) continue;
        // Skip SSS challenge levels cause the only thing that changes is the starting danger level
        if (excel.stageType === 'CLIMB_TOWER' && levelId.substring(levelId.length - 3) === '_ex') continue;

        const code = excel.code.toLowerCase();

        if (excel.diffGroup === 'TOUGH' || excel.difficulty === 'FOUR_STAR') {
            if (!toughArr.find(data => data.keys.includes(code))) {
                toughArr.push({ keys: [code], value: [] });
            }

            try {
                const levels = await (await fetch(`${dataPath}/levels/${levelId}.json`)).json();
                const stage = { excel: excel, levels: levels };

                toughArr.push({ keys: [excel.stageId, excel.stageId.split('#').join(''), excel.code, excel.name], value: [stage] });
                toughArr.find(data => data.keys.includes(code)).value.push(stage); // Stage code
            }
            catch (e) {
                const levels = await (await fetch(`${backupPath}/levels/${levelId}.json`)).json();
                const stage = { excel: excel, levels: levels };

                toughArr.push({ keys: [excel.stageId, excel.stageId.split('#').join(''), excel.code, excel.name], value: [stage] });
                toughArr.find(data => data.keys.includes(code)).value.push(stage); // Stage code
            }
        }
        else if (excel.difficulty === 'NORMAL') {
            if (!dataArr.find(data => data.keys.includes(code))) {
                dataArr.push({ keys: [code], value: [] }); // Multiple stages can have the same code, so each code maps to an array
            }

            try {
                const levels = await (await fetch(`${dataPath}/levels/${levelId}.json`)).json();
                const stage = { excel: excel, levels: levels };

                dataArr.push({ keys: [excel.stageId, excel.code, excel.name], value: [stage] });
                dataArr.find(data => data.keys.includes(code)).value.push(stage); // Stage code
            }
            catch (e) {
                const levels = await (await fetch(`${backupPath}/levels/${levelId}.json`)).json();
                const stage = { excel: excel, levels: levels };

                dataArr.push({ keys: [excel.stageId, excel.code, excel.name], value: [stage] });
                dataArr.find(data => data.keys.includes(code)).value.push(stage); // Stage code
            }
        }
    }

    for (const datumArr of Object.values(dataArr)) {
        for (const datum of datumArr) {
            try {
                StageZod.parse(datum.value);
            } catch (e: any) {
                log('\nStage type conformity error: ' + datum.keys);
                log(e);
                break;
            }
        }
    }
    for (const datumArr of Object.values(toughArr)) {
        for (const datum of datumArr) {
            try {
                StageZod.parse(datum.value);
            } catch (e: any) {
                log('\nTough stage type conformity error: ' + datum.keys);
                log(e);
                break;
            }
        }
    }

    if (writeToDb) {
        console.log(`Writing ${dataArr.length + toughArr.length} Stages to DB...`);
        await db.collection("stage").deleteMany({});
        await db.collection("stage").insertMany(dataArr);
        await db.collection("toughstage").deleteMany({});
        await db.collection("toughstage").insertMany(toughArr);
    }
    console.log(`${dataArr.length + toughArr.length} Stages loaded in ${(Date.now() - start) / 1000}s`);
}

async function loadCnArchetypes(db, gameConsts) {
    const start = Date.now();
    const moduleTable = await (await fetch(`${cnDataPath}/excel/uniequip_table.json`)).json();
    const subProfDict: { [key: string]: any } = moduleTable.subProfDict;

    const dataArr: any[] = [];
    for (const subProf of Object.values(subProfDict)) {

        if (archetypeDict.hasOwnProperty(subProf.subProfessionId)) continue;

        cnArchetypeDict[subProf.subProfessionId] = subProf.subProfessionName;
        dataArr.push({ keys: [subProf.subProfessionId], value: subProf.subProfessionName });
    }

    if (writeToDb) {
        console.log(`Writing ${dataArr.length} CN Archetypes to DB...`);
        await db.collection("cn/archetype").deleteMany({});
        await db.collection("cn/archetype").insertMany(dataArr);
    }
    console.log(`${dataArr.length} CN Archetypes loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadCnBases(db, gameConsts) {
    const start = Date.now();

    const buildingData = await (await fetch(`${cnDataPath}/excel/building_data.json`)).json();
    const buffs: { [key: string]: any } = buildingData.buffs;

    const dataArr: any[] = [];
    for (const buff of Object.values(buffs)) {

        if (baseDict.hasOwnProperty(buff.buffId)) continue;

        cnBaseDict[buff.buffId] = buff;
        dataArr.push({ keys: [buff.buffId], value: buff });
    }

    if (writeToDb) {
        console.log(`Writing ${dataArr.length} CN Base skills to DB...`);
        await db.collection("cn/base").deleteMany({});
        await db.collection("cn/base").insertMany(dataArr);
    }
    console.log(`${dataArr.length} CN Base skills loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadCnModules(db, gameConsts) {
    const start = Date.now();

    const moduleTable = await (await fetch(`${cnDataPath}/excel/uniequip_table.json`)).json();
    const equipDict: { [key: string]: any } = moduleTable.equipDict;
    const battleDict = await (await fetch(`${cnDataPath}/excel/battle_equip_table.json`)).json();

    const dataArr: any[] = [];
    for (const module of Object.values(equipDict)) {
        const moduleId = module.uniEquipId.toLowerCase();

        if (moduleDict.hasOwnProperty(moduleId)) continue;

        cnModuleDict[moduleId] = { info: module, data: battleDict[moduleId] };
        dataArr.push({ keys: [moduleId], value: { info: module, data: battleDict[moduleId] ?? null } });
    }

    if (writeToDb) {
        console.log(`Writing ${dataArr.length} CN Modules to DB...`);
        await db.collection("cn/module").deleteMany({});
        await db.collection("cn/module").insertMany(dataArr);
    }
    console.log(`${dataArr.length} CN Modules loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadCnOperators(db, gameConsts) {
    const start = Date.now();

    const operatorTable = await (await fetch(`${cnDataPath}/excel/character_table.json`)).json();
    const patchChars = (await (await fetch(`${cnDataPath}/excel/char_patch_table.json`)).json()).patchChars;
    const charEquip = (await (await fetch(`${cnDataPath}/excel/uniequip_table.json`)).json()).charEquip;
    const charBaseBuffs = (await (await fetch(`${cnDataPath}/excel/building_data.json`)).json()).chars;

    const dataArr: any[] = [];
    for (const opId of Object.keys(operatorTable)) {
        if (operatorDict.hasOwnProperty(opId)) continue;
        dataArr.push(...readOperatorIntoArr(opId, operatorTable, charEquip, charBaseBuffs, gameConsts));
    }
    for (const opId of Object.keys(patchChars)) {
        if (operatorDict.hasOwnProperty(opId)) continue;
        dataArr.push(...readOperatorIntoArr(opId, patchChars, charEquip, charBaseBuffs, gameConsts));
    }

    if (writeToDb) {
        console.log(`Writing ${dataArr.length} CN Operators to DB...`)
        await db.collection("cn/operator").deleteMany({});
        await db.collection("cn/operator").insertMany(dataArr);
    }
    console.log(`${dataArr.length} CN Operators loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadCnParadoxes(db, gameConsts) {
    const start = Date.now();

    const handbookTable = await (await fetch(`${cnDataPath}/excel/handbook_info_table.json`)).json();
    const stages: { [key: string]: any } = handbookTable.handbookStageData;

    const dataArr: any[] = [];
    for (const excel of Object.values(stages)) {

        if (paradoxDict.hasOwnProperty(excel.charId)) continue;

        const levelId = excel.levelId.toLowerCase();
        const levels = await (await fetch(`${cnDataPath}/levels/${levelId}.json`)).json();
        paradoxDict[excel.charId] = { excel: excel, levels: levels };
        dataArr.push({ keys: [excel.charId], value: { excel: excel, levels: levels } })
    }

    if (writeToDb) {
        console.log(`Writing ${dataArr.length} CN Paradoxes to DB...`);
        await db.collection("cn/paradox").deleteMany({});
        await db.collection("cn/paradox").insertMany(dataArr);
    }
    console.log(`${dataArr.length} CN Paradoxes loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadCnRanges(db, gameConsts) {
    const start = Date.now();
    const rangeTable: { [key: string]: any } = await (await fetch(`${cnDataPath}/excel/range_table.json`)).json();

    const dataArr: any[] = [];
    for (const range of Object.values(rangeTable)) {

        if (rangeDict.hasOwnProperty(range.id.toLowerCase())) continue;

        cnRangeDict[range.id.toLowerCase()] = range;
        dataArr.push({ keys: [range.id.toLowerCase()], value: range })
    }

    if (writeToDb) {
        console.log(`Writing ${dataArr.length} CN Ranges to DB...`);
        await db.collection("cn/range").deleteMany({});
        await db.collection("cn/range").insertMany(dataArr);
    }
    console.log(`${dataArr.length} CN Ranges loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadCnSkills(db, gameConsts) {
    const start = Date.now();

    const skillTable: { [key: string]: any } = await (await fetch(`${cnDataPath}/excel/skill_table.json`)).json();

    const dataArr: any[] = [];
    for (const skill of Object.values(skillTable)) {
        const skillId = skill.skillId.toLowerCase();

        if (skillDict.hasOwnProperty(skillId)) continue;

        cnSkillDict[skillId] = skill;
        dataArr.push({ keys: [skillId], value: skill });
    }

    if (writeToDb) {
        console.log(`Writing ${dataArr.length} CN Skills to DB...`);
        await db.collection("cn/skill").deleteMany({});
        await db.collection("cn/skill").insertMany(dataArr);
    }
    console.log(`${dataArr.length} CN Skills loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadCnSkins(db, gameConsts) {
    const start = Date.now();

    const skinTable = await (await fetch(`${cnDataPath}/excel/skin_table.json`)).json();
    const charSkins: { [key: string]: any } = skinTable.charSkins;

    const dataArr: any[] = [];
    for (const skin of Object.values(charSkins)) {
        const opId = skin.charId;

        if (skinDict.hasOwnProperty(opId)) continue;

        if (!cnSkinDict.hasOwnProperty(opId)) {
            cnSkinDict[opId] = []; // Create an empty array if it's the first skin for that op
        }
        cnSkinDict[opId].push(skin);

        if (!dataArr.find(data => data.keys.includes(opId))) {
            dataArr.push({ keys: [opId], value: [] });
        }
        dataArr.find(data => data.keys.includes(opId)).value.push(skin);
    }

    if (writeToDb) {
        console.log(`Writing ${dataArr.length} CN Skins to DB...`);
        await db.collection("cn/skin").deleteMany({});
        await db.collection("cn/skin").insertMany(dataArr);
    }
    console.log(`${dataArr.length} CN Skins loaded in ${(Date.now() - start) / 1000}s`);
}

main();