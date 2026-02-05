import express, { Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = express.Router();

// Get user bookings
router.get('/user/:userId/bookings', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params as { userId: string };

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        class: {
          include: {
            batch: true,
          },
        },
      },
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Create a new booking
router.post('/bookings', async (req: Request, res: Response) => {
  try {
    const { userId, classId } = req.body;

    // Check if booking already exists
    const existing = await prisma.booking.findUnique({
      where: {
        userId_classId: {
          userId,
          classId,
        },
      },
    });

    if (existing) {
      res.status(400).json({ error: 'Booking already exists' });
      return;
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        classId,
        status: 'PENDING',
      },
      include: {
        class: {
          include: {
            batch: true,
          },
        },
      },
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Delete a booking
router.delete('/bookings/:bookingId', async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params as { bookingId: string };

    await prisma.booking.delete({
      where: { id: bookingId },
    });

    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// Confirm booking (submit)
router.patch('/bookings/:bookingId/confirm', async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params as { bookingId: string };

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
      include: {
        class: {
          include: {
            batch: true,
          },
        },
      },
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to confirm booking' });
  }
});

export default router;
