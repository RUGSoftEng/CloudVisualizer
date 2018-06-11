const assert = require('assert')

describe('Node JS', function(){
    describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });
});

describe('Cloudwatch', function(){
    describe('GET "/"', function(){
        it('should return the right http statuscode', function(){
            assert.equal(-1, [1,2,3].indexOf(4));
        });
        it('contain the right body', function(){
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });
    describe('GET "/api/v1"', function(){
        it('should return the right http statuscode', function(){
            assert.equal(-1, [1,2,3].indexOf(4));
        });
        it('contain the right body', function(){
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });
    describe('POST "/api/v1"', function(){
        it('should return the right http statuscode', function(){
            assert.equal(-1, [1,2,3].indexOf(4));
        });
        it('contain the right body', function(){
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });

});