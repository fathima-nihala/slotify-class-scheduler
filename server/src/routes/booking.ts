import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import * as bookingController from '../controllers/booking.controller';

const router = express.Router();

router.post('/bookings', asyncHandler(bookingController.createBookings));
router.get('/bookings/user/:userId', asyncHandler(bookingController.getUserBookings));
router.delete('/bookings/:id', asyncHandler(bookingController.deleteBooking));

export default router;
