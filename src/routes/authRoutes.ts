import express from 'express';
import { register, login, requestOTP } from '../controllers/AuthController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../utils/schemas.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/request-otp', authenticate, requestOTP);

export default router;
