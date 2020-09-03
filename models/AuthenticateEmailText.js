

let getContent = function (link) {
    var content = 'Dear Account User,\n' +
        'We have recently received a request for an account with our company. ' +
        'We are pleased to welcome you our service. ' +
        'Please click the link below to authenticate your new account. ' +
        'If you did not make this request please ignore this email.\n' +
        'Thank you - Curlybois\n\n\n\n' +

        '<a href='+link+'>Verify Account</a>';
return content;

};


module.exports = getContent;