const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getUsers,
  getUser,
  setUser,
  setAvatar,
  getMe,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', celebrate({
  params: {
    userId: Joi.string().alphanum.length(24),
  },
}), getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required.min(2).max(30),
    about: Joi.string().required.min(2).max(30),
  }),
}), setUser);
router.patch('/me/avatar', celebrate({
  body: {
    avatar: Joi.string().required().regex(/^http(s)?:\/\/([\w.]+\/?)\S*/g),
  },
}), setAvatar);
module.exports = router;
