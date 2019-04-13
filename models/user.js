'use strict';

module.exports = function(sequelize, DataTypes) {

    var user = sequelize.define('user', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        contactNo: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        userType: {
            type: DataTypes.STRING(30)
        }
    });

    return user;
};