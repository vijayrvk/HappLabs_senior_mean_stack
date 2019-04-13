'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert({tableName:'users',schema:'public'}, [{
      id: '8ec7f804-c01f-40f9-b989-a61ecb42aa6b',
      firstName: 'Admin',
      lastName: 'User',
      email: 'adminuser@gmail.com',
      contactNo: '8956892345',
      password: '$2a$10$T/nD4jIzph598R1yTvlLW.LGbWYhVuLtKDHBRQwa4JVgh4vk4OH7i',
      userType: 'Admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }

], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
