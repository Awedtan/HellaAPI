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
require("dotenv/config");
var express_1 = __importDefault(require("express"));
var persistence_1 = require("./persistence");
var cors = require('cors');
function createRouter(route) {
    var _this = this;
    var router = express_1.default.Router();
    router.get('/', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, persistence_1.getMulti)(route, req)];
                case 1:
                    result = _a.sent();
                    if (!result)
                        res.status(404).send("Not found");
                    else
                        res.status(200).send(result);
                    return [2 /*return*/];
            }
        });
    }); });
    router.get('/search', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, persistence_1.getSearch)(route, req)];
                case 1:
                    result = _a.sent();
                    if (!result)
                        res.status(404).send("Not found");
                    else
                        res.status(200).send(result);
                    return [2 /*return*/];
            }
        });
    }); });
    router.get('/match/:id', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, persistence_1.getMatch)(route, req)];
                case 1:
                    result = _a.sent();
                    if (!result)
                        res.status(404).send("Not found");
                    else
                        res.status(200).send(result);
                    return [2 /*return*/];
            }
        });
    }); });
    router.get('/:id', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, persistence_1.getSingle)(route, req)];
                case 1:
                    result = _a.sent();
                    if (!result)
                        res.status(404).send("Not found");
                    else
                        res.status(200).send(result);
                    return [2 /*return*/];
            }
        });
    }); });
    return router;
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var app, collections, _i, collections_1, collection;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = (0, express_1.default)();
                    app.use(cors());
                    return [4 /*yield*/, (0, persistence_1.getCollections)()];
                case 1:
                    collections = _a.sent();
                    for (_i = 0, collections_1 = collections; _i < collections_1.length; _i++) {
                        collection = collections_1[_i];
                        app.use('/' + collection, createRouter(collection));
                    }
                    app.use('/new', function (_req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, persistence_1.getNewEn)()];
                                case 1:
                                    result = _a.sent();
                                    res.status(200).send(result);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    app.use(function (_req, res) {
                        var obj = {
                            msg: 'Invalid endpoint',
                            endpoints: collections.concat('new').sort()
                        };
                        res.status(404).send(obj);
                    });
                    app.use(function (err, _req, res, next) {
                        res.status(500).send("Uh oh! An unexpected error occured.");
                        console.log(err);
                    });
                    app.listen(process.env.PORT, function () {
                        console.log("Server is running on port: ".concat(process.env.PORT));
                    });
                    return [2 /*return*/];
            }
        });
    });
}
main();
/*

api.app/operator
api.app/operator/hellagur
api.app/operator/hellagur?include=description&include=name
api.app/operator/hellagur?exclude=paradox
api.app/operator/search
api.app/operator/search?archetype=Pioneer&include=id
api.app/operator/search?archetype=Pioneer&include=data.name&limit=6
api.app/operator/match/chen

*/ 
