'use strict';

module.exports = function(sequelize, DataTypes) {

    var answer = sequelize.define('answer', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        answer: {
            type: DataTypes.STRING
        }
    }, {
        classMethods: {
            associate: function(models) {
                answer.belongsTo(models.user, { foreignKey: 'userId' });
                answer.belongsTo(models.question, { foreignKey: 'questionId' });
            }
        }
    });

    return answer;
};