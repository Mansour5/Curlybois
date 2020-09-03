const fs = require('fs');

let deleteFile = function (fileName, type){
    try {
        //try to delete file.
        fs.unlinkSync('./temp/' + fileName + '.'+ type);
        return;
    } catch (err) {
        console.error('Error: File delete failed');
        return;
    }
}


module.exports = deleteFile;
