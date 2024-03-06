"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.skinDict = exports.skillDict = exports.rangeDict = exports.paradoxDict = exports.moduleDict = exports.baseDict = exports.archetypeDict = void 0;
var db_1 = __importDefault(require("./db"));
var dataPath = 'https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData_YoStar/main/en_US/gamedata';
var backupPath = 'https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/5ba509ad5a07f17b7e220a25f1ff66794dd79af1/en_US/gamedata'; // last commit before removing en_US folder
exports.archetypeDict = {}; // Archetype id -> archetype name
exports.baseDict = {}; // Base skill id -> Base object
exports.moduleDict = {}; // Module id -> Module object
exports.paradoxDict = {}; // Operator id -> Paradox object
exports.rangeDict = {}; // Range id -> Range object
exports.skillDict = {}; // Skill id -> Skill object
exports.skinDict = {}; // Operator id -> Skin object array
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var start, db, gameConsts, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    start = Date.now();
                    return [4 /*yield*/, (0, db_1.default)()];
                case 1:
                    db = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 21, 22, 23]);
                    return [4 /*yield*/, fetch('https://raw.githubusercontent.com/Awedtan/HellaBot/main/src/constants.json')];
                case 3: return [4 /*yield*/, (_a.sent()).json()];
                case 4:
                    gameConsts = (_a.sent()).gameConsts;
                    return [4 /*yield*/, loadArchetypes(db, gameConsts).catch(console.error)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, loadBases(db, gameConsts).catch(console.error)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, loadCC(db, gameConsts).catch(console.error)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, loadDefinitions(db, gameConsts).catch(console.error)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, loadEnemies(db, gameConsts).catch(console.error)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, loadEvents(db, gameConsts).catch(console.error)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, loadItems(db, gameConsts).catch(console.error)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, loadModules(db, gameConsts).catch(console.error)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, loadParadoxes(db, gameConsts).catch(console.error)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, loadRanges(db, gameConsts).catch(console.error)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, loadRogueThemes(db, gameConsts).catch(console.error)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, loadSandboxes(db, gameConsts).catch(console.error)];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, loadSkills(db, gameConsts).catch(console.error)];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, loadSkins(db, gameConsts).catch(console.error)];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, loadStages(db, gameConsts).catch(console.error)];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, loadOperators(db, gameConsts).catch(console.error)];
                case 20:
                    _a.sent();
                    console.log("Finished loading data in ".concat((Date.now() - start) / 1000, "s"));
                    return [3 /*break*/, 23];
                case 21:
                    e_1 = _a.sent();
                    console.error(e_1);
                    return [3 /*break*/, 23];
                case 22:
                    process.exit();
                    return [7 /*endfinally*/];
                case 23: return [2 /*return*/];
            }
        });
    });
}
function loadArchetypes(db, gameConsts) {
    return __awaiter(this, void 0, void 0, function () {
        var start, moduleTable, subProfDict, dataArr, _i, _a, subProf;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    start = Date.now();
                    return [4 /*yield*/, fetch("".concat(dataPath, "/excel/uniequip_table.json"))];
                case 1: return [4 /*yield*/, (_b.sent()).json()];
                case 2:
                    moduleTable = _b.sent();
                    subProfDict = moduleTable.subProfDict;
                    dataArr = [];
                    for (_i = 0, _a = Object.values(subProfDict); _i < _a.length; _i++) {
                        subProf = _a[_i];
                        exports.archetypeDict[subProf.subProfessionId] = subProf.subProfessionName;
                        dataArr.push({ keys: [subProf.subProfessionId], value: subProf.subProfessionName });
                    }
                    return [4 /*yield*/, db.collection("archetype").deleteMany({})];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, db.collection("archetype").insertMany(dataArr)];
                case 4:
                    _b.sent();
                    console.log("".concat(dataArr.length, " Archetypes loaded in ").concat((Date.now() - start) / 1000, "s"));
                    return [2 /*return*/];
            }
        });
    });
}
function loadBases(db, gameConsts) {
    return __awaiter(this, void 0, void 0, function () {
        var start, buildingData, buffs, dataArr, _i, _a, buff;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    start = Date.now();
                    return [4 /*yield*/, fetch("".concat(dataPath, "/excel/building_data.json"))];
                case 1: return [4 /*yield*/, (_b.sent()).json()];
                case 2:
                    buildingData = _b.sent();
                    buffs = buildingData.buffs;
                    dataArr = [];
                    for (_i = 0, _a = Object.values(buffs); _i < _a.length; _i++) {
                        buff = _a[_i];
                        exports.baseDict[buff.buffId] = buff;
                        dataArr.push({ keys: [buff.buffId], value: buff });
                    }
                    return [4 /*yield*/, db.collection("base").deleteMany({})];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, db.collection("base").insertMany(dataArr)];
                case 4:
                    _b.sent();
                    console.log("".concat(dataArr.length, " Base skills loaded in ").concat((Date.now() - start) / 1000, "s"));
                    return [2 /*return*/];
            }
        });
    });
}
function loadCC(db, gameConsts) {
    return __awaiter(this, void 0, void 0, function () {
        var start, ccStages, dataArr, _i, ccStages_1, stage, levels;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    start = Date.now();
                    ccStages = gameConsts.ccStages;
                    dataArr = [];
                    _i = 0, ccStages_1 = ccStages;
                    _a.label = 1;
                case 1:
                    if (!(_i < ccStages_1.length)) return [3 /*break*/, 5];
                    stage = ccStages_1[_i];
                    return [4 /*yield*/, fetch("".concat(dataPath, "/levels/").concat(stage.levelId.toLowerCase(), ".json"))];
                case 2: return [4 /*yield*/, (_a.sent()).json()];
                case 3:
                    levels = _a.sent();
                    dataArr.push({ keys: [stage.name.toLowerCase(), stage.levelId.split('/')[2].toLowerCase()], value: { const: stage, levels: levels } });
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5: return [4 /*yield*/, db.collection("cc").deleteMany({})];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, db.collection("cc").insertMany(dataArr)];
                case 7:
                    _a.sent();
                    console.log("".concat(dataArr.length, " CC stages loaded in ").concat((Date.now() - start) / 1000, "s"));
                    return [2 /*return*/];
            }
        });
    });
}
function loadDefinitions(db, gameConsts) {
    return __awaiter(this, void 0, void 0, function () {
        var start, gamedataConst, termDescriptionDict, dataArr, _i, _a, definition;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    start = Date.now();
                    return [4 /*yield*/, fetch("".concat(dataPath, "/excel/gamedata_const.json"))];
                case 1: return [4 /*yield*/, (_b.sent()).json()];
                case 2:
                    gamedataConst = _b.sent();
                    termDescriptionDict = gamedataConst.termDescriptionDict;
                    dataArr = [];
                    for (_i = 0, _a = Object.values(termDescriptionDict); _i < _a.length; _i++) {
                        definition = _a[_i];
                        dataArr.push({ keys: [definition.termName.toLowerCase()], value: definition });
                    }
                    return [4 /*yield*/, db.collection("define").deleteMany({})];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, db.collection("define").insertMany(dataArr)];
                case 4:
                    _b.sent();
                    console.log("".concat(dataArr.length, " Definitions loaded in ").concat((Date.now() - start) / 1000, "s"));
                    return [2 /*return*/];
            }
        });
    });
}
function loadEnemies(db, gameConsts) {
    return __awaiter(this, void 0, void 0, function () {
        var start, enemyHandbook, enemyDatabase, enemyData, enemies, dataArr, _i, _a, excel, _b, enemies_1, levels, enemyId, enemyName, keyArr;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    start = Date.now();
                    return [4 /*yield*/, fetch("".concat(dataPath, "/excel/enemy_handbook_table.json"))];
                case 1: return [4 /*yield*/, (_c.sent()).json()];
                case 2:
                    enemyHandbook = _c.sent();
                    return [4 /*yield*/, fetch("".concat(dataPath, "/levels/enemydata/enemy_database.json"))];
                case 3: return [4 /*yield*/, (_c.sent()).json()];
                case 4:
                    enemyDatabase = _c.sent();
                    enemyData = enemyHandbook.enemyData;
                    enemies = enemyDatabase.enemies;
                    dataArr = [];
                    for (_i = 0, _a = Object.values(enemyData); _i < _a.length; _i++) {
                        excel = _a[_i];
                        for (_b = 0, enemies_1 = enemies; _b < enemies_1.length; _b++) {
                            levels = enemies_1[_b];
                            if (levels.Key !== excel.enemyId)
                                continue; // Brute force matches
                            enemyId = excel.enemyId.toLowerCase();
                            enemyName = excel.name.toLowerCase();
                            keyArr = [enemyId, enemyName, enemyName.split('\'').join(''), excel.enemyIndex.toLowerCase()];
                            dataArr.push({ keys: keyArr, value: { excel: excel, levels: levels } });
                            break;
                        }
                    }
                    return [4 /*yield*/, db.collection("enemy").deleteMany({})];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, db.collection("enemy").insertMany(dataArr)];
                case 6:
                    _c.sent();
                    console.log("".concat(dataArr.length, " Enemies loaded in ").concat((Date.now() - start) / 1000, "s"));
                    return [2 /*return*/];
            }
        });
    });
}
function loadEvents(db, gameConsts) {
    return __awaiter(this, void 0, void 0, function () {
        var start, activityTable, basicInfo, dataArr, _i, _a, event_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    start = Date.now();
                    return [4 /*yield*/, fetch("".concat(dataPath, "/excel/activity_table.json"))];
                case 1: return [4 /*yield*/, (_b.sent()).json()];
                case 2:
                    activityTable = _b.sent();
                    basicInfo = activityTable.basicInfo;
                    dataArr = [];
                    for (_i = 0, _a = Object.values(basicInfo); _i < _a.length; _i++) {
                        event_1 = _a[_i];
                        dataArr.push({ keys: [event_1.id], value: event_1 });
                    }
                    return [4 /*yield*/, db.collection("event").deleteMany({})];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, db.collection("event").insertMany(dataArr)];
                case 4:
                    _b.sent();
                    console.log("".concat(dataArr.length, " Events loaded in ").concat((Date.now() - start) / 1000, "s"));
                    return [2 /*return*/];
            }
        });
    });
}
function loadItems(db, gameConsts) {
    return __awaiter(this, void 0, void 0, function () {
        var start, itemTable, buildingData, items, manufactFormulas, workshopFormulas, dataArr, _i, _a, data, formula, itemName, keyArr;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    start = Date.now();
                    return [4 /*yield*/, fetch("".concat(dataPath, "/excel/item_table.json"))];
                case 1: return [4 /*yield*/, (_b.sent()).json()];
                case 2:
                    itemTable = _b.sent();
                    return [4 /*yield*/, fetch("".concat(dataPath, "/excel/building_data.json"))];
                case 3: return [4 /*yield*/, (_b.sent()).json()];
                case 4:
                    buildingData = _b.sent();
                    items = itemTable.items;
                    manufactFormulas = buildingData.manufactFormulas;
                    workshopFormulas = buildingData.workshopFormulas;
                    dataArr = [];
                    for (_i = 0, _a = Object.values(items); _i < _a.length; _i++) {
                        data = _a[_i];
                        formula = null;
                        if (data.buildingProductList.length > 0) {
                            // Factory and workshop formulas can have same id, need to check item craft type
                            if (data.buildingProductList[0].roomType === 'MANUFACTURE') {
                                formula = manufactFormulas[data.buildingProductList[0].formulaId];
                            }
                            else if (data.buildingProductList[0].roomType === 'WORKSHOP') {
                                formula = workshopFormulas[data.buildingProductList[0].formulaId];
                            }
                        }
                        itemName = data.name.toLowerCase();
                        keyArr = [data.itemId, itemName, itemName.split('\'').join('')];
                        dataArr.push({ keys: keyArr, value: { data: data, formula: formula } });
                    }
                    return [4 /*yield*/, db.collection("item").deleteMany({})];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, db.collection("item").insertMany(dataArr)];
                case 6:
                    _b.sent();
                    console.log("".concat(dataArr.length, " Items loaded in ").concat((Date.now() - start) / 1000, "s"));
                    return [2 /*return*/];
            }
        });
    });
}
function loadModules(db, gameConsts) {
    return __awaiter(this, void 0, void 0, function () {
        var start, moduleTable, equipDict, battleDict, dataArr, _i, _a, module_1, moduleId;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    start = Date.now();
                    return [4 /*yield*/, fetch("".concat(dataPath, "/excel/uniequip_table.json"))];
                case 1: return [4 /*yield*/, (_b.sent()).json()];
                case 2:
                    moduleTable = _b.sent();
                    equipDict = moduleTable.equipDict;
                    return [4 /*yield*/, fetch("".concat(dataPath, "/excel/battle_equip_table.json"))];
                case 3: return [4 /*yield*/, (_b.sent()).json()];
                case 4:
                    battleDict = _b.sent();
                    dataArr = [];
                    for (_i = 0, _a = Object.values(equipDict); _i < _a.length; _i++) {
                        module_1 = _a[_i];
                        moduleId = module_1.uniEquipId.toLowerCase();
                        exports.moduleDict[moduleId] = { info: module_1, data: battleDict[moduleId] };
                        dataArr.push({ keys: [moduleId], value: { info: module_1, data: battleDict[moduleId] } });
                    }
                    return [4 /*yield*/, db.collection("module").deleteMany({})];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, db.collection("module").insertMany(dataArr)];
                case 6:
                    _b.sent();
                    console.log("".concat(dataArr.length, " Modules loaded in ").concat((Date.now() - start) / 1000, "s"));
                    return [2 /*return*/];
            }
        });
    });
}
function loadOperators(db, gameConsts) {
    return __awaiter(this, void 0, void 0, function () {
        var start, operatorTable, patchChars, charEquip, charBaseBuffs, dataArr, _i, _a, opId, opData, rarityId, positionId, classId, tagId, _b, _c, tag, recruitId, opArchetype, opRange, opSkills, _d, _e, skill, opModules, _f, _g, module_2, opSkins, opBases, _h, _j, buff, _k, _l, baseData, opParadox, opName, keyArr, _m, _o, opId, opData, rarityId, positionId, classId, tagId, _p, _q, tag, recruitId, opArchetype, opRange, opSkills, _r, _s, skill, opModules, _t, _u, module_3, opSkins, opBases, _v, _w, buff, _x, _y, baseData, opParadox, opName, keyArr;
        return __generator(this, function (_z) {
            switch (_z.label) {
                case 0:
                    start = Date.now();
                    return [4 /*yield*/, fetch("".concat(dataPath, "/excel/character_table.json"))];
                case 1: return [4 /*yield*/, (_z.sent()).json()];
                case 2:
                    operatorTable = _z.sent();
                    return [4 /*yield*/, fetch("".concat(dataPath, "/excel/char_patch_table.json"))];
                case 3: return [4 /*yield*/, (_z.sent()).json()];
                case 4:
                    patchChars = (_z.sent()).patchChars;
                    return [4 /*yield*/, fetch("".concat(dataPath, "/excel/uniequip_table.json"))];
                case 5: return [4 /*yield*/, (_z.sent()).json()];
                case 6:
                    charEquip = (_z.sent()).charEquip;
                    return [4 /*yield*/, fetch("".concat(dataPath, "/excel/building_data.json"))];
                case 7: return [4 /*yield*/, (_z.sent()).json()];
                case 8:
                    charBaseBuffs = (_z.sent()).chars;
                    dataArr = [];
                    for (_i = 0, _a = Object.keys(operatorTable); _i < _a.length; _i++) {
                        opId = _a[_i];
                        opData = operatorTable[opId];
                        if (opData.tagList === null)
                            continue; // Summons and deployables dont have tags, skip them
                        rarityId = gameConsts.tagValues[opData.rarity];
                        positionId = gameConsts.tagValues[opData.position.toLowerCase()];
                        classId = gameConsts.tagValues[gameConsts.professions[opData.profession].toLowerCase()];
                        tagId = 1;
                        for (_b = 0, _c = opData.tagList; _b < _c.length; _b++) {
                            tag = _c[_b];
                            tagId *= gameConsts.tagValues[tag.toLowerCase()];
                        }
                        // Robot is not explicitly defined as a tag, infer from operator description instead
                        if (opData.itemDesc !== null && opData.itemDesc.includes('robot')) {
                            tagId *= gameConsts.tagValues['robot'];
                        }
                        recruitId = rarityId * positionId * classId * tagId;
                        opArchetype = exports.archetypeDict[opData.subProfessionId];
                        opRange = exports.rangeDict[opData.phases[opData.phases.length - 1].rangeId];
                        opSkills = [];
                        for (_d = 0, _e = opData.skills; _d < _e.length; _d++) {
                            skill = _e[_d];
                            opSkills.push(exports.skillDict[skill.skillId]);
                        }
                        opModules = [];
                        if (charEquip.hasOwnProperty(opId)) {
                            for (_f = 0, _g = charEquip[opId]; _f < _g.length; _f++) {
                                module_2 = _g[_f];
                                if (module_2.includes('uniequip_001'))
                                    continue;
                                opModules.push(exports.moduleDict[module_2]);
                            }
                        }
                        opSkins = [];
                        if (exports.skinDict.hasOwnProperty(opId)) {
                            opSkins = exports.skinDict[opId];
                        }
                        opBases = [];
                        if (charBaseBuffs.hasOwnProperty(opId)) {
                            for (_h = 0, _j = charBaseBuffs[opId].buffChar; _h < _j.length; _h++) {
                                buff = _j[_h];
                                for (_k = 0, _l = buff.buffData; _k < _l.length; _k++) {
                                    baseData = _l[_k];
                                    opBases.push({ condition: baseData, skill: exports.baseDict[baseData.buffId] });
                                }
                            }
                        }
                        opParadox = null;
                        if (exports.paradoxDict.hasOwnProperty(opId)) {
                            opParadox = exports.paradoxDict[opId];
                        }
                        opName = opData.name.toLowerCase();
                        keyArr = [opId, opName, opName.split('\'').join('')];
                        if (opId === 'char_4055_bgsnow')
                            keyArr.push('Pozemka', 'pozemka');
                        if (opId === 'char_4064_mlynar')
                            keyArr.push('Mlynar', 'mlynar');
                        dataArr.push({
                            keys: keyArr,
                            value: {
                                id: opId, recruit: recruitId,
                                archetype: opArchetype, range: opRange, skills: opSkills, modules: opModules, skins: opSkins, bases: opBases, paradox: opParadox,
                                data: opData
                            }
                        });
                    }
                    for (_m = 0, _o = Object.keys(patchChars); _m < _o.length; _m++) {
                        opId = _o[_m];
                        opData = patchChars[opId];
                        if (opData.tagList === null)
                            continue; // Summons and deployables dont have tags, skip them
                        rarityId = gameConsts.tagValues[opData.rarity];
                        positionId = gameConsts.tagValues[opData.position.toLowerCase()];
                        classId = gameConsts.tagValues[gameConsts.professions[opData.profession].toLowerCase()];
                        tagId = 1;
                        for (_p = 0, _q = opData.tagList; _p < _q.length; _p++) {
                            tag = _q[_p];
                            tagId *= gameConsts.tagValues[tag.toLowerCase()];
                        }
                        // Robot is not explicitly defined as a tag, infer from operator description instead
                        if (opData.itemDesc !== null && opData.itemDesc.includes('robot')) {
                            tagId *= gameConsts.tagValues['robot'];
                        }
                        recruitId = rarityId * positionId * classId * tagId;
                        opArchetype = exports.archetypeDict[opData.subProfessionId];
                        opRange = exports.rangeDict[opData.phases[opData.phases.length - 1].rangeId];
                        opSkills = [];
                        for (_r = 0, _s = opData.skills; _r < _s.length; _r++) {
                            skill = _s[_r];
                            opSkills.push(exports.skillDict[skill.skillId]);
                        }
                        opModules = [];
                        if (charEquip.hasOwnProperty(opId)) {
                            for (_t = 0, _u = charEquip[opId]; _t < _u.length; _t++) {
                                module_3 = _u[_t];
                                if (module_3.includes('uniequip_001'))
                                    continue;
                                opModules.push(exports.moduleDict[module_3]);
                            }
                        }
                        opSkins = [];
                        if (exports.skinDict.hasOwnProperty(opId)) {
                            opSkins = exports.skinDict[opId];
                        }
                        opBases = [];
                        if (charBaseBuffs.hasOwnProperty(opId)) {
                            for (_v = 0, _w = charBaseBuffs[opId].buffChar; _v < _w.length; _v++) {
                                buff = _w[_v];
                                for (_x = 0, _y = buff.buffData; _x < _y.length; _x++) {
                                    baseData = _y[_x];
                                    opBases.push(exports.baseDict[baseData.buffId]);
                                }
                            }
                        }
                        opParadox = null;
                        if (exports.paradoxDict.hasOwnProperty(opId)) {
                            opParadox = exports.paradoxDict[opId];
                        }
                        opName = opData.name.toLowerCase();
                        keyArr = [opId, opName, opName.split('\'').join('')];
                        if (opId === 'char_1001_amiya2')
                            keyArr.push('amiya guard', 'guard amiya');
                        dataArr.push({
                            keys: keyArr,
                            value: {
                                id: opId, recruit: recruitId,
                                archetype: opArchetype, range: opRange, skills: opSkills, modules: opModules, skins: opSkins, bases: opBases, paradox: opParadox,
                                data: opData
                            }
                        });
                    }
                    return [4 /*yield*/, db.collection("operator").deleteMany({})];
                case 9:
                    _z.sent();
                    return [4 /*yield*/, db.collection("operator").insertMany(dataArr)];
                case 10:
                    _z.sent();
                    console.log("".concat(dataArr.length, " Operators loaded in ").concat((Date.now() - start) / 1000, "s"));
                    return [2 /*return*/];
            }
        });
    });
}
function loadParadoxes(db, gameConsts) {
    return __awaiter(this, void 0, void 0, function () {
        var start, handbookTable, stages, dataArr, _i, _a, excel, levelId, levels;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    start = Date.now();
                    return [4 /*yield*/, fetch("".concat(dataPath, "/excel/handbook_info_table.json"))];
                case 1: return [4 /*yield*/, (_b.sent()).json()];
                case 2:
                    handbookTable = _b.sent();
                    stages = handbookTable.handbookStageData;
                    dataArr = [];
                    _i = 0, _a = Object.values(stages);
                    _b.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    excel = _a[_i];
                    levelId = excel.levelId.toLowerCase();
                    return [4 /*yield*/, fetch("".concat(dataPath, "/levels/").concat(levelId, ".json"))];
                case 4: return [4 /*yield*/, (_b.sent()).json()];
                case 5:
                    levels = _b.sent();
                    exports.paradoxDict[excel.charId] = { excel: excel, levels: levels };
                    dataArr.push({ keys: [excel.charId], value: { excel: excel, levels: levels } });
                    _b.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 3];
                case 7: return [4 /*yield*/, db.collection("paradox").deleteMany({})];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, db.collection("paradox").insertMany(dataArr)];
                case 9:
                    _b.sent();
                    console.log("".concat(dataArr.length, " Paradoxes loaded in ").concat((Date.now() - start) / 1000, "s"));
                    return [2 /*return*/];
            }
        });
    });
}
function loadRanges(db, gameConsts) {
    return __awaiter(this, void 0, void 0, function () {
        var start, rangeTable, dataArr, _i, _a, range;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    start = Date.now();
                    return [4 /*yield*/, fetch("".concat(dataPath, "/excel/range_table.json"))];
                case 1: return [4 /*yield*/, (_b.sent()).json()];
                case 2:
                    rangeTable = _b.sent();
                    dataArr = [];
                    for (_i = 0, _a = Object.values(rangeTable); _i < _a.length; _i++) {
                        range = _a[_i];
                        exports.rangeDict[range.id.toLowerCase()] = range;
                        dataArr.push({ keys: [range.id.toLowerCase()], value: range });
                    }
                    return [4 /*yield*/, db.collection("range").deleteMany({})];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, db.collection("range").insertMany(dataArr)];
                case 4:
                    _b.sent();
                    console.log("".concat(dataArr.length, " Ranges loaded in ").concat((Date.now() - start) / 1000, "s"));
                    return [2 /*return*/];
            }
        });
    });
}
function loadRogueThemes(db, gameConsts) {
    return __awaiter(this, void 0, void 0, function () {
        var start, rogueTable, rogueDetails, rogueTopics, dataArr, i, rogueName, rogueTheme, rogueStages, stageDict, toughStageDict, rogueRelics, relicDict, rogueVariations, variationDict, _i, _a, excel, levelId, stageName, levels, levels, _b, _c, relic, relicName, _d, _e, variation;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    start = Date.now();
                    return [4 /*yield*/, fetch("".concat(dataPath, "/excel/roguelike_topic_table.json"))];
                case 1: return [4 /*yield*/, (_f.sent()).json()];
                case 2:
                    rogueTable = _f.sent();
                    rogueDetails = rogueTable.details;
                    rogueTopics = rogueTable.topics;
                    dataArr = [];
                    i = 0;
                    _f.label = 3;
                case 3:
                    if (!(i < Object.keys(rogueDetails).length)) return [3 /*break*/, 13];
                    rogueName = Object.values(rogueTopics)[i].name;
                    rogueTheme = Object.values(rogueDetails)[i];
                    rogueStages = rogueTheme.stages;
                    stageDict = {};
                    toughStageDict = {};
                    rogueRelics = rogueTheme.items;
                    relicDict = {};
                    rogueVariations = rogueTheme.variationData;
                    variationDict = {};
                    _i = 0, _a = Object.values(rogueStages);
                    _f.label = 4;
                case 4:
                    if (!(_i < _a.length)) return [3 /*break*/, 11];
                    excel = _a[_i];
                    levelId = excel.levelId.toLowerCase();
                    stageName = excel.name.toLowerCase();
                    if (!(excel.difficulty === 'FOUR_STAR')) return [3 /*break*/, 7];
                    return [4 /*yield*/, fetch("".concat(dataPath, "/levels/").concat(levelId, ".json"))];
                case 5: return [4 /*yield*/, (_f.sent()).json()];
                case 6:
                    levels = _f.sent();
                    toughStageDict[stageName] = { excel: excel, levels: levels };
                    return [3 /*break*/, 10];
                case 7:
                    if (!(excel.difficulty === 'NORMAL')) return [3 /*break*/, 10];
                    return [4 /*yield*/, fetch("".concat(dataPath, "/levels/").concat(levelId, ".json"))];
                case 8: return [4 /*yield*/, (_f.sent()).json()];
                case 9:
                    levels = _f.sent();
                    stageDict[stageName] = { excel: excel, levels: levels };
                    _f.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 4];
                case 11:
                    for (_b = 0, _c = Object.values(rogueRelics); _b < _c.length; _b++) {
                        relic = _c[_b];
                        if (relic.type === 'BAND' || relic.type == 'CAPSULE')
                            continue; // Bands are squads, capsules are IS2 plays, skip these
                        relicName = relic.name.toLowerCase();
                        relicDict[relicName] = relic;
                    }
                    for (_d = 0, _e = Object.values(rogueVariations); _d < _e.length; _d++) {
                        variation = _e[_d];
                        variationDict[variation.outerName.toLowerCase()] = variation;
                    }
                    dataArr[i] = { keys: [i, i.toString()], value: { name: rogueName, stageDict: stageDict, toughStageDict: toughStageDict, relicDict: relicDict, variationDict: variationDict } };
                    _f.label = 12;
                case 12:
                    i++;
                    return [3 /*break*/, 3];
                case 13: return [4 /*yield*/, db.collection("rogue").deleteMany({})];
                case 14:
                    _f.sent();
                    return [4 /*yield*/, db.collection("rogue").insertMany(dataArr)];
                case 15:
                    _f.sent();
                    console.log("".concat(dataArr.length, " Rogue themes loaded in ").concat((Date.now() - start) / 1000, "s"));
                    return [2 /*return*/];
            }
        });
    });
}
function loadSandboxes(db, gameConsts) {
    return __awaiter(this, void 0, void 0, function () {
        var start, sandboxTable, sandboxActTables, dataArr, i, sandboxAct, stageDatas, stageDict, _i, _a, excel, levelId, stageName, levels;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    start = Date.now();
                    return [4 /*yield*/, fetch("".concat(dataPath, "/excel/sandbox_table.json"))];
                case 1: return [4 /*yield*/, (_b.sent()).json()];
                case 2:
                    sandboxTable = _b.sent();
                    sandboxActTables = sandboxTable.sandboxActTables;
                    dataArr = [];
                    i = 0;
                    _b.label = 3;
                case 3:
                    if (!(i < Object.keys(sandboxActTables).length)) return [3 /*break*/, 10];
                    sandboxAct = Object.values(sandboxActTables)[i];
                    stageDatas = sandboxAct.stageDatas;
                    stageDict = {};
                    _i = 0, _a = Object.values(stageDatas);
                    _b.label = 4;
                case 4:
                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                    excel = _a[_i];
                    levelId = excel.levelId.toLowerCase();
                    stageName = excel.name.toLowerCase();
                    return [4 /*yield*/, fetch("".concat(dataPath, "/levels/").concat(levelId, ".json"))];
                case 5: return [4 /*yield*/, (_b.sent()).json()];
                case 6:
                    levels = _b.sent();
                    stageDict[stageName] = { excel: excel, levels: levels };
                    _b.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 4];
                case 8:
                    dataArr[i] = { keys: [i, i.toString()], value: { stageDict: stageDict } };
                    _b.label = 9;
                case 9:
                    i++;
                    return [3 /*break*/, 3];
                case 10: return [4 /*yield*/, db.collection("sandbox").deleteMany({})];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, db.collection("sandbox").insertMany(dataArr)];
                case 12:
                    _b.sent();
                    console.log("".concat(dataArr.length, " Sandbox acts loaded in ").concat((Date.now() - start) / 1000, "s"));
                    return [2 /*return*/];
            }
        });
    });
}
function loadSkills(db, gameConsts) {
    return __awaiter(this, void 0, void 0, function () {
        var start, skillTable, dataArr, _i, _a, skill;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    start = Date.now();
                    return [4 /*yield*/, fetch("".concat(dataPath, "/excel/skill_table.json"))];
                case 1: return [4 /*yield*/, (_b.sent()).json()];
                case 2:
                    skillTable = _b.sent();
                    dataArr = [];
                    for (_i = 0, _a = Object.values(skillTable); _i < _a.length; _i++) {
                        skill = _a[_i];
                        exports.skillDict[skill.skillId.toLowerCase()] = skill;
                        dataArr.push({ keys: [skill.skillId.toLowerCase()], value: skill });
                    }
                    return [4 /*yield*/, db.collection("skill").deleteMany({})];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, db.collection("skill").insertMany(dataArr)];
                case 4:
                    _b.sent();
                    console.log("".concat(dataArr.length, " Skills loaded in ").concat((Date.now() - start) / 1000, "s"));
                    return [2 /*return*/];
            }
        });
    });
}
function loadSkins(db, gameConsts) {
    return __awaiter(this, void 0, void 0, function () {
        var start, skinTable, charSkins, dataArr, _loop_1, _i, _a, skin;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    start = Date.now();
                    return [4 /*yield*/, fetch("".concat(dataPath, "/excel/skin_table.json"))];
                case 1: return [4 /*yield*/, (_b.sent()).json()];
                case 2:
                    skinTable = _b.sent();
                    charSkins = skinTable.charSkins;
                    dataArr = [];
                    _loop_1 = function (skin) {
                        var opId = skin.charId;
                        if (!exports.skinDict.hasOwnProperty(opId)) {
                            exports.skinDict[opId] = []; // Create an empty array if it's the first skin for that op
                        }
                        exports.skinDict[opId].push(skin);
                        if (!dataArr.find(function (data) { return data.keys.includes(opId); })) {
                            dataArr.push({ keys: [opId], value: [] });
                        }
                        dataArr.find(function (data) { return data.keys.includes(opId); }).value.push(skin);
                    };
                    for (_i = 0, _a = Object.values(charSkins); _i < _a.length; _i++) {
                        skin = _a[_i];
                        _loop_1(skin);
                    }
                    return [4 /*yield*/, db.collection("skin").deleteMany({})];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, db.collection("skin").insertMany(dataArr)];
                case 4:
                    _b.sent();
                    console.log("".concat(dataArr.length, " Skins loaded in ").concat((Date.now() - start) / 1000, "s"));
                    return [2 /*return*/];
            }
        });
    });
}
function loadStages(db, gameConsts) {
    return __awaiter(this, void 0, void 0, function () {
        var start, stageTable, stages, dataArr, toughArr, _loop_2, _i, _a, excel;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    start = Date.now();
                    return [4 /*yield*/, fetch("".concat(dataPath, "/excel/stage_table.json"))];
                case 1: return [4 /*yield*/, (_b.sent()).json()];
                case 2:
                    stageTable = _b.sent();
                    stages = stageTable.stages;
                    dataArr = [];
                    toughArr = [];
                    _loop_2 = function (excel) {
                        var levelRegex, levelId, code, levels, stage, e_2, levels, stage, levels, stage, e_3, levels, stage;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (excel.isStoryOnly || excel.stageType === 'GUIDE')
                                        return [2 /*return*/, "continue"]; // Skip story and cutscene levels
                                    levelRegex = /\S+_m$/;
                                    levelId = excel.levelId.toLowerCase();
                                    if (levelId.match(levelRegex)) {
                                        levelId = levelId.substring(0, excel.levelId.length - 2).split('mission/').join('');
                                    }
                                    // Skip easy levels cause no one cares, basically the same as normal anyways
                                    if (levelId.includes('easy_sub') || levelId.includes('easy'))
                                        return [2 /*return*/, "continue"];
                                    // Skip SSS challenge levels cause the only thing that changes is the starting danger level
                                    if (excel.stageType === 'CLIMB_TOWER' && levelId.substring(levelId.length - 3) === '_ex')
                                        return [2 /*return*/, "continue"];
                                    code = excel.code.toLowerCase();
                                    if (!(excel.diffGroup === 'TOUGH' || excel.difficulty === 'FOUR_STAR')) return [3 /*break*/, 8];
                                    if (!toughArr.find(function (data) { return data.keys.includes(code); })) {
                                        toughArr.push({ keys: [code], value: [] });
                                    }
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 4, , 7]);
                                    return [4 /*yield*/, fetch("".concat(dataPath, "/levels/").concat(levelId, ".json"))];
                                case 2: return [4 /*yield*/, (_c.sent()).json()];
                                case 3:
                                    levels = _c.sent();
                                    stage = { excel: excel, levels: levels };
                                    toughArr.push({ keys: [excel.stageId, excel.stageId.split('#').join(''), excel.code, excel.name], value: [stage] });
                                    toughArr.find(function (data) { return data.keys.includes(code); }).value.push(stage); // Stage code
                                    return [3 /*break*/, 7];
                                case 4:
                                    e_2 = _c.sent();
                                    return [4 /*yield*/, fetch("".concat(backupPath, "/levels/").concat(levelId, ".json"))];
                                case 5: return [4 /*yield*/, (_c.sent()).json()];
                                case 6:
                                    levels = _c.sent();
                                    stage = { excel: excel, levels: levels };
                                    toughArr.push({ keys: [excel.stageId, excel.stageId.split('#').join(''), excel.code, excel.name], value: [stage] });
                                    toughArr.find(function (data) { return data.keys.includes(code); }).value.push(stage); // Stage code
                                    return [3 /*break*/, 7];
                                case 7: return [3 /*break*/, 15];
                                case 8:
                                    if (!(excel.difficulty === 'NORMAL')) return [3 /*break*/, 15];
                                    if (!dataArr.find(function (data) { return data.keys.includes(code); })) {
                                        dataArr.push({ keys: [code], value: [] }); // Multiple stages can have the same code, so each code maps to an array
                                    }
                                    _c.label = 9;
                                case 9:
                                    _c.trys.push([9, 12, , 15]);
                                    return [4 /*yield*/, fetch("".concat(dataPath, "/levels/").concat(levelId, ".json"))];
                                case 10: return [4 /*yield*/, (_c.sent()).json()];
                                case 11:
                                    levels = _c.sent();
                                    stage = { excel: excel, levels: levels };
                                    dataArr.push({ keys: [excel.stageId, excel.code, excel.name], value: [stage] });
                                    dataArr.find(function (data) { return data.keys.includes(code); }).value.push(stage); // Stage code
                                    return [3 /*break*/, 15];
                                case 12:
                                    e_3 = _c.sent();
                                    return [4 /*yield*/, fetch("".concat(backupPath, "/levels/").concat(levelId, ".json"))];
                                case 13: return [4 /*yield*/, (_c.sent()).json()];
                                case 14:
                                    levels = _c.sent();
                                    stage = { excel: excel, levels: levels };
                                    dataArr.push({ keys: [excel.stageId, excel.code, excel.name], value: [stage] });
                                    dataArr.find(function (data) { return data.keys.includes(code); }).value.push(stage); // Stage code
                                    return [3 /*break*/, 15];
                                case 15: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _a = Object.values(stages);
                    _b.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    excel = _a[_i];
                    return [5 /*yield**/, _loop_2(excel)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [4 /*yield*/, db.collection("stage").deleteMany({})];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, db.collection("stage").insertMany(dataArr)];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, db.collection("toughstage").deleteMany({})];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, db.collection("toughstage").insertMany(toughArr)];
                case 10:
                    _b.sent();
                    console.log("".concat(dataArr.length + toughArr.length, " Stages loaded in ").concat((Date.now() - start) / 1000, "s"));
                    return [2 /*return*/];
            }
        });
    });
}
main();
