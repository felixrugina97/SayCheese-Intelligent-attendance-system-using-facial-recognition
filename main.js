const electron = require('electron');
const url = require('url');
const path = require('path');
const exec = require('child_process').exec;
const {app, BrowserWindow, Menu} = electron;

const logger = require('./config/logger').Logger;
const mainMenuTemplate = require('./config/menu_template');

const fileName = 'root::main.js';

let loaderWindow;
let loginWindow;
let mainWindow;

exec('sh config/init_log_file.sh');

app.on('ready', function() {
    logger.debug("SayCheese started", fileName);

    logger.debug("Creating Loader Window", fileName);
    loaderWindow = new BrowserWindow({
        width: 250, 
        height: 300, 
        frame: false, 
        resizable: false,
        backgroundColor: '#212121'
    });
    
    logger.debug("Creating Login Window", fileName);
    loginWindow = new BrowserWindow({
        width: 300,
        height: 400,
        show: false,
        resizable: true,
        maximizable: false,
        titleBarStyle: 'hidden',
        backgroundColor: '#212121'
    });

    loginWindow.on('closed', function(){
        logger.debug("SayCheese closed with success", fileName);
        app.quit();
    });

    logger.debug("Display Loader Window", fileName);
    loaderWindow.loadURL(`file://${__dirname}/src/view/index.html`);
    setTimeout(openLogin, 3000);

    logger.debug("Building menu from template", fileName);
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    Menu.setApplicationMenu(mainMenu);
    logger.debug("SayCheese menu set with succes", fileName);
});

function openLogin() {
    loginWindow.loadURL(`file://${__dirname}/src/view/login.html`);
    loginWindow.once('ready-to-show', () => {
        loaderWindow.close();
        logger.debug("Loader Window Closed", fileName);
        loginWindow.show();
        logger.debug("Display Login Window", fileName);
    });
}

exports.openWindow = (filename) => {
    mainWindow = new BrowserWindow({
        titleBarStyle: 'hidden',
        backgroundColor: '#212121'
    });

    if (filename == 'admin_index') {
        logger.debug("Loading Admin Window", fileName);
        mainWindow.loadURL(`file://${__dirname}/src/view/admin_view/` + filename + `.html`);
    }
    else if (filename == 'teacher_index') {
        logger.debug("Loading Teacher Window", fileName);
        mainWindow.loadURL(`file://${__dirname}/src/view/teacher_view/` + filename + `.html`);
    }
    else if (filename == 'exit') {
        app.quit();
    }
    
    mainWindow.on('closed', function(){
        app.quit();
    })
}
