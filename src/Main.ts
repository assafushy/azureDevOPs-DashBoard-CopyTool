var inquirer = require('inquirer');

export default class Main{

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

main(){
  inquirer.prompt([{"type":"list","name":"assaf","message":"whats up?","choices":["one","two","three"]}]).then((answer:any)=>{console.log(answer)})
}

}