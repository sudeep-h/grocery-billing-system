const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/dbConfig');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool
});


sequelize.authenticate()
    .then(() => console.log('Connected to MySQL database successfully!'))
    .catch(err => console.log('Unable to connect to the database:', err));


const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./User')(sequelize, DataTypes); 
// db.Product = require('./Product')(sequelize, DataTypes);
// db.cart = require('./Cart')(sequelize, DataTypes);

module.exports = db;
