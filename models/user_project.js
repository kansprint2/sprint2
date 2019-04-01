'use strict';
module.exports = (sequelize, DataTypes) => {
    var UserProject = sequelize.define('UserProject', {
        role: {
            type: DataTypes.INTEGER,
        },
    });

    return UserProject;
};