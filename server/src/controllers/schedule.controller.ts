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

        const data = [];
        let activeDayCount = 0;

        // Simple Indian Public Holidays Helper (Fixed for Demo/2026)
        const isIndianHoliday = (d: dayjs.Dayjs) => {
            const dateStr = d.format("MM-DD");
            const year = d.year();

            const holidays = [
                "01-26", // Republic Day
                "08-15", // Independence Day
                "10-02", // Gandhi Jayanti
                "12-25", // Christmas
                "05-01", // Labor Day
            ];

            // 2026 Specific major festival approx dates
            const festival2026 = [
                "03-03", // Holi
                "03-20", // Eid-ul-Fitr
                "08-26", // Raksha Bandhan
                "11-08", // Diwali
            ];

            return holidays.includes(dateStr) || (year === 2026 && festival2026.includes(dateStr));
        };

        for (let day = 1; day <= daysInMonth; day++) {
            const date = start.date(day);
            const dayOfWeek = date.day(); // 0 (Sun) to 6 (Sat)

            // If it's Monday (1) through Saturday (6) AND NOT an Indian Holiday
            if (dayOfWeek >= 1 && dayOfWeek <= 6 && !isIndianHoliday(date)) {
                const topicIndex = activeDayCount % 7;
                data.push({
                    date: date.toDate(),
                    topic: TOPICS[topicIndex],
                    startTime: "09:00",
                    endTime: "18:00",
                    isActive: true
                });
                activeDayCount++;
            }
        }

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
