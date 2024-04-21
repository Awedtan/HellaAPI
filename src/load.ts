import 'dotenv/config';
import * as fs from 'fs';
import { BaseZod, CCStageZod, DefinitionZod, EnemyZod, GameEventZod, GridRangeZod, ItemZod, ModuleZod, OperatorZod, ParadoxZod, RogueThemeZod, SandboxActZod, SkillZod, SkinZod, StageZod } from "hella-types";
import { Db, ObjectId } from "mongodb";
import getDb from "./db";

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
const skinArrDict = {};         // Operator id -> Skin object array
const skinDict = {};            // Skin id -> Skin object

const cnArchetypeDict = {};
const cnBaseDict = {};
const cnModuleDict = {};
const cnParadoxDict = {};
const cnRangeDict = {};
const cnSkillDict = {};
const cnSkinArrDict = {};

const log = (msg: any) => fs.appendFileSync('log.txt', JSON.stringify(msg) + '\n');

const writeToDb = true;

let db: Db;
let gameConsts: any;
let commit: any;
let date: Date;

async function main() {
    const start = Date.now();

    db = await getDb();
    gameConsts = (await (await fetch('https://raw.githubusercontent.com/Awedtan/HellaBot/main/src/constants.json')).json()).gameConsts;
    commit = (await (await fetch('https://api.github.com/repos/Kengxxiao/ArknightsGameData_YoStar/commits')).json())[0];
    date = new Date();

    if (!db) {
        console.error('Failed to connect to database');
        return;
    }

    fs.writeFileSync('log.txt', '');

    try {
        await db.collection('about').updateOne({}, { $set: { date: date, hash: commit.sha, message: commit.commit.message } }, { upsert: true });

        await loadArchetypes().catch(console.error);
        await loadBases().catch(console.error);
        await loadModules().catch(console.error);
        await loadParadoxes().catch(console.error);
        await loadRanges().catch(console.error);
        await loadSkills().catch(console.error);
        await loadSkins().catch(console.error);
        await loadOperators().catch(console.error);

        await loadCC().catch(console.error);
        await loadDefinitions().catch(console.error);
        await loadEnemies().catch(console.error);
        await loadEvents().catch(console.error);
        await loadItems().catch(console.error);
        await loadRogueThemes().catch(console.error);
        await loadSandboxes().catch(console.error);
        await loadStages().catch(console.error);

        await loadCnArchetypes().catch(console.error);
        await loadCnBases().catch(console.error);
        await loadCnModules().catch(console.error);
        await loadCnParadoxes().catch(console.error);
        await loadCnRanges().catch(console.error);
        await loadCnSkills().catch(console.error);
        await loadCnSkins().catch(console.error);
        await loadCnOperators().catch(console.error);

        console.log(`Finished loading data in ${(Date.now() - start) / 1000}s`);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

function readOperatorIntoArr(opId: string, file, charEquip, charBaseBuffs, oldDocuments) {
    const arr: Doc[] = [];

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
    const opSkins = skinArrDict[opId] ?? cnSkinArrDict[opId] ?? [];

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
    if (opId === 'char_4055_bgsnow') keyArr.push('pozemka');
    if (opId === 'char_4064_mlynar') keyArr.push('mlynar');

    arr.push(createDoc(oldDocuments, keyArr,
        {
            id: opId,
            recruit: recruitId,
            data: opData,
            archetype: opArchetype,
            range: opRange,
            skills: opSkills,
            modules: opModules,
            skins: opSkins,
            bases: opBases,
            paradox: opParadox
        }
    ));

    return arr;
}
async function filterDocuments(oldDocuments: any[], newDocuments: Doc[]): Promise<Doc[]> {
    return newDocuments.filter(newDoc => {
        const oldDoc = oldDocuments.find(old => old.canon === newDoc.canon);

        const docsAreEqual = oldDoc
            && JSON.stringify(oldDoc.meta)
            && JSON.stringify(oldDoc.meta.created)
            && JSON.stringify(oldDoc.keys) === JSON.stringify(newDoc.keys)
            && JSON.stringify(oldDoc.value) === JSON.stringify(newDoc.value);
        return !docsAreEqual;
    });
}
async function updateDb(collection: string, dataArr: Doc[]) {
    const unique = new Set();
    for (const datum of dataArr) {
        if (unique.has(datum.canon)) {
            log(`Duplicate canon in ${collection}: ${datum.canon}`);
            continue;
        }
        unique.add(datum.canon);
    }

    if (writeToDb && dataArr.length > 0) {
        console.log(`Writing ${dataArr.length} documents to ${collection}...`);
        const filter = { canon: { $in: dataArr.map(datum => datum.canon) } };
        await db.collection(collection).deleteMany(filter);
        await db.collection(collection).insertMany(dataArr);
    }
}
function createDoc(oldDocuments: any[], keys: string[], value: any): Doc {
    const createHash = oldDocuments.find(doc => doc.canon === keys[0])?.meta?.created;

    return {
        meta: {
            created: createHash ?? commit.sha,
            updated: commit.sha,
            date: date,
        },
        canon: keys[0],
        keys: keys.map(key => key.toLowerCase()),
        value: value
    }
}

type Doc = {
    _id?: ObjectId,
    meta: {
        created: string,
        updated: string,
        date: Date,
    },
    canon: string,
    keys: string[],
    value: any
}

async function loadArchetypes() {
    /* 
    Canonical key: subProfessionId
    Additional keys: none 
    */

    const start = Date.now();
    const collection = "archetype";
    const oldDocuments = await db.collection(collection).find({}).toArray();

    const moduleTable = await (await fetch(`${dataPath}/excel/uniequip_table.json`)).json();
    const subProfDict: { [key: string]: any } = moduleTable.subProfDict;

    const dataArr = await filterDocuments(oldDocuments,
        Object.values(subProfDict).map(subProf => {
            archetypeDict[subProf.subProfessionId] = subProf.subProfessionName;
            return createDoc(oldDocuments, [subProf.subProfessionId], subProf.subProfessionName);
        })
    );

    await updateDb(collection, dataArr);
    console.log(`${dataArr.length} Archetypes loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadBases() {
    /* 
    Canonical key: buffId
    Additional keys: none
    */

    const start = Date.now();
    const collection = "base";
    const oldDocuments = await db.collection(collection).find({}).toArray();

    const buildingData = await (await fetch(`${dataPath}/excel/building_data.json`)).json();
    const buffs: { [key: string]: any } = buildingData.buffs;

    const dataArr = await filterDocuments(oldDocuments,
        Object.values(buffs).map(buff => {
            baseDict[buff.buffId] = buff;
            return createDoc(oldDocuments, [buff.buffId], buff);
        })
    );

    for (const datum of Object.values(dataArr)) {
        try {
            BaseZod.parse(datum.value);
        } catch (e: any) {
            log('\nBase type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    await updateDb(collection, dataArr);
    console.log(`${dataArr.length} Base skills loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadCC() {
    /* 
    Canonical key: levelId
    Additional keys: name
    */

    const start = Date.now();
    const collection = "cc";
    const oldDocuments = await db.collection(collection).find({}).toArray();
    const ccStages = gameConsts.ccStages;

    const dataArr = await filterDocuments(oldDocuments,
        await Promise.all(ccStages.map(async stage => {
            const levels = await (await fetch(`${dataPath}/levels/${stage.levelId}.json`)).json();
            return createDoc(oldDocuments, [stage.levelId.split('/')[2], stage.name], { const: stage, levels: levels });
        }))
    );

    for (const datum of Object.values(dataArr)) {
        try {
            CCStageZod.parse(datum.value);
        } catch (e: any) {
            log('\nCC type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    await updateDb(collection, dataArr);
    console.log(`${dataArr.length} CC stages loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadDefinitions() {
    /* 
    Canonical key: termId
    Additional keys: termName
    */

    const start = Date.now();
    const collection = "define";
    const oldDocuments = await db.collection(collection).find({}).toArray();

    const gamedataConst = await (await fetch(`${dataPath}/excel/gamedata_const.json`)).json();
    const termDescriptionDict: { [key: string]: any } = gamedataConst.termDescriptionDict;

    const dataArr = await filterDocuments(oldDocuments,
        Object.values(termDescriptionDict).map(definition =>
            createDoc(oldDocuments, [definition.termId, definition.termName], definition)
        )
    );

    for (const datum of Object.values(dataArr)) {
        try {
            DefinitionZod.parse(datum.value);
        } catch (e: any) {
            log('\nDefinition type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    await updateDb(collection, dataArr);
    console.log(`${dataArr.length} Definitions loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadEnemies() {
    /* 
    Canonical key: enemyId
    Additional keys: name, enemyIndex
    */

    const start = Date.now();
    const collection = "enemy";
    const oldDocuments = await db.collection(collection).find({}).toArray();

    // Find matches between enemy_handbook_table and enemy_database
    // Stores data in enemyDict[enemy] = {excel, levels}
    //     excel = /excel/enemy_handbook_table.json
    //         Contains name, ID, category, description
    //     levels = /levels/enemydata/enemy_database.json
    //         Contains stats, skills, range
    // Unique enemy key is enemyId (enemy_1007_slime)
    // Additional keys are name (originium slug) and enemyIndex (b1) 
    const enemyHandbook = await (await fetch(`${dataPath}/excel/enemy_handbook_table.json`)).json();
    const enemyDatabase = await (await fetch(`${dataPath}/levels/enemydata/enemy_database.json`)).json();
    const enemyData: { [key: string]: any } = enemyHandbook.enemyData;

    const levelsLookup = {};
    for (const levels of enemyDatabase.enemies) {
        levelsLookup[levels.Key] = levels;
    }

    const dataArr = await filterDocuments(oldDocuments,
        Object.values(enemyData).map(excel =>
            createDoc(oldDocuments, [excel.enemyId, excel.name, excel.name.split('\'').join(''), excel.enemyIndex],
                { excel: excel, levels: levelsLookup[excel.enemyId] })
        )
    );

    for (const datum of Object.values(dataArr)) {
        try {
            EnemyZod.parse(datum.value);
        } catch (e: any) {
            log('\nEnemy type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    await updateDb(collection, dataArr);
    console.log(`${dataArr.length} Enemies loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadEvents() {
    /* 
    Canonical key: id
    Additional keys: none
    */

    const start = Date.now();
    const collection = "event";
    const oldDocuments = await db.collection(collection).find({}).toArray();

    const activityTable = await (await fetch(`${dataPath}/excel/activity_table.json`)).json();
    const basicInfo: { [key: string]: any } = activityTable.basicInfo;

    const dataArr = await filterDocuments(oldDocuments,
        Object.values(basicInfo).map(event =>
            createDoc(oldDocuments, [event.id], event)
        )
    );

    for (const datum of Object.values(dataArr)) {
        try {
            GameEventZod.parse(datum.value);
        } catch (e: any) {
            log('\nGame event type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    await updateDb(collection, dataArr);
    console.log(`${dataArr.length} Events loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadItems() {
    /* 
    Canonical key: itemId
    Additional keys: name
    */

    const start = Date.now();
    const collection = "item";
    const oldDocuments = await db.collection(collection).find({}).toArray();

    const itemTable = await (await fetch(`${dataPath}/excel/item_table.json`)).json();
    const buildingData = await (await fetch(`${dataPath}/excel/building_data.json`)).json();
    const items: { [key: string]: any } = itemTable.items;
    const manufactFormulas = buildingData.manufactFormulas; // Factory formulas
    const workshopFormulas = buildingData.workshopFormulas; // Workshop formulas

    const dataArr = await filterDocuments(oldDocuments,
        Object.values(items).map(data => {
            let formula = null;
            if (data.buildingProductList.length > 0) {
                if (data.buildingProductList[0].roomType === 'MANUFACTURE') {
                    formula = manufactFormulas[data.buildingProductList[0].formulaId];
                }
                else if (data.buildingProductList[0].roomType === 'WORKSHOP') {
                    formula = workshopFormulas[data.buildingProductList[0].formulaId];
                }
            }

            return createDoc(oldDocuments, [data.itemId, data.name, data.name.split('\'').join('')], { data: data, formula: formula });
        })
    );

    for (const datum of Object.values(dataArr)) {
        try {
            ItemZod.parse(datum.value);
        } catch (e: any) {
            log('\nItem type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    await updateDb(collection, dataArr);
    console.log(`${dataArr.length} Items loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadModules() {
    /* 
    Canonical key: uniEquipId
    Additional keys: none
    */

    const start = Date.now();
    const collection = "module";
    const oldDocuments = await db.collection(collection).find({}).toArray();

    const moduleTable = await (await fetch(`${dataPath}/excel/uniequip_table.json`)).json();
    const equipDict: { [key: string]: any } = moduleTable.equipDict;
    const battleDict = await (await fetch(`${dataPath}/excel/battle_equip_table.json`)).json();

    const dataArr = await filterDocuments(oldDocuments,
        Object.values(equipDict).map(module => {
            moduleDict[module.uniEquipId] = { info: module, data: battleDict[module.uniEquipId] ?? null };
            return createDoc(oldDocuments, [module.uniEquipId], { info: module, data: battleDict[module.uniEquipId] ?? null });
        })
    );

    for (const datum of Object.values(dataArr)) {
        try {
            ModuleZod.parse(datum.value);
        } catch (e: any) {
            log('\nModule type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    await updateDb(collection, dataArr);
    console.log(`${dataArr.length} Modules loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadOperators() {
    /* 
    Canonical key: opId
    Additional keys: name
    */

    const start = Date.now();
    const collection = "operator";
    const oldDocuments = await db.collection(collection).find({}).toArray();

    const operatorTable = await (await fetch(`${dataPath}/excel/character_table.json`)).json();
    const patchChars = (await (await fetch(`${dataPath}/excel/char_patch_table.json`)).json()).patchChars;
    const charEquip = (await (await fetch(`${dataPath}/excel/uniequip_table.json`)).json()).charEquip;
    const charBaseBuffs = (await (await fetch(`${dataPath}/excel/building_data.json`)).json()).chars;

    const opArr: Doc[] = [];
    for (const opId of Object.keys(operatorTable)) {
        opArr.push(...readOperatorIntoArr(opId, operatorTable, charEquip, charBaseBuffs, oldDocuments));
    }
    for (const opId of Object.keys(patchChars)) {
        opArr.push(...readOperatorIntoArr(opId, patchChars, charEquip, charBaseBuffs, oldDocuments));
    }
    for (const op of opArr) {
        for (const key of op.keys) {
            operatorDict[key] = op.value;
        }
    }

    const dataArr = await filterDocuments(oldDocuments, opArr);

    for (const datum of dataArr) {
        try {
            OperatorZod.parse(datum.value);
        } catch (e: any) {
            log('\nOperator type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    await updateDb(collection, dataArr);
    console.log(`${dataArr.length} Operators loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadParadoxes() {
    /* 
    Canonical key: charId
    Additional keys: stageId
    */

    const start = Date.now();
    const collection = "paradox";
    const oldDocuments = await db.collection(collection).find({}).toArray();

    const handbookTable = await (await fetch(`${dataPath}/excel/handbook_info_table.json`)).json();
    const stages: { [key: string]: any } = handbookTable.handbookStageData;

    const dataArr = await filterDocuments(oldDocuments,
        await Promise.all(Object.values(stages).map(async excel => {
            const levels = await (await fetch(`${dataPath}/levels/${excel.levelId.toLowerCase()}.json`)).json();
            paradoxDict[excel.charId] = { excel: excel, levels: levels };
            return createDoc(oldDocuments, [excel.charId, excel.stageId], { excel: excel, levels: levels });
        }))
    );

    for (const datum of Object.values(dataArr)) {
        try {
            ParadoxZod.parse(datum.value);
        } catch (e: any) {
            log('\nParadox type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    await updateDb(collection, dataArr);
    console.log(`${dataArr.length} Paradoxes loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadRanges() {
    /* 
    Canonical key: id
    Additional keys: none
    */

    const start = Date.now();
    const collection = "range";
    const oldDocuments = await db.collection(collection).find({}).toArray();

    const rangeTable: { [key: string]: any } = await (await fetch(`${dataPath}/excel/range_table.json`)).json();

    const dataArr = await filterDocuments(oldDocuments,
        Object.values(rangeTable).map(range => {
            rangeDict[range.id] = range;
            return createDoc(oldDocuments, [range.id], range);
        })
    );

    for (const datum of Object.values(dataArr)) {
        try {
            GridRangeZod.parse(datum.value);
        } catch (e: any) {
            log('\nGrid range type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    await updateDb(collection, dataArr);
    console.log(`${dataArr.length} Ranges loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadRogueThemes() {
    /* 
    Theme:
        Canonical key: index
        Additional keys: none
    Stages:
        Canonical key: id
        Additional keys: name, code
    */

    const start = Date.now();
    const collection = ["rogue", "roguestage", "roguetoughstage"];
    const oldDocuments = await db.collection(collection[0]).find({}).toArray();
    const oldStageDocs: any[] = [];
    const oldToughDocs: any[] = [];

    const rogueTable = await (await fetch(`${dataPath}/excel/roguelike_topic_table.json`)).json();
    const rogueDetails: { [key: string]: any } = rogueTable.details;
    const rogueTopics: { [key: string]: any } = rogueTable.topics;

    for (let i = 0; i < Object.keys(rogueDetails).length; i++) {
        oldStageDocs.push(await db.collection(`${collection[1]}/${i}`).find({}).toArray());
        oldToughDocs.push(await db.collection(`${collection[2]}/${i}`).find({}).toArray());
    }

    const rogueArr: Doc[] = [];
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

        rogueArr[i] = createDoc(oldDocuments, [i.toString()],
            { name: rogueName, stageDict: stageDict, toughStageDict: toughStageDict, relicDict: relicDict, variationDict: variationDict });
    }

    const rogueStageArr: Doc[][] = [];
    const rogueToughArr: Doc[][] = [];
    for (let i = 0; i < rogueArr.length; i++) {
        rogueStageArr[i] = [];
        rogueToughArr[i] = [];

        const theme = rogueArr[i];
        const stageDict = theme.value.stageDict;
        const toughStageDict = theme.value.toughStageDict;

        for (const key of Object.keys(stageDict)) {
            const stage = stageDict[key];
            rogueStageArr[i].push(createDoc(oldToughDocs[i], [key, stage.excel.id, stage.excel.code], stage));
        }
        for (const key of Object.keys(toughStageDict)) {
            const stage = toughStageDict[key];
            rogueToughArr[i].push(createDoc(oldToughDocs[i], [key, stage.excel.id, stage.excel.code], stage));
        }
    }

    const dataArr = await filterDocuments(oldDocuments, rogueArr);
    const stageDataArr: Doc[][] = [];
    const toughDataArr: Doc[][] = [];
    for (let i = 0; i < rogueStageArr.length; i++) {
        stageDataArr[i] = await filterDocuments(oldStageDocs[i], rogueStageArr[i]);
    }
    for (let i = 0; i < rogueToughArr.length; i++) {
        toughDataArr[i] = await filterDocuments(oldToughDocs[i], rogueToughArr[i]);
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

    await updateDb("rogue", dataArr);
    for (let i = 0; i < stageDataArr.length; i++) {
        await updateDb(`roguestage/${i}`, stageDataArr[i]);
    }
    for (let i = 0; i < toughDataArr.length; i++) {
        await updateDb(`roguetoughstage/${i}`, toughDataArr[i]);
    }
    console.log(`${dataArr.length} Rogue themes loaded in ${(Date.now() - start) / 1000}s`);
    for (let i = 0; i < stageDataArr.length; i++) {
        if (stageDataArr[i].length === 0) continue;
        console.log(`${stageDataArr[i].length} Rogue ${i} stages loaded in ${(Date.now() - start) / 1000}s`);
    }
    for (let i = 0; i < toughDataArr.length; i++) {
        if (toughDataArr[i].length === 0) continue;
        console.log(`${toughDataArr[i].length} Rogue ${i} tough stages loaded in ${(Date.now() - start) / 1000}s`);
    }
}
async function loadSandboxes() {
    /* 
    Canonical key: index
    Additional keys: none
    */

    const start = Date.now();
    const collection = "sandbox";
    const oldDocuments = await db.collection(collection).find({}).toArray();

    const sandboxTable = await (await fetch(`${dataPath}/excel/sandbox_table.json`)).json();
    const sandboxActTables: { [key: string]: any } = sandboxTable.sandboxActTables;

    const sandArr: Doc[] = [];
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

        sandArr[i] = createDoc(oldDocuments, [i.toString()], { stageDict: stageDict });
    }

    const dataArr = await filterDocuments(oldDocuments, sandArr);

    for (const datum of Object.values(dataArr)) {
        try {
            SandboxActZod.parse(datum.value);
        } catch (e: any) {
            log('\nSandbox act type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    await updateDb(collection, dataArr);
    console.log(`${dataArr.length} Sandbox acts loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadSkills() {
    /* 
    Canonical key: skillId
    Additional keys: none
    */

    const start = Date.now();
    const collection = "skill";
    const oldDocuments = await db.collection(collection).find({}).toArray();

    const skillTable: { [key: string]: any } = await (await fetch(`${dataPath}/excel/skill_table.json`)).json();

    const dataArr = await filterDocuments(oldDocuments,
        Object.values(skillTable).map(skill => {
            skillDict[skill.skillId.toLowerCase()] = skill;
            return createDoc(oldDocuments, [skill.skillId], skill);
        })
    );

    for (const datum of Object.values(dataArr)) {
        try {
            SkillZod.parse(datum.value);
        } catch (e: any) {
            log('\nSkill type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    await updateDb(collection, dataArr);
    console.log(`${dataArr.length} Skills loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadSkins() {
    /* 
    Canonical key: charId
    Additional keys: none
    */

    const start = Date.now();
    const collection = "skin";
    const oldDocuments = await db.collection(collection).find({}).toArray();

    const skinTable = await (await fetch(`${dataPath}/excel/skin_table.json`)).json();
    const charSkins: { [key: string]: any } = skinTable.charSkins;

    const skinArr: Doc[] = [];
    for (const skin of Object.values(charSkins)) {
        if (!skinArrDict.hasOwnProperty(skin.charId)) {
            skinArrDict[skin.charId] = []; // Create an empty array if it's the first skin for that op
        }
        skinArrDict[skin.charId].push(skin);
        skinDict[skin.skinId] = skin;

        skinArr.push(createDoc(oldDocuments, [skin.skinId], skin));
    }

    const dataArr = await filterDocuments(oldDocuments, skinArr);

    for (const datum of Object.values(dataArr)) {
        try {
            SkinZod.parse(datum.value);
        } catch (e: any) {
            log('\nSkin type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    await updateDb(collection, dataArr);
    console.log(`${dataArr.length} Skins loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadStages() {
    /* 
    Single stage:
        Canonical key: stageId
        Additional keys: code, name
    Stage array:
        Canonical key: code
        Additional keys: none
    */

    const start = Date.now();
    const collection = ["stage", "toughstage"];
    const oldStageDocs = await db.collection(collection[0]).find({}).toArray();
    const oldToughDocs = await db.collection(collection[1]).find({}).toArray();

    const stageTable = await (await fetch(`${dataPath}/excel/stage_table.json`)).json();
    const stages: { [key: string]: any } = stageTable.stages;

    const stageArr: Doc[] = [];
    const toughArr: Doc[] = [];

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
                toughArr.push(createDoc(oldToughDocs, [code], []));
            }

            try {
                const levels = await (await fetch(`${dataPath}/levels/${levelId}.json`)).json();
                const stage = { excel: excel, levels: levels };

                toughArr.push(createDoc(oldToughDocs, [excel.stageId, excel.stageId.split('#').join(''), excel.code, excel.name], [stage]));
                toughArr.find(data => data.keys.includes(code))?.value.push(stage); // Stage code
            }
            catch (e) {
                const levels = await (await fetch(`${backupPath}/levels/${levelId}.json`)).json();
                const stage = { excel: excel, levels: levels };

                toughArr.push(createDoc(oldToughDocs, [excel.stageId, excel.stageId.split('#').join(''), excel.code, excel.name], [stage]));
                toughArr.find(data => data.keys.includes(code))?.value.push(stage); // Stage code
            }
        }
        else if (excel.difficulty === 'NORMAL') {
            if (!stageArr.find(data => data.keys.includes(code))) {
                stageArr.push(createDoc(oldStageDocs, [code], [])); // Multiple stages can have the same code, so each code maps to an array
            }

            try {
                const levels = await (await fetch(`${dataPath}/levels/${levelId}.json`)).json();
                const stage = { excel: excel, levels: levels };

                stageArr.push(createDoc(oldStageDocs, [excel.stageId, excel.code, excel.name], [stage]));
                stageArr.find(data => data.keys.includes(code))?.value.push(stage); // Stage code
            }
            catch (e) {
                const levels = await (await fetch(`${backupPath}/levels/${levelId}.json`)).json();
                const stage = { excel: excel, levels: levels };

                stageArr.push(createDoc(oldStageDocs, [excel.stageId, excel.code, excel.name], [stage]));
                stageArr.find(data => data.keys.includes(code))?.value.push(stage); // Stage code
            }
        }
    }

    const dataArr = await filterDocuments(oldStageDocs, stageArr);
    const toughDataArr = await filterDocuments(oldToughDocs, toughArr);

    for (const datumArr of Object.values(dataArr)) {
        for (const datum of datumArr.value) {
            try {
                StageZod.parse(datum);
            } catch (e: any) {
                log('\nStage type conformity error: ' + datumArr.keys);
                log(e);
                break;
            }
        }
    }
    for (const datumArr of Object.values(toughDataArr)) {
        for (const datum of datumArr.value) {
            try {
                StageZod.parse(datum);
            } catch (e: any) {
                log('\nTough stage type conformity error: ' + datum.keys);
                log(e);
                break;
            }
        }
    }

    await updateDb("stage", dataArr);
    await updateDb("toughstage", toughDataArr);
    console.log(`${dataArr.length} Stages loaded in ${(Date.now() - start) / 1000}s`);
    console.log(`${toughDataArr.length} Tough stages loaded in ${(Date.now() - start) / 1000}s`);
}

async function loadCnArchetypes() {
    const start = Date.now();
    const collection = "cn/archetype";
    const oldDocuments = await db.collection(collection).find({}).toArray();

    const moduleTable = await (await fetch(`${cnDataPath}/excel/uniequip_table.json`)).json();
    const subProfDict: { [key: string]: any } = moduleTable.subProfDict;

    const dataArr = await filterDocuments(oldDocuments,
        Object.values(subProfDict)
            .filter(subProf => !archetypeDict.hasOwnProperty(subProf.subProfessionId))
            .map(subProf => {
                cnArchetypeDict[subProf.subProfessionId] = subProf.subProfessionName;
                return createDoc(oldDocuments, [subProf.subProfessionId], subProf.subProfessionName);
            })
    );

    await updateDb(collection, dataArr);
    console.log(`${dataArr.length} CN Archetypes loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadCnBases() {
    const start = Date.now();
    const collection = "cn/base";
    const oldDocuments = await db.collection(collection).find({}).toArray();

    const buildingData = await (await fetch(`${cnDataPath}/excel/building_data.json`)).json();
    const buffs: { [key: string]: any } = buildingData.buffs;

    const dataArr = await filterDocuments(oldDocuments,
        Object.values(buffs)
            .filter(buff => !baseDict.hasOwnProperty(buff.buffId))
            .map(buff => {
                cnBaseDict[buff.buffId] = buff;
                return createDoc(oldDocuments, [buff.buffId], buff);
            })
    );

    for (const datum of Object.values(dataArr)) {
        try {
            BaseZod.parse(datum.value);
        } catch (e: any) {
            log('\nBase type conformity error: ' + datum.keys);
            log(e);
            break;
        }
    }

    await updateDb(collection, dataArr);
    console.log(`${dataArr.length} CN Base skills loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadCnModules() {
    const start = Date.now();
    const collection = "cn/module";
    const oldDocuments = await db.collection(collection).find({}).toArray();

    const moduleTable = await (await fetch(`${cnDataPath}/excel/uniequip_table.json`)).json();
    const equipDict: { [key: string]: any } = moduleTable.equipDict;
    const battleDict = await (await fetch(`${cnDataPath}/excel/battle_equip_table.json`)).json();

    const dataArr = await filterDocuments(oldDocuments,
        Object.values(equipDict)
            .filter(module => !moduleDict.hasOwnProperty(module.uniEquipId))
            .map(module => {
                cnModuleDict[module.uniEquipId] = { info: module, data: battleDict[module.uniEquipId] ?? null };
                return createDoc(oldDocuments, [module.uniEquipId], { info: module, data: battleDict[module.uniEquipId] ?? null });
            })
    );

    await updateDb(collection, dataArr);
    console.log(`${dataArr.length} CN Modules loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadCnOperators() {
    const start = Date.now();
    const collection = "cn/operator";
    const oldDocuments = await db.collection(collection).find({}).toArray();

    const operatorTable = await (await fetch(`${cnDataPath}/excel/character_table.json`)).json();
    const patchChars = (await (await fetch(`${cnDataPath}/excel/char_patch_table.json`)).json()).patchChars;
    const charEquip = (await (await fetch(`${cnDataPath}/excel/uniequip_table.json`)).json()).charEquip;
    const charBaseBuffs = (await (await fetch(`${cnDataPath}/excel/building_data.json`)).json()).chars;

    const opArr: Doc[] = [];
    for (const opId of Object.keys(operatorTable)) {
        if (operatorDict.hasOwnProperty(opId)) continue;
        opArr.push(...readOperatorIntoArr(opId, operatorTable, charEquip, charBaseBuffs, oldDocuments));
    }
    for (const opId of Object.keys(patchChars)) {
        if (operatorDict.hasOwnProperty(opId)) continue;
        opArr.push(...readOperatorIntoArr(opId, patchChars, charEquip, charBaseBuffs, oldDocuments));
    }

    const dataArr = await filterDocuments(oldDocuments, opArr);

    await updateDb(collection, dataArr);
    console.log(`${dataArr.length} CN Operators loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadCnParadoxes() {
    const start = Date.now();
    const collection = "cn/paradox";
    const oldDocuments = await db.collection(collection).find({}).toArray();

    const handbookTable = await (await fetch(`${cnDataPath}/excel/handbook_info_table.json`)).json();
    const stages: { [key: string]: any } = handbookTable.handbookStageData;

    const dataArr = await filterDocuments(oldDocuments,
        await Promise.all(Object.values(stages)
            .filter(excel => !paradoxDict.hasOwnProperty(excel.charId))
            .map(async excel => {
                const levels = await (await fetch(`${cnDataPath}/levels/${excel.levelId.toLowerCase()}.json`)).json();
                cnParadoxDict[excel.charId] = { excel: excel, levels: levels };
                return createDoc(oldDocuments, [excel.charId, excel.stageId], { excel: excel, levels: levels });
            }))
    );

    await updateDb(collection, dataArr);
    console.log(`${dataArr.length} CN Paradoxes loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadCnRanges() {
    const start = Date.now();
    const collection = "cn/range";
    const oldDocuments = await db.collection(collection).find({}).toArray();

    const rangeTable: { [key: string]: any } = await (await fetch(`${cnDataPath}/excel/range_table.json`)).json();

    const dataArr = await filterDocuments(oldDocuments,
        Object.values(rangeTable)
            .filter(range => !rangeDict.hasOwnProperty(range.id))
            .map(range => {
                cnRangeDict[range.id] = range;
                return createDoc(oldDocuments, [range.id], range);
            })
    );

    await updateDb(collection, dataArr);
    console.log(`${dataArr.length} CN Ranges loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadCnSkills() {
    const start = Date.now();
    const collection = "cn/skill";
    const oldDocuments = await db.collection(collection).find({}).toArray();

    const skillTable: { [key: string]: any } = await (await fetch(`${cnDataPath}/excel/skill_table.json`)).json();

    const dataArr = await filterDocuments(oldDocuments,
        Object.values(skillTable)
            .filter(skill => !skillDict.hasOwnProperty(skill.skillId.toLowerCase()))
            .map(skill => {
                cnSkillDict[skill.skillId.toLowerCase()] = skill;
                return createDoc(oldDocuments, [skill.skillId], skill);
            })
    );

    await updateDb(collection, dataArr);
    console.log(`${dataArr.length} CN Skills loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadCnSkins() {
    const start = Date.now();
    const collection = "cn/skin";
    const oldDocuments = await db.collection(collection).find({}).toArray();

    const skinTable = await (await fetch(`${cnDataPath}/excel/skin_table.json`)).json();
    const charSkins: { [key: string]: any } = skinTable.charSkins;

    const skinArr: Doc[] = [];
    for (const skin of Object.values(charSkins)) {
        if (skinDict.hasOwnProperty(skin.skinId)) continue;

        if (!cnSkinArrDict.hasOwnProperty(skin.charId)) {
            cnSkinArrDict[skin.charId] = []; // Create an empty array if it's the first skin for that op
        }
        cnSkinArrDict[skin.charId].push(skin);

        skinArr.push(createDoc(oldDocuments, [skin.skinId], skin));
    }

    const dataArr = await filterDocuments(oldDocuments, skinArr);

    await updateDb(collection, dataArr);
    console.log(`${dataArr.length} CN Skins loaded in ${(Date.now() - start) / 1000}s`);
}

main();