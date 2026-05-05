import express from 'express';
import { createAccount, getMyAccounts, getAccountDetails } from '../controllers/AccountController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createAccountSchema } from '../utils/schemas.js';

const router = express.Router();

router.use(authenticate);

router.post('/', validate(createAccountSchema), createAccount);
router.get('/', getMyAccounts);
router.get('/:accountNumber', getAccountDetails);

export default router;
