import { Sequelize, DataTypes } from "sequelize";
import { sequealize } from "../database.js";
import { encrypt, decrypt, hash } from "../Auth/Services/encryptionService.js";

const User = sequealize.define('users', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: 'name',
        set(value) {
            this.setDataValue('name', encrypt(value));
            this.setDataValue('name_hash', hash(value));
        },
        get() {
            const encrypted = this.getDataValue('name');
            const decrypted = decrypt(encrypted);
            return decrypted;
        }
    },
    name_hash: {
        type: DataTypes.CHAR(64),
        allowNull: false,
        field: 'name_hash',
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol: {
        type: DataTypes.ENUM('admin', 'recepcionista', 'doctor', 'enfermera'),
        allowNull: false
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    ultima_conexion: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
}, { timestamps: false });
User.paginate = async (records, page) => {
    const users = await User.findAll({
        limit: records,
        offset: records * (page - 1),
        order: [['estado', 'DESC']],
    });
    const lastPage = Math.ceil((await User.count()) / records);
    return {
        data: users,
        meta: {
            current: page,
            records: records,
            next: (lastPage >= page + 1) ? page + 1 : null,
            last: lastPage
        }
    }
}
export { User };
