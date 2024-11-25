const Sequelize = require('sequelize');
const sequelize = require('../db');  
const Usuarios = require('./usuarios'); 

const Diario = sequelize.define('diario', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    sis: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    dia: {
        type: Sequelize.INTEGER,
        allowNull: false
    }, 
    pul: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    peso: {
        type: Sequelize.INTEGER, // Removido `unique: true`
        allowNull: false
    },
    o2: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    dataHora: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
});

Diario.belongsTo(Usuarios, { 
    constraint: true,
    foreignKey: 'idUsuario' 
});

module.exports = Diario;

