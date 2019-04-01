'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('UserProjects', [
        {
          user_id: 4,
          project_id:1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 4,
          project_id:2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 5,
          project_id:1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 5,
          project_id:2,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
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
