import azureREST from './AzureREST';
import _ from 'lodash';
import {Iconfig} from './interfaces';
var inquirer = require('inquirer');
var figlet = require('figlet');
var chalk = require('chalk');

export default class Main{

restClient : any;
  
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
  
  let config:Iconfig = {rootUrl:'',PAT:''};

  let answer = await inquirer.prompt([{"type":"list","name":"selectType",
      "message":"How do you want to pass your connection data ?",
      "choices":["Manual Typing","JSON Config file"]}]);
  switch(answer.selectType){
    case 'Manual Typing':{
      //if via manual typing
      let rootUrl = await inquirer.prompt([{"type":"input","name":"rootUrl",
          "message":"Please type the root url:"}]);
      let PAT = await inquirer.prompt([{"type":"input","name":"PAT",
          "message":"Please type your Personal Access Token(PAT):"}]);
      return({"baseUrl":rootUrl.rootUrl,"PAT":PAT.PAT});
    }
    case 'JSON Config file':{
      //if via config file
      console.log(`make sure you suppliy a JSON file path with properties: {rootUrl:***,PAT:***}`);
      let configPath = await inquirer.prompt([{"type":"input","name":"configPath",
          "message":"Please type the path of the config file:"}]);
      if(configPath.configPath){config = require(configPath.configPath)}
      if(config.rootUrl && config.PAT){
        return({"baseUrl":config.rootUrl,"PAT":config.PAT});
      }else{
        console.error('Please fix your config file');
      }
    break;
    }
    default:
    break;
  }
}//getConnectionData

//connect to azureDevOps and get project list
async connectToAzureDevops(rootUrl : string,PAT : string){
  let res : any;
  console.log(`Fetching data with parameters : {rootUrl:${rootUrl},PAT:${PAT}}`)
  this.restClient = new azureREST(rootUrl,PAT);
    try{
       res = await this.restClient.getProjectList();
    }catch(error){
      console.error("Error fetching TeamProjects - please check --  baseURL and your PAT");
    }
    return res.data.value;
}//connectToAzureDevops

//get dashboard list
async getDashboardList(projectName : string){
  let res : any;
  try{
      res = await this.restClient.getDashboardList(projectName);
  }catch(error){
    console.error("Error fetching TeamProjects - please check --  baseURL and your PAT");
  }
  return res.data.dashboardEntries;
}//getDashboardList

//get dashboard list
async getDashboardData(projectName : string,dashboardId :string){
  let res : any;
  try{
      res = await this.restClient.getDashboardData(projectName,dashboardId);
  }catch(error){
    console.error("Error fetching TeamProjects - please check --  baseURL and your PAT");
  }
  return res.data;
}//getDashboardList

//copy dashboard
async copyDashboard(projectToName : string , dashboardObject : any){
  let res : any;
  delete dashboardObject.id;
  try{
      res = await this.restClient.createDashboard(projectToName,dashboardObject);
  }catch(error){
    console.error("Error copying dashboard - please check --  baseURL and your PAT");
    console.log(error.response.data);
  }//try
}//copyDashboard

async inputfromSelect(){
  let answer = await inquirer.prompt([{"type":"list","name":"selectType",
  "message":"How do you want to pass your dashboard copy information?",
  "choices":["Select from list","From original JSON Config file"]}]);
  switch(answer.selectType){
    case 'Select from list':{
      return 'list';
    }
    case 'From original JSON Config file':{
      console.log(`Please make sure before you proceed, that your config file cantains the following properties:
      {
        projectFrom:<your project to copy from name>,
        dashboardFrom:<your dashboard or dashboards to copy from name>
      } `);
      return 'json';
    }
  }//switch
}//inputfromSelect

//select relavnt item from list
async selectFromList(list : any, actionToSelect : string){ 
  let selected : any;
  let titles : any = await Promise.all(list.map((item : any)=>{return item.name}));
  selected = await inquirer.prompt([{"type":"list","name":"selected",
  "message":actionToSelect,
  "choices":titles}]);
  let i = _.findIndex(list,(item : any)=>{return item.name === selected.selected})
  return(list[i]);   
}//selectFromList

