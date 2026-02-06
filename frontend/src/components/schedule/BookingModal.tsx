import React from "react";
import { X } from "lucide-react";

interface Slot {
    id: string;
    day: number;
    topic: string;
    label: string;
}

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    selectedSlots: Slot[];
    onRemoveSlot: (id: string) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    selectedSlots,
    onRemoveSlot
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                >
                    <X className="w-6 h-6 text-slate-400" />
                </button>

                <div className="p-8 md:p-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-800 mb-10">Selected Slots</h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-10 overflow-y-auto max-h-[40vh] p-2">
                        {selectedSlots.map((slot, index) => (
                            <div key={slot.id} className="flex flex-col gap-2">
                                <div className="text-xs font-bold text-slate-500 text-center uppercase tracking-tight">
                                    {index + 1}{index + 1 === 1 ? 'st' : index + 1 === 2 ? 'nd' : index + 1 === 3 ? 'rd' : 'th'} Schedule
                                </div>
                                <div className="bg-[#674c7e] text-white p-3 rounded-lg shadow-sm flex flex-col items-center justify-center min-h-[80px]">
                                    <div className="text-xl font-bold">{String(slot.day).padStart(2, '0')}</div>
                                    <div className="text-[10px] uppercase font-semibold opacity-80">{slot.label}</div>
                                    <div className="text-[10px] uppercase font-semibold opacity-80">{slot.topic}</div>
                                </div>
                                <button
                                    onClick={() => onRemoveSlot(slot.id)}
                                    className="text-[10px] text-slate-400 border border-slate-200 py-1 rounded hover:bg-slate-50 transition-colors uppercase font-bold cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onClose}
                            className="px-10 py-3 rounded-lg bg-slate-200 text-slate-600 font-bold hover:bg-slate-300 transition-all uppercase cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-10 py-3 rounded-lg bg-[#674c7e] text-white font-bold hover:bg-[#5a426e] shadow-lg transition-all uppercase cursor-pointer"
                        >
                            Ok
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
