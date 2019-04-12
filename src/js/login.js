const remote = require('electron').remote
const main = remote.require('./main.js')

var clientType = 0;

function login() {
    var window = remote.getCurrentWindow();
    if (clientType == 0) {
        main.openWindow('admin_index');
    }
    else if (clientType == 1) {
        main.openWindow('teacher_index');
    }
    window.hide();
}
