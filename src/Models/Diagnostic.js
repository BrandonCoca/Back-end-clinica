import { Sequelize, DataTypes } from "sequelize";
import { sequealize } from "../database.js";

const Diagnostic = sequealize.define('diagnostics', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    codigo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción del código CIE-10'
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

export { Diagnostic };
