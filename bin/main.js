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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var AzureREST_1 = __importDefault(require("./AzureREST"));
var lodash_1 = __importDefault(require("lodash"));
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
            var config, answer, _a, baseUrl, PAT, configPath;
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
                    case 5:
                        //if via config file
                        console.log("make sure you suppliy a JSON file path with properties: {rootUrl:***,PAT:***}");
                        return [4 /*yield*/, inquirer.prompt([{ "type": "input", "name": "configPath",
                                    "message": "Please type the path of the config file:" }])];
                    case 6:
                        configPath = _b.sent();
                        if (configPath.configPath) {
                            config = require(configPath.configPath);
                        }
                        if (config.rootUrl && config.PAT) {
                            return [2 /*return*/, ({ "baseUrl": config.rootUrl, "PAT": config.PAT })];
                        }
                        else {
                            console.error('Please fix your config file');
                        }
                        return [3 /*break*/, 8];
                    case 7: return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    }; //getConnectionData
    //connect to azureDevOps and get project list
    Main.prototype.connectToAzureDevops = function (rootUrl, PAT) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.restClient = new AzureREST_1.default(rootUrl, PAT);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.restClient.getProjectList()];
                    case 2:
                        res = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Error fetching TeamProjects - please check --  baseURL and your PAT");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, res.data.value];
                }
            });
        });
    }; //connectToAzureDevops
    //get dashboard list
    Main.prototype.getDashboardList = function (projectName) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.restClient.getDashboardList(projectName)];
                    case 1:
                        res = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Error fetching TeamProjects - please check --  baseURL and your PAT");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, res.data.dashboardEntries];
                }
            });
        });
    }; //getDashboardList
    //get dashboard list
    Main.prototype.getDashboardData = function (projectName, dashboardId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.restClient.getDashboardData(projectName, dashboardId)];
                    case 1:
                        res = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Error fetching TeamProjects - please check --  baseURL and your PAT");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, res.data];
                }
            });
        });
    }; //getDashboardList
    //copy dashboard
    Main.prototype.copyDashboard = function (projectToName, dashboardObject) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        delete dashboardObject.id;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.restClient.createDashboard(projectToName, dashboardObject)];
                    case 2:
                        res = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.error("Error copying dashboard - please check --  baseURL and your PAT");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }; //copyDashboard
    Main.prototype.inputfromSelect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var answer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, inquirer.prompt([{ "type": "list", "name": "selectType",
                                "message": "How do you want to pass your connection data ?",
                                "choices": ["Select from list", "JSON Config file"] }])];
                    case 1:
                        answer = _a.sent();
                        switch (answer.selectType) {
                            case 'Select from list': {
                                return [2 /*return*/, 'list'];
                            }
                            case 'JSON Config file': {
                                console.log("Please make sure before you proceed, that your config file cantains the following properties:\n      {\n        projectFrom:<your project to copy from name>,\n        dashboardFrom:<your dashboard or dashboards to copy from name>\n      } ");
                                return [2 /*return*/, 'json'];
                            }
                        } //switch
                        return [2 /*return*/];
                }
            });
        });
    }; //inputfromSelect
    //select relavnt item from list
    Main.prototype.selectFromList = function (list, actionToSelect) {
        return __awaiter(this, void 0, void 0, function () {
            var selected, titles, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(list.map(function (item) { return item.name; }))];
                    case 1:
                        titles = _a.sent();
                        return [4 /*yield*/, inquirer.prompt([{ "type": "list", "name": "selected",
                                    "message": actionToSelect,
                                    "choices": titles }])];
                    case 2:
                        selected = _a.sent();
                        i = lodash_1.default.findIndex(list, function (item) { return item.name === selected.selected; });
                        return [2 /*return*/, (list[i])];
                }
            });
        });
    }; //selectFromList
    Main.prototype.createNewDashboardObject = function (dashboardObject, fromProject, destProject) {
        return __awaiter(this, void 0, void 0, function () {
            var queryStack, updatedWidgetArray, destQueryPath;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryStack = [];
                        updatedWidgetArray = [];
                        return [4 /*yield*/, this.restClient.createQueryPath(destProject, "/Shared Queries/Dashboards/" + dashboardObject.name + "/XXX")];
                    case 1:
                        destQueryPath = _a.sent();
                        //iterate Dashboards Widgets
                        return [4 /*yield*/, Promise.all(dashboardObject.widgets.map(function (widget) { return __awaiter(_this, void 0, void 0, function () {
                                var jsonSettings, i, queryData, queryObject, res, i, queryData, queryObject, res, i, queryData, queryObject, res, i, queryData, queryObject, res;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            jsonSettings = JSON.parse(widget.settings);
                                            if (!jsonSettings.queryId) return [3 /*break*/, 4];
                                            console.log("found queryId: " + jsonSettings.queryId);
                                            i = lodash_1.default.findIndex(queryStack, function (o) { return o.oldQueryId === jsonSettings.queryId; });
                                            if (!(i === -1)) return [3 /*break*/, 3];
                                            return [4 /*yield*/, this.restClient.getQueryData(fromProject, jsonSettings.queryId)];
                                        case 1:
                                            queryData = _a.sent();
                                            queryObject = { "name": queryData.data.name, "wiql": queryData.data.wiql };
                                            return [4 /*yield*/, this.restClient.createQuery(destProject, queryObject, destQueryPath)];
                                        case 2:
                                            res = _a.sent();
                                            //add new old and new query to query stack
                                            try {
                                                queryStack.push({ oldQueryId: jsonSettings.queryId, newQueryId: res.data.id });
                                            }
                                            catch (error) {
                                                console.log("cought error queryId: " + error);
                                            }
                                            //replace the queryId with the new query
                                            jsonSettings.queryId = res.data.id;
                                            widget.settings = JSON.stringify(jsonSettings);
                                            return [3 /*break*/, 4];
                                        case 3:
                                            //replace the queryId with the new query
                                            jsonSettings.queryId = queryStack[i].newQueryId;
                                            widget.settings = JSON.stringify(jsonSettings);
                                            _a.label = 4;
                                        case 4:
                                            if (!jsonSettings.query) return [3 /*break*/, 8];
                                            if (!jsonSettings.query.queryId) return [3 /*break*/, 8];
                                            console.log("found query.queryId: " + jsonSettings.query.queryId);
                                            i = lodash_1.default.findIndex(queryStack, function (o) { return o.oldQueryId === jsonSettings.query.queryId; });
                                            if (!(i === -1)) return [3 /*break*/, 7];
                                            return [4 /*yield*/, this.restClient.getQueryData(fromProject, jsonSettings.query.queryId)];
                                        case 5:
                                            queryData = _a.sent();
                                            queryObject = { "name": queryData.data.name, "wiql": queryData.data.wiql };
                                            return [4 /*yield*/, this.restClient.createQuery(destProject, queryObject, destQueryPath)];
                                        case 6:
                                            res = _a.sent();
                                            //add new old and new query to query stack
                                            try {
                                                queryStack.push({ oldQueryId: jsonSettings.query.queryId, newQueryId: res.data.id });
                                            }
                                            catch (error) {
                                                console.log("cought error query.queryId: " + error);
                                            }
                                            //replace the queryId with the new query
                                            jsonSettings.query.queryId = res.data.id;
                                            widget.settings = JSON.stringify(jsonSettings);
                                            return [3 /*break*/, 8];
                                        case 7:
                                            //replace the queryId with the new query
                                            jsonSettings.query.queryId = queryStack[i].newQueryId;
                                            widget.settings = JSON.stringify(jsonSettings);
                                            _a.label = 8;
                                        case 8:
                                            if (!jsonSettings.groupKey) return [3 /*break*/, 12];
                                            console.log("found groupKey: " + jsonSettings.groupKey);
                                            i = lodash_1.default.findIndex(queryStack, function (o) { return o.oldQueryId === jsonSettings.groupKey; });
                                            if (!(i === -1)) return [3 /*break*/, 11];
                                            return [4 /*yield*/, this.restClient.getQueryData(fromProject, jsonSettings.groupKey)];
                                        case 9:
                                            queryData = _a.sent();
                                            queryObject = { "name": queryData.data.name, "wiql": queryData.data.wiql };
                                            return [4 /*yield*/, this.restClient.createQuery(destProject, queryObject, destQueryPath)];
                                        case 10:
                                            res = _a.sent();
                                            //add new old and new query to query stack
                                            try {
                                                queryStack.push({ oldQueryId: jsonSettings.groupKey, newQueryId: res.data.id });
                                            }
                                            catch (error) {
                                                console.log("cought error groupKey: " + error);
                                            }
                                            //replace the queryId with the new query
                                            jsonSettings.groupKey = res.data.id;
                                            widget.settings = JSON.stringify(jsonSettings);
                                            return [3 /*break*/, 12];
                                        case 11:
                                            //replace the queryId with the new query
                                            jsonSettings.groupKey = queryStack[i].newQueryId;
                                            widget.settings = JSON.stringify(jsonSettings);
                                            _a.label = 12;
                                        case 12:
                                            if (!jsonSettings.transformOptions) return [3 /*break*/, 16];
                                            if (!jsonSettings.transformOptions.filter) return [3 /*break*/, 16];
                                            console.log("found transformOptions.filter: " + jsonSettings.transformOptions.filter);
                                            i = lodash_1.default.findIndex(queryStack, function (o) { return o.oldQueryId === jsonSettings.transformOptions.filter; });
                                            if (!(i === -1)) return [3 /*break*/, 15];
                                            return [4 /*yield*/, this.restClient.getQueryData(fromProject, jsonSettings.transformOptions.filter)];
                                        case 13:
                                            queryData = _a.sent();
                                            queryObject = { "name": queryData.data.name, "wiql": queryData.data.wiql };
                                            return [4 /*yield*/, this.restClient.createQuery(destProject, queryObject, destQueryPath)];
                                        case 14:
                                            res = _a.sent();
                                            //add new old and new query to query stack
                                            try {
                                                queryStack.push({ oldQueryId: jsonSettings.transformOptions.filter, newQueryId: res.data.id });
                                            }
                                            catch (error) {
                                                console.log("cought error: " + error);
                                            }
                                            //replace the queryId with the new query
                                            jsonSettings.transformOptions.filter = res.data.id;
                                            widget.settings = JSON.stringify(jsonSettings);
                                            return [3 /*break*/, 16];
                                        case 15:
                                            //replace the queryId with the new query
                                            jsonSettings.transformOptions.filter = queryStack[i].newQueryId;
                                            widget.settings = JSON.stringify(jsonSettings);
                                            _a.label = 16;
                                        case 16:
                                            //replace in dashboardObject
                                            updatedWidgetArray.push(widget);
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 2:
                        //iterate Dashboards Widgets
                        _a.sent(); //Promise.all
                        // console.log(updatedWidgetArray);
                        dashboardObject.widgets = updatedWidgetArray;
                        return [2 /*return*/, dashboardObject];
                }
            });
        });
    }; //createNewDashboardObject
    Main.prototype.runBaseOnConfigFIle = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    }; //runBaseOnConfigFIle
    Main.prototype.main = function () {
        return __awaiter(this, void 0, void 0, function () {
            var azureParams, projectList, inputFrom, selectedProjectFrom, dashBoardList, selectedDashboard, dashBoardDetails, isCloneQueries, selectedProjectTo, updatedDashBoardObject;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.printappHeader("DashBoard - Copy Tool")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getConnectionData()];
                    case 2:
                        azureParams = _a.sent();
                        return [4 /*yield*/, this.connectToAzureDevops(azureParams.baseUrl, azureParams.PAT)];
                    case 3:
                        projectList = _a.sent();
                        return [4 /*yield*/, this.inputfromSelect()];
                    case 4:
                        inputFrom = _a.sent();
                        if (!(inputFrom === 'list')) return [3 /*break*/, 16];
                        return [4 /*yield*/, this.selectFromList(projectList, 'Please select a project to copy from:')];
                    case 5:
                        selectedProjectFrom = _a.sent();
                        return [4 /*yield*/, this.getDashboardList(selectedProjectFrom.name)];
                    case 6:
                        dashBoardList = _a.sent();
                        return [4 /*yield*/, this.selectFromList(dashBoardList, 'Please select a dashboard to copy:')];
                    case 7:
                        selectedDashboard = _a.sent();
                        return [4 /*yield*/, this.getDashboardData(selectedProjectFrom.name, selectedDashboard.id)];
                    case 8:
                        dashBoardDetails = _a.sent();
                        return [4 /*yield*/, this.selectFromList([{ name: 'Yes' }, { name: 'No' }], 'Do you want to clone all dashboard queries?')];
                    case 9:
                        isCloneQueries = _a.sent();
                        return [4 /*yield*/, this.selectFromList(projectList, 'Please select a project to copy from:')];
                    case 10:
                        selectedProjectTo = _a.sent();
                        if (!(isCloneQueries.name === 'Yes')) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.createNewDashboardObject(dashBoardDetails, selectedProjectFrom.name, selectedProjectTo.name)];
                    case 11:
                        updatedDashBoardObject = _a.sent();
                        // console.log(updatedDashBoardObject);
                        return [4 /*yield*/, this.copyDashboard(selectedProjectTo.name, updatedDashBoardObject)];
                    case 12:
                        // console.log(updatedDashBoardObject);
                        _a.sent();
                        return [3 /*break*/, 15];
                    case 13: return [4 /*yield*/, this.copyDashboard(selectedProjectTo.name, dashBoardDetails)];
                    case 14:
                        _a.sent();
                        _a.label = 15;
                    case 15: return [3 /*break*/, 16];
                    case 16:
                        console.log("Thanks for using if you like please add a star on github");
                        return [2 /*return*/];
                }
            });
        });
    }; //main
    return Main;
}()); //class
exports.default = Main;
//# sourceMappingURL=Main.js.map