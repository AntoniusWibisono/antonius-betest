const { expect } = require('chai');
const sinon = require('sinon');
const faker = require('faker');
const {
  getUserByQuery,
  getUserAuthByQuery,
  updateUserById,
  deleteUserById,
  createUser
} = require('../app/action/user');
const User = require('../app/model/user');
const util = require('../app/helpers/util');

describe('User Action', () => {
  const stubBody = {
    userName: faker.name.findName(),
    password: '12345',
    accountNumber: 123124,
    identityNumber: 7778,
    emailAddress: faker.internet.email()
  };

  const stubValue = {
    id: faker.datatype.uuid(),
    userName: stubBody.userName,
    emailAddress: stubBody.emailAddress,
    identityNumber: stubBody.identityNumber,
    accountNumber: stubBody.accountNumber,
    password: util.encryptPass(stubBody.password)
  };

  let sandbox;
  let stubFindOne;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    stubFindOne = sandbox.stub(User, 'findOne').returns(stubValue);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('function createUser()', () => {
    it('should add new user to db', async () => {
      const stub = sinon.stub(User, 'create').returns(stubValue);
      const result = await createUser(stubBody);

      expect(stub.calledOnce).to.true;
      expect(result.id).to.equal(stubValue.id);
      expect(result.userName).to.equal(stubValue.userName);
      expect(result.emailAddress).to.equal(stubValue.emailAddress);
    });
  });
  describe('function getUserByQuery()', () => {
    it('should get user data based on query.identityNumber', async () => {
      const result = await getUserByQuery({ identityNumber: stubBody.identityNumber });

      expect(stubFindOne.calledOnce).to.true;
      expect(result.id).to.equal(stubValue.id);
      expect(result.userName).to.equal(stubValue.userName);
      expect(result.emailAddress).to.equal(stubValue.emailAddress);
      expect(result.identityNumber).to.equal(stubValue.identityNumber);
      expect(result.accountNumber).to.equal(stubValue.accountNumber);
    });

    it('should get user data based on query.accountNumber', async () => {
      const result = await getUserByQuery({ accountNumber: stubBody.accountNumber });

      expect(stubFindOne.calledOnce).to.true;
      expect(result.id).to.equal(stubValue.id);
      expect(result.userName).to.equal(stubValue.userName);
      expect(result.emailAddress).to.equal(stubValue.emailAddress);
      expect(result.identityNumber).to.equal(stubValue.identityNumber);
      expect(result.accountNumber).to.equal(stubValue.accountNumber);
    });
  });

  describe('function getUserAuthByQuery()', () => {
    it('should get user auth data based on query.userName', async () => {
      const result = await getUserAuthByQuery({ userName: stubBody.userName });

      expect(stubFindOne.calledOnce).to.true;
      expect(result.userName).to.equal(stubValue.userName);
      expect(result.password).to.equal(stubValue.password);
    });
  });

  describe('function updateUserById()', () => {
    const stubUpdateBody = {
      password: '23456'
    };
    const stubUpdateValue = {
      password: util.encryptPass(stubUpdateBody.password)
    };
    it('should update user data based on query.id', async () => {
      const stubUpdate = sinon.stub(User, 'findOneAndUpdate').returns(stubUpdateValue);
      const result = await updateUserById(stubValue.id, stubUpdateBody);

      expect(stubUpdate.calledOnce).to.true;
      expect(result.password).to.equal(stubUpdateValue.password);
    });
  });

  describe('function deleteUserById()', () => {
    it('should delete user data based on query.id', async () => {
      const stubDelete = sinon.stub(User, 'findOneAndDelete').returns(stubValue);
      const result = await deleteUserById(stubValue.id);

      expect(stubDelete.calledOnce).to.true;
      expect(result.id).to.equal(stubValue.id);
      expect(result.userName).to.equal(stubValue.userName);
      expect(result.emailAddress).to.equal(stubValue.emailAddress);
      expect(result.identityNumber).to.equal(stubValue.identityNumber);
    });
  });
});
