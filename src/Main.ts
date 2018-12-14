var inquirer = require('inquirer');
var figlet = require('figlet');
var chalk = require('chalk');
export default class Main{

//show welcome screen
printappHeader(str : string){
  return new Promise((resolve,reject)=>{
    console.log(chalk.yellow(figlet.textSync(str, { horizontalLayout: 'full' })))
    console.log('\n');
    resolve(true);
  })//Promise
}//printappHeader

//get connection data
async getConnectionData(){
 
  let answer = await inquirer.prompt([{"type":"list","name":"selectType",
      "message":"How do you want to pass your connection data ?",
      "choices":["Manual Typing","JSON Config file"]}]);
  switch(answer.selectType){
    case 'Manual Typing':{
      //if via manual typing
      let baseUrl = await inquirer.prompt([{"type":"input","name":"rootUrl",
          "message":"Please type the root url:"}]);
      let PAT = await inquirer.prompt([{"type":"input","name":"PAT",
          "message":"Please type your Personal Access Token(PAT):"}]);
      return({"baseUrl":baseUrl,"PAT":PAT});
    break;
    }
    case 'JSON Config file':{
      //if via config file
      let configPath = await inquirer.prompt([{"type":"input","name":"rootUrl",
          "message":"Please type the root url:"}]);
    break;
    }
    default:
    break;
  }


}

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

async main(){
  await this.printappHeader("DashBoard - Copy Tool");
  this.getConnectionData(); 
}

}