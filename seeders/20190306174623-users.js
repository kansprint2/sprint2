'use strict';

var bcrypt = require('bcrypt');
module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('Users', [

      {
        username: 'admin',
        password: bcrypt.hashSync('password', 10),
        name: 'Ana',
        surname: 'Administrator',
        email: 'ana@student.fri.uni-lj.si',
        is_user: 0
      },
      {
        username: 'berta',
        password: bcrypt.hashSync('password', 10),
        name: 'Bertica',
        surname: 'Novak',
        email: 'berta.user@student.fri.uni-lj.si',
        is_user: 0,

      },
      {
        username: 'cilka',
        password: bcrypt.hashSync('password', 10),
        name: 'Cilka',
        surname: 'Hrovat',
        email: 'cilka.user@student.fri.uni-lj.si',
        is_user: 1,
      },
      {
        username: 'danijel',
        password: bcrypt.hashSync('password', 10),
        name: 'Deni',
        surname: 'Kovačič',
        email: 'deni.admin@student.fri.uni-lj.si',
        is_user: 1,
      },
      {
        username: 'edo',
        password: bcrypt.hashSync('password', 10),
        name: 'Edi',
        surname: 'Zupančič',
        email: 'edi.user@student.fri.uni-lj.si',
        is_user: 1,
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
