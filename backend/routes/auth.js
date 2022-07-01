import express from "express";
import User from "../models/User.js";
import Joi from "joi";
import bcrypt from "bcrypt";
import Token from "../models/token.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

const router = express.Router();

//signin

router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(401).send({ message: "Invalid Email or Password" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(401).send({ message: "Invalid Email or Password" });

    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        
        const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
        await sendEmail(user.email, "Verify Email", url);
      }
      return res
        .status(400)
        .send({ message: "An Email sent to your account please verify" });
    }

    const token = user.generateAuthToken();
    res.status(200).send({ data: token, message: "Logged In Successfully" });
  } catch (error) {
    res.status(500).send({ message: "Inernal server error" });
  }
});

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label(Email),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};
export default router;
