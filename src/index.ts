import Main from './Main';
import AzureREST from './AzureREST';


// let rest = new AzureREST("https://assafushy.visualstudio.com","7ne3n2b4uzgux46bkjvofdz7lsz2kbb4nm34ai45jiztdichxeta");

// async function tests(){
//   let res :any;
//   try{
//     res = await rest.getQueryData("BarventoryServerApi","0dbb8363-758d-40c9-9527-57d097720624");
//   }catch(error)
//   {
//     console.log(error.response.data)
//   }
//   // console.log(res.data);
//   return res.data;
// }


// // async function mainTest(){
//   let res :any;
//   let queryData = await tests();
//   let queryObject = {"name":queryData.name,"wiql":queryData.wiql};
 
//   try{
//     res = await rest.createQuery("TFSInnerSourceExtension",queryObject,pathToCopyTo);
//   }catch(error){
//     console.log(error.response.data);
//   }
//   console.log(res.data);
// }



let mainThread = new Main();
mainThread.main();

 //buildDefenitions - not supported
 