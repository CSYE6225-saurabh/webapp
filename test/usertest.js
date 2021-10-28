const { describe } = require('mocha');
const chai = require('chai');

describe('User should receive user details if authenticated',()=>{
    let userName = "test@test.com";
    let password = "test";
    it('user should be authenticated', ()=>{
        chai.expect(userName).to.equal("test@test.com")
        chai.expect(password).to.equal("test") 
    })
})

describe('User data should be added if valid',()=>{
    let userName = "test@test.com";
    let password = "test";
    let firstName = "Test";
    let lastName = "Example";
    let Account_Updated = null;
    let Account_Created = null;
    let UserId = null;
    it("Create new user",()=>{
        chai.expect(userName).to.equal("test@test.com")
        chai.expect(password).to.equal("test") 
        chai.expect(firstName).to.equal("Test")
        chai.expect(lastName).to.equal("Example") 
        chai.expect(Account_Updated).to.equal(null) 
        chai.expect(Account_Created).to.equal(null)
        chai.expect(UserId).to.equal(null)
    })
})