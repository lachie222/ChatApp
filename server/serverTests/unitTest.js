var assert = require('assert');
var db = require('../app_modules/dbOps/app');

describe('Tests for db read', () => {
    it('should return an array of found objects from a query', ()=> {
        query = {collection: 'users', query: { username: 'superadmin', password: 'abc123' }};
        assert.equal(db.read(query), query);
    });
});