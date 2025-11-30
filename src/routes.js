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
import { loginController } from './Auth/Controllers/loginController.js';
import { verifyTokenController } from './Auth/Controllers/verifyTokenController.js';
import { showProfileController } from './Controllers/General/showProfileController.js';
import { indexUserController } from './Controllers/User/indexUserController.js';
import { createUserController } from './Controllers/User/createUserController.js';
import { showController } from './Controllers/User/showController.js';
import { updateController } from './Controllers/User/updateController.js';
import { deleteUserController } from './Controllers/User/deleteUserController.js';
import { indexPatientController } from './Controllers/Patient/indexPatientController.js';
import { createPatientController } from './Controllers/Patient/createPatientController.js';
import { showPatientController } from './Controllers/Patient/showPatientController.js';
import { updatePatientController } from './Controllers/Patient/updatePatientController.js';
import { indexProfessionalController } from './Controllers/Professional/indexProfessionalController.js';
import { createProfessionalController } from './Controllers/Professional/createProfessionalController.js';
import { showProfessionalController } from './Controllers/Professional/showProfessionalController.js';
import { updateProfessionalController } from './Controllers/Professional/updateProfessionalController.js';
import { createRecetController } from './Controllers/Recet/createRecetController.js';
import { createConsultationController } from './Controllers/Consultation/createConsultationController.js';
import { showConsultationController } from './Controllers/Consultation/showConsultationController.js';
const router = express.Router();

router.post('/api/v1/login', loginController);
router.get('/api/v1/token/verify', verifyTokenController);
router.get('/api/v1/perfil', tokenMiddleware, showProfileController);
//usuarios
router.get('/api/v1/usuarios', tokenMiddleware, indexUserController);
router.post('/api/v1/usuarios', tokenMiddleware, createUserController);
router.get('/api/v1/usuarios/:id', tokenMiddleware, showController);
router.patch('/api/v1/usuarios/:id', tokenMiddleware, updateController);
router.delete('/api/v1/usuarios/:id', tokenMiddleware, deleteUserController);
//pacientes
router.get('/api/v1/pacientes', tokenMiddleware, indexPatientController);
router.post('/api/v1/pacientes', tokenMiddleware, createPatientController);
router.get('/api/v1/pacientes/:id', tokenMiddleware, showPatientController);
router.patch('/api/v1/pacientes/:id', tokenMiddleware, updatePatientController);
//Profesionales
router.get('/api/v1/profesionales', tokenMiddleware, indexProfessionalController);
router.post('/api/v1/profesionales', tokenMiddleware, createProfessionalController);
router.get('/api/v1/profesionales/:id', tokenMiddleware, showProfessionalController);
router.patch('/api/v1/profesionales/:id', tokenMiddleware, updateProfessionalController);
//Consultas
router.post('/api/v1/pacientes/:patientId/consultas', tokenMiddleware, createConsultationController);
router.get('/api/v1/pacientes/:patientId/consultas', tokenMiddleware, showConsultationController);
//Recetas
router.post('/api/v1/consultas/:consultationId/recetas', tokenMiddleware, createRecetController);

export { router }; 