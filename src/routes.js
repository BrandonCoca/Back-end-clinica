import express from 'express';
import { tokenMiddleware } from './Auth/Middlewares/tokenMiddleware.js';
import { Consultation } from './Models/Consultation.js';
import { Diagnostic } from './Models/Diagnostic.js';
import { Observation } from './Models/Control.js';
import { Patient } from './Models/Patient.js';
import { Professional } from './Models/Professional.js';
import { Quote } from './Models/Quote.js';
import { Recet } from './Models/Recet.js';
import { Test } from './Models/Test.js';
import { Trazabilitie } from './Models/Trazabilitie.js';
import { indexUserController } from './Controllers/User/indexUserController.js';
import { createUserController } from './Controllers/User/createUserController.js';
import { loginController } from './Auth/Controllers/loginController.js';
import { verifyTokenController } from './Auth/Controllers/verifyTokenController.js';

const router = express.Router();

router.post('/api/v1/login', loginController);
router.get('/api/v1/token/verify', verifyTokenController);
router.get('/api/v1/usuarios', tokenMiddleware, indexUserController);
router.post('/api/v1/usuarios', tokenMiddleware, createUserController);

export { router }; 