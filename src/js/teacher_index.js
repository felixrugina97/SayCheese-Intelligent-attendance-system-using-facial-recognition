var remote = require('electron').remote;
var main = remote.require('./main.js');
var $ = require('jquery');

var logger = require('../../config/logger').Logger;

var fileName = 'src::js::teacher::teacher_index.js';

$('.page.dashboard-page').show();

$('.page-link').click(function() {
    const pageToShow = this.dataset.page;

    $('.page').hide();
    $('.' + pageToShow + '-page').show();

    logger.info("User enter on " + this.dataset.page + " page", fileName);
});

$('.exit-button').click(function() {
    $('.exit-modal').show();
    logger.info("User enter on exit modal view", fileName);
});

$('.exit-modal-button.cancel').click(function(){
    $('.exit-modal').hide();
    logger.info("User left exit modal view by clicking cancel button", fileName);
});

$('.exit-modal-header > div.x-button').click(function(){
    $('.exit-modal').hide();
    logger.info("User left exit modal view by clicking X button", fileName);
});

$('html').click(function (e) {
    if (e.target.className == 'exit-modal') {
        $('.exit-modal').hide();
        logger.info("User left exit modal view by clicking outside off modal", fileName);
    }
});

$('.exit-modal-button.confirm').click(function () {
    main.openWindow('exit');
});
