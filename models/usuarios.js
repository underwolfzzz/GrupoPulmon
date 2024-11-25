const {Sequelize} = require('sequelize');
const database = require('../db');

const Usuarios = database.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cpf: {
        type: Sequelize.INTEGER,
        allowNull: false
    }, 
    nascimento: {
        type: Sequelize.DATE,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    },
})

module.exports = Usuarios;