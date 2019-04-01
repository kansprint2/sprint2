var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js');
var models = require('../models');
var Project = models.Project;
var UserProject = models.UserProject;

var ProjectHelper = require('../helpers/ProjectHelper');

/* GET home page. */
router.get('/', middleware.ensureAuthenticated, async function(req, res, next) {

    let myProjects = await ProjectHelper.getMyProjects(req.user.id);

    var myActiveSprints = await models.Sprint.findAll({
        include: [
            {
                model: models.Project,
                as: 'Project',
                attributes: ['name','id'],

            },
        ],
        where: {
            startDate: {
                [models.Sequelize.Op.lte]: new Date()
            },
            endDate: {
                [models.Sequelize.Op.gt]: new Date()
            },
            [models.Sequelize.Op.or]:[
                {project_id: myProjects.map((row) => {return row.id}) }
            ]
        }
    });

    res.render('dashboard', { title: 'AC scrum vol2', pageName: 'dashboard', myProjects: myProjects, username: req.user.username, isUser: req.user.is_user, myActiveSprints: myActiveSprints });
});

router.get('/projects', function(req, res, next) {

    Project.findAll().then(function (projects) {
        res.send(JSON.parse(JSON.stringify(projects)));
    }, function (err) {
        throw err;
    })

});

module.exports = router;