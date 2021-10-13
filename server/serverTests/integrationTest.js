var assert = require('assert');
var app = require('../server.js');
var chai = require('chai');
var chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);

describe('Db find test', function() {
    before(function() {
        console.log("before test");
    });

    after(function() {
        console.log("after test")
    });

    describe('/api/auth', () => {
        it('should find user from db', () => {
            chai.request(app).post('/api/auth').send({username:'superadmin', password:'abc123'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                assert(res.body, { _id: "616547f896da00cd1419ed95",
                username: 'superadmin',
                password: 'abc123',
                email: 'super@gmail.com',
                role: 'superadmin'})
            });
        });
    });

    describe('/api/fetchgroups', () => {
        it('should retrieve groups from db', () => {
            chai.request(app).post('/api/fetchgroups').send({role:'superadmin', username:'superadmin'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.all.keys('message', 'groupdata');
            });
        });
    });
})