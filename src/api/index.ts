import express from 'express';
import tasks from './tasks';

const router = express.Router();
router.use('/task', tasks);

export default router;
