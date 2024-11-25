const Sequelize = require('sequelize');
const sequelize = require('../db');  
const Usuarios = require('./usuarios'); 

const Remedios = sequelize.define('remedios', {
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
    quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false
    }, 
    tipo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    datainicio: {
        type: Sequelize.DATE, 
        allowNull: false
    },
    datatermino: {
        type: Sequelize.DATE,
        allowNull: false
    },
    intervalo: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    descricao: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Relacionamento: cada remédio pertence a um usuário
Remedios.belongsTo(Usuarios, { 
    constraint: true,
    foreignKey: 'idUsuario',
    onDelete: 'CASCADE'  // Para garantir que os remédios sejam excluídos se o usuário for removido
});

module.exports = Remedios;