async createNewDashboardObject(dashboardObject:any, fromProject : string, destProject : string,
                               selectedProjectToDashboardList : any, withQueryPath : boolean){
  let queryStack : any[] = [];
  let updatedWidgetArray : any[] = [];
  
  //create dashboard query path
  let maxPosDashboard : any = _.maxBy(selectedProjectToDashboardList, 'position');
  dashboardObject.position = maxPosDashboard.position+1;
  let isDuplicateName = _.findIndex(selectedProjectToDashboardList,(o:any)=>{return o.name == dashboardObject.name});
  while (isDuplicateName>-1) {
    dashboardObject.name = dashboardObject.name + '-new';
    isDuplicateName = _.findIndex(selectedProjectToDashboardList,(o:any)=>{return o.name == dashboardObject.name});
  }//while
  if(withQueryPath){
    let destQueryPath = await this.restClient.createQueryPath(destProject,`/Shared Queries/Dashboards/${dashboardObject.name}/XXX`);  
    //iterate Dashboards Widgets
    await Promise.all(dashboardObject.widgets.map(async (widget : any) => { 
      //get Settings property

      //all known cases:
      let jsonSettings = JSON.parse(widget.settings);  
      if(jsonSettings){
        if(jsonSettings.queryId){
          // console.log(`found queryId: ${jsonSettings.queryId}`);
          //check query stack if the query has been copied already
          let i = _.findIndex(queryStack,(o)=>o.oldQueryId === jsonSettings.queryId);
          if(i===-1){
            //get query data
            let queryData = await this.restClient.getQueryData(fromProject,jsonSettings.queryId);
            let queryObject = {"name":queryData.data.name,"wiql":queryData.data.wiql};
            //create query data under folder path
            let res = await this.restClient.createQuery(destProject,queryObject,destQueryPath);
            //add new old and new query to query stack
            try{
            queryStack.push({oldQueryId:jsonSettings.queryId,newQueryId:res.data.id});
            }catch(error){
              // console.log(`cought error queryId: ${error}`);
            }
            //replace the queryId with the new query
            jsonSettings.queryId = res.data.id;
            widget.settings = JSON.stringify(jsonSettings);
          }else{
            //replace the queryId with the new query
            jsonSettings.queryId = queryStack[i].newQueryId;
            widget.settings = JSON.stringify(jsonSettings);
          }
        }//if
        if(jsonSettings.query){
          if(jsonSettings.query.queryId){
            // console.log(`found query.queryId: ${jsonSettings.query.queryId}`);
            //check query stack if the query has been copied already
            let i = _.findIndex(queryStack,(o)=>o.oldQueryId === jsonSettings.query.queryId);
            if(i===-1){
              //get query data
              let queryData = await this.restClient.getQueryData(fromProject,jsonSettings.query.queryId);
              let queryObject = {"name":queryData.data.name,"wiql":queryData.data.wiql};
              //create query data under folder path
              let res = await this.restClient.createQuery(destProject,queryObject,destQueryPath);
              //add new old and new query to query stack
              try{
              queryStack.push({oldQueryId:jsonSettings.query.queryId,newQueryId:res.data.id});
              }catch(error){
                // console.log(`cought error query.queryId: ${error}`);
              }
              //replace the queryId with the new query
              jsonSettings.query.queryId = res.data.id;
              widget.settings = JSON.stringify(jsonSettings);
            }else{
              //replace the queryId with the new query
              jsonSettings.query.queryId = queryStack[i].newQueryId;
              widget.settings = JSON.stringify(jsonSettings);
            }
          }//if
        }//if
        if(jsonSettings.groupKey){
          // console.log(`found groupKey: ${jsonSettings.groupKey}`);
          //check query stack if the query has been copied already
          let i = _.findIndex(queryStack,(o)=>o.oldQueryId === jsonSettings.groupKey);
          if(i===-1){
            //get query data
            let queryData = await this.restClient.getQueryData(fromProject,jsonSettings.groupKey);
            let queryObject = {"name":queryData.data.name,"wiql":queryData.data.wiql};
            //create query data under folder path
            let res = await this.restClient.createQuery(destProject,queryObject,destQueryPath);
            //add new old and new query to query stack
            try{
              queryStack.push({oldQueryId:jsonSettings.groupKey,newQueryId:res.data.id});
            }catch(error){
              // console.log(`cought error groupKey: ${error}`);
            }
            //replace the queryId with the new query
            jsonSettings.groupKey = res.data.id;
            widget.settings = JSON.stringify(jsonSettings);
          }else{
            //replace the queryId with the new query
            jsonSettings.groupKey = queryStack[i].newQueryId;
            widget.settings = JSON.stringify(jsonSettings);
          }
        }//if
        if(jsonSettings.transformOptions){
          if(jsonSettings.transformOptions.filter){
            // console.log(`found transformOptions.filter: ${jsonSettings.transformOptions.filter}`);
            //check query stack if the query has been copied already
          let i = _.findIndex(queryStack,(o)=>o.oldQueryId === jsonSettings.transformOptions.filter);
          if(i===-1){
            //get query data
            let queryData = await this.restClient.getQueryData(fromProject,jsonSettings.transformOptions.filter);
            let queryObject = {"name":queryData.data.name,"wiql":queryData.data.wiql};
            //create query data under folder path
            let res = await this.restClient.createQuery(destProject,queryObject,destQueryPath);
            //add new old and new query to query stack
            try{
              queryStack.push({oldQueryId:jsonSettings.transformOptions.filter,newQueryId:res.data.id});
            }catch(error){
              console.log(`cought error: ${error}`);
            }
            //replace the queryId with the new query
            jsonSettings.transformOptions.filter = res.data.id;
            widget.settings = JSON.stringify(jsonSettings);
          }else{
            //replace the queryId with the new query
            jsonSettings.transformOptions.filter = queryStack[i].newQueryId;
            widget.settings = JSON.stringify(jsonSettings);
          }//if
          }//if
        }//if
      }//if
      //replace in dashboardObject
      updatedWidgetArray.push(widget);
    }));//Promise.all
    // console.log(updatedWidgetArray);
    dashboardObject.widgets = updatedWidgetArray;
  }//if 

  return dashboardObject;
 
}//createNewDashboardObject

