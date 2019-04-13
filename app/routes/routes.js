'use strict';

var _ = require('lodash');
var async = require('async');
var jwt = require('jsonwebtoken');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var salt = bcrypt.genSaltSync(10);
var models = require(path.resolve('models'));
var Sequelize = require('sequelize');


module.exports = function(app) {

    app.post('/api/createUser', function(req, res) {
        async.waterfall([
            function(callback) {
                models.user.findOne({
                    where: {
                        email: req.body.email
                    }
                }).then(function(user) {
                    if (user) {
                        callback({
                            success: false,
                            message: 'Email Id already exists'
                        }, null);
                    } else {
                        callback(null, req.body)
                    }
                });
            },
            function(userDetails, callback) {
                userDetails.userType = 'User';
                userDetails.password = bcrypt.hashSync(req.body.password, salt);
                models.user.create(userDetails).then(function(userCreated) {
                    if (userCreated) {
                        callback(null, userCreated)
                    } else {
                        callback({
                            success: false,
                            message: 'Something went wrong. Try again'
                        }, null);
                    }
                });
            }
        ], function(err, result) {
            if (err) {
                res.send({
                    success: false,
                    message: err.message
                });
            } else {
                res.send({
                    success: true,
                    message: 'User created successfully'
                });
            }
        });
    });

    app.post('/api/authenticate', function(req, res) {
        models.user.findOne({
            where: {
                email: req.body.username
            }
        }).then(function(user) {
            if (user) {
                var comparePwd = bcrypt.compareSync(req.body.password, user.password);
                if (comparePwd) {
                    var token = jwt.sign({
                        username: user.email,
                        userId: user.id
                    }, process.env.JWT_KEY, {
                        expiresIn: '2h'
                    });

                    res.send({
                        // success: true,
                        token: token,
                        id: user.id,
                        message: 'Successfully Logged In.'
                    });
                } else {
                    res.send({
                        success: false,
                        message: ' Incorrect Email/Password.'
                    });
                }
            } else {
                res.send({
                    success: false,
                    message: 'Please enter a valid Email and password.'
                });
                
            }
        });
    });

    app.use('/api/*', function(req, res, next) {
        var token = req.body.token || req.param('token') || req.headers['x-access-token'] || req.query.token;
        if(token){
            jwt.verify(token, process.env.JWT_KEY, function(err, decoded) {
                if (err) {
                    res.status(403).json({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    console.log(decoded)
                    models.user.findOne({
                        where: {
                            id: decoded.userId
                        }
                    }).then(function(user) {
                        if(user) {
                            next();
                        } else {
                            res.status(403).json({
                                success: false,
                                message: 'Invalid token.'
                            });
                        }
                    });
                }
            });
        } 
        else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    });

    app.get('/api/getUserDetails/:userId', function(req, res) {
        models.user.findOne({
            where: {
                id: req.params.userId
            }
        }).then(function(user) {
            res.send(user);
        });
    });

    app.post('/api/createBulkQues', function(req, res) {
        models.question.bulkCreate(req.body).then(function(ques) {
            res.send({
               success: true,
               message: 'Question created successfully' 
            });
        });
    });

    app.get('/api/getQuestion/:category', function(req, res) {
        models.question.findAll({
            limit: 10,
            where: {
                category: req.params.category,
                
            }
        }).then(function(questions) {
            res.send(questions);
        });
    });

    app.post('/api/createAnswers', function(req, res) {
        async.forEach(req.body, function(ans, cb){
            ans.userId = req.body[0].userId;
            ans.questionId = ans.id;
            cb();
        }, function(err, data) {
            models.answer.bulkCreate(req.body).then(function(ques) {
                return models.answer.findAll({ where: { userId: req.body[0].userId },
                include: [{
                    model: models.question
                }] }).then(function(answers) {
                    res.send({
                        success: true,
                        message: 'Answer created successfully' ,
                        answers: req.body
                     });
                });                
            });
        });
        
    });

    app.get('/api/getAnswers/:userId', function(req, res) {
        models.answer.findAll({ where: { userId: req.params.userId },
            include: [{
                model: models.question
            }] }).then(function(answers) {
                res.send({
                    success: true,
                    answers: answers
                 });
            });    
    });

    app.get('/api/getUsers', function(req, res) {
        models.answer.findAll({ attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('userId')) ,'userId']]
           }).then(function(answers) {
               var users = [];
                async.forEach(answers, function(ans, cb){                    
                    models.user.findById(ans.userId).then(function(user) {
                        users.push(user);
                        cb();
                    });
                }, function(err, data) {
                    res.send({
                        success: true,
                        users: users
                    });
                });
            });    
    });

    app.put('api/updateAdmin/:id', function(req, res) {
        models.user.update({ userType: 'Admin' }, {
            where: {
                id: req.params.id
            }
        }).then(function(user) {
            if(user) {
                res.send({
                    success: true,
                    message: 'Updated'
                });
            } else {
                res.send({
                    success: false
                })
            }
        });
    });

};