const {Sequelize} = require('sequelize');
const sequelize = new Sequelize('pulmon0','root','', {
    host: 'localhost',
    dialect: 'mysql',
  
})

module.exports = sequelize;