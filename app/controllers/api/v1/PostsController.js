"use strict";

var models = require('../../../models')
  , PostSerializer = models.PostSerializer

exports.addController = function(app) {
  var PostsController = function() {
  }

  PostsController.create = function(req, res) {
    if (!req.user)
      return res.status(401).jsonp({ err: 'Not found' })

    req.user.newPost({
      body: req.body.post.body
    })
      .then(function(newPost) { return newPost.create() })
      .then(function(newPost) {
        new PostSerializer(newPost).toJSON(function(err, json) {
          res.jsonp(json)
        })
      })
      .catch(function(e) { res.status(422).send({}) })
  }

  PostsController.update = function(req, res) {
    if (!req.user)
      return res.status(401).jsonp({ err: 'Not found' })

    models.Post.findById(req.params.postId)
      .then(function(post) {
        return post.update({
          body: req.body.post.body
        })
      })
      .then(function(post) {
        new PostSerializer(post).toJSON(function(err, json) {
          res.jsonp(json)
        })
      })
      .catch(function(e) { res.status(422).send({}) })
  }

  PostsController.show = function(req, res) {
    models.Post.findById(req.params.postId)
      .then(function(post) {
        new PostSerializer(post).toJSON(function(err, json) {
          res.jsonp(json)
        })
      })
      .catch(function(e) { res.status(422).send({}) })
  }

  PostsController.like = function(req, res) {
    if (!req.user)
      return res.status(401).jsonp({ err: 'Not found' })

    models.Post.findById(req.params.postId)
      .then(function(post) { return post.addLike(req.user.id) })
      .then(function() { res.status(200).send({}) })
      .catch(function(e) { res.status(422).send({}) })
  }

  PostsController.unlike = function(req, res) {
    if (!req.user)
      return res.status(401).jsonp({ err: 'Not found' })

    models.Post.findById(req.params.postId)
      .then(function(post) { return post.removeLike(req.user.id) })
      .then(function() { res.status(200).send({}) })
      .catch(function(e) { res.status(422).send({}) })
  },

  PostsController.destroy = function(req, res) {
    if (!req.user)
      return res.status(401).jsonp({ err: 'Not found' })

    models.Post.findById(req.params.postId)
      .then(function(post) { return post.destroy() })
      .then(function(status) { res.jsonp({}) })
      .catch(function(e) { res.status(422).send({}) })
  }

  PostsController.hide = function(req, res) {
    if (!req.user)
      return res.status(401).jsonp({ err: 'Not found' })

    models.Post.findById(req.params.postId)
      .then(function(post) { return post.hide() })
      .then(function() { res.jsonp({} )})
      .catch(function(e) { res.status(422).send({}) })
  }

  PostsController.unhide = function(req, res) {
    if (!req.user)
      return res.status(401).jsonp({ err: 'Not found' })

    models.Post.findById(req.params.postId)
      .then(function(post) { return post.unhide() })
      .then(function() { res.jsonp({} )})
      .catch(function(e) { res.status(422).send({}) })
  }

  return PostsController
}
