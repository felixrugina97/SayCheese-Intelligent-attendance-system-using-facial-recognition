const { ipcRenderer } = require('electron');
var $ = require('jquery');

ipcRenderer.on('fullScreen', (evt) => 
    $('.title-bar').css("display", "none") + 
    $('.main-menu').css("padding-top", "0px")
);

ipcRenderer.on('leaveFullScreen', (evt) => 
    $('.title-bar').css("display", "flex") + 
    $('.main-menu').css("padding-top", "20px")
);
