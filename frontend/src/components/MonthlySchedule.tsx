import React, { useState } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { ChevronLeft, ChevronRight, Clock, Facebook, Instagram, Twitter, MessageCircle } from "lucide-react";

dayjs.extend(isSameOrAfter);

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
    const today = dayjs();
    const [currentMonth, setCurrentMonth] = useState(today.startOf("month"));
    const [selectedMonth, setSelectedMonth] = useState(today.month());

    const startOfMonth = currentMonth.startOf("month");
    const daysInMonth = currentMonth.daysInMonth();
    const startDay = startOfMonth.day();

    const getDayInfo = (day: number) => {
        const date = currentMonth.date(day);
        const isPast = date.isBefore(today.startOf("day"));
        const topicIndex = (day - 1) % 7;

        // Distribution of colors as seen in the original image pattern
        const darkPurpleDays = [2, 4, 12, 14, 22, 25, 29];
        const lightPurpleDays = [1, 3, 5, 7, 8, 11, 15, 16, 17, 18, 23, 24, 26, 28];

        const isDark = darkPurpleDays.includes(day);
        const isLight = lightPurpleDays.includes(day);

        return {
            label: `Day ${topicIndex + 1}`,
            topic: TOPICS[topicIndex],
            bgColor: isDark ? "bg-[#674c7e]" : isLight ? "bg-[#e6e0f3]" : "bg-[#f5f6f7]",
            textColor: isDark ? "text-white" : isLight ? "text-[#7e699f]" : "text-[#9ca3af]",
            isScheduled: isDark || isLight,
            isPast
        };
    };

    const handleMonthChange = (idx: number) => {
        setSelectedMonth(idx);
        setCurrentMonth(dayjs().month(idx).year(currentMonth.year()));
    };

    return (
        <div className="min-h-screen bg-[#fafafa] p-4 md:p-8 font-sans text-slate-800">
            <div className="max-w-[1280px] mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-10 transition-all duration-300">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Select your slots</h1>

                    <div className="flex flex-col items-end w-full md:w-auto">
                        <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">Monthly Schedule</h2>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setCurrentMonth(prev => prev.subtract(1, 'month'))}
                                className="p-1 hover:bg-slate-100 rounded-md transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
                            </button>
                            <span className="text-lg md:text-xl font-medium text-[#c0b4d4]">
                                {currentMonth.format("MMMM YYYY")}
                            </span>
                            <button
                                onClick={() => setCurrentMonth(prev => prev.add(1, 'month'))}
                                className="p-1 hover:bg-slate-100 rounded-md transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Calendar Grid */}
                    <div className="flex-1 overflow-x-auto lg:overflow-visible">
                        <div className="min-w-[500px] lg:min-w-0">
                            <div className="grid grid-cols-7 mb-4">
                                {WEEK_DAYS.map((day) => (
                                    <div key={day} className="text-center text-xs md:text-sm font-medium text-[#c0b4d4]">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1 md:gap-2">
                                {/* Fillers for empty days */}
                                {Array.from({ length: startDay }).map((_, i) => (
                                    <div key={`filler-${i}`} className="h-20 md:h-32 bg-[#f5f6f7] rounded-sm flex items-end justify-center p-2">
                                        <span className="text-slate-400 text-sm">-</span>
                                    </div>
                                ))}

                                {/* Day cells */}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1;
                                    const info = getDayInfo(day);

                                    return (
                                        <div
                                            key={day}
                                            className={`h-20 md:h-32 rounded-sm p-1.5 md:p-3 flex flex-col justify-between transition-all ${info.isPast
                                                    ? "opacity-40 cursor-not-allowed grayscale-[0.2]"
                                                    : "cursor-pointer hover:opacity-90"
                                                } ${info.bgColor}`}
                                        >
                                            {info.isScheduled ? (
                                                <div className="overflow-hidden">
                                                    <div className={`text-[10px] md:text-[12px] font-bold leading-tight truncate ${info.textColor}`}>{info.label}</div>
                                                    <div className={`text-[8px] md:text-[10px] uppercase tracking-wider font-semibold opacity-80 truncate hidden sm:block ${info.textColor}`}>{info.topic}</div>
                                                </div>
                                            ) : <div></div>}

                                            <div className={`text-right text-sm md:text-base font-bold ${info.textColor} opacity-60`}>
                                                {String(day).padStart(2, "0")}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* End fillers */}
                                {Array.from({ length: (7 - (startDay + daysInMonth) % 7) % 7 }).map((_, i) => (
                                    <div key={`end-filler-${i}`} className="h-20 md:h-32 bg-[#f5f6f7] rounded-sm flex items-end justify-end p-2 opacity-50">
                                        <span className="text-slate-400 text-sm">{String(i + 1).padStart(2, '0')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Information Panel */}
                    <div className="w-full lg:w-[380px] flex gap-4">
                        <div className="flex-1 flex flex-col gap-4">
                            {/* Time Selection */}
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-[#f5f5f5] p-3 md:p-4 rounded-lg flex items-center justify-center gap-2 md:gap-3">
                                    <Clock className="w-5 h-5 text-slate-900" />
                                    <span className="font-bold text-slate-900 text-sm md:text-base">09:00 hs</span>
                                </div>
                                <div className="w-px h-10 bg-slate-300"></div>
                                <div className="flex-1 bg-[#f5f5f5] p-3 md:p-4 rounded-lg flex items-center justify-center">
                                    <span className="font-bold text-slate-900 text-sm md:text-base">06:00 hs</span>
                                </div>
                            </div>

                            {/* Topic Detail View */}
                            <div className="bg-[#f5f5f5] p-4 md:p-6 rounded-lg flex-1 min-h-[250px] md:min-h-[300px]">
                                <div className="space-y-3 md:space-y-4">
                                    {TOPICS.map((topic, i) => (
                                        <div key={i} className="flex items-center text-sm md:text-lg">
                                            <span className="font-extrabold text-slate-700 min-w-[60px] md:min-w-[70px]">Day {i + 1}:</span>
                                            <span className="text-slate-500 ml-4 line-clamp-1">{topic}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions & Footer */}
                            <div className="mt-auto space-y-6">
                                <button className="w-full bg-[#674c7e] text-white py-3 md:py-4 rounded-xl text-lg md:text-xl font-bold shadow-md hover:bg-[#5a426e] transition-all">
                                    Submit
                                </button>

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex gap-3">
                                        {[Instagram, Facebook, Twitter, MessageCircle].map((Icon, i) => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors">
                                                <Icon size={16} />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="text-slate-900 font-bold text-xs md:text-sm text-center">
                                        For inquiry : <span className="text-slate-700">+44 123456789</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vertical Month Strip */}
                        <div className="hidden md:flex flex-col bg-[#f5f5f5] rounded-lg overflow-y-auto max-h-[600px] no-scrollbar py-2 border-l border-white shadow-inner shrink-0">
                            {MONTHS.map((month, idx) => (
                                <button
                                    key={month}
                                    onClick={() => handleMonthChange(idx)}
                                    className={`px-3 py-2 text-xs md:text-sm font-semibold transition-all ${selectedMonth === idx
                                            ? "bg-white text-slate-900 shadow-sm border-y border-slate-100"
                                            : "text-slate-400 hover:text-slate-600"
                                        }`}
                                >
                                    {month}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MonthlySchedule;
