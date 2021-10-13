var assert = require('assert');
var app = require('../server.js');
var chai = require('chai');
var chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);

describe('Db Auth Routes Integration', function() {
    before(function() {
        let seed = require('../dbSeeding/seed');
    });

    after(function() {
    });

    describe('/api/auth', () => {
        it('should find user from db', (done) => {
            chai.request(app).post('/api/auth').send({username:'superadmin', password:'abc123'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                assert(res.body, { _id: "616547f896da00cd1419ed95",
                username: 'superadmin',
                password: 'abc123',
                email: 'super@gmail.com',
                role: 'superadmin'})
                done();
            });
        });
    });

    describe('/api/fetchgroups', () => {
        it('should retrieve groups from db', (done) => {
            chai.request(app).post('/api/fetchgroups').send({role:'superadmin', username:'superadmin'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.all.keys('message', 'groupdata');
                done();
            });
        });
    });

    describe('/api/register', () => {
        it('should register a new user to DB', (done) => {
            chai.request(app).post('/api/register').send({user:{role:'superadmin'}, username: 'john55', password: 'abc123', email: 'john55@gmail.com'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.all.keys('message');
                assert.equal(res.body.message, 'User successfully created!');
                done();
            });
        });
    });

    describe('/api/deleteacc', () => {
        it('should delete user from DB', (done) => {
            chai.request(app).post('/api/deleteacc').send({user:{role:'superadmin'}, username:'john55'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.all.keys('message');
                assert.equal(res.body.message, 'User john55 was deleted!')
                done();
            });
        });
    });
});

describe('DB groupfunction routes integration', function() {
    before(function() {
        let seed = require('../dbSeeding/seed');
    });

    after(function() {
    });

    describe('/api/creategroup', () => {
        it('should create new group to DB', (done) => {
            chai.request(app).post('/api/creategroup').send({user:{role:'superadmin'}, groupname: 'group 5'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.all.keys('message');
                assert.equal(res.body.message, 'Group successfully created!');
                done();
            });
        });
    });

    describe('/api/removegroup', () => {
        it('should remove existing group from DB', (done) => {
            chai.request(app).post('/api/removegroup').send({user:{role:'superadmin'}, groupname: 'group 5'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.all.keys('message');
                assert.equal(res.body.message, 'Group group 5 was deleted!');
                done();
            });
        });
    });

    describe('/api/createchannel', () => {
        it('should create new channel in DB', (done) => {
            chai.request(app).post('/api/createchannel').send({user:{role:'superadmin'}, groupname: 'group 1', channelname: 'channel 3'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.all.keys('message');
                assert.equal(res.body.message, 'Channel created!');
                done();
            });
        });
    });

    describe('/api/removechannel', () => {
        it('should remove channel in DB', (done) => {
            chai.request(app).post('/api/removechannel').send({user:{role:'superadmin'}, groupname: 'group 1', channelname: 'channel 3'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.all.keys('message');
                assert.equal(res.body.message, 'Channel successfully deleted!');
                done();
            });
        });
    });
    
})