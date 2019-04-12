const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipc} = electron;

let loaderWindow;
let loginWindow;
let mainWindow;

app.setName("Say Cheese");

app.on('ready', function() {
    loaderWindow = new BrowserWindow({width: 250, 
        height: 300, 
        frame: false, 
        resizable: false
    });

    loginWindow = new BrowserWindow({
        width: 300,
        height: 400,
        show: false,
        resizable: true,
        maximizable: false,
        titleBarStyle: 'hidden'
    });

    loginWindow.on('closed', function(){
        app.quit();
    });

    loaderWindow.loadURL(`file://${__dirname}/src/view/index.html`);
    setTimeout(openLogin, 3000);

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    Menu.setApplicationMenu(mainMenu);
});

function openLogin() {
    loginWindow.loadURL(`file://${__dirname}/src/view/login.html`);
    loginWindow.once('ready-to-show', () => {
        loaderWindow.close();
        loginWindow.show();
    });
}

exports.openWindow = (filename) => {
    mainWindow = new BrowserWindow({
        titleBarStyle: 'hidden',
    });

    if (filename == 'admin_index') {
        mainWindow.loadURL(`file://${__dirname}/src/view/admin_view/` + filename + `.html`);
    }
    else if (filename == 'teacher_index') {
        mainWindow.loadURL(`file://${__dirname}/src/view/teacher_view/` + filename + `.html`);
    }
    
    mainWindow.on('closed', function(){
        app.quit();
    })
}

const mainMenuTemplate = [
    {
        label: 'File',
            submenu: [
                {
                    label: 'Quit',
                    accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                    click() {
                        app.quit();
                    }
                }
            ]
    },
    {
        label: "Help",
            submenu: [
                {
                    label: 'About'
                } 
            ]
    }
];

if (process.env.NODE_ENV != 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}