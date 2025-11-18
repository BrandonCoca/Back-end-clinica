import { Sequelize, DataTypes } from "sequelize";
import { sequealize } from "../database.js";
import { encrypt, decrypt, hash } from "../Auth/Services/encryptionService.js";

const Patient = sequealize.define('patients', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: 'nombre',
        set(value) {
            this.setDataValue('nombre', encrypt(value));
            this.setDataValue('nombre_hash', hash(value));
        },
        get() {
            const encrypted = this.getDataValue('nombre');
            const decrypted = decrypt(encrypted);
            return decrypted;
        }
    },
    nombre_hash: {
        type: DataTypes.CHAR(64),
        allowNull: false,
        field: 'nombre_hash',
    },
    ci: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: 'ci',
        set(value) {
            this.setDataValue('ci', encrypt(value));
            this.setDataValue('ci_hash', hash(value));
        },
        get() {
            const encrypted = this.getDataValue('ci');
            const decrypted = decrypt(encrypted);
            return decrypted;
        }
    },
    ci_hash: {
        type: DataTypes.CHAR(64),
        allowNull: false,
        field: 'ci_hash',
        unique: true
    },
    fecha_nac: {
        type: DataTypes.DATE,
        allowNull: false
    },
    genero: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    cel: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, { timestamps: false });

export { Patient };
