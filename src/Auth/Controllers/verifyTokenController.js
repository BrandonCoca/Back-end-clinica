import { TokenService } from "../Services/TokenService.js";

export const verifyTokenController = (request, response) => {
    const token = request.headers.authorization;
    if (TokenService.isValid(token)) {
        return response.json({
            message: "Token valido",
            data: {
                response: true
            }
        });
    }
    return response.json({
        message: "Token invalido",
        data: {
            response: false
        }
    });
}