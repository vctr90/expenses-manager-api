const authentication = require('../../modules/authentication.js');

describe('Authentication module', () => {
  describe('A new user should be able to successfully sign in with a unique email', () => {
    describe('User email should NOT be duplicated', () => {
      test('Validate email duplication', async () => {
        try {
          const isDuplicatedtUser = await authentication.isEmailDuplicated('test@test.com');
        } catch (error) {
          throw error;
        }
      });
      test.todo('Reply duplication error message');
    });

    describe('User should be able to sign up', () => {
      test.todo('Create user');
      test.todo('Reply success message about user creation');
    });
  });
});
