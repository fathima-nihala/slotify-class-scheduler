import React from "react";
import { Plus } from "lucide-react";

interface DayCellProps {
    day: number | string;
    isFiller?: boolean;
    isPast?: boolean;
    isScheduled?: boolean;
    label?: string;
    topic?: string;
    bgColor: string;
    textColor: string;
    onClick?: () => void;
    isSelected?: boolean;
}

const DayCell: React.FC<DayCellProps> = ({
    day,
    isFiller,
    isPast,
    isScheduled,
    label,
    topic,
    bgColor,
    textColor,
    onClick,
    isSelected
}) => {
    // Determine the state for visual feedback
    const isActive = isScheduled && !isFiller;
    const isClickable = (!isPast || isSelected) && isActive;

    return (
        <div
            onClick={isClickable ? onClick : undefined}
            className={`group relative h-20 md:h-32 rounded-lg p-1.5 md:p-3 flex flex-col justify-between transition-all duration-300 ${!isActive
                    ? "opacity-30 grayscale cursor-default"
                    : isPast && !isSelected
                        ? "opacity-50 grayscale-[0.5] cursor-not-allowed"
                        : "cursor-pointer hover:shadow-md hover:-translate-y-0.5"
                } ${isSelected ? "ring-4 ring-[#674c7e] border-2 border-white scale-[1.02] z-10 shadow-lg" : ""} ${bgColor} overflow-hidden`}
        >
            {/* Background Accent for Active Slots */}
            {isActive && !isSelected && (
                <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className={`w-3 h-3 md:w-4 md:h-4 ${textColor} opacity-40`} />
                </div>
            )}

            {isScheduled ? (
                <div className="overflow-hidden">
                    <div className={`text-[10px] md:text-[12px] font-bold leading-tight truncate ${textColor}`}>
                        {label}
                    </div>
                    <div className={`text-[8px] md:text-[10px] uppercase tracking-wider font-semibold opacity-80 truncate hidden sm:block ${textColor}`}>
                        {topic}
                    </div>
                </div>
            ) : (
                <div className="h-4"></div>
            )}

            <div className="flex items-end justify-between">
                {/* Active Indicator Dot */}
                {isActive && !isSelected && (
                    <div className={`w-1.5 h-1.5 rounded-full ${textColor} opacity-30 group-hover:animate-ping`}></div>
                )}
                {!isActive && <div></div>}

                <div className={`text-right text-sm md:text-base font-bold ${textColor} ${!isActive ? 'opacity-30' : 'opacity-80'}`}>
                    {day === "-" ? "-" : String(day).padStart(2, "0")}
                </div>
            </div>
        </div>
    );
};

export default DayCell;
