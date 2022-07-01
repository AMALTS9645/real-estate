import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
});

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, name: this.name, isAdmin: this.isAdmin },
    process.env.JWTPRIVATEKEY,
    {
      expiresIn: "7d",
    }
  );
  return token;
};

export const validate = (data) => {
  const schema = Joi.object({
    firstname: Joi.string().required().label("First Name"),
    lastname: Joi.string().required().label("Last Name"),
    email: Joi.string().email.required().label("Email"),
    password: passwordComplexity().required.label("password"),
  });
  return schema.validate(data);
};

export default mongoose.model("Users", UserSchema);
