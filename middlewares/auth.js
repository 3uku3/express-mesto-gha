const jwt = require('jsonwebtoken');
const DeniedAccessError = require('../utils/denied-access-error');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new DeniedAccessError('Необходима авторизация'));
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'qwerty');
  } catch (err) {
    next(new DeniedAccessError('Необходима авторизация'));
  }

  req.user = payload;

  next();
  return 0;
};
