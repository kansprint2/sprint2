'use strict';
module.exports = (sequelize, DataTypes) => {
    var Task = sequelize.define('Task', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        timeEstimate: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: {
                    args: [0],
                    msg: 'Cant be a negative value.'
                }
            }
        },
        isAccepted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        createdAt: {
            field: 'createdat',
            type: DataTypes.DATE,
        },
        updatedAt: {
            field: 'updatedat',
            type: DataTypes.DATE,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        indexes: [
            {
                unique: {
                    args: true,
                    msg: 'Task name already exists!'
                },
                fields: ['name', 'story_id']
            }
        ]
    }

    );

    Task.associate = function (models) {
        models.Task.belongsTo(models.Stories, {
            onDelete: "CASCADE",
            foreignKey: 'story_id'
        });
        models.Task.belongsTo(models.User, {
            onDelete: "CASCADE",
            foreignKey: 'user_id',
            as: 'User'
        });
    };

    return Task;
};