'use strict';

var q = require('q');
var bcrypt = require('bcrypt');


var hashPassword = function (raw) {
    return bcrypt.hashSync(raw, 10);
};


module.exports = (sequelize, DataTypes) => {

    var User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'Username address already in use!'
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        surname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            }
        },
        is_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
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

    User.associate = function (models) {
        models.User.belongsToMany(models.Project, {
            through: models.UserProject,
            foreignKey: 'user_id',
        });
    };

    User.findAllUsers = function () {
        console.log('User.findAll invoked');
        var deferred = q.defer();

        User.findAll().then(function (users) {
            console.log('User.findAll successfully executed');
            deferred.resolve(users);
        }, function (err) {
            console.log('User.findAll ERROR', err);
            deferred.reject(err);
        });

        return deferred.promise;
    };

    User.findByUsername = function (username) {
        console.log('User.findByUsername invoked');
        var deferred = q.defer();

        if (!username) throw "Missing params";

        User.findOne({ where: { username: username } }).then(function (user) {
            console.log('User.findByUsername successfully executed');
            deferred.resolve(user);
        }, function (err) {
            console.log('User.findByUsername ERROR', err);
            deferred.reject(err);
        });

        return deferred.promise;
    };

    User.findById = function (id) {
        console.log('User.findById invoked');
        var deferred = q.defer();

        if (!id) throw "Missing params";

        User.findOne({ where: { id: id } }).then(function (data) {
            console.log('User.findById successfully executed');
            deferred.resolve(data);
        }, function (err) {
            console.log('User.findById ERROR', err);
            deferred.reject(err);
        });

        return deferred.promise;
    };

    User.save = function (userObject) {
        console.log('User.save invoked');
        var deferred = q.defer();

        if (!userObject) throw "Missing params";
        if (userObject.password.length < 8) throw "Missing params";

        userObject.password = hashPassword(userObject.password);

        User.create(userObject).then(function (createdUser) {
            console.log('User.save successfully executed');
            deferred.resolve(createdUser);
        }, function (err) {
            console.log('User.save ERROR', err);
            deferred.reject(err);
        });

        return deferred.promise;
    };

    User.comparePassword = function (p1, p2) {
        return bcrypt.compareSync(p1, p2);
    };

    User.login = function (username, password) {
        console.log('User.login invoked');
        var deferred = q.defer();

        if (!username || !password) throw "Missing params";

        User.findOne({ where: { username: username } }).then(function (user) {
            console.log('User.login successfully executed');

            return User.comparePassword(password, user.password) ? deferred.resolve(user) : deferred.reject(false);
        }, function (err) {
            console.log('User.login ERROR', err);
            deferred.reject(null);
        });

        return deferred.promise;
    };
    return User;
};