# How to use
### 1. Set up github action with the file
```yml

name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    ####################### - PHP Environment - #################
    services:
      php:
        image: appsvc/php:7.4-apache-xdebug_20211102.4
        ports:
          - 8080:8080
        volumes:
          - /home/runner/work:/home/site/wwwroot
    #############################################################
    name: Build and Deploy Job
    steps:
      ############################## - set Env - ################
      - name: Set github environment
        run: |
          p=$(pwd); BASE_PATH=${p/'/home/runner/work/'/''}; echo "BASE_PHP_PATH=http://php:${{ job.services.php.ports[8080] }}/${BASE_PATH}" >> $GITHUB_ENV
      ###########################################################
      - uses: actions/checkout@v2
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_BLUE_ISLAND_089B1490F }}
          repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for Github integrations (i.e. PR comments)
          action: "upload"
          ###### Repository/Build Configurations - These values can be configured to match your app requirements. ######
          # For more information regarding Static Web App workflow configurations, please  visit: https://aka.ms/swaworkflowconfig
          app_location: "/" # App source code path
          api_location: "" # Api source code path - optional
          output_location: "out" # Built app content directory - optional
          ###### End of Repository/Build Configurations ######

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_BLUE_ISLAND_089B1490F }}
          action: "close"



```


### 2. Add submodule which is a php project is ready to convert html website
```shell
git submodule add https://github.com/artis-reit/300mainwebsitev2_dev.git public
```

3. Set the remote url and files which are the pages need to convert to htmls
```js

export const files = [
    "/404.php",
    "/index.php",
    "/winnipeg-apartment-for-rent.php",
    "/inquiries.php"
];

export const remoteUrl="https://artisplayground.azurewebsites.net/300mainwebsitev2"

```


### `or`


Set the set up local server in github action and specify files which are the pages need to convert to htmls
```js

export const files = [
    "/404.php",
    "/index.php",
    "/winnipeg-apartment-for-rent.php",
    "/inquiries.php"
];

export const remoteUrl=""

```

### 4. Converting

```js

import staticky from './src/static.js'

await staticky({
    files:files,
    remoteUrl:remoteUrl,
})


```