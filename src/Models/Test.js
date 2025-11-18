import { Sequelize, DataTypes } from "sequelize";
import { sequealize } from "../database.js";

const Test = sequealize.define('tests', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    doc: {
        type: DataTypes.STRING,
        allowNull: false
    },
    docurl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    patient_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'patients',
            key: 'id'
        }
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

export { Test };
