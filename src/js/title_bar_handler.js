const { ipcRenderer } = require('electron');
const $ = require('jquery');

ipcRenderer.on('fullScreen', (evt) => 
    $('.title-bar').css("visibility", "hidden")
);

ipcRenderer.on('leaveFullScreen', (evt) => 
    $('.title-bar').css("visibility", "visible")
);
