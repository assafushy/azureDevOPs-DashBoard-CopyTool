import azureREST from './azureDevOpsREST';


let restClient : azureREST = new azureREST("https://assafushy.visualstudio.com","7ne3n2b4uzgux46bkjvofdz7lsz2kbb4nm34ai45jiztdichxeta");

async function fetchTeamProjectList(){
  let res : any;
  try{
     res = await restClient.getProjectList();
  }catch(error){
    console.error("Error fetching TeamProjects - please check --  baseURL and your PAT");
  }
  console.log(res.data.value);
}

fetchTeamProjectList();
