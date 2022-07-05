const fs = require('fs');
const createError = require('http-errors');

const { Sauce } = require('../models');


exports.getAllSauces = async (request, response, next) => {
  try {
    const sauces = await Sauce.find();

    response.status(200).json(sauces);
  } catch (error) {
    next(error);
  }
};

exports.getOneSauce = async (request, response, next) => {
  try {
    const sauceFound = await Sauce.findById(request.params.id);
    if (!sauceFound) throw createError(404, 'sauce not found');

    response.status(200).json(sauceFound);
  } catch (error) {
    next(error);
  }
};

exports.createSauce = async (request, response, next) => {
  try {
    const sauceObject = JSON.parse(request.body.sauce);

    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${request.protocol}://${request.get('host')}/images/${request.file.filename}`
    });

    await sauce.save();

    response.status(201).json({ message: "sauce successfully created" });
  } catch (error) {
    next(error);
  }
};

exports.updateSauce = async (request, response, next) => {
  try {
    const sauceFound = await Sauce.findById(request.params.id);
    if (!sauceFound) throw createError(404, "sauce not found");
    if (sauceFound.userId !== request.auth.userId) throw createError(401, "unauthorized request");

    const sauceObject = request.file
      ? { ...JSON.parse(request.body.sauce),
          imageUrl: `${request.protocol}://${request.get('host')}/images/${request.file.filename}` } 
      : { ...request.body };

    await Sauce.updateOne({ _id: request.params.id }, { ...sauceObject, _id: request.params.id });

    if (request.file) await fs.unlink(`public/images/${filename}`);

    response.status(200).json({ message: "Sauce successfully updated!" });
  } catch (error) {
    response.status(400).json({ error })
  }
};

exports.deleteSauce = async (request, response, next) => {
  try {
    const sauceFound = await Sauce.findById(request.params.id);
    if (!sauceFound) throw createError(404, "sauce not found");
    if (sauceFound.userId !== request.auth.userId) throw createError(401, "unauthorized request");

    await sauceFound.deleteOne();
    const filename = sauceFound.imageUrl.split('/images/')[1];

    await fs.unlink(`public/images/${filename}`);
    response.status(200).json({ message: "Sauce successfully deleted" });
  } catch (error) {
    next(error);
  }
};

exports.likeSauce = async (request, response, next) => {
  try {
    const { like } = request.body;
    const { userId } = request.auth;

    const status = [-1, 0, 1];
    if (!status.includes(like)) return response.status(400).json({ error });

    const sauceFound = await Sauce.findById( request.params.id );
    if (!sauceFound) throw createError(404, "sauce not found");

    const { usersLiked, usersDisliked } = sauceFound;

    switch (like) {
      case 1:
        if (usersLiked.includes(userId)) return response.status(400).json({ error });
        usersLiked.push(userId);
        break;
      case -1:
        if (usersDisliked.includes(userId)) return response.status(400).json({ error });
        usersDisliked.push(userId);
        break;
      case 0:
        if (usersLiked.includes(userId)) {
          const index = usersLiked.indexOf(userId);
          usersLiked.splice(index, 1);
        } else {
          const index = usersDisliked.indexOf(userId);
          usersDisliked.splice(index, 1);
        }
        break;
      default: response.status(400).json({ error });
    }

    sauceFound.likes = usersLiked.length;
    sauceFound.dislikes = usersDisliked.length;

    await sauceFound.save();

    response.status(200).json({ message: "Sauce updated" });
  } catch (error) {
    next(error);
  }
};
