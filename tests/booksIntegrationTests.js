require('should');

const request = require('supertest');
const mongoose = require('mongoose');

process.env.ENV = 'TEST';

const app = require('../app.js');
const Book = mongoose.model('Book');

const agent = request.agent(app);

describe('Book crud test', () => {
    it('should allow book to be posted and return read and _it', (done) => {
        const bookPost = {title:'MyBook', author:'Me', genre:'Fiction'};

        agent.post('/api/books')
        .send(bookPost)
        .expect(200)
        .end((err,results) => {
            results.body.read.should.not.equal('false');
            results.body.should.have.property('_id');
            done();
        });
    });

afterEach((done) => {
    //Book.deleteMany({}).exec();
    done();
});

after((done) => {
    mongoose.connection.close();
    app.server.close(done());    
});

})