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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.getCollections = getCollections;
exports.getMulti = getMulti;
exports.getSingle = getSingle;
exports.getMatch = getMatch;
exports.getSearch = getSearch;
exports.getNewEn = getNewEn;
var db_1 = __importDefault(require("./db"));
function getCollections() {
    return __awaiter(this, void 0, void 0, function () {
        var collections;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, db_1.default)()];
                case 1: return [4 /*yield*/, (_a.sent()).collections()];
                case 2:
                    collections = _a.sent();
                    return [2 /*return*/, collections.map(function (collection) { return collection.collectionName; })];
            }
        });
    });
}
// Gets all documents from a collection
// operator
function getMulti(collectionName, req) {
    return __awaiter(this, void 0, void 0, function () {
        var collection, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, db_1.default)()];
                case 1:
                    collection = (_a.sent()).collection(collectionName);
                    return [4 /*yield*/, collection.find({}, createOptions(req)).toArray()];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
// Gets a single document that has a key equal to the request id
// operator/char_188_helage
function getSingle(collectionName, req) {
    return __awaiter(this, void 0, void 0, function () {
        var collection, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, db_1.default)()];
                case 1:
                    collection = (_a.sent()).collection(collectionName);
                    return [4 /*yield*/, collection.findOne({ keys: { $eq: req.params.id } }, createOptions(req))];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
// Gets all documents whose keys contain the request id as a substring
// operator/match/helage
function getMatch(collectionName, req) {
    return __awaiter(this, void 0, void 0, function () {
        var collection, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, db_1.default)()];
                case 1:
                    collection = (_a.sent()).collection(collectionName);
                    return [4 /*yield*/, collection.find({ keys: { $regex: req.params.id, $options: 'i' } }, createOptions(req)).toArray()];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
// Gets all documents where the document fields match the request params
// operator/search?data.subProfessionId=musha
function getSearch(collectionName, req) {
    return __awaiter(this, void 0, void 0, function () {
        var collection, filter, key, field, field, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, db_1.default)()];
                case 1:
                    collection = (_a.sent()).collection(collectionName);
                    filter = {};
                    for (key in req.query) {
                        if (key.charAt(key.length - 1) === '>') {
                            field = "value.".concat(key.slice(0, -1));
                            filter[field] = filter[field] || {};
                            filter[field].$gte = parseInt(req.query[key]);
                            continue;
                        }
                        else if (key.charAt(key.length - 1) === '<') {
                            field = "value.".concat(key.slice(0, -1));
                            filter[field] = filter[field] || {};
                            filter[field].$lte = parseInt(req.query[key]);
                            continue;
                        }
                        else {
                            if (['include', 'exclude', 'limit'].includes(key))
                                continue;
                            filter["value.".concat(key)] = { $eq: req.query[key] };
                        }
                    }
                    return [4 /*yield*/, collection.find(filter, createOptions(req)).toArray()];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
// Gets all documents that have been created during the last EN update
function getNewEn() {
    return __awaiter(this, void 0, void 0, function () {
        var collections, commits, hash, filter, result, _i, collections_1, collection, a;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, db_1.default)()];
                case 1: return [4 /*yield*/, (_a.sent()).collections()];
                case 2:
                    collections = _a.sent();
                    return [4 /*yield*/, fetch('https://api.github.com/repos/Kengxxiao/ArknightsGameData_YoStar/commits').then(function (res) { return res.json(); })];
                case 3:
                    commits = _a.sent();
                    hash = commits.find(function (commit) { return commit.commit.message.includes('[EN UPDATE]'); }).sha;
                    filter = { 'meta.created': hash };
                    result = {};
                    _i = 0, collections_1 = collections;
                    _a.label = 4;
                case 4:
                    if (!(_i < collections_1.length)) return [3 /*break*/, 7];
                    collection = collections_1[_i];
                    if (collection.collectionName === 'about')
                        return [3 /*break*/, 6];
                    if (collection.collectionName.startsWith('cn'))
                        return [3 /*break*/, 6];
                    return [4 /*yield*/, collection.find(filter).toArray()];
                case 5:
                    a = _a.sent();
                    result[collection.collectionName] = a;
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7: return [2 /*return*/, result];
            }
        });
    });
}
function createOptions(req) {
    var _a;
    var includeParams = req.query.include;
    var excludeParams = req.query.exclude;
    var projection = {};
    var limit = (_a = parseInt(req.query.limit)) !== null && _a !== void 0 ? _a : 0;
    if (includeParams) {
        projection['meta'] = 1;
        projection['canon'] = 1;
        projection['keys'] = 1;
        if (Array.isArray(includeParams)) {
            includeParams.forEach(function (include) { return projection["value.".concat(include)] = 1; });
        }
        else {
            projection["value.".concat(includeParams)] = 1;
        }
    }
    else if (excludeParams) {
        if (Array.isArray(excludeParams)) {
            excludeParams.forEach(function (exclude) { return projection["value.".concat(exclude)] = 0; });
        }
        else {
            projection["value.".concat(excludeParams)] = 0;
        }
    }
    var options = { projection: projection, limit: limit };
    return options;
}
