var express = require('express');
var router = express.Router();
var models = require('../models/');
var Project = require('../models/project.js').Project;

var User = models.User;
/* GET users listing. */

// JSON GET EXAMPLE
/*router.get('/', async function(req, res, next) {

  try {
    let users = await User.findAllUsers({
      include: [
        {
          model: Project,
        }
      ]
    })
    res.send(JSON.parse(JSON.stringify(users)));

  } catch (e) {
    throw e;
  }


});*/

module.exports = router;
