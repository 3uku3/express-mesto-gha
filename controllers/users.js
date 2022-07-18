const { Error } = require('mongoose');

const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};
module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      }
      return Promise.reject(new Error.ValidationError());
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      if (err.name === 'ValidationError') {
        res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(500).send({ message: err.name });
    });
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};
module.exports.setUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return;
      }
      if (err.name === 'CastError') {
        res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};
module.exports.setAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return;
      }
      if (err.name === 'CastError') {
        res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};
