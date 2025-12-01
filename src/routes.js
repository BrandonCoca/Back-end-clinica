import express from 'express';
import { tokenMiddleware } from './Auth/Middlewares/tokenMiddleware.js';
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
import { showRecetController } from './Controllers/Recet/showRecetController.js';
import { createControlController } from './Controllers/Control/createControlController.js';
import { showControlController } from './Controllers/Control/showControlController.js';
import { searchCIE10ByTerm } from './Controllers/Diagnostic/searchCIE10Controller.js';
import { createDiagnosticController, listDiagnosticsController } from './Controllers/Diagnostic/diagnosticController.js';
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
router.get('/api/v1/consultas/:consultationId/recetas', tokenMiddleware, showRecetController);
//Control
router.post('/api/v1/consultas/:consultationId/controles', tokenMiddleware, createControlController);
router.get('/api/v1/consultas/:consultationId/controles', tokenMiddleware, showControlController);
//Diagnósticos (solo crear y listar)
router.post('/api/v1/consultas/:consultationId/diagnosticos', tokenMiddleware, createDiagnosticController);
router.get('/api/v1/consultas/:consultationId/diagnosticos', tokenMiddleware, listDiagnosticsController);
//CIE-10 (solo búsqueda por descripción/nombre)
router.get('/api/v1/cie10/search', tokenMiddleware, searchCIE10ByTerm);

export { router }; 