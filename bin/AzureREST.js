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
var axios_1 = __importDefault(require("axios"));
var AzureREST = /** @class */ (function () {
    function AzureREST(rootUrl, PAT) {
        this.rootUrl = rootUrl;
        axios_1.default.defaults['auth'] = { "username": '', "password": PAT };
    }
    //fetches all teamProjects
    AzureREST.prototype.getProjectList = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, axios_1.default.get(this.rootUrl + "/_apis/projects")];
            });
        });
    }; //getProjectList
    //fetch all dashboards for a team project
    AzureREST.prototype.getDashboardList = function (projectName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                //?api-version=5.0-preview.2
                return [2 /*return*/, axios_1.default.get(this.rootUrl + "/" + projectName + "/_apis/dashboard/dashboards")];
            });
        });
    }; //getProjectList
    //fetch  dashboard data by id
    AzureREST.prototype.getDashboardData = function (projectName, dashboardId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, axios_1.default.get(this.rootUrl + "/" + projectName + "/_apis/dashboard/dashboards/" + dashboardId)];
            });
        });
    }; //getProjectList
    //creates a dashboard
    AzureREST.prototype.createDashboard = function (projectName, dashboardObject) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, axios_1.default.post(this.rootUrl + "/" + projectName + "/_apis/dashboard/dashboards?api-version=4.1-preview.2", dashboardObject)];
            });
        });
    }; //getProjectList
    //fetch Query folder by path
    AzureREST.prototype.getQueryFolder = function (projectName, folderPath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, axios_1.default.get(this.rootUrl + "/" + projectName + "/_apis/wit/queries/" + folderPath + "?$expand=all")];
            });
        });
    }; //getProjectList
    //fetch Query data by id
    AzureREST.prototype.getQueryData = function (projectName, queryId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, axios_1.default.get(this.rootUrl + "/" + projectName + "/_apis/wit/queries/" + queryId + "?$expand=all")];
            });
        });
    }; //getProjectList
    //creates a query
    AzureREST.prototype.createQuery = function (projectName, queryObject, queryPath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, axios_1.default.post(this.rootUrl + "/" + projectName + "/_apis/wit/queries/" + queryPath + "?api-version=4.1", queryObject)];
            });
        });
    }; //getProjectList
    //creates folder structure
    AzureREST.prototype.createQueryPath = function (projectName, queryPath) {
        return __awaiter(this, void 0, void 0, function () {
            var foldersByOrder, currentFolderToCheck, currentFolderCreatePath, i, res, error_1, res_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        foldersByOrder = queryPath.split("/");
                        currentFolderToCheck = '';
                        currentFolderCreatePath = '';
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < foldersByOrder.length - 1)) return [3 /*break*/, 8];
                        res = void 0;
                        currentFolderToCheck += foldersByOrder[i] + "/";
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 6]);
                        return [4 /*yield*/, this.getQueryFolder(projectName, currentFolderToCheck)];
                    case 3:
                        res = _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        error_1 = _a.sent();
                        res_1 = void 0;
                        return [4 /*yield*/, this.createQuery(projectName, { "name": foldersByOrder[i], "isFolder": true }, currentFolderCreatePath)];
                    case 5:
                        //ADD ERROR HANDLING
                        res_1 = _a.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        currentFolderCreatePath += foldersByOrder[i] + "/";
                        _a.label = 7;
                    case 7:
                        i++;
                        return [3 /*break*/, 1];
                    case 8: return [2 /*return*/, currentFolderCreatePath];
                }
            });
        });
    }; //createQueryPath
    return AzureREST;
}()); //class
exports.default = AzureREST;
//# sourceMappingURL=AzureREST.js.map