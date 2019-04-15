const models = require('../models');

const Stories = models.Stories;
const Task = models.Task;
var sequelize = require('sequelize')

async function isValidName(userStory) {
    // Check if there is another story with same name, case insensitive
    let existing = await Stories.findAll({
        where: {
            name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), userStory.name.toLowerCase())
        }
    });
    if (existing.length === 0){
        return true;
    } else {
        // If saving same object - it is ok.
        return existing[0].id === userStory.id;
    }

}

async function listStories(projectId) {
    return await Stories.findAll( {
        where: {
            project_id: projectId,
        },
        include: [Task]
    })
}

async function getStory(storyID) {
    return await Stories.findOne( {
        where: {
            id: storyID,
        }
    });
}


module.exports = {
    listStories,
    getStory,
    isValidName
};