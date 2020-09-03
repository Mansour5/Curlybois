const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../../app.js');
const http = require('http');
const mailToUser = require('../../modules/MailToUser.js');
const assert = chai.assert;
const expect = chai.expect;
describe('Mails user', function() {
    it('Should email test email', () => {
        expect(()=>mailToUser('test@gmail.com', 'test', 'this is a test'))
                    .not.to.throw();
    });
    it('Should throw error when sending email with empty recipent', () => {
        expect(()=>mailToUser('', 'test', 'this is a test'))
                    .to.throw();
    });
    it('Should throw error when sending email with null/undefined recipent', () => {
        expect(()=>mailToUser(null, 'test', 'this is a test'))
                    .to.throw();
    });
});
