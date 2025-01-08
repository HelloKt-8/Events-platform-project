const { selectUsers, selectUser } = require('../models/models');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await selectUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

exports.getUserId = async (req, res, next) => {
  try {
    const { user_id } = req.params
    const user = await selectUser(user_id);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};
