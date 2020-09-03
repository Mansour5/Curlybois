'use strict';
const express = require('express');
const router = express.Router();
const Page = require('../models/page');
const saveFile = require('../modules/saveFile');
const deleteFile = require('../modules/deleteFile');

//download page.
router.get('/page/download/', function (req, res, next) {
    //get data from url

    var pageId = req.query.pageId;
    var type = req.query.type;
    var docSaved = req.query.docSaved;

    var username = req.user?req.user.username:'guest';

    //find page
    Page.findOne({page_id: pageId, viewers: {$in: [username, 'guest']}}, function (err, rst) {
        console.log("rst: " +rst);
        if(err){
            console.log(err);
        }
        //if result found
        if(rst) {
            //create local file

            saveFile(rst.content, rst.filename, type, function(){
                //if file is need to be saved for download, delete from db after local write.
                if(docSaved == 'false'){
                    Page.deleteOne({page_id:pageId},function (err ,rst) {
                        if(err) console.log(err);
                    });
                }
                //send file to user
                res.download('./temp/' + rst.filename + '.' + type, rst.filename + '.' + type, function (err) {
                    if (err) console.error(err);
                    //delete local file.
                    deleteFile(pageId, type);
                });
            });
        } else {
            res.status(403).send('<h1>You do not have permission to download this page</h1><p>Please <a href="/">sign in</a> to continue</p>');
        }
    });
});

router.post('/page/download', async function (req, res, next) {
    if(req.body.isTest == true){
        res.send('you are testing')
    }
    //set pageData
    var pageData = {
        type: req.body.type,
        docSaved: req.body.isInDB
    };
    //if page exists in db get pagId
    if(req.body.isInDB == "true") {
        pageData.page_id = req.headers.referer.slice(-5);
        res.status(201).json(pageData);

    }else {
        //save a temp page in db
        let newPage = new Page();
        newPage.content = req.body.content;
        newPage.viewers.push('guest');
        newPage.save(function (err, page) {
            if (err) {
                res.sendStatus(500);
            } else {
                //using object id as page_id to avoid conflicts with multiple users downloading at one time
                pageData.page_id = page._id;
                res.status(201).json(pageData);
            }
        });
    }
});


module.exports = router;
