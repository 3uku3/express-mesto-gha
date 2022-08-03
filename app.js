const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const error = require('./middlewares/errors');
const NotFoundError = require('./utils/not-found-error');

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb', {});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/users/singup', celebrate({
  body: {
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  },
}), createUser);
app.post('/users/singin', login);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
app.use(error);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
