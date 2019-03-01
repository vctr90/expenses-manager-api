const mongoose = require('mongoose');

const { validateEmailFormat } = require('../../../lib/validators');

const user = {
  firstName: { type: String, required: true },
  email: {
    type: String, required: true, index: { unique: true },
    validate: {
      validator: validateEmailFormat,
      message: (props) => {`Provided email: ${props.value} has no valid format`}
    }
  },
  lastName: { type: String, required: true },
  password: { type: String, required: true }
};

const { Schema } = mongoose;
const userSchema = new Schema(user);
module.exports = { mongoose, userSchema };
