const nodemailer = require('nodemailer');

let send = function (to, subject, contents, cb) {

    let {EMAIL_PROVIDER, EMAIL_ADDRESS, EMAIL_PASSWORD} = process.env;

    // exit early if email and password are not setup
    // check .env file
    if(!EMAIL_ADDRESS && !EMAIL_PASSWORD) return ;

    if(!to || to.length<5) throw Error('No recipent');

    var transporter = nodemailer.createTransport({
        service: EMAIL_PROVIDER,
        auth: {
            user: EMAIL_ADDRESS,
            pass: EMAIL_PASSWORD
        }
    });

    var mailOptions = {
        from: EMAIL_ADDRESS,
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
