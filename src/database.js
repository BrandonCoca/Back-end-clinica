import { Sequelize } from "sequelize";

const sequealize = new Sequelize('users_backend_app', 'admin', '123456789', {
    host: 'localhost',
    dialect: 'mysql'
});

export { sequealize };