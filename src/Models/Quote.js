import { Sequelize, DataTypes } from "sequelize";
import { sequealize } from "../database.js";

const Quote = sequealize.define('quotes', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    cel: {
        type: DataTypes.STRING,
        allowNull: false,
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
    }
}, { timestamps: false });

export { Quote };
