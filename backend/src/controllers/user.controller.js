const bcrypt = require('bcrypt');
const createError = require('http-errors');

const { isvalid, crypto, jwt } = require('../utils');
const { User } = require('../models');


exports.signup = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) throw createError(400, "missing parameters");

    const validEmail = isvalid.email(email);
    if (!validEmail) throw createError(400, "invalid email");

    const validPassword = isvalid.password(password);
    if (!validPassword) throw createError(400, "invalid password");

    const encryptedEmail = await crypto.encrypt(email);

    const userFound = await User.findOne({ email: encryptedEmail });
    if (userFound) throw createError(409, "user already exists");

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ email: encryptedEmail, password: hashPassword });
    await newUser.save();

    response.status(201).json({ message: "user successfully registered" });
  } catch (error) {
    next(error);
  }
};

exports.login = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) throw createError(400, "missing parameters");

    const encryptedEmail = await crypto.encrypt(email);

    const userFound = await User.findOne({ email: encryptedEmail });
    if (!userFound)  throw createError(404, "user not found");

    const validPassword = await bcrypt.compare(password, userFound.password);
    if (!validPassword)  throw createError(401, "invalid password");

    const userId = userFound._id;
    const token = jwt.generateAccessToken({ userId });

    response.status(200).json({ message: "successfully logged in", userId, token });
  } catch (error) {
    next(error);
  }
};
