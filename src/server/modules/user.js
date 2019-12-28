const { comparePassword } = require('../db/schemas/user/utils');

// TODO: This needs to be moved into a helper
const GetError = _ => error => {
  if ((error.name === 'ValidationError') && (error.errors)) {
    const validationErrorContent = _.values(error.errors).map(singleError => _.pick(singleError, ['message', 'path']));
    const validationError = { ..._.omit(error, 'errors'), validation: validationErrorContent, message: 'Invalid data' };

    return validationError;
  }

  return error;
};

const signUp = ({ User, getError }) => async (userToCreate) => {
  try {
    const user = new User(userToCreate);
    return await user.create();
  } catch (error) {
    throw getError(error);
  }
};

const authenticateUser = ({ User, _ }) => async ({ email, password }) => {
  try {
    const user = await User.getByEmail({ email });
    if (user && user.get('email') === email) {
      const areCredentialsCorrect = await comparePassword({
        password, hashedPassword: user.get('password')
      });
      if (areCredentialsCorrect) {
        const userWithoutPassword = _.omit(user, ['password']);
        return userWithoutPassword;
      }
    }

    return null;
  } catch (error) {
    throw error;
  }
};

module.exports = ({ User, _ }) => {
  // TODO: This should be loaded form a helper
  const getError = GetError(_);

  return {
    signUp: signUp({ User, getError }),
    authenticateUser: authenticateUser({ User, _ })
  };
};
