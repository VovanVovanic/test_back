import { body } from 'express-validator'

export const booksValidation = [
  body('title', "Minimum password length is 3").isLength({ min: 3 }),
  body('description', "Minimum description length is 20").isLength({ min: 20 }),
]