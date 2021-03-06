/* eslint-disable no-undef */
const express = require('express');
//const Book = require('../models/bookModel');
const booksController = require('../controllers/booksController');

function routes(Book) {
//route for books and filter based on queryparam
const bookRouter = express.Router();
const controller = booksController(Book);

bookRouter.route('/books')
.get(controller.get)
.post (controller.post);

//middleware for router
bookRouter.use('/books/:bookId', (req, res, next) => {
    Book.findById(req.params.bookId, (err,book) => {
        if (err) {
            return res.send(err);
        }
        if (book) {
            req.book = book;
            return next();
        }
        return res.sendStatus(404);
    });
});

//route for find book by Id
bookRouter.route('/books/:bookId')
.get((req,res) => {
    const returnBook = req.book.toJSON();
    returnBook.links = {};
    const genre = req.book.genre.replace(' ', '%20');
    returnBook.links.FilterByThisGenre = `http://${req.headers.host}/api/books?genre=${genre}`;

    res.json(returnBook);

})
.put((req,res) => {
    const {book} = req;
        book.title = req.body.title;
        book.author = req.body.author;
        book.genre = req.body.genre;
        book.read = req.body.read;
        req.book.save(err => {
            if (err) return res.send(err);
            return res.json(book);
        });
})
.patch((req,res) => {
    const {book} = req;
    if (req.body._id) {delete req.body._id;}
    Object.entries(req.body).forEach(item => {
        const key = item[0];
        const value = item[1];
        book[key]=value;
    });
    req.book.save(err => {
        if (err) return res.send(err);
        return res.json(book);
    });
})
.delete((req,res) => {
    req.book.remove((err) => {
        if (err) return res.send(err);
        return res.sendStatus(204);
    });
});

return bookRouter;
}

// eslint-disable-next-line no-undef
module.exports = routes;