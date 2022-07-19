const User = require('../models/user');
const {
  NOT_FOUND_STATUS,
  UNCORRECT_DATA_STATUS,
  CREATE_STATUS,
  SERVER_ERROR_STATUS,
} = require('../utils/status');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(SERVER_ERROR_STATUS).send({ message: 'Ошибка сервера' }));
};
module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      res.status(NOT_FOUND_STATUS).send({ message: 'Запрашиваемый пользователь не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(UNCORRECT_DATA_STATUS)
          .send({ message: 'Передан некорректный id пользователя' });
        return;
      }
      res.status(SERVER_ERROR_STATUS).send({ message: err.name });
    });
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATE_STATUS).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(UNCORRECT_DATA_STATUS).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(SERVER_ERROR_STATUS).send({ message: 'Ошибка сервера' });
    });
};
module.exports.setUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      res.status(NOT_FOUND_STATUS).send({ message: 'Запрашиваемый пользователь не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(UNCORRECT_DATA_STATUS).send({ message: 'Переданы некорректные данные' });
        return;
      }
      if (err.name === 'CastError') {
        res
          .status(UNCORRECT_DATA_STATUS)
          .send({ message: 'Передан некорректный id пользователя' });
        return;
      }
      res.status(SERVER_ERROR_STATUS).send({ message: 'Ошибка сервера' });
    });
};
module.exports.setAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      res.status(NOT_FOUND_STATUS).send({ message: 'Запрашиваемый пользователь не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(UNCORRECT_DATA_STATUS).send({ message: 'Переданы некорректные данные' });
        return;
      }
      if (err.name === 'CastError') {
        res
          .status(UNCORRECT_DATA_STATUS)
          .send({ message: 'Передан некорректный id пользователя' });
        return;
      }
      res.status(SERVER_ERROR_STATUS).send({ message: 'Ошибка сервера' });
    });
};
