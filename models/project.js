'use strict';
module.exports = (sequelize, DataTypes) => {
    var Project = sequelize.define('Project', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'Project name already exists'
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,

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


    Project.associate = function (models) {
        models.Project.belongsTo(models.User, {
            onDelete: "CASCADE",
            foreignKey: 'created_by',
            as: 'CreatedBy'
        });
        models.Project.belongsTo(models.User, {
            onDelete: "CASCADE",
            foreignKey: 'scrum_master',
            as: 'ScrumMaster'
        });
        models.Project.belongsTo(models.User, {
            onDelete: "CASCADE",
            foreignKey: 'product_owner',
            as: 'ProductOwner'
        });

        models.Project.belongsToMany(models.User, {
            through: models.UserProject,
            foreignKey: 'project_id',
            as: 'ProjectMembers'
        });
    };

    return Project;
};