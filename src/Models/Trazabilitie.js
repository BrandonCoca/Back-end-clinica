import { Sequelize, DataTypes } from "sequelize";
import { sequealize } from "../database.js";

const Trazabilitie = sequealize.define('trazabilities', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    usuario: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    accion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    entidad: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    entidad_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    dispositivo: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, { timestamps: false });

export { Trazabilitie };
