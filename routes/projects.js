var express = require('express');
var router = express.Router();

var models = require('../models/');
var middleware = require('./middleware.js');

// models
var User = models.User;
var Projects = models.Project;
const Stories = models.Stories;
var UserProject = models.UserProject;

// helpers
var ProjectHelper = require('../helpers/ProjectHelper');
var StoriesHelper = require('../helpers/StoriesHelper');
var SprintsHelper = require('../helpers/SprintsHelper');

// ------------------ This should list all projects that are available to signed user ------------------
router.get('/', middleware.ensureAuthenticated, async function(req, res, next) {
    // let userProjects = await ProjectHelper.listUserProjects();
    let projects = await ProjectHelper.getAllowedProjects(req.user.id);

    res.render('projects', { errorMessages: 0, success: 0, pageName: 'projects', projects: projects, username: req.user.username, isUser: req.user.is_user, uid:req.user.id});
});

// ------------------ endpoint for project page ------------------
router.get('/:id/view', ProjectHelper.canAccessProject, async function(req, res, next) {
    let currentProject = await ProjectHelper.getProject(req.params.id);
    let projectStories = await StoriesHelper.listStories(req.params.id);
    let activeSprintId = await SprintsHelper.currentActiveSprint(currentProject.id);
    res.render('project', { errorMessages: 0, success: 0, pageName: 'projects', project: currentProject, stories: projectStories, uid: req.user.id, username: req.user.username, isUser: req.user.is_user,
    activeSprintId:activeSprintId});
});

router.get('/:id/activate/:story_id', ProjectHelper.isSMorPM, async function(req, res, next) {
    let project_id = req.params.id;
    let story_id = req.params.story_id;

    let story = await Stories.findOne({
        where: {
            id: story_id,
        }
    });
    let activeSprintId = await SprintsHelper.currentActiveSprint(story.project_id);

    if (activeSprintId !== undefined) {
        // Set new attributes
        story.setAttributes({
            sprint_id: activeSprintId
        });
        await story.save();
    }

    let currentProject = await ProjectHelper.getProject(req.params.id);
    let projectStories = await StoriesHelper.listStories(req.params.id);
    res.render('project', { errorMessages: 0, success: 0, pageName: 'projects', project: currentProject, stories: projectStories, uid: req.user.id, username: req.user.username, isUser: req.user.is_user,
        activeSprintId:activeSprintId});
});

router.get('/:id/deactivate/:story_id', ProjectHelper.isSMorPM, async function(req, res, next) {
    let project_id = req.params.id;
    let story_id = req.params.story_id;

    let story = await Stories.findOne({
        where: {
            id: story_id,
        }
    });
    let activeSprintId = await SprintsHelper.currentActiveSprint(story.project_id);

    // Set new attributes
    story.setAttributes({
        sprint_id: null
    });
    await story.save();

    let currentProject = await ProjectHelper.getProject(req.params.id);
    let projectStories = await StoriesHelper.listStories(req.params.id);
    res.render('project', { errorMessages: 0, success: 0, pageName: 'projects', project: currentProject, stories: projectStories, uid: req.user.id, username: req.user.username, isUser: req.user.is_user,
        activeSprintId:activeSprintId});
});


router.post('/:id/time/:story_id', ProjectHelper.isSMorPM, async function(req, res, next) {
    let project_id = req.params.id;
    let story_id = req.params.story_id;

    let story = await Stories.findOne({
        where: {
            id: story_id,

        }
    });
    let activeSprintId = await SprintsHelper.currentActiveSprint(story.project_id);

    let time = req.body.time;
    if (time.endsWith('h')) {
        time = time.slice(0, time.length - 1);
        time = +time;
    }

    if (time.endsWith('d')) {
        time = time.slice(0, time.length - 1);
        time = +time;
        time *= 8;
    }

    // Set new attributes
    story.setAttributes({
        timeEstimate: time
    });
    await story.save();

    let currentProject = await ProjectHelper.getProject(req.params.id);
    let projectStories = await StoriesHelper.listStories(req.params.id);
    res.render('project', { errorMessages: 0, success: 0, pageName: 'projects', project: currentProject, stories: projectStories, uid: req.user.id, username: req.user.username, isUser: req.user.is_user,
        activeSprintId:activeSprintId});
});

