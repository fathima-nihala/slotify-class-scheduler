import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import * as scheduleController from '../controllers/schedule.controller';

const router = express.Router();

router.get('/schedules', asyncHandler(scheduleController.getSchedules));
router.post('/schedules', asyncHandler(scheduleController.createSchedule));
router.post('/schedules/seed', asyncHandler(scheduleController.seedMonthlySchedules));

export default router;
