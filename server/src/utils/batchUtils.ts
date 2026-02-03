/**
 * Generates batches for a given month and year
 * Returns batch start and end dates
 */
export function generateBatches(month: number, year: number) {
  const batches = [];
  const firstDay = new Date(year, month - 1, 1);
  
  // Batch 1: Starts on 1st
  const batch1Start = new Date(year, month - 1, 1);
  const batch1End = new Date(year, month - 1, 7);
  batches.push({
    batchNum: 1,
    startDate: batch1Start,
    endDate: batch1End,
  });

  // Gap of 2 days after batch 1 (skip Sunday)
  // Batch 2: Starts on 10th
  const batch2Start = new Date(year, month - 1, 10);
  const batch2End = new Date(year, month - 1, 16);
  batches.push({
    batchNum: 2,
    startDate: batch2Start,
    endDate: batch2End,
  });

  // Gap of 2 days after batch 2 (skip Sunday)
  // Batch 3: Starts on 19th
  const batch3Start = new Date(year, month - 1, 19);
  const batch3End = new Date(year, month - 1, 25);
  batches.push({
    batchNum: 3,
    startDate: batch3Start,
    endDate: batch3End,
  });

  return batches;
}

/**
 * Get all class dates for a batch (excludes Sundays)
 */
export function getClassDatesForBatch(startDate: Date, endDate: Date) {
  const classDates = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    // Skip Sundays (dayOfWeek = 6)
    if (current.getDay() !== 0) {
      classDates.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }

  return classDates;
}

/**
 * Get all topics for a batch
 */
export const TOPICS = [
  'Introduction to Web Development',
  'JavaScript Fundamentals',
  'React Basics',
  'Backend Development',
  'Database Design',
  'API Development',
  'Full Stack Integration',
];

/**
 * Get topic for a specific day in batch (0-6)
 */
export function getTopicForDay(dayIndex: number): string {
  return TOPICS[dayIndex % TOPICS.length];
}
