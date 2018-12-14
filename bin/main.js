"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inquirer = require('inquirer');
var Main = /** @class */ (function () {
    function Main() {
    }
    //get connection data
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
        inquirer.prompt([{ "type": "list", "name": "assaf", "message": "whats up?", "choices": ["one", "two", "three"] }]).then(function (answer) { console.log(answer); });
    };
    return Main;
}());
exports.default = Main;
