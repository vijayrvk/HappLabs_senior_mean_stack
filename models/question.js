'use strict';

module.exports = function(sequelize, DataTypes) {

    var question = sequelize.define('question', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        question: {
            type: DataTypes.TEXT
        },
        category: {
            type: DataTypes.STRING
        },
        value: {
            type:  DataTypes.JSON
        }
    });

    return question;
};