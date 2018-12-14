"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var inquirer = require('inquirer');
var figlet = require('figlet');
var chalk = require('chalk');
var Main = /** @class */ (function () {
    function Main() {
    }
    //show welcome screen
    Main.prototype.printappHeader = function (str) {
        return new Promise(function (resolve, reject) {
            console.log(chalk.yellow(figlet.textSync(str, { horizontalLayout: 'full' })));
            console.log('\n');
            resolve(true);
        }); //Promise
    }; //printappHeader
    //get connection data
    Main.prototype.getConnectionData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var answer, _a, baseUrl, PAT, configPath;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, inquirer.prompt([{ "type": "list", "name": "selectType",
                                "message": "How do you want to pass your connection data ?",
                                "choices": ["Manual Typing", "JSON Config file"] }])];
                    case 1:
                        answer = _b.sent();
                        _a = answer.selectType;
                        switch (_a) {
                            case 'Manual Typing': return [3 /*break*/, 2];
                            case 'JSON Config file': return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 7];
                    case 2: return [4 /*yield*/, inquirer.prompt([{ "type": "input", "name": "rootUrl",
                                "message": "Please type the root url:" }])];
                    case 3:
                        baseUrl = _b.sent();
                        return [4 /*yield*/, inquirer.prompt([{ "type": "input", "name": "PAT",
                                    "message": "Please type your Personal Access Token(PAT):" }])];
                    case 4:
                        PAT = _b.sent();
                        return [2 /*return*/, ({ "baseUrl": baseUrl, "PAT": PAT })];
                    case 5: return [4 /*yield*/, inquirer.prompt([{ "type": "input", "name": "rootUrl",
                                "message": "Please type the root url:" }])];
                    case 6:
                        configPath = _b.sent();
                        return [3 /*break*/, 8];
                    case 7: return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    //connect to azureDevOps
    //get project list
    //select relavnt project to copy from
    //if via config file
    //if via manual select from list
    //get dashboard list
    //select relavnt dashboard to copy from
    //if via config file
    //if via manual select from list
    //select relavnt project to copy from
    //if via config file
    //if via manual select from list
    //copy dashboard
    Main.prototype.main = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.printappHeader("DashBoard - Copy Tool")];
                    case 1:
                        _a.sent();
                        this.getConnectionData();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Main;
}());
exports.default = Main;
