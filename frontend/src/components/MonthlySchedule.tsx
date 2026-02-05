import React, { useState } from "react";
import dayjs from "dayjs";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TOPICS = [
    "Topic 1",
    "Topic 2",
    "Topic 3",
    "Topic 4",
    "Topic 5",
    "Topic 6",
    "Topic 7",
];

const MonthlySchedule: React.FC = () => {
    console.log("MonthlySchedule rendering");
    const [currentMonth, setCurrentMonth] = useState(dayjs());

    const startOfMonth = currentMonth.startOf("month");
    const daysInMonth = currentMonth.daysInMonth();
    const startDay = startOfMonth.day();

    const calendarCells = Array.from({
        length: startDay + daysInMonth,
    });

    const getTopicForDay = (day: number) => {
        const index = (day - 1) % 7;
        return {
            label: `Day ${index + 1}`,
            topic: TOPICS[index],
            highlight: index % 2 === 1,
        };
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
                {/* Calendar */}
                <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-4">Select your slots</h2>

                    <div className="grid grid-cols-7 mb-2 text-sm text-gray-500">
                        {WEEK_DAYS.map((d) => (
                            <div key={d} className="text-center">
                                {d}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {calendarCells.map((_, i) => {
                            const day = i - startDay + 1;
                            if (day <= 0 || day > daysInMonth) {
                                return (
                                    <div
                                        key={i}
                                        className="h-20 rounded bg-gray-100"
                                    />
                                );
                            }

                            const { label, topic, highlight } = getTopicForDay(day);

                            return (
                                <div
                                    key={i}
                                    className={clsx(
                                        "h-20 p-2 rounded border cursor-pointer flex flex-col justify-between",
                                        highlight
                                            ? "bg-violet-700 text-white"
                                            : "bg-violet-100 text-violet-700"
                                    )}
                                >
                                    <div>
                                        <div className="text-xs font-semibold">{label}</div>
                                        <div className="text-xs">{topic}</div>
                                    </div>
                                    <div className="text-right text-sm font-bold">
                                        {String(day).padStart(2, "0")}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-80 flex flex-col gap-4">
                    {/* Month Header */}
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">
                            {currentMonth.format("MMMM YYYY")}
                        </h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentMonth((m) => m.subtract(1, "month"))}
                            >
                                <ChevronLeft />
                            </button>
                            <button
                                onClick={() => setCurrentMonth((m) => m.add(1, "month"))}
                            >
                                <ChevronRight />
                            </button>
                        </div>
                    </div>

                    {/* Time Slot */}
                    <div className="flex items-center justify-between bg-gray-100 p-3 rounded">
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span className="text-sm">09:00 hrs</span>
                        </div>
                        <span className="font-semibold">06:00 hrs</span>
                    </div>

                    {/* Topic List */}
                    <div className="bg-gray-100 rounded p-4 space-y-2 text-sm">
                        {TOPICS.map((topic, i) => (
                            <div key={i} className="flex gap-2">
                                <span className="font-semibold">Day {i + 1}:</span>
                                <span>{topic}</span>
                            </div>
                        ))}
                    </div>

                    {/* Submit */}
                    <button className="mt-auto bg-violet-700 text-white py-3 rounded font-semibold">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MonthlySchedule;
