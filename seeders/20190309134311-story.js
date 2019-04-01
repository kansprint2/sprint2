'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('Stories', [
      {
        name: 'User story 1',
        description: 'This is user story description 1',
        acceptanceCriteria: 'Naredi to i ovo.',
        importance: 'could have',
        is_done: false,
        project_id: 1,
        sprint_id: 1,
      },
      {
        name: 'User story 2',
        description: 'This is user story description 2',
        acceptanceCriteria: 'Naredi to i ovo.',
        importance: 'must have',
        is_done: true,
        project_id: 1,
        sprint_id: 1,
      },
      {
        name: 'User story 3',
        description: 'This is user story description 3',
        acceptanceCriteria: 'Naredi to i ovo.',
        importance: 'should have',
        is_done: false,
        project_id: 1,
        sprint_id: 1,
      },
      {
        name: 'User story 4',
        description: 'This is user story description 4',
        acceptanceCriteria: 'Naredi to i ovo.',
        importance: 'won\'t have this time',
        is_done: false,
        project_id: 1
      },

    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
