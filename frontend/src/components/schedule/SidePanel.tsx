import React, { useState } from "react";
import { Clock, Instagram, Facebook, Twitter, MessageCircle, Edit2, Check } from "lucide-react";

interface SidePanelProps {
    topics: string[];
    onTopicChange: (index: number, newTopic: string) => void;
    times: { start: string, end: string };
    onTimeChange: (key: "start" | "end", newVal: string) => void;
    onSubmit: () => void;
    onViewScheduled: () => void;
    inquiryNumber: string;
}

const SidePanel: React.FC<SidePanelProps> = ({
    topics, onTopicChange, times, onTimeChange, onSubmit, onViewScheduled, inquiryNumber
}) => {
    const [editingIdx, setEditingIdx] = useState<number | null>(null);
    const [editingTimeKey, setEditingTimeKey] = useState<"start" | "end" | null>(null);
    const [editValue, setEditValue] = useState("");

    const startEditingTopic = (idx: number, val: string) => {
        setEditingIdx(idx);
        setEditingTimeKey(null);
        setEditValue(val);
    };

    const startEditingTime = (key: "start" | "end", val: string) => {
        setEditingTimeKey(key);
        setEditingIdx(null);
        setEditValue(val);
    };

    const saveTopic = (idx: number) => {
        onTopicChange(idx, editValue);
        setEditingIdx(null);
    };

    const saveTime = (key: "start" | "end") => {
        onTimeChange(key, editValue);
        setEditingTimeKey(null);
    };

    return (
        <div className="flex-1 flex flex-col gap-4">
            {/* Time Selection */}
            <div className="flex items-center gap-2">
                <div
                    className="flex-1 bg-[#f5f5f5] p-3 md:p-4 rounded-lg flex items-center justify-center gap-2 md:gap-3 cursor-pointer hover:bg-slate-200 transition-colors"
                    onClick={() => !editingTimeKey && startEditingTime("start", times.start)}
                >
                    <Clock className="w-5 h-5 text-slate-900" />
                    {editingTimeKey === "start" ? (
                        <input
                            className="w-full bg-white border border-violet-200 px-1 rounded text-slate-900 font-bold outline-none"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                            onBlur={() => saveTime("start")}
                            onKeyDown={(e) => e.key === 'Enter' && saveTime("start")}
                        />
                    ) : (
                        <span className="font-bold text-slate-900 text-sm md:text-base">{times.start}</span>
                    )}
                </div>
                <div className="w-px h-10 bg-slate-300"></div>
                <div
                    className="flex-1 bg-[#f5f5f5] p-3 md:p-4 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors"
                    onClick={() => !editingTimeKey && startEditingTime("end", times.end)}
                >
                    {editingTimeKey === "end" ? (
                        <input
                            className="w-full bg-white border border-violet-200 px-1 rounded text-slate-900 font-bold outline-none text-center"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                            onBlur={() => saveTime("end")}
                            onKeyDown={(e) => e.key === 'Enter' && saveTime("end")}
                        />
                    ) : (
                        <span className="font-bold text-slate-900 text-sm md:text-base">{times.end}</span>
                    )}
                </div>
            </div>

            {/* Topic Detail View */}
            <div className="bg-[#f5f5f5] p-4 md:p-6 rounded-lg flex-1 min-h-[250px] md:min-h-[300px]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800">Monthly Topics</h3>
                    <button
                        onClick={onViewScheduled}
                        className="text-xs font-bold text-violet-600 hover:text-violet-700 cursor-pointer"
                    >
                        View History
                    </button>
                </div>
                <div className="space-y-3 md:space-y-4">
                    {topics.map((topic, i) => (
                        <div key={i} className="flex items-center text-sm md:text-lg group">
                            <span className="font-extrabold text-slate-700 min-w-[60px] md:min-w-[70px]">Day {i + 1}:</span>

                            {editingIdx === i ? (
                                <div className="flex-1 flex items-center gap-2 ml-4">
                                    <input
                                        className="flex-1 bg-white border border-violet-200 px-2 py-0.5 rounded text-slate-600 outline-none focus:border-violet-500"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        autoFocus
                                        onKeyDown={(e) => e.key === 'Enter' && saveTopic(i)}
                                        onBlur={() => saveTopic(i)}
                                    />
                                    <button onClick={() => saveTopic(i)} className="cursor-pointer"><Check className="w-4 h-4 text-green-500" /></button>
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-between ml-4">
                                    <span className="text-slate-500 line-clamp-1">{topic}</span>
                                    <button
                                        onClick={() => startEditingTopic(i, topic)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    >
                                        <Edit2 className="w-3.5 h-3.5 text-slate-400 hover:text-violet-500" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions & Footer */}
            <div className="mt-auto space-y-6">
                <button
                    onClick={onSubmit}
                    className="w-full bg-[#674c7e] text-white py-3 md:py-4 rounded-xl text-lg md:text-xl font-bold shadow-md hover:bg-[#5a426e] transition-all cursor-pointer"
                >
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
                        For inquiry : <span className="text-slate-700">{inquiryNumber}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SidePanel;
