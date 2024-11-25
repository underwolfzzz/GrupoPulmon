const Sequelize = require('sequelize');
const sequelize = require('../db');  
const Usuarios = require('./usuarios'); 

const Eventos = sequelize.define('eventos', {
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
    data: {
        type: Sequelize.DATE,
        allowNull: false
    }, 
    hora: {
        type: Sequelize.TIME,
        allowNull: false
    },
});

Eventos.belongsTo(Usuarios, { 
    constraint: true,
    foreignKey: 'idUsuario' 
});

module.exports = Eventos;


