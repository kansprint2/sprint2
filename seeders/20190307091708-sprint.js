'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    var endDate = new Date();
    var startDate = new Date();
    var numberOfDaysToAdd = 6;
    endDate.setDate(endDate.getDate() + numberOfDaysToAdd);
    startDate.setDate(startDate.getDate() - numberOfDaysToAdd);
    return queryInterface.bulkInsert('Sprints', [
      {
        startDate: startDate,
        endDate: new Date(),
        velocity: 2,
        project_id: 1,
      },
      {
        startDate: new Date(),
        endDate: endDate,
        velocity: 6,
        project_id: 2,
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
