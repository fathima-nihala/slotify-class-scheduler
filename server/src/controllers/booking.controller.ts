import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const createBookings = async (req: Request, res: Response) => {
    try {
        const { scheduleIds, userId } = req.body;

        if (!scheduleIds || !Array.isArray(scheduleIds) || scheduleIds.length === 0) {
            res.status(400).json({ error: 'At least one schedule must be selected' });
            return;
        }

        // Create bookings in a transaction
        const bookings = await prisma.$transaction(
            scheduleIds.map(id => prisma.booking.create({
                data: {
                    userId,
                    scheduleId: id
                }
            }))
        );

        res.status(201).json(bookings);
    } catch (error: any) {
        if (error.code === 'P2002') {
            res.status(400).json({ error: 'One or more slots already booked by this user' });
            return;
        }
        res.status(500).json({ error: 'Failed to create bookings' });
    }
};

export const getUserBookings = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId as string;

        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: {
                schedule: true
            },
            orderBy: {
                schedule: {
                    date: 'asc'
                }
            }
        });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user bookings' });
    }
};

export const deleteBooking = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await prisma.booking.delete({
            where: { id }
        });
        res.json({ message: 'Booking deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete booking' });
    }
};
