const main = require('./../main');

const mainMenuTemplate = [
    {
        label: 'File',
            submenu: [
                {
                    label: 'Quit',
                    accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                    click() {
                        main.openWindow('exit');
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

if (process.env.NODE_ENV != 'PRODUCTION') {
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

module.exports = mainMenuTemplate;
