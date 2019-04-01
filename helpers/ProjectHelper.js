var models = require('../models');
var Project = models.Project;
var UserProject = models.UserProject;
var User = models.User;
var sequelize = require('sequelize');

const PROJECT_INCLUDED_FIELDS = [
    {
        model: models.User,
        as: 'ProductOwner',
        attributes: ['name', 'id'],
    },
    {
        model: models.User,
        as: 'ScrumMaster',
        attributes: ['name', 'id'],
    },
    {
        model: models.User,
        as: 'ProjectMembers',
        attributes: ['name','id'],
    },

];

async function getProject(pid) {
    // Solved with selection of assigned projects and then use those ids in query
    return await Project.findOne({
        include: PROJECT_INCLUDED_FIELDS,
        where: {
            [models.Sequelize.Op.or]: [
                {id: pid}
            ]
        },
    });
}


async function getMyProjects(uid) {
    var assignedProjectsIds = await UserProject.findAll({
        where: {
            user_id: uid,
        }
    }).map( (row) => {return row.project_id});

    // Solved with selection of assigned projects and then use those ids in query
    return await Project.findAll({
        include: PROJECT_INCLUDED_FIELDS,
        where: {
            [models.Sequelize.Op.or]: [
                {scrum_master: uid},
                {product_owner: uid},
                {id: assignedProjectsIds}
            ]
        },
    });
}

async function getSMProjects(sm_uid) {
    return await Project.findAll({
        include: PROJECT_INCLUDED_FIELDS,
        where: {
            [models.Sequelize.Op.or]: [
                {scrum_master: sm_uid},
            ]
        },
    });
}

async function getAllowedProjects(uid) {
    let user = await User.findById(uid);
    if (user.is_user) {
        // Only if user is assigned to this project can see it
        return await getMyProjects(uid)
    } else {
        // User is admin, he can see all projects
        return await Project.findAll({
            include: PROJECT_INCLUDED_FIELDS
        })
    }
}


async function isValidProject(project) {
    // Check if there is another project with same name, ignore case
    let existing = await Project.findAll({
        where: {
            name:  sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), project.name.toLowerCase())
        }
    });

    if (existing.length == 0){
        return true;
    } else {
        // If saving same object - it is ok.
        return existing[0].id == project.id;
    }

}

async function saveProjectMembers(project, memberList) {

    let memberIdsArray = [];

    // Check if passed memberList is array or just one value
    if (Array.isArray(memberList)){
        memberIdsArray = memberIdsArray.concat(memberList);
    } else {
        memberIdsArray.push(memberList)
    }

    // Check if product owner and scrum masters already present in member list
    // Add them if they do not exist
    if (!memberList.includes(project.scrum_master)){
        memberIdsArray.push(project.scrum_master.toString())
    }
    if (!memberList.includes(project.product_owner)){
        memberIdsArray.push(project.product_owner.toString())
    }

    // Make unique array - do not add same user twice
    memberIdsArray = Array.from(new Set(memberIdsArray))

    let members = [];

    for (let uid of memberIdsArray){
        members.push({
            role:1,
            project_id: project.id,
            user_id: uid,
        })
    }

    // Link new members
    await UserProject.bulkCreate(members);
}

async function getProjectToEdit(projectId) {
    let toEditProject = await Project.findOne({
        where: {
            id: projectId,
        },
        include: {
            model: User,
            as: 'ProjectMembers',
            attributes: ['id'],
        }
    });
    if (toEditProject) {
        // Covert project members to include only array of user ids
        toEditProject.ProjectMembers = toEditProject.ProjectMembers.map( (member) => {return member.id});

    }

    return toEditProject;
}

// OPTIMISE THOSE
async function isAdmin(req, res, next) {
    var user = req.user;

    if (req.isAuthenticated() && user && !user.isUser) {
        return next();
    } else {
        console.log('isAllowed admin MIDDLEWARE SAYS:', false);
        res.redirect('/');
    }
}

async function isPM(req, res, next) {
    var user = req.user;
    if (req.params.id) {
        // Check for permissions
        let toEditProject = await getProjectToEdit(req.params.id);
        let pm = user.id === toEditProject.product_owner;
        if (req.isAuthenticated() && user && pm) {
            return next();
        } else {
            console.log('isAllowed pm MIDDLEWARE SAYS:', false);
            res.redirect('/');
        }
    } else {
        // No info allow
        return next();
    }
}

async function isSMorAdmin(req, res, next) {

    if (!req.isAuthenticated()) {
        console.log('isSMorAdmin not logined');
        res.redirect('/');
    }

    var user = await User.findById(req.user.id);
    if (!user) {
        console.log('isSMorAdmin no user info MIDDLEWARE SAYS:', false);
        res.redirect('/');
        return;
    }

    if (req.params.id) {
        // Check for permissions
        let toEditProject = await getProjectToEdit(req.params.id);
        let sm = user.id === toEditProject.scrum_master;

        if (req.isAuthenticated() && user && (sm || !user.is_user)) {
            return next();
        } else {
            console.log('isSMorAdmin scrum master || admin MIDDLEWARE SAYS:', false);
            res.redirect('/');
        }
    } else {
        // No info allow
        return next();
    }
}

async function isSMorPM(req, res, next) {

    if (!req.isAuthenticated()) {
        console.log('isSMorPM not logined');
        res.redirect('/');
    }

    var user = await User.findById(req.user.id);
    if (!user) {
        console.log('isSMorPM no user info MIDDLEWARE SAYS:', false);
        res.redirect('/');
        return;
    }

    if (req.params.id) {
        // Check for permissions
        let toEditProject = await getProjectToEdit(req.params.id);
        let sm = user.id === toEditProject.scrum_master;
        let pm = user.id === toEditProject.product_owner;

        if (req.isAuthenticated() && user && (sm || pm)) {
            return next();
        } else {
            console.log('isSMorPM scrum master || admin MIDDLEWARE SAYS:', false);
            res.redirect('/');
        }
    } else {
        // No info allow
        return next();
    }
}

async function canAccessProject(req, res, next) {
    let user = req.user;
    let toCheckProject = await getProjectToEdit(req.params.id);
    if (!toCheckProject || !user) {
        console.log(`No project or user info user: ${user} proj: ${toCheckProject}`);
        res.redirect('/');
        return;
    }
    let allowedProjects =  await getAllowedProjects(user.id);
    let isAllowed = allowedProjects.find( p => p.id === toCheckProject.id);
    if (req.isAuthenticated() && isAllowed) {
        return next();
    } else {
        console.log('canAccessProject project MIDDLEWARE SAYS:', false);
        res.redirect('/');
    }
}

module.exports = {
    isValidProject,
    saveProjectMembers,
    getProjectToEdit,
    isPM,
    isAdmin,
    isSMorAdmin,
    isSMorPM,
    getAllowedProjects,
    getMyProjects,
    canAccessProject,
    getProject,
    getSMProjects,
};