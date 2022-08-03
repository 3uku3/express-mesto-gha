const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  CREATE_STATUS,
} = require('../utils/status');
const UncorrectDataError = require('../utils/uncorrect-data-error');
const NotFoundError = require('../utils/not-found-error');
const ConflictError = require('../utils/conflict-error');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      }
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new UncorrectDataError('Передан некорректный id пользователя');
      }
      next(err);
    });
};
module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id).then((user) => {
    if (!user) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
    res.status(200).send({ data: user });
  }).catch(next);
};
module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => User.create({
    name, about, avatar, email, password: hash,
  }))
    .then((user) => {
      res.status(CREATE_STATUS).send({
        data: {
          email: user.email,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new UncorrectDataError('Переданы некорректные данные');
      }
      if (err.code === 11000) {
        throw new ConflictError('Пользователь уже зарегестрирован');
      }
    })
    .catch(next);
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredintials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'qwerty', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
        }).send({
          data: {
            email: user.email,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            _id: user._id,
          },
        })
        .end();
    })
    .catch(next);
};
module.exports.setUser = (req, res, next) => {
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
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new UncorrectDataError('Переданы некорректные данные');
      }
      if (err.name === 'CastError') {
        throw new UncorrectDataError('Передан некорректный id пользователя');
      }
    }).catch(next);
};
module.exports.setAvatar = (req, res, next) => {
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
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new UncorrectDataError('Переданы некорректные данные');
      }
      if (err.name === 'CastError') {
        throw new UncorrectDataError('Передан некорректный id пользователя');
      }
    }).catch(next);
};
