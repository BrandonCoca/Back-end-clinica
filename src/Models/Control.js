import { Sequelize, DataTypes } from "sequelize";
import { sequealize } from "../database.js";

const Control = sequealize.define('controls', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
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

export { Control };
