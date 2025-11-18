import { Sequelize, DataTypes } from "sequelize";
import { sequealize } from "../database.js";

const Professional = sequealize.define('professionals', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    matricula: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    especialidad: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cel: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { timestamps: false });

export { Professional };
