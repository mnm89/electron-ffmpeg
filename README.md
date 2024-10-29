
# Introduction

Bootstrap and package your project with Angular 17(+) and Electron (Typescript + SASS + Hot Reload) for creating Desktop applications.

Currently runs with:

- Angular v17.3.6
- Electron v30.0.1
- Electron Builder v24.13.3

With this sample, you can :

- Run your app in a local development environment with Electron & Hot reload
- Run your app in a production environment
- Package your app into an executable file for Linux, Windows & Mac

## Getting Started

Clone this repository locally :

``` bash
git clone https://github.com/NacerDev/electron-ffmpeg.git
```

Install dependencies with npm :

``` bash
npm install
```

If you want to generate Angular components with Angular-cli, you **CAN** install `@angular/cli` in the npm global context.  
If you have installed a previous version of Angular-cli, please follow the [Angular-cli documentation](https://github.com/angular/angular-cli).

``` bash
npm install -g @angular/cli
```
Or use 

``` bash
npm run ng -- ...
```
without installing @angular/cli globaly

## To build for development

- **in a terminal window** -> npm start  

Voila! With hot reload, you can use your Angular + Electron app in a local development environment!

The application code is managed by `app/main.ts`. In this sample, the app runs with a simple Angular App (http://localhost:4200) and an Electron window.  
The Angular component contains an example of Electron and NodeJS native lib import.  
You can deactivate "Developer Tools" by commenting `win.webContents.openDevTools();` in `app/main.ts`.

## Included Commands

|Command|Description|
|--|--|
|`npm run ng:serve`| Execute the app in the browser |
|`npm run build`| Build the app. Your built files are in the /dist folder. |
|`npm run build:prod`| Build the app with Angular aot. Your built files are in the /dist folder. |
|`npm run electron:serve`| Builds your application and start electron

**Your application is optimized. Only /dist folder and node dependencies are included in the executable.**

