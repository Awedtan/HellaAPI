import "./loadEnv.mjs";

import fetch from "node-fetch";
import db from './db.mjs';

const dataPath = 'https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/en_US/gamedata';

export const archetypeDict = {};        // Archetype id -> archetype name
export const baseDict = {};             // Base skill id -> Base object
export const moduleDict = {};           // Module id -> Module object
export const paradoxDict = {};          // Operator id -> Paradox object
export const rangeDict = {};            // Range id -> Range object
export const skillDict = {};            // Skill id -> Skill object
export const skinDict = {};             // Operator id -> Skin object array

async function main() {
    const start = Date.now();

    try {
        const { gameConsts } = await (await fetch('https://raw.githubusercontent.com/Awedtan/HellaBot/main/src/constants.json')).json();

        await loadArchetypes(db, gameConsts).catch(console.error);
        await loadBases(db, gameConsts).catch(console.error);
        await loadCC(db, gameConsts).catch(console.error);
        await loadDefinitions(db, gameConsts).catch(console.error);
        await loadEnemies(db, gameConsts).catch(console.error);
        await loadEvents(db, gameConsts).catch(console.error);
        await loadItems(db, gameConsts).catch(console.error);
        await loadModules(db, gameConsts).catch(console.error);
        await loadOperators(db, gameConsts).catch(console.error);
        await loadParadoxes(db, gameConsts).catch(console.error);
        await loadRanges(db, gameConsts).catch(console.error);
        await loadRogueThemes(db, gameConsts).catch(console.error);
        await loadSkills(db, gameConsts).catch(console.error);
        await loadSkins(db, gameConsts).catch(console.error);
        await loadStages(db, gameConsts).catch(console.error);

        await loadNewOperators(db, gameConsts).catch(console.error);

        console.log(`Finished loading data in ${(Date.now() - start) / 1000}s`);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

async function loadArchetypes(db, gameConsts) {
    await db.collection("archetypes").deleteMany({});
    const start = Date.now();
    const moduleTable = await (await fetch(`${dataPath}/excel/uniequip_table.json`)).json();
    const subProfDict = moduleTable.subProfDict;

    const dataArr = [];
    for (const subProf of Object.values(subProfDict)) {
        archetypeDict[subProf.subProfessionId] = subProf.subProfessionName;
        dataArr.push({ keys: [subProf.subProfessionId], value: subProf.subProfessionName });
    }

    await db.collection("archetypes").insertMany(dataArr);
    console.log(`${dataArr.length} Archetypes loaded in ${(Date.now() - start) / 1000}s`);
}

async function loadBases(db, gameConsts) {
    await db.collection("baseskills").deleteMany({});
    const start = Date.now();

    const buildingData = await (await fetch(`${dataPath}/excel/building_data.json`)).json();
    const buffs = buildingData.buffs;

    const dataArr = [];
    for (const buff of Object.values(buffs)) {
        baseDict[buff.buffId] = buff;
        dataArr.push({ keys: [buff.buffId], value: buff });
    }

    await db.collection("baseskills").insertMany(dataArr);
    console.log(`${dataArr.length} Base skills loaded in ${(Date.now() - start) / 1000}s`);
}

async function loadCC(db, gameConsts) {
    await db.collection("ccstages").deleteMany({});
    const start = Date.now();
    const ccStages = gameConsts.ccStages;

    const dataArr = [];
    for (const stage of ccStages) {
        const levels = await (await fetch(`${dataPath}/levels/obt/rune/${stage.code}.json`)).json();
        dataArr.push({ keys: [stage.name.toLowerCase()], value: { const: stage, levels: levels } })
    }

    await db.collection("ccstages").insertMany(dataArr);
    console.log(`${dataArr.length} CC stages loaded in ${(Date.now() - start) / 1000}s`);
}

async function loadDefinitions(db, gameConsts) {
    await db.collection("definitions").deleteMany({});
    const start = Date.now();

    const gamedataConst = await (await fetch(`${dataPath}/excel/gamedata_const.json`)).json();
    const termDescriptionDict = gamedataConst.termDescriptionDict;

    const dataArr = [];
    for (const definition of Object.values(termDescriptionDict)) {
        dataArr.push({ keys: [definition.termName.toLowerCase()], value: definition });
    }

    await db.collection("definitions").insertMany(dataArr);
    console.log(`${dataArr.length} Definitions loaded in ${(Date.now() - start) / 1000}s`);
}

async function loadEnemies(db, gameConsts) {
    await db.collection("enemies").deleteMany({});
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
    const enemies = enemyDatabase.enemies;

    const dataArr = [];
    for (const excel of Object.values(enemyHandbook)) {
        for (const levels of enemies) {
            if (levels.Key !== excel.enemyId) continue; // Brute force matches

            const enemyId = excel.enemyId.toLowerCase();
            const enemyName = excel.name.toLowerCase();
            const keyArr = [enemyId, enemyName, enemyName.split('\'').join(''), excel.enemyIndex.toLowerCase()];

            dataArr.push({ keys: keyArr, value: { excel: excel, levels: levels } });

            break;
        }
    }

    await db.collection("enemies").insertMany(dataArr);
    console.log(`${dataArr.length} Enemies loaded in ${(Date.now() - start) / 1000}s`);
}

async function loadEvents(db, gameConsts) {
    await db.collection("events").deleteMany({});
    const start = Date.now();

    const activityTable = await (await fetch(`${dataPath}/excel/activity_table.json`)).json();
    const basicInfo = activityTable.basicInfo;

    const dataArr = [];
    for (const event of Object.values(basicInfo)) {
        dataArr.push({ keys: [event.id], value: event });
    }

    await db.collection("events").insertMany(dataArr);
    console.log(`${dataArr.length} Events loaded in ${(Date.now() - start) / 1000}s`);
}

async function loadItems(db, gameConsts) {
    await db.collection("items").deleteMany({});
    const start = Date.now();

    const itemTable = await (await fetch(`${dataPath}/excel/item_table.json`)).json();
    const buildingData = await (await fetch(`${dataPath}/excel/building_data.json`)).json();
    const items = itemTable.items;
    const manufactFormulas = buildingData.manufactFormulas; // Factory formulas
    const workshopFormulas = buildingData.workshopFormulas; // Workshop formulas

    const dataArr = [];
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

    await db.collection("items").insertMany(dataArr);
    console.log(`${dataArr.length} Items loaded in ${(Date.now() - start) / 1000}s`);
}

async function loadModules(db, gameConsts) {
    await db.collection("modules").deleteMany({});
    const start = Date.now();

    const moduleTable = await (await fetch(`${dataPath}/excel/uniequip_table.json`)).json();
    const equipDict = moduleTable.equipDict;
    const battleDict = await (await fetch(`${dataPath}/excel/battle_equip_table.json`)).json();

    const dataArr = [];
    for (const module of Object.values(equipDict)) {
        const moduleId = module.uniEquipId.toLowerCase();
        moduleDict[moduleId] = { info: module, data: battleDict[moduleId] };
        dataArr.push({ keys: [moduleId], value: { info: module, data: battleDict[moduleId] } });
    }

    await db.collection("modules").insertMany(dataArr);
    console.log(`${dataArr.length} Modules loaded in ${(Date.now() - start) / 1000}s`);
}

async function loadNewOperators(db, gameConsts) {
    await db.collection("newoperators").deleteMany({});
    const start = Date.now();

    const operatorTable = await (await fetch(`${dataPath}/excel/character_table.json`)).json();
    const patchChars = (await (await fetch(`${dataPath}/excel/char_patch_table.json`)).json()).patchChars;
    const charEquip = (await (await fetch(`${dataPath}/excel/uniequip_table.json`)).json()).charEquip;
    const charBaseBuffs = (await (await fetch(`${dataPath}/excel/building_data.json`)).json()).chars;

    const dataArr = [];

    for (const opId of Object.keys(operatorTable)) {
        // ID AND DATA
        const opData = operatorTable[opId];
        if (opData.tagList === null) continue; // Summons and deployables dont have tags, skip them

        // RECRUIT ID
        const positionId = gameConsts.tagValues[opData.position.toLowerCase()];
        const classId = gameConsts.tagValues[gameConsts.professions[opData.profession].toLowerCase()];
        let tagId = 1;
        for (const tag of opData.tagList) {
            tagId *= gameConsts.tagValues[tag.toLowerCase()];
        }
        // Robot is not explicitly defined as a tag, infer from operator description instead
        if (opData.itemDesc !== null && opData.itemDesc.includes('robot')) {
            tagId *= gameConsts.tagValues['robot'];
        }
        const recruitId = positionId * classId * tagId;

        // ARCHETYPE
        const opArchetype = archetypeDict[opData.subProfessionId];

        // RANGE
        const opRange = rangeDict[opData.phases[opData.phases.length - 1].rangeId];

        // SKILLS
        const opSkills = [];
        for (const skill of opData.skills) {
            opSkills.push(skillDict[skill.skillId]);
        }

        // MODULES
        const opModules = [];
        if (charEquip.hasOwnProperty(opId)) {
            for (const module of charEquip[opId]) {
                if (module.includes('uniequip_001')) continue;
                opModules.push(moduleDict[module]);
            }
        }

        // SKINS
        let opSkins = []
        if (skinDict.hasOwnProperty(opId)) { opSkins = skinDict[opId]; }

        // BASE SKILLS
        const opBases = [];
        if (charBaseBuffs.hasOwnProperty(opId)) {
            for (const buff of charBaseBuffs[opId].buffChar) {
                for (const baseData of buff.buffData) {
                    opBases.push(baseDict[baseData.buffId]);
                }
            }
        }

        // PARADOX SIMULATION
        let opParadox = null;
        if (paradoxDict.hasOwnProperty(opId)) {
            opParadox = paradoxDict[opId];
        }

        const opName = opData.name.toLowerCase();
        const keyArr = [opId, opName, opName.split('\'').join('')];
        if (opId === 'char_4055_bgsnow') keyArr.push('Pozemka', 'pozemka');
        if (opId === 'char_4064_mlynar') keyArr.push('Mlynar', 'mlynar');

        dataArr.push({
            keys: keyArr,
            value: {
                id: opId, recruitId: recruitId,
                archetype: opArchetype, range: opRange, skills: opSkills, modules: opModules, skins: opSkins, baseSkills: opBases, paradox: opParadox,
                data: opData
            }
        });
    }

    for (const opId of Object.keys(patchChars)) {
        // ID AND DATA
        const opData = patchChars[opId];
        if (opData.tagList === null) continue; // Summons and deployables dont have tags, skip them

        // RECRUIT ID
        const positionId = gameConsts.tagValues[opData.position.toLowerCase()];
        const classId = gameConsts.tagValues[gameConsts.professions[opData.profession].toLowerCase()];
        let tagId = 1;
        for (const tag of opData.tagList) {
            tagId *= gameConsts.tagValues[tag.toLowerCase()];
        }
        // Robot is not explicitly defined as a tag, infer from operator description instead
        if (opData.itemDesc !== null && opData.itemDesc.includes('robot')) {
            tagId *= gameConsts.tagValues['robot'];
        }
        const recruitId = positionId * classId * tagId;

        // ARCHETYPE
        const opArchetype = archetypeDict[opData.subProfessionId];

        // RANGE
        const opRange = rangeDict[opData.phases[opData.phases.length - 1].rangeId];

        // SKILLS
        const opSkills = [];
        for (const skill of opData.skills) {
            opSkills.push(skillDict[skill.skillId]);
        }

        // MODULES
        const opModules = [];
        if (charEquip.hasOwnProperty(opId)) {
            for (const module of charEquip[opId]) {
                if (module.includes('uniequip_001')) continue;
                opModules.push(moduleDict[module]);
            }
        }

        // SKINS
        let opSkins = []
        if (skinDict.hasOwnProperty(opId)) { opSkins = skinDict[opId]; }

        // BASE SKILLS
        const opBases = [];
        if (charBaseBuffs.hasOwnProperty(opId)) {
            for (const buff of charBaseBuffs[opId].buffChar) {
                for (const baseData of buff.buffData) {
                    opBases.push(baseDict[baseData.buffId]);
                }
            }
        }

        // PARADOX SIMULATION
        let opParadox = null;
        if (paradoxDict.hasOwnProperty(opId)) {
            opParadox = paradoxDict[opId];
        }

        const opName = opData.name.toLowerCase();
        const keyArr = [opId, opName, opName.split('\'').join('')];
        if (opId === 'char_1001_amiya2') keyArr.push('amiya guard', 'guard amiya');

        dataArr.push({
            keys: keyArr,
            value: {
                id: opId, recruitId: recruitId,
                archetype: opArchetype, range: opRange, skills: opSkills, modules: opModules, skins: opSkins, baseSkills: opBases, paradox: opParadox,
                data: opData
            }
        });
    }

    await db.collection("newoperators").insertMany(dataArr);
    console.log(`${dataArr.length} newOperators loaded in ${(Date.now() - start) / 1000}s`);
}

async function loadOperators(db, gameConsts) {
    await db.collection("operators").deleteMany({});
    const start = Date.now();

    const buildingData = await (await fetch(`${dataPath}/excel/building_data.json`)).json();
    const operatorTable = await (await fetch(`${dataPath}/excel/character_table.json`)).json();
    const moduleTable = await (await fetch(`${dataPath}/excel/uniequip_table.json`)).json();
    const patchTable = await (await fetch(`${dataPath}/excel/char_patch_table.json`)).json();
    const charBaseBuffs = buildingData.chars; // Base skills
    const charEquip = moduleTable.charEquip; // Modules
    const patchChars = patchTable.patchChars; // Guard amiya

    const dataArr = [];

    // All ops except guard amiya
    for (const opId of Object.keys(operatorTable)) {
        const opData = operatorTable[opId];
        const opName = opData.name.toLowerCase();
        const opModules = charEquip.hasOwnProperty(opId) ? charEquip[opId] : [];
        const opBases = [];

        if (opData.tagList === null) continue; // Summons and deployables dont have tags, skip them

        if (charBaseBuffs.hasOwnProperty(opId)) {
            for (const buff of charBaseBuffs[opId].buffChar) {
                for (const baseData of buff.buffData) {
                    opBases.push(baseData);
                }
            }
        }

        const positionId = gameConsts.tagValues[opData.position.toLowerCase()];
        const classId = gameConsts.tagValues[gameConsts.professions[opData.profession].toLowerCase()];
        let tagId = 1;
        for (const tag of opData.tagList) {
            tagId *= gameConsts.tagValues[tag.toLowerCase()];
        }
        // Robot is not explicitly defined as a tag, infer from operator description instead
        if (opData.itemDesc !== null && opData.itemDesc.includes('robot')) {
            tagId *= gameConsts.tagValues['robot'];
        }
        const recruitId = positionId * classId * tagId;
        const keyArr = [opId, opName, opName.split('\'').join('')];
        if (opId === 'char_4055_bgsnow') keyArr.push('Pozemka', 'pozemka');
        if (opId === 'char_4064_mlynar') keyArr.push('Mlynar', 'mlynar');

        dataArr.push({ keys: keyArr, value: { id: opId, recruitId: recruitId, modules: opModules, bases: opBases, data: opData } });
    }

    // Guard amiya
    for (const opId of Object.keys(patchChars)) {
        if (opId !== 'char_1001_amiya2') continue; // Just in case someone else is added here and messes stuff up

        const opData = patchChars[opId];
        const opModules = charEquip.hasOwnProperty(opId) ? charEquip[opId] : [];
        const opBases = [];

        if (opData.tagList === null) continue;

        if (charBaseBuffs.hasOwnProperty(opId)) {
            for (const buff of charBaseBuffs[opId].buffChar) {
                for (const baseData of buff.buffData) {
                    opBases.push(baseData);
                }
            }
        }

        const positionId = gameConsts.tagValues[opData.position.toLowerCase()];
        const classId = gameConsts.tagValues[gameConsts.professions[opData.profession].toLowerCase()];
        let tagId = 1;
        for (const tag of opData.tagList) {
            tagId *= gameConsts.tagValues[tag.toLowerCase()];
        }
        if (opData.itemDesc !== null && opData.itemDesc.includes('robot')) {
            tagId *= gameConsts.tagValues['robot'];
        }
        const recruitId = positionId * classId * tagId;
        const keyArr = [opId, 'amiya guard', 'guard amiya'];

        dataArr.push({ keys: keyArr, value: { id: opId, recruitId: recruitId, modules: opModules, bases: opBases, data: opData } });
    }

    await db.collection("operators").insertMany(dataArr);
    console.log(`${dataArr.length} Operators loaded in ${(Date.now() - start) / 1000}s`);
}

async function loadParadoxes(db, gameConsts) {
    await db.collection("paradoxes").deleteMany({});
    const start = Date.now();

    const handbookTable = await (await fetch(`${dataPath}/excel/handbook_info_table.json`)).json();
    const stages = handbookTable.handbookStageData;

    const dataArr = [];
    for (const excel of Object.values(stages)) {
        const levelId = excel.levelId.toLowerCase();
        const levels = await (await fetch(`${dataPath}/levels/${levelId}.json`)).json();
        paradoxDict[excel.charId] = { excel: excel, levels: levels };
        dataArr.push({ keys: [excel.charId], value: { excel: excel, levels: levels } })
    }

    await db.collection("paradoxes").insertMany(dataArr);
    console.log(`${dataArr.length} Paradoxes loaded in ${(Date.now() - start) / 1000}s`);
}

async function loadRanges(db, gameConsts) {
    await db.collection("ranges").deleteMany({});
    const start = Date.now();
    const rangeTable = await (await fetch(`${dataPath}/excel/range_table.json`)).json();

    const dataArr = [];
    for (const range of Object.values(rangeTable)) {
        rangeDict[range.id.toLowerCase()] = range;
        dataArr.push({ keys: [range.id.toLowerCase()], value: range })
    }

    await db.collection("ranges").insertMany(dataArr);
    console.log(`${dataArr.length} Ranges loaded in ${(Date.now() - start) / 1000}s`);
}

async function loadRogueThemes(db, gameConsts) {
    await db.collection("roguethemes").deleteMany({});
    const start = Date.now();

    const rogueTable = await (await fetch(`${dataPath}/excel/roguelike_topic_table.json`)).json();
    const rogueDetails = rogueTable.details;
    const rogueTopics = rogueTable.topics;

    const dataArr = [];

    for (let i = 0; i < Object.keys(rogueDetails).length; i++) {
        const rogueName = Object.values(rogueTopics)[i].name;
        const rogueTheme = Object.values(rogueDetails)[i];
        const rogueStages = rogueTheme.stages;
        const stageDict = {};
        const toughStageDict = {};
        const rogueRelics = rogueTheme.items;
        const relicDict = {};
        const rogueVariations = rogueTheme.variationData; // Variations are floor effects
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

    await db.collection("roguethemes").insertMany(dataArr);
    console.log(`${dataArr.length} Rogue themes loaded in ${(Date.now() - start) / 1000}s`);
}

async function loadSkills(db, gameConsts) {
    await db.collection("skills").deleteMany({});
    const start = Date.now();

    const skillTable = await (await fetch(`${dataPath}/excel/skill_table.json`)).json();

    const dataArr = [];
    for (const skill of Object.values(skillTable)) {
        skillDict[skill.skillId.toLowerCase()] = skill;
        dataArr.push({ keys: [skill.skillId.toLowerCase()], value: skill });
    }

    await db.collection("skills").insertMany(dataArr);
    console.log(`${dataArr.length} Skills loaded in ${(Date.now() - start) / 1000}s`);
}

async function loadSkins(db, gameConsts) {
    await db.collection("skins").deleteMany({});
    const start = Date.now();

    const skinTable = await (await fetch(`${dataPath}/excel/skin_table.json`)).json();
    const charSkins = skinTable.charSkins;

    const dataArr = [];
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

    await db.collection("skins").insertMany(dataArr);
    console.log(`${dataArr.length} Skins loaded in ${(Date.now() - start) / 1000}s`);
}

async function loadStages(db, gameConsts) {
    await db.collection("stages").deleteMany({});
    await db.collection("toughstages").deleteMany({});
    const start = Date.now();

    const stageTable = await (await fetch(`${dataPath}/excel/stage_table.json`)).json();
    const stages = stageTable.stages;

    const dataArr = [];
    const toughArr = [];

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

            const levels = await (await fetch(`${dataPath}/levels/${levelId}.json`)).json();
            const stage = { excel: excel, levels: levels };

            toughArr.find(data => data.keys.includes(code)).value.push(stage); // Stage code
        }
        else if (excel.difficulty === 'NORMAL') {
            if (!dataArr.find(data => data.keys.includes(code))) {
                dataArr.push({ keys: [code], value: [] }); // Multiple stages can have the same code, so each code maps to an array
            }

            const levels = await (await fetch(`${dataPath}/levels/${levelId}.json`)).json();
            const stage = { excel: excel, levels: levels };

            dataArr.push({ keys: [excel.stageId], value: [stage] }); // Unique identifier
            dataArr.find(data => data.keys.includes(code)).value.push(stage); // Stage code
            // stageDict[excel.stageId] = [stage]; 
            // stageDict[code].push(stage); // Stage code
        }
    }

    await db.collection("stages").insertMany(dataArr);
    await db.collection("toughstages").insertMany(toughArr);
    console.log(`${dataArr.length + toughArr.length} Stages loaded in ${(Date.now() - start) / 1000}s`);
}

main();