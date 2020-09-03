'use strict';
const express = require('express');
const router = express.Router();
const Page = require('../models/page');
const User = require('../models/users');
//Serve landing page
router.get('/', function(req, res) {
    if(req.user){
    User.findOne({'username':req.user.username}).exec((err, user)=>{
        res.render('editor', {docSaved: false,user: user});
    });
    }else{
        res.render('editor', {docSaved: false,user: null});
    }

});


router.get('/doc/:page_id', function(req, res) {
    Page.findOne({
        'page_id': req.params.page_id
    }).exec((err, page) => {
        if (page) {
            if (page.viewers.includes('guest') || req.user && page.viewers.includes(req.user.username)) {
                console.log(page);
                res.render('editor', {
                    page: page,
                    docSaved: true,
                    user: req.user,
                    isOwner: page.owners.includes(req.user.username)
                });
            } else {
                res.status(403).send('<h1>You do not have permission to view this page</h1><p>Please <a href="/">sign in</a> to continue</p>');
            }
        } else {
            res.status(404).send('<h1>Wow there, Cowboy Neil. It looks like you are lost! 🤠</h1>');
        }
    });
});


module.exports = router;
