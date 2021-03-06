var request = require('superagent')
  , app = require('../../index')
  , models = require('../../app/models')

describe("TimelinesController", function() {
  beforeEach(function(done) {
    $database.flushdbAsync()
      .then(function() { done() })
  })

  describe("#home()", function() {
    var authToken

    beforeEach(function(done) {
      var user = {
        username: 'Luna',
        password: 'password'
      }

      request
        .post(app.config.host + '/v1/users')
        .send({ username: user.username, password: user.password })
        .end(function(err, res) {
          res.should.not.be.empty
          res.body.should.not.be.empty
          res.body.should.have.property('authToken')
          authToken = res.body.authToken

          done()
        })
    })

    it('should return empty River Of News', function(done) {
      request
        .get(app.config.host + '/v1/timelines/home')
        .query({ authToken: authToken })
        .end(function(err, res) {
          res.should.not.be.empty
          res.body.should.not.be.empty
          res.body.should.have.property('timelines')
          res.body.timelines.should.have.property('name')
          res.body.timelines.name.should.eql('RiverOfNews')
          res.body.timelines.should.have.property('posts')
          res.body.timelines.posts.length.should.eql(0)
          res.body.should.have.property('posts')
          res.body.posts.length.should.eql(0)
          done()
        })
    })

    it('should not return River Of News for unauthenticated user', function(done) {
      request
        .get(app.config.host + '/v1/timelines/home')
        .end(function(err, res) {
          err.should.not.be.empty
          err.status.should.eql(401)
          done()
        })
    })

    it('should return River of News with one post', function(done) {
      var body = 'Post body'

      request
        .post(app.config.host + '/v1/posts')
        .send({ post: { body: body }, authToken: authToken })
        .end(function(err, res) {
          res.body.should.not.be.empty
          res.body.should.have.property('posts')
          res.body.posts.should.have.property('body')
          res.body.posts.body.should.eql(body)

          request
            .get(app.config.host + '/v1/timelines/home')
            .query({ authToken: authToken })
            .end(function(err, res) {
              res.should.not.be.empty
              res.body.should.not.be.empty
              res.body.should.have.property('timelines')
              res.body.timelines.should.have.property('name')
              res.body.timelines.name.should.eql('RiverOfNews')
              res.body.timelines.should.have.property('posts')
              res.body.timelines.posts.length.should.eql(1)
              res.body.should.have.property('posts')
              res.body.posts.length.should.eql(1)
              res.body.posts[0].body.should.eql(body)
              done()
            })
        })
    })
  })

  describe('#posts()', function() {
    var authToken
      , user
      , post

    beforeEach(function(done) {
      user = {
        username: 'Luna',
        password: 'password'
      }

      request
        .post(app.config.host + '/v1/users')
        .send({ username: user.username, password: user.password })
        .end(function(err, res) {
          res.should.not.be.empty
          res.body.should.not.be.empty
          res.body.should.have.property('authToken')
          authToken = res.body.authToken

          var body = 'Post body'

          request
            .post(app.config.host + '/v1/posts')
            .send({ post: { body: body }, authToken: authToken })
            .end(function(err, res) {
              res.body.should.not.be.empty
              res.body.should.have.property('posts')
              res.body.posts.should.have.property('body')
              res.body.posts.body.should.eql(body)

              post = res.body.posts

              done()
            })
        })
    })

    it('should return posts timeline', function(done) {
      request
        .get(app.config.host + '/v1/timelines/' + user.username)
        .query({ authToken: authToken })
        .end(function(err, res) {
          res.should.not.be.empty
          res.body.should.not.be.empty
          res.body.should.have.property('timelines')
          res.body.timelines.should.have.property('name')
          res.body.timelines.name.should.eql('Posts')
          res.body.timelines.should.have.property('posts')
          res.body.timelines.posts.length.should.eql(1)
          res.body.should.have.property('posts')
          res.body.posts.length.should.eql(1)
          res.body.posts[0].body.should.eql(post.body)
          done()
        })
    })
  })

  describe('#likes()', function() {
    var authToken
      , user
      , post

    beforeEach(function(done) {
      user = {
        username: 'Luna',
        password: 'password'
      }

      request
        .post(app.config.host + '/v1/users')
        .send({ username: user.username, password: user.password })
        .end(function(err, res) {
          authToken = res.body.authToken

          var body = 'Post body'

          request
            .post(app.config.host + '/v1/posts')
            .send({ post: { body: body }, authToken: authToken })
            .end(function(err, res) {
              post = res.body.posts

              request
                .post(app.config.host + '/v1/posts/' + post.id + '/like')
                .send({ authToken: authToken })
                .end(function(req, res) {
                  done()
                })
            })
        })
    })

    it('should return likes timeline', function(done) {
      request
        .get(app.config.host + '/v1/timelines/' + user.username + '/likes')
        .query({ authToken: authToken })
        .end(function(err, res) {
          res.should.not.be.empty
          res.body.should.not.be.empty
          res.body.should.have.property('timelines')
          res.body.timelines.should.have.property('name')
          res.body.timelines.name.should.eql('Likes')
          res.body.timelines.should.have.property('posts')
          res.body.timelines.posts.length.should.eql(1)
          res.body.should.have.property('posts')
          res.body.posts.length.should.eql(1)
          res.body.posts[0].body.should.eql(post.body)
          done()
        })
    })
  })

  describe('#comments()', function() {
    var authToken
      , user
      , post
      , comment

    beforeEach(function(done) {
      user = {
        username: 'Luna',
        password: 'password'
      }

      request
        .post(app.config.host + '/v1/users')
        .send({ username: user.username, password: user.password })
        .end(function(err, res) {
          authToken = res.body.authToken

          var body = 'Post body'

          request
            .post(app.config.host + '/v1/posts')
            .send({ post: { body: body }, authToken: authToken })
            .end(function(err, res) {
              post = res.body.posts

              var body = "Comment"

              request
                .post(app.config.host + '/v1/comments')
                .send({ comment: { body: body, post: post.id }, authToken: authToken })
                .end(function(err, res) {
                  comment = res.body.comments

                  done()
                })
            })
        })
    })

    it('should return comments timeline', function(done) {
      request
        .get(app.config.host + '/v1/timelines/' + user.username + '/comments')
        .query({ authToken: authToken })
        .end(function(err, res) {
          res.should.not.be.empty
          res.body.should.not.be.empty
          res.body.should.have.property('timelines')
          res.body.timelines.should.have.property('name')
          res.body.timelines.name.should.eql('Comments')
          res.body.timelines.should.have.property('posts')
          res.body.timelines.posts.length.should.eql(1)
          res.body.should.have.property('posts')
          res.body.posts.length.should.eql(1)
          res.body.posts[0].body.should.eql(post.body)
          done()
        })
    })
  })
})