// ------------------ endpoint for editing existing projects ------------------
router.get('/:id/edit/', ProjectHelper.isSMorAdmin, async function(req, res, next) {

    let toEditProject = await ProjectHelper.getProjectToEdit(req.params.id);
    let users = await User.findAllUsers();
    res.render('add_edit_project', { errorMessages: 0, title: 'AC scrum vol2', users: users,
        pageName: 'projects', username: req.user.username, toEditProject: toEditProject,
        isUser: req.user.is_user, success: 0 });
});

router.post('/:id/edit/', ProjectHelper.isSMorAdmin, async function(req, res, next) {
    var data = req.body;

    let users = await User.findAllUsers();
    // Get current version
    var project = await Projects.findOne({
        where: {
            id:req.params.id,
        }
    });

    // Set new attributes
    project.setAttributes({
        name: data.name,
        description: data.description,
        created_by: req.user.id,
        scrum_master: data.scrum_master,
        product_owner: data.product_owner,
    });

    // validate project
    if (!await ProjectHelper.isValidProject(project)){
        let toEditProject = await ProjectHelper.getProjectToEdit(project.id);
        req.flash('error', `Project Name: ${project.name} already in use!`);
        res.render('add_edit_project', { errorMessages: req.flash('error'), users:users, success: 0,
            title: 'AC scrum vol2', pageName: 'projects', toEditProject:toEditProject,
            username: req.user.username, isUser: req.user.is_user });
        return;
    }

    await project.save();

    // Destroy all current members
    await UserProject.destroy({
        where: {
            project_id: project.id,
        }
    });

    await ProjectHelper.saveProjectMembers(project, data.members);

    let toEditProject = await ProjectHelper.getProjectToEdit(req.params.id);

    req.flash('success', 'Project: '+ project.name + ' has been successfully updated');
    return res.render('add_edit_project', { errorMessages: 0, title: 'AC scrum vol2', users: users,
        pageName: 'projects', username: req.user.username, toEditProject: toEditProject,
        isUser: req.user.is_user, success: req.flash('success') });
});

// ------------------ endpoint for creating new projects ------------------

/**
 * Only admin can add new projects:
 *
 */
router.get('/create/', middleware.isAllowed, async function(req, res, next) {
    let users = await User.findAllUsers();
    res.render('add_edit_project', { errorMessages: 0, title: 'AC scrum vol2', users: users,
        pageName: 'projects', username: req.user.username,
        isUser: req.user.is_user, success: 0 });
});

router.post('/create/', middleware.isAllowed, async function(req, res, next) {

    let data = req.body;

    try {

        let users = await User.findAllUsers();

        // Create new project
        const createdProject = Projects.build({
            name: data.name,
            description: data.description,
            created_by: req.user.id,
            scrum_master: data.scrum_master,
            product_owner: data.product_owner,
        });

        // Validate project
        if (!await ProjectHelper.isValidProject(createdProject)){
            req.flash(req.flash('error', `Project Name: ${createdProject.name} already in use!`));
            return res.render('add_edit_project', { errorMessages: req.flash('error'),users:users, success: 0,
                title: 'AC scrum vol2', pageName: 'projects',
                username: req.user.username, isUser: req.user.is_user });
        }

        await createdProject.save();

        await ProjectHelper.saveProjectMembers(createdProject, data.members);

        req.flash('success', 'New Projects - ' + createdProject.name + ' has been successfully added');
        res.render('add_edit_project', { success: req.flash('success'),users:users, errorMessages: 0,
            title: 'AC scrum vol2', pageName: 'projects',
            username: req.user.username, isUser: req.user.is_user });
    } catch (e) {
        req.flash('error', 'Error!');
        res.render('add_edit_project', { errorMessages: req.flash('error'),users:[], success: 0,
            title: 'AC scrum vol2', pageName: 'projects',
            username: req.user.username, isUser: req.user.is_user });

    }

});

module.exports = router;