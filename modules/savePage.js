const Page = require('../models/page');
const users = require('../models/users');
let save = async function(req, res, next) {
  let pageContent = req.body.content;
  let isInDB = (req.body.isInDB == 'true');

  var username = req.user?req.user.username:'guest';

    //If in db update
  if (isInDB) {
    let pageID = req.headers.referer.slice(-5);
    Page.update({page_id: pageID, editors: {$in: [username, 'guest']}},{'content':pageContent}, function (err, rst){
        if (err) {
            console.log('error');
        }else if(rst.n > 0){
            //Page updated
            if(rst.nModified > 0) {
                res.sendStatus(200);
            }else{
                res.sendStatus(304);
            }
        }else{
            //user not authorized to edit page
            res.sendStatus(401);
        }
        });
  } else {
    //else create new page
    let newPage = new Page();
    newPage.content = req.body.content;
    newPage.page_id = await generateUniqueID();

    if(req.user){
    newPage.published_by = username;
    //save to user pages
        users.findOneAndUpdate(
            {'username': req.user.username},
            {$push: {pages: newPage.page_id}},
            { upsert: true, new: true, setDefaultsOnInsert: true },
            function (err, model) {
              console.log(err);
              });
  }
    newPage.owners.push(username);
    newPage.editors.push(username);
    newPage.viewers.push(username);
    newPage.save((err, page) => {
      if (err)
        res.sendStatus(500);
      else {
        res.status(201).json(page);
      }
    });
  }
}


//Function generates random and guaranteed unique page IDs
async function generateUniqueID() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let iDArray = [];
    for (let i = 0; i < 5; i++) {
        iDArray.push(chars.charAt(Math.floor(Math.random() * 62)));
    }
    let pageID = iDArray.join('');
    //Invalid if there is a collision
    let invalid = await Page.find({
        'page_id': pageID
    }).length > 0;
    //If there is a collision a new one is generated
    if (invalid)
        return generateUniqueID();
    else {
        return pageID;
    }
}

module.exports = save;
