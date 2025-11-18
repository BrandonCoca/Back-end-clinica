import { Sequelize, DataTypes } from "sequelize";
import { sequealize } from "../database.js";

const Recet = sequealize.define('recets', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    medicamento: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dosis: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    consultation_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'consultations',
            key: 'id'
        }
    }
}, { timestamps: false });

export { Recet };
