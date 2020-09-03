/**
 * Created by ali-meysammohebbi on 2018-02-14.
 */
'use strict';
const express = require('express');
const router = express.Router();
const fs = require('fs');
const Page = require('../models/page');
const User = require('../models/users');

router.post('/page/deleteFile/', function (req, res) {
    // saving pageId in the variable pageID
    var pageId = req.headers.referer.slice(-5);

    var username = req.user?req.user.username:'guest';

    //Search for the page
    Page.findOne({page_id: pageId}, function (err, rst) {
        Page.deleteOne({page_id:pageId, owners: {$in: [username, 'guest']}}, function (err, result) {
            if(result) {
                var users = []
                rst.owners.forEach(function (name, index, arr) {
                    if(!users.includes(name)){
                        users.push(name);
                    }
                });
                rst.editors.forEach(function (name, index, arr) {
                    if(!users.includes(name)){
                        users.push(name);
                    }
                });
                rst.viewers.forEach(function (name, index, arr) {
                    if(!users.includes(name)){
                        users.push(name);
                    }
                });
                User.update({username: {$in: users}}, { $pull: { pages: pageId }}, { safe: true, multi:true }, function(err, obj) {
                    if(err){
                        console.log(err);
                        res.sendStatus(500);
                    }else{
                        res.sendStatus(200);
                    }
                });
            } else {
                res.status(404).send('<h1>You do not have permission to delete this page</h1><p>Please <a href="/">sign in</a> to continue</p>');
            }
        });
    })




});

module.exports = router;
