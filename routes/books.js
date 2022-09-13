import BookSchema from '../models/Book.js'
import { validationResult } from 'express-validator'

export const remove = async (req, res) => {
  try {
    const bookId = req.params.id.slice(1);

    BookSchema.findOneAndDelete(
      {
        _id: bookId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Could not delete the book',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'The book is not found',
          });
        }

        res.json({
          success: true,
        });
      },
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Could not get books',
    });
  }
}

export const update = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array())
    }
    const bookId = req.params.id.slice(1);
    await BookSchema.updateOne(
      {
        _id: bookId,
      },
      {
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        url: req.body.url,
        type: req.body.type

      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Could not update book info',
    });
  }
}

export const getSingle = async (req, res) => {
  try {
    const id = req.params.id.slice(1)
    const book = await BookSchema.findOne({ _id: id }).exec();
    res.json(book);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Impossible to get book',
    });
  }
}

export const getByGroup = async (req, res) => {
  try {
    const type = req.params.id.slice(1)
    const books = await BookSchema.find({ type: type }).exec();
    res.json(books);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Impossible to get books',
    });
  }
}

export const insert = async (req, res) => {

  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array())
    }
    const doc = new BookSchema({
      title: req.body.title,
      description: req.body.description,
      author: req.body.author,
      type: req.body.type,
      url: req.body.url,
    })
    const article = await doc.save()
    res.json(article)
  }
  catch (e) {
    console.log(e)
    res.status(500).json({ message: "Something wrong" })
  }
}