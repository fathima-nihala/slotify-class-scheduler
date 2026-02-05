import express, { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { generateBatches, getClassDatesForBatch, getTopicForDay } from '../utils/batchUtils';

const router = express.Router();

// Get all batches for a month
router.get('/batches/:month/:year', async (req: Request, res: Response) => {
  try {
    const { month, year } = req.params as { month: string; year: string };

    const batches = await prisma.batch.findMany({
      where: {
        month: parseInt(month),
        year: parseInt(year),
      },
      include: {
        classes: true,
      },
    });

    res.json(batches);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch batches' });
  }
});

// Get classes for a specific batch
router.get('/batches/:batchId/classes', async (req: Request, res: Response) => {
  try {
    const { batchId } = req.params as { batchId: string };

    const classes = await prisma.class.findMany({
      where: { batchId },
    });

    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// Initialize batches and classes for a month (admin endpoint)
router.post('/batches/init/:month/:year', async (req: Request, res: Response) => {
  try {
    const { month, year } = req.params as { month: string; year: string };
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    // Generate batch data
    const batchDates = generateBatches(monthNum, yearNum);

    const createdBatches = [];

    for (const batchData of batchDates) {
      // Check if batch already exists
      const existing = await prisma.batch.findFirst({
        where: {
          month: monthNum,
          year: yearNum,
          batchNum: batchData.batchNum,
        },
      });

      if (existing) continue;

      // Create batch
      const batch = await prisma.batch.create({
        data: {
          month: monthNum,
          year: yearNum,
          batchNum: batchData.batchNum,
          startDate: batchData.startDate,
          endDate: batchData.endDate,
        },
      });

      // Get class dates (excluding Sundays)
      const classDates = getClassDatesForBatch(batchData.startDate, batchData.endDate);

      // Create classes for each day
      for (let i = 0; i < classDates.length; i++) {
        const classDate = classDates[i];
        const topic = getTopicForDay(i);

        await prisma.class.create({
          data: {
            batchId: batch.id,
            date: classDate,
            dayOfWeek: classDate.getDay(),
            topic,
          },
        });
      }

      createdBatches.push(batch);
    }

    res.json({ message: 'Batches initialized', batches: createdBatches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to initialize batches' });
  }
});

export default router;
