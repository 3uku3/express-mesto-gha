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
router.get('/:userId', getUser);
router.patch('/me', setUser);
router.patch('/me/avatar', setAvatar);
module.exports = router;
