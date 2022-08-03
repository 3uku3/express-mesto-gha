const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getCards,
  setCard,
  deleteCard,
  likeCard,
  unlikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: {
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  },
}), setCard);
router.delete('/:cardId', celebrate({
  params: {
    cardId: Joi.string().alphanum().length(24),
  },
}), deleteCard);
router.put('/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string().alphanum().length(24),
  },
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string().alphanum().length(24),
  },
}), unlikeCard);
module.exports = router;
