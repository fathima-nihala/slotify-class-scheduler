import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import dayjs from 'dayjs';

export const getSchedules = async (req: Request, res: Response) => {
    try {
        const { month, year } = req.query;

        const startOfMonth = dayjs().year(Number(year)).month(Number(month)).startOf('month').toDate();
        const endOfMonth = dayjs().year(Number(year)).month(Number(month)).endOf('month').toDate();

        const schedules = await prisma.schedule.findMany({
            where: {
                date: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
                isActive: true,
            },
            orderBy: {
                date: 'asc',
            },
            include: {
                _count: {
                    select: { bookings: true }
                }
            }
        });

        res.json(schedules);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch schedules' });
    }
};

export const createSchedule = async (req: Request, res: Response) => {
    try {
        const { date, topic, startTime, endTime } = req.body;

        const schedule = await prisma.schedule.create({
            data: {
                date: new Date(date),
                topic,
                startTime,
                endTime,
            },
        });

        res.status(201).json(schedule);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create schedule' });
    }
};

// Seeder function to populate slots for a month
export const seedMonthlySchedules = async (req: Request, res: Response) => {
    try {
        const { month, year } = req.body; // 0-indexed month
        const start = dayjs().year(year).month(month).startOf('month');
        const daysInMonth = start.daysInMonth();

        const TOPICS = [
            "Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5", "Topic 6", "Topic 7"
        ];

        // Distribution of slots as per pattern
        const scheduleDays = [1, 2, 3, 4, 5, 7, 8, 11, 12, 14, 15, 16, 17, 18, 22, 23, 24, 25, 26, 28, 29];

        const data = scheduleDays.map(day => {
            const date = start.date(day);
            const topicIndex = (day - 1) % 7;
            return {
                date: date.toDate(),
                topic: TOPICS[topicIndex],
                startTime: "09:00",
                endTime: "18:00",
                isActive: true
            };
        });

        const result = await prisma.schedule.createMany({
            data,
            skipDuplicates: true
        });

        res.json({ message: `Seeded ${result.count} schedules` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to seed schedules' });
    }
};
