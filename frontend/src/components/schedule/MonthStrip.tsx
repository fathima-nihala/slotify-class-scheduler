import React from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface MonthStripProps {
    selectedMonth: number;
    onMonthChange: (idx: number) => void;
}

const MonthStrip: React.FC<MonthStripProps> = ({ selectedMonth, onMonthChange }) => {
    return (
        <div className="hidden md:flex flex-col bg-[#f5f5f5] rounded-lg overflow-y-auto max-h-[600px] no-scrollbar py-2 border-l border-white shadow-inner shrink-0">
            {MONTHS.map((month, idx) => (
                <button
                    key={month}
                    onClick={() => onMonthChange(idx)}
                    className={`px-3 py-2 text-sm font-semibold transition-all cursor-pointer ${selectedMonth === idx
                        ? "bg-white text-slate-900 shadow-sm border-y border-slate-100"
                        : "text-slate-400 hover:text-slate-600"
                        }`}
                >
                    {month}
                </button>
            ))}
        </div>
    );
};

export default MonthStrip;
