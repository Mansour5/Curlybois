const fs = require('fs');

let saveFile = function(content, fileName, type, cb) {

    var fws = fs.createWriteStream('./temp/' + fileName + '.'+ type);

    fws.write(content);
    fws.end()
    fws.on('finish', cb);
    return;
}
module.exports = saveFile;