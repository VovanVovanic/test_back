import express from 'express'
import mongoose from 'mongoose'
import { registerValidation } from './validations/auth.js'
import { booksValidation } from './validations/book.js'
import { validationResult } from 'express-validator'
import cors from 'cors'
import * as books from './routes/books.js';
import * as articles from './routes/articles.js';
import * as auth from './routes/auth.js';
import { checkAuth }  from './utils/checkAuth.js';

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('DB ok'))
  .catch((e)=> console.log('db error', e))

const app = express()
app.use(express.json())
app.use(cors());

///articles
app.get('/', checkAuth, articles.getAll)
app.post('/article', checkAuth, articles.insert)

///user
app.get('/auth/me', checkAuth, auth.getMe);
app.post('/auth/login', auth.login)
app.post('/auth/register', registerValidation, auth.register)
app.get('/auth/logout', checkAuth, auth.logout)

///books
app.post('/book', booksValidation, checkAuth, books.insert)
app.get('/books/:id', checkAuth, books.getByGroup)
app.get('/book/:id', checkAuth, books.getSingle)
app.patch('/books/:id', booksValidation, checkAuth, books.update)
app.delete('/books/:id', checkAuth, books.remove);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log('Server OK')
})