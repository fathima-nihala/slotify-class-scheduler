import React from "react";

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
    return (
        <div
            onClick={(!isPast || isSelected) && !isFiller ? onClick : undefined}
            className={`h-20 md:h-32 rounded-sm p-1.5 md:p-3 flex flex-col justify-between transition-all ${(isPast || isFiller) && !isSelected
                    ? "opacity-40 cursor-not-allowed grayscale-[0.2]"
                    : "cursor-pointer hover:opacity-90 opacity-100"
                } ${isSelected ? "ring-4 ring-[#674c7e] border-2 border-white scale-[1.02] z-10" : ""} ${bgColor}`}
        >
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
                <div></div>
            )}

            <div className={`text-right text-sm md:text-base font-bold ${textColor} opacity-60`}>
                {day === "-" ? "-" : String(day).padStart(2, "0")}
            </div>
        </div>
    );
};

export default DayCell;
