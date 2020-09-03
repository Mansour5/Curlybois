const nodemailer = require('nodemailer');
// const getPassword = require('../config/MailConfig');



let send = function (to, subject, contents, cb) {
    if(!to || to.length<5){
        throw Error('No recipent');
    }
    var email = 'curlyboiseditor@gmail.com';

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: email,
            pass: getPassword()
        }
    });

    var mailOptions = {
        from: email,
        to: to,
        subject: subject,
        text: contents
    };


    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            cb()
        } else {
            cb()
        }
    });
}

module.exports = send;
