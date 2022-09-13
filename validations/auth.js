import { body } from 'express-validator'

export const registerValidation = [
  body('email', "Wrong email format").isEmail(),
  body('password', "Minimum password length is 5").isLength({ min: 5 }),
  body('userName', "Minimum userName length is 2").isLength({ min: 2 })
]