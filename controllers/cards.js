const Card = require('../models/card');
const {
  NOT_FOUND_STATUS,
  UNCORRECT_DATA_STATUS,
  CREATE_STATUS,
  SERVER_ERROR_STATUS,
} = require('../utils/status');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(SERVER_ERROR_STATUS).send({ message: 'Ошибка сервера' }));
};
module.exports.setCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATE_STATUS).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(UNCORRECT_DATA_STATUS)
          .send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(SERVER_ERROR_STATUS).send({ message: 'Ошибка сервера' });
    });
};
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send({ data: card });
        return;
      }
      res
        .status(NOT_FOUND_STATUS)
        .send({ message: 'Запрашиваемая карточка не найдена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(UNCORRECT_DATA_STATUS)
          .send({ message: 'Передан некорректный id карточки' });
        return;
      }
      res.status(SERVER_ERROR_STATUS).send({ message: 'Ошибка сервера' });
    });
};
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
        return;
      }
      res
        .status(NOT_FOUND_STATUS)
        .send({ message: 'Запрашиваемая карточка не найдена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(UNCORRECT_DATA_STATUS)
          .send({ message: 'Передан некорректный id карточки' });
        return;
      }
      res.status(SERVER_ERROR_STATUS).send({ message: 'Ошибка сервера' });
    });
};
module.exports.unlikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
        return;
      }
      res
        .status(NOT_FOUND_STATUS)
        .send({ message: 'Запрашиваемая карточка не найдена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(UNCORRECT_DATA_STATUS)
          .send({ message: 'Передан некорректный id карточки' });
        return;
      }
      res.status(SERVER_ERROR_STATUS).send({ message: 'Ошибка сервера' });
    });
};
