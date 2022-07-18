const router = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  setUser,
  setAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', setUser);
router.patch('/me/avatar', setAvatar);
module.exports = router;
