import React from "react";

interface ScheduledClass {
    id: string;
    date: Date;
    day: number;
    topic: string;
    label: string;
}

interface MonthGroup {
    name: string;
    year: number;
    classes: ScheduledClass[];
}

interface ScheduledClassesProps {
    groups: MonthGroup[];
    onDelete: (id: string) => void;
    onAddNew: () => void;
}

const ScheduledClasses: React.FC<ScheduledClassesProps> = ({ groups, onDelete, onAddNew }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10 w-full max-w-[1280px] mx-auto overflow-hidden">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Scheduled Classes</h1>
                <button
                    onClick={onAddNew}
                    className="bg-[#674c7e] text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-[#5a426e] transition-all cursor-pointer"
                >
                    Add New Slot
                </button>
            </div>

            <div className="space-y-12">
                {groups.map((group) => (
                    <div key={`${group.name}-${group.year}`} className="flex flex-col md:flex-row gap-6 md:gap-12">
                        <div className="w-48 shrink-0">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-800">{group.name}</h2>
                            <p className="text-lg md:text-xl font-bold text-slate-800 opacity-80">{group.year}</p>
                        </div>

                        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4">
                            {group.classes.map((cls) => (
                                <div key={cls.id} className="flex flex-col gap-2">
                                    <div className="bg-[#e6e0f3] p-3 rounded-lg min-h-[80px] flex flex-col items-center justify-center relative group">
                                        <div className="text-[10px] font-bold text-[#7e699f]">{cls.label}</div>
                                        <div className="text-[10px] font-semibold text-[#7e699f] opacity-80 uppercase">{cls.topic}</div>
                                        <div className="mt-2 text-xl font-bold text-[#7e699f]">{String(cls.day).padStart(2, '0')}</div>
                                    </div>
                                    <button
                                        onClick={() => onDelete(cls.id)}
                                        className="text-[10px] font-bold text-slate-400 border border-slate-200 py-1 rounded hover:bg-slate-50 transition-colors uppercase cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScheduledClasses;
