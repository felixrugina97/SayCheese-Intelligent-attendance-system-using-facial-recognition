const electron = require('electron');
const exec = require('child_process').exec;
const {app, BrowserWindow, Menu} = electron;
const path = require('path')

var logger = require('./config/logger').Logger;
var mainMenuTemplate = require('./config/menu_template');

var fileName = 'root::main.js';

let loaderWindow;
let loginWindow;
let mainWindow;

exec('sh config/scripts/init_log_file.sh');
exec('sh config/scripts/run_flask_server.sh');

app.setName("SayCheese");

app.on('ready', function() {
    logger.debug("SayCheese started", fileName);

    logger.debug("Creating Loader Window", fileName);
    loaderWindow = new BrowserWindow({
        width: 250,
        height: 300,
        frame: false,
        resizable: false,
        backgroundColor: '#212121',
        icon: path.join(__dirname, 'assets/icons/256x256.icns')
    });

    logger.debug("Creating Login Window", fileName);
    loginWindow = new BrowserWindow({
        width: 300,
        height: 400,
        show: false,
        resizable: true,
        maximizable: false,
        titleBarStyle: 'hidden',
        backgroundColor: '#212121',
        icon: path.join(__dirname, 'assets/icons/256x256.icns')
    });

    loginWindow.on('closed', function(){
        logger.debug("SayCheese closed with success", fileName);
        exec('sh config/scripts/kill_flask_server.sh');
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
        backgroundColor: '#212121',
        'minWidth': 200,
        'minHeight': 150,
        icon: path.join(__dirname, 'assets/icons/256x256.icns')
    });

    if (filename == 'admin_index') {
        logger.debug("Loading Admin Window", fileName);
        mainWindow.loadURL(`file://${__dirname}/src/view/` + filename + `.html`);
    }
    else if (filename == 'teacher_index') {
        logger.debug("Loading Teacher Window", fileName);
        mainWindow.loadURL(`file://${__dirname}/src/view/` + filename + `.html`);
        let server = require('./src/js/teacher_server')
    }
    else if (filename == 'exit') {
        app.quit();
    }

    mainWindow.on('enter-full-screen', function(){
        mainWindow.webContents.send('fullScreen');
        logger.debug("User enter full screen", fileName);
    });

    mainWindow.on('leave-full-screen', function(){
        mainWindow.webContents.send('leaveFullScreen');
        logger.debug("User leave full screen", fileName);
    });

    mainWindow.on('closed', function(){
        app.quit();
    })
}
