import { Sequelize, DataTypes } from "sequelize";
import { sequealize } from "../database.js";

const Consultation = sequealize.define('consultations', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    motivo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    professional_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'professionals',
            key: 'id'
        }
    },
    patient_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'patients',
            key: 'id'
        }
    },
    quote_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'quotes',
            key: 'id'
        }
    }
}, {
    timestamps: false,
    freezeTableName: true
});

export { Consultation };
