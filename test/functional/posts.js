var request = require('superagent')
  , app = require('../../index')
  , models = require('../../app/models')

describe("PostsController", function() {
  beforeEach(function(done) {
    $database.flushdbAsync()
      .then(function() { done() })
  })

  describe('#create()', function() {
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

    it('should create a post with a valid user', function(done) {
      var body = 'Post body'

      request
        .post(app.config.host + '/v1/posts')
        .send({ post: { body: body }, authToken: authToken })
        .end(function(err, res) {
          res.body.should.not.be.empty
          res.body.should.have.property('posts')
          res.body.posts.should.have.property('body')
          res.body.posts.body.should.eql(body)

          done()
        })
    })

    it('should not create a post with an invalid user', function(done) {
      var body = 'Post body'

      request
        .post(app.config.host + '/v1/posts')
        .send({ post: { body: body }, authToken: 'token' })
        .end(function(err, res) {
          err.should.not.be.empty
          err.status.should.eql(401)

          done()
        })
    })
  })

  describe('#like()', function() {
    var authToken
      , post

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

    it('should like post with a valid user', function(done) {
      request
        .post(app.config.host + '/v1/posts/' + post.id + '/like')
        .send({ authToken: authToken })
        .end(function(err, res) {
          res.body.should.be.empty
          $should.not.exist(err)

          done()
        })
    })

    it('should not like post with an invalid user', function(done) {
      request
        .post(app.config.host + '/v1/posts/' + post.id + '/like')
        .end(function(err, res) {
          err.should.not.be.empty
          err.status.should.eql(401)
          done()
        })
    })

    it('should not like invalid post', function(done) {
      request
        .post(app.config.host + '/v1/posts/:id/like')
        .send({ authToken: authToken })
        .end(function(err, res) {
          err.should.not.be.empty
          err.status.should.eql(422)
          done()
        })
    })
  })

  describe('#unlike()', function() {
    var authToken
      , post

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

    it('should unlike post with a valid user', function(done) {
      request
        .post(app.config.host + '/v1/posts/' + post.id + '/unlike')
        .send({ authToken: authToken })
        .end(function(err, res) {
          res.body.should.be.empty
          $should.not.exist(err)

          done()
        })
    })

    it('should not unlike post with an invalid user', function(done) {
      request
        .post(app.config.host + '/v1/posts/' + post.id + '/unlike')
        .end(function(err, res) {
          err.should.not.be.empty
          err.status.should.eql(401)
          done()
        })
    })

    it('should not unlike invalid post', function(done) {
      request
        .post(app.config.host + '/v1/posts/:id/unlike')
        .send({ authToken: authToken })
        .end(function(err, res) {
          err.should.not.be.empty
          err.status.should.eql(422)
          done()
        })
    })
  })

  describe('#update()', function() {
    var post
      , authToken

    beforeEach(function(done) {
      var user = {
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

              done()
            })
        })
    })

    it('should update post with a valid user', function(done) {
      var newBody = "New body"
      request
        .post(app.config.host + '/v1/posts/' + post.id)
        .send({ post: { body: newBody },
                authToken: authToken,
                '_method': 'put'
              })
        .end(function(err, res) {
          res.body.should.not.be.empty
          res.body.should.have.property('posts')
          res.body.posts.should.have.property('body')
          res.body.posts.body.should.eql(newBody)

          done()
        })
    })

    it('should not update post with a invalid user', function(done) {
      var newBody = "New body"
      request
        .post(app.config.host + '/v1/posts/' + post.id)
        .send({ post: { body: newBody },
                '_method': 'put'
              })
        .end(function(err, res) {
          err.should.not.be.empty
          err.status.should.eql(401)

          done()
        })
    })
  })

  describe('#show()', function() {
    var post
      , authToken

    beforeEach(function(done) {
      var user = {
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

              done()
            })
        })
    })

    it('should show a post', function(done) {
      request
        .get(app.config.host + '/v1/posts/' + post.id)
        .query({ authToken: authToken })
        .end(function(err, res) {
          res.body.should.not.be.empty
          res.body.should.have.property('posts')
          res.body.posts.should.have.property('body')
          res.body.posts.body.should.eql(post.body)

          done()
        })
    })
  })

  describe('#destroy()', function() {
    var user
      , post
      , authToken

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

              done()
            })
        })
    })

    it('should destroy valid post', function(done) {
      request
        .post(app.config.host + '/v1/posts/' + post.id)
        .send({
          authToken: authToken,
          '_method': 'delete'
        })
        .end(function(err, res) {
          res.body.should.be.empty
          res.status.should.eql(200)

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
              res.body.timelines.posts.length.should.eql(0)
              res.body.should.have.property('posts')
              res.body.posts.length.should.eql(0)
              done()
            })
        })
    })

    it('should not destroy valid post without user', function(done) {
      request
        .post(app.config.host + '/v1/posts/' + post.id)
        .send({
          '_method': 'delete'
        })
        .end(function(err, res) {
          err.should.not.be.empty
          err.status.should.eql(401)
          done()
        })
    })
  })
})
