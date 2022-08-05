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
    link: Joi.string().required().regex(/^http(s)?:\/\/((www.)?([\w-]+\.)+\/?)\S*$/),
  },
}), setCard);
router.delete('/:cardId', celebrate({
  params: {
    cardId: Joi.string().alphanum().length(24).hex(),
  },
}), deleteCard);
router.put('/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string().alphanum().length(24).hex(),
  },
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string().alphanum().length(24).hex(),
  },
}), unlikeCard);
module.exports = router;
