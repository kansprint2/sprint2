'use strict';
module.exports = (sequelize, DataTypes) => {
    var Sprint = sequelize.define('Sprint', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        velocity: {
            type: DataTypes.INTEGER,
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
    });


    Sprint.associate = function (models) {
        models.Sprint.belongsTo(models.Project, {
            onDelete: "CASCADE",
            foreignKey: 'project_id',
            as: 'Project'
        });
    };

    return Sprint;
};