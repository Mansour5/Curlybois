'use strict';
const express = require('express');
const router = express.Router();
const auth = require("../modules/AuthController.js");
const User = require("../models/users");
const Page = require('../models/page');

// route for register action
router.post('/register', auth.register);

// route for login action
router.post('/login', auth.login);

router.get('/login', auth.getLogin);

// route for logout action
router.get('/logout', auth.logout);

//autherisation for user
router.get('/authenticatetoken/:authToken', auth.validateUser);

//Route allows ajax queries for searching users
router.get('/users', (req, res) => {
    User.find({
        username: RegExp('^' + req.query.search, "i")
    }, (err, users) => {
        if (err)
            console.log(err);
        if (users.length < 1)
            res.sendStatus(404);
        else
            res.json(users);
    });
});

//TODO check that poster is owner
router.post('/users/invite', (req, res) => {
    let pageID = req.headers.referer.slice(-5);
    let username = req.body.username;
    let permLevel = parseInt(req.body.permLevel);
    let byPageIDQuery = {
        'page_id': pageID
    }

    //Add page to user collection
    User.findOneAndUpdate({
        'username': username
    }, {
        $push: {
            pages: pageID
        }
    }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
    }, (err, model) => {
        if (err) {
            console.error(err);
            res.sendStatus(409)
        } else {

            let pushQuery = {};
            if (permLevel >= 0)
                pushQuery['viewers'] = username;
            if (permLevel >= 1)
                pushQuery['editors'] = username;
            if (permLevel === 2)
                pushQuery['owners'] = username;

            let updateQuery = {
                $addToSet: pushQuery
            }
            //Add user to page collection
            Page.update(byPageIDQuery, updateQuery, (err, update) => {
                if (err)
                    console.log(err);
                if (update.nModified == 0)
                    res.sendStatus(409);
                else
                    res.sendStatus(200);
            });
        }
    });
});

router.delete('/users/remove', (req, res) => {
    let pageID = req.headers.referer.slice(-5);
    let username = req.body.username;
    let byUsernameQuery = {
        'username': username,
    }
    let byPageIDQuery = {
        'page_id': pageID
    }

    User.findOneAndUpdate(byUsernameQuery, {
        $pull: {
            pages: pageID
        }
    }, (err, model) => {
        let updateQuery = {
            $pull: {
                viewer: username,
                editors: username,
                owners: username
            }
        }
        Page.update(byPageIDQuery, updateQuery, (err, model) => {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        });
    });
});

module.exports = router;
