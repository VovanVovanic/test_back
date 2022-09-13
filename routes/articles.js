import ArticleSchema from '../models/Article.js'
import { validationResult } from 'express-validator'

export const insert = async (req, res) => {

  try {
    const doc = new ArticleSchema({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      user: req.userId,
    })
    const article = await doc.save()
    res.json(article)
  }
  catch (e) {
    console.log(e)
    res.status(500).json({ message: "Something wrong" })
  }
}

export const getAll = async (req, res) => {
  try {
    const posts = await ArticleSchema.find().populate('user').exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Impossible to get articles',
    });
  }
}