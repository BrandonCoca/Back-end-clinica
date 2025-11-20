import { User } from "../../Models/User.js";
import { PasswordService } from "../Services//PasswordService.js";
import { hash } from "../Services/encryptionService.js";
import jwt from "jsonwebtoken";
import { env } from "../../Shared/env.js";

export const loginController = async (request, response) => {
    const { name, password } = request.body;
    const nameHash = hash(name)
    const user = await User.findOne({ where: { name_hash: nameHash } });
    if (!user) {
        return response.status(401).json({ message: "Credenciales incorrectas" });
    }
    const userExist = await PasswordService.check(password, user.password);
    if (!userExist) {
        return response.status(401).json({ message: "Credenciales incorrectas" });
    }
    await user.update({ ultima_conexion: new Date() });
    const token = jwt.sign({ userId: user.id }, env('JWT_SECRET_KEY'), { expiresIn: '1h' });
    const jsonResponse = { message: 'Usuario logeado exitosamente', data: { token } }
    return response.json(jsonResponse);
};