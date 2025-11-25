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
Professional.paginate = async (records, page) => {
    const profesionals = await Professional.findAll({
        offset: (page - 1) * records,
        limit: records,
        order: [['nombre', 'ASC']],
    });
    const lastPage = Math.ceil((await Professional.count()) / records);
    return {
        data: profesionals,
        meta: {
            current: page,
            records: records,
            next: (lastPage >= page + 1) ? page + 1 : null,
            last: lastPage
        }
    }
}
export { Professional };
