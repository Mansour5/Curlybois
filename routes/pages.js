'use strict';
const express = require('express');
const router = express.Router();
const Page = require('../models/page');
const User = require('../models/users');

//Finds all pages
router.post('/pages', function(req, res, next){
    var pages = {
        owners: [],
        editors: [],
        viewers: [],
    };
    if(req.user) {
        var username = req.user.username;
        User.findOne({username: username}).exec(function (err, user) {
            if(err){
                console.log(err);
                res.sendStatus(500);
            }else{
                Page.find({page_id: {$in:user.pages}}).exec(function (err, rst) {
                    if(err){
                        console.log(err);
                        res.sendStatus(500);
                    }else{
                        rst.forEach(function (page, index) {
                            var data = {
                                filename: page.filename,
                                page_id: page.page_id
                            };

                            if(page.owners.includes(username)){
                                pages.owners.push(data)

                            }else if(page.editors.includes(username)){
                                pages.editors.push(data)

                            }else if(page.viewers.includes(username)){
                                pages.viewers.push(data)
                            }
                        });
                    res.status(200).json(pages)
                    }
                })
            }
        });
    }
});

router.post('/findname', function (req, res, next) {
    var username = req.user?req.user.username:'';
    var pageId = req.headers.referer.slice(-5);
    Page.findOne({page_id:pageId, viewers:{$in:[username]}}, function (err, rst) {
        if(err){
            console.log(err);
            res.sendStatus(500);
        }else if(rst){
            res.status(200).json(rst.filename);
        }else{
            res.sendStatus(401);
        }
    })
});

router.post('/save', require('../modules/savePage'));

router.post('/getPagePermissions', function (req, res, next) {
    var username = req.user?req.user.username:'';
    var pageId = req.headers.referer.slice(-5);
    Page.findOne({page_id:pageId, viewers:{$in:[username]}}, function (err, rst) {
        if(err){
            console.log(err);
            res.sendStatus(500);
        }else if(rst){
            var auth = 'none';
            if(rst.owners.includes(username)){
                auth = 'owner';
            }else if(rst.editors.includes(username)){
                auth = 'editor';
            }else if(rst.viewers.includes(username)){
                auth = 'viewer';
            }
            res.status(200).json(auth);
        }else{
            res.sendStatus(401);
        }
    })
});

router.post('/namefile', function (req, res, next) {
    var username = req.user?req.user.username:'guest';

    var filename = req.body.filename;
    var filter = /^(?!\s*$)[a-z\d\-_\s]+$/i;
    if(filename != '' && filter.test(filename)){
        var pageId = req.headers.referer.slice(-5);

        Page.findOneAndUpdate({page_id:pageId, owners: {$in: [username, 'guest']}}, {filename: filename},function (err, rst) {
            if(err){
                console.log(err);
                res.sendStatus(500)
            }else{
                res.sendStatus(201);
            }
        })
    }else{
        res.sendStatus(500);
    }
});


module.exports = router;
