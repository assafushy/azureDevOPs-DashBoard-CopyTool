# azureDevOps-DashBoard-CopyTool

NodeJS CLI for copying dashboards and their queries between team project.


## Installation 
`npm install -g azuredevops-dashboard-copytool`

## Demo
![](/samples/DemoGif.gif)


## Getting started

how to run the app : 
````
:> copyDash  
````

creating a login "config.json":

````  
{
  "rootUrl":"",
  "PAT":""
}

````
Coming soon - giving all app params in the config file

### Parameters:

rootUrl: "https://dev.azure.com/{organization}"

PAT: Personal Access Token - For instructions on how to create one :

https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=vsts



## Still Unsupported:

Build related WIdgets - will be copied but params wont change

Code related WIdgets - will be copied but params wont change


#### If this helped you give us a star on github
https://github.com/assafushy/azureDevOPs-DashBoard-CopyTool