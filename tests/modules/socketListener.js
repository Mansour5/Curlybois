const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../../app.js');
const http = require('http');
const socketListener = require('../../modules/socketListener.js');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const assert = chai.assert;
const expect = chai.expect;

describe('Tests Sockets Listening',()=>{
    it('Should not throw any errors',()=>{
        expect(()=>socketListener(io)).not.to.throw();
    })
})
