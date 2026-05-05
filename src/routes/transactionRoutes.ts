import express from 'express';
import { deposit, withdraw, transfer, getHistory } from '../controllers/TransactionController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { depositSchema, withdrawSchema, transferSchema } from '../utils/schemas.js';

const router = express.Router();

router.use(authenticate);

router.post('/deposit', validate(depositSchema), deposit);
router.post('/withdraw', validate(withdrawSchema), withdraw);
router.post('/transfer', validate(transferSchema), transfer);
router.get('/history/:accountId', getHistory);

export default router;
