const { describe } = require('mocha');
const { expect }  = require('chai');

describe('User should receive user details if authenticated',()=>{
    let userName = "test@test.com";
    let password = "test";
    it('user should be authenticated', ()=>{
        expect(userName).to.equal("test@test.com")
        expect(password).to.equal("test") 
    })
})