import UserSchema from '../models/User.js'
import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const getMe = async (req, res) => {
  try {
    const user = await UserSchema.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: ' The user is not found',
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {

    res.status(500).json({
      message: 'No Access',
    });
  }
}

export const login = async (req, res) => {
  try {
    const user = await UserSchema.findOne({ email: req.body.email })

    if (!user) {
      return res.status(404).json({ message: "User Not found" })
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.password)
    if (!isValidPass) {
      return res.status(404).json({ message: "Wrong credentials" })
    }

    const token = jwt.sign({
      _id: user._id
    }, 'secret123', { expiresIn: '30d' })

    const { password, ...data } = user._doc
    return res.json({
      ...data,
      token
    })

  } catch (e) {
    console.log(e, "error")
    res.status(500).json({ message: "Something gonna wrong", e })
  }
}

export const register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array())
    }
    const pass = req.body.password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(pass, salt)
    const doc = new UserSchema({
      email: req.body.email,
      userName: req.body.userName,
      password: passwordHash
    })
    const user = await doc.save()

    const token = jwt.sign({
      _id: user._id
    }, 'secret123', { expiresIn: '30d' })

    const { password, ...data } = user._doc
    return res.json({
      ...data,
      token
    })
  }
  catch (e) {
    res.json({ message: "Something gonna wrong", e })
  }
}

export const logout = async (req, res) => {

  try {
    const user = await UserSchema.findOne({ email: req.body.email })

    if (!user) {
      return res.status(404).json({ message: "User Not found" })
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.password)
    
    if (!isValidPass) {
      return res.status(404).json({ message: "Wrong credentials" })
    }

    user.token = null
    await user.save()
    
    const { password, ...data } = user._doc
    return res.json({
      ...data,
      message: "Logout successful"
    })

  } catch (e) {
    console.log(e, "error")
    res.status(500).json({ message: "Something gonna wrong", e })
  }
}