async runBaseOnConfigFIle(){
  //  //if via config file
  //  let configPath = await inquirer.prompt([{"type":"input","name":"configPath",
  //  "message":"Please type the path of the config file:"}]);
  // if(configPath.configPath){config = require(configPath.configPath)}
  // if(config.projectName){
  // let i = _.findIndex(list,(o : any)=>{return o.name === config.dashboardName});
  // if(i>=0){
  //  return(list[i]);
  // }else{
  //  console.error('Please fix your config file');  
  // }
  // }else{
  // console.error('Please fix your config file');
  // }
}//runBaseOnConfigFIle

 
async main(){
  await this.printappHeader("DashBoard - Copy Tool");
  let azureParams : any = await this.getConnectionData(); 
  let projectList = await this.connectToAzureDevops(azureParams.baseUrl,azureParams.PAT);
  let inputFrom = await this.inputfromSelect();
  if(inputFrom === 'list'){
    let selectedProjectFrom = await this.selectFromList(projectList,'Please select a project to copy from:' );
    let dashBoardList = await this.getDashboardList(selectedProjectFrom.name);
    let selectedDashboard = await this.selectFromList(dashBoardList,'Please select a dashboard to copy:');
    let dashBoardDetails = await this.getDashboardData(selectedProjectFrom.name,selectedDashboard.id);
    let isCloneQueries = await this.selectFromList([{name:'Yes'},{name:'No'}],'Do you want to clone all dashboard queries?');
    let selectedProjectTo = await this.selectFromList(projectList,'Please select a project to copy from:' );
    let selectedProjectToDashboardList = await this.getDashboardList(selectedProjectTo.name);
    let updatedDashBoardObject :any;
    if(isCloneQueries.name === 'Yes'){
      updatedDashBoardObject = await this.createNewDashboardObject(dashBoardDetails,selectedProjectFrom.name,selectedProjectTo.name,selectedProjectToDashboardList,true);
    }else{
      updatedDashBoardObject = await this.createNewDashboardObject(dashBoardDetails,selectedProjectFrom.name,selectedProjectTo.name,selectedProjectToDashboardList,false);
    }//if
    await this.copyDashboard(selectedProjectTo.name,updatedDashBoardObject);
  }else{
    //run base on config file
  }//if
  console.log(`Thanks for using if you like please add a star on github`);
}//main
}//class