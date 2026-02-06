import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const createBookings = async (req: Request, res: Response) => {
    try {
        const { bookings: bookingData, userId } = req.body;

        if (!bookingData || !Array.isArray(bookingData) || bookingData.length === 0) {
            res.status(400).json({ error: 'No slots provided for booking' });
            return;
        }

        // Ensure user exists
        const user = await prisma.user.upsert({
            where: { id: userId },
            update: {},
            create: {
                id: userId,
                email: `${userId}@example.com`,
                name: userId,
                password: 'placeholder-password'
            }
        });

        // Create bookings with user-specific data in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const createdBookings = [];

            for (const item of bookingData) {
                // Create the booking with its own topic and times
                const booking = await tx.booking.create({
                    data: {
                        userId: user.id,
                        scheduleId: item.scheduleId,
                        topic: item.topic,
                        startTime: item.startTime,
                        endTime: item.endTime
                    }
                });
                createdBookings.push(booking);
            }

            return createdBookings;
        });

        res.status(201).json(result);
    } catch (error: any) {
        console.error("CREATE BOOKINGS ERROR:", error);
        if (error.code === 'P2002') {
            res.status(400).json({ error: 'One or more slots already booked by this user' });
            return;
        }
        res.status(500).json({ error: 'Failed to create bookings', details: error.message });
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
