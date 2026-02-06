import React, { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { scheduleApi, bookingApi } from "../services/api";
import DayCell from "./schedule/DayCell";
import MonthStrip from "./schedule/MonthStrip";
import SidePanel from "./schedule/SidePanel";
import BookingModal from "./schedule/BookingModal";
import ScheduledClasses from "./schedule/ScheduledClasses";
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react";

interface ScheduleSlot {
    id: string;
    date: string;
    topic: string;
    startTime: string;
    endTime: string;
    isActive: boolean;
}

interface UserBooking {
    id: string;
    scheduleId: string;
    schedule: ScheduleSlot;
}

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MonthlySchedule: React.FC = () => {
    // Auth State
    const { user } = useSelector((state: any) => state.auth);
    const userId = user?.id || "guest";

    // View State
    const [view, setView] = useState<"calendar" | "scheduled">("calendar");

    // Date State
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [selectedMonthIdx, setSelectedMonthIdx] = useState(dayjs().month());

    // Data State
    const [availableSchedules, setAvailableSchedules] = useState<ScheduleSlot[]>([]);
    const [userBookings, setUserBookings] = useState<UserBooking[]>([]);
    const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    // Notification State
    const [notification, setNotification] = useState<{ message: string, type: "success" | "error" } | null>(null);

    // Persistence for Custom Topics & Times
    const [customTopics, setCustomTopics] = useState<string[]>(() => {
        const saved = localStorage.getItem("slotify_custom_topics");
        return saved ? JSON.parse(saved) : [
            "Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5", "Topic 6", "Topic 7"
        ];
    });

    const [classTimes, setClassTimes] = useState<{ start: string, end: string }>(() => {
        const saved = localStorage.getItem("slotify_class_times");
        return saved ? JSON.parse(saved) : { start: "09:00 hs", end: "06:00 hs" };
    });

    useEffect(() => {
        localStorage.setItem("slotify_custom_topics", JSON.stringify(customTopics));
    }, [customTopics]);

    useEffect(() => {
        localStorage.setItem("slotify_class_times", JSON.stringify(classTimes));
    }, [classTimes]);

    // Derived State
    const startOfMonth = currentMonth.startOf("month");
    const daysInMonth = currentMonth.daysInMonth();
    const startDay = startOfMonth.day();

    // Notification Effect
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const showNotification = (message: string, type: "success" | "error") => {
        setNotification({ message, type });
    };

    // Fetch Schedules
    const fetchSchedules = async () => {
        try {
            const res = await scheduleApi.getSchedules(currentMonth.month(), currentMonth.year());
            setAvailableSchedules(res.data);

            if (res.data.length === 0) {
                await scheduleApi.seedSchedules(currentMonth.month(), currentMonth.year());
                const reFetch = await scheduleApi.getSchedules(currentMonth.month(), currentMonth.year());
                setAvailableSchedules(reFetch.data);
            }
        } catch (err) {
            console.error("Error fetching schedules:", err);
        }
    };

    // Fetch Personal Bookings
    const fetchBookings = async () => {
        if (!userId) return;
        try {
            const res = await bookingApi.getUserBookings(userId);
            setUserBookings(res.data);
        } catch (err) {
            console.error("Error fetching bookings", err);
        }
    };

    useEffect(() => {
        fetchSchedules();
        fetchBookings();
    }, [currentMonth, userId]);

    // Handle Topic Change
    const handleTopicChange = (idx: number, newTopic: string) => {
        setCustomTopics(prev => {
            const next = [...prev];
            next[idx] = newTopic;
            return next;
        });

        setAvailableSchedules(prev => prev.map(s => {
            const d = dayjs(s.date);
            const patternIdx = (d.date() - 1) % 7;
            if (patternIdx === idx) {
                return { ...s, topic: newTopic };
            }
            return s;
        }));
    };

    // Format data for ScheduledClasses component
    const groupedBookings = useMemo(() => {
        const groups: any[] = [];
        const sorted = [...userBookings].sort((a, b) => dayjs(a.schedule.date).unix() - dayjs(b.schedule.date).unix());

        sorted.forEach(booking => {
            const d = dayjs(booking.schedule.date);
            const monthName = d.format("MMMM");
            const year = d.year();

            let group = groups.find((g: any) => g.name === monthName && g.year === year);
            if (!group) {
                group = { name: monthName, year, classes: [] };
                groups.push(group);
            }

            group.classes.push({
                id: booking.id,
                date: d.toDate(),
                day: d.date(),
                topic: booking.schedule.topic,
                label: `Day ${((d.date() - 1) % 7) + 1}`
            });
        });

        return groups;
    }, [userBookings]);

    // Handle Slot Selection
    const toggleSlot = (id: string) => {
        setSelectedSlotIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleConfirmBookings = async () => {
        try {
            const bookingsPayload = selectedSlotIds.map(id => {
                const slot = availableSchedules.find(s => s.id === id);
                const d = dayjs(slot?.date);
                const patternIdx = (d.date() - 1) % 7;
                return {
                    scheduleId: id,
                    topic: customTopics[patternIdx],
                    startTime: classTimes.start,
                    endTime: classTimes.end
                };
            });

            await bookingApi.createBookings(userId, bookingsPayload);
            setSelectedSlotIds([]);
            setIsBookingModalOpen(false);
            await fetchBookings();
            showNotification("Successfully booked your slots!", "success");
            setTimeout(() => setView("scheduled"), 1000);
        } catch (err: any) {
            const msg = err.response?.data?.error || "Failed to book slots.";
            showNotification(msg, "error");
        }
    };

    const handleDeleteBooking = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this booking?")) {
            try {
                await bookingApi.deleteBooking(id);
                await fetchBookings();
                showNotification("Booking deleted successfully", "success");
            } catch (err) {
                showNotification("Failed to delete booking", "error");
            }
        }
    };

    const selectedSlotDetails = useMemo(() => {
        return selectedSlotIds.map(id => {
            const slot = availableSchedules.find(s => s.id === id);
            const d = dayjs(slot?.date);
            const topicIdx = (d.date() - 1) % 7;
            return {
                id: id,
                day: d.date(),
                topic: customTopics[topicIdx] || "",
                label: `Day ${topicIdx + 1}`
            };
        });
    }, [selectedSlotIds, availableSchedules, customTopics]);

    if (view === "scheduled") {
        return (
            <div className="min-h-screen bg-[#fafafa] p-4 md:p-8 relative">
                <ScheduledClasses
                    groups={groupedBookings}
                    onDelete={handleDeleteBooking}
                    onAddNew={() => setView("calendar")}
                />
                <Toast notification={notification} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] p-2 sm:p-4 md:p-8 font-sans text-slate-800 relative">
            <div className="max-w-[1280px] mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-slate-900">Select your slots</h1>
                    <div className="flex flex-col items-end w-full md:w-auto">
                        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Monthly Schedule</h2>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setCurrentMonth(prev => prev.subtract(1, "month"))} className="p-1 hover:bg-slate-100 rounded-md transition-colors">
                                <ChevronLeft className="w-6 h-6 text-slate-400" />
                            </button>
                            <span className="text-xl font-medium text-[#c0b4d4]">
                                {currentMonth.format("MMMM YYYY")}
                            </span>
                            <button onClick={() => setCurrentMonth(prev => prev.add(1, "month"))} className="p-1 hover:bg-slate-100 rounded-md transition-colors">
                                <ChevronRight className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 overflow-x-auto lg:overflow-visible">
                        <div className="min-w-[600px] lg:min-w-0">
                            <div className="grid grid-cols-7 mb-4">
                                {WEEK_DAYS.map((day) => (
                                    <div key={day} className="text-center text-sm font-medium text-[#c0b4d4] uppercase">{day}</div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                                {Array.from({ length: startDay }).map((_, i) => (
                                    <DayCell key={`filler-${i}`} day="-" isFiller bgColor="bg-[#f5f6f7]" textColor="text-slate-400" />
                                ))}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const dayNum = i + 1;
                                    const dateObj = currentMonth.date(dayNum);
                                    const isPast = dateObj.isBefore(dayjs().startOf("day"));
                                    const schedule = availableSchedules.find(s => dayjs(s.date).isSame(dateObj, 'day'));
                                    const isBooked = userBookings.some(b => dayjs(b.schedule.date).isSame(dateObj, 'day'));
                                    const isSelected = selectedSlotIds.includes(schedule?.id || "");

                                    let cellBg = "bg-[#f5f6f7]";
                                    let cellText = "text-[#9ca3af]";
                                    if (isSelected) { cellBg = "bg-[#674c7e]"; cellText = "text-white"; }
                                    else if (isBooked) { cellBg = "bg-[#4a345e]"; cellText = "text-white"; }
                                    else if (schedule) { cellBg = "bg-[#e6e0f3]"; cellText = "text-[#7e699f]"; }

                                    return (
                                        <DayCell
                                            key={dayNum}
                                            day={dayNum}
                                            isPast={isPast && !isBooked}
                                            isScheduled={!!schedule}
                                            label={schedule ? `Day ${((dayNum - 1) % 7) + 1}` : ""}
                                            topic={schedule?.topic || customTopics[(dayNum - 1) % 7]}
                                            isSelected={isSelected}
                                            bgColor={cellBg}
                                            textColor={cellText}
                                            onClick={() => {
                                                if (isBooked) { showNotification("This slot is already booked!", "error"); return; }
                                                if (schedule) toggleSlot(schedule.id);
                                                else showNotification("Please select a date with an active slot pattern", "error");
                                            }}
                                        />
                                    );
                                })}
                                {Array.from({ length: (7 - (startDay + daysInMonth) % 7) % 7 }).map((_, i) => (
                                    <DayCell key={`end-${i}`} day={i + 1} isFiller bgColor="bg-[#f5f6f7]" textColor="text-slate-400" />
                                ))}
                            </div>

                            {/* Color Legend */}
                            <div className="mt-8 flex flex-wrap gap-4 md:gap-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-[#e6e0f3]"></div>
                                    <span className="text-xs font-bold text-slate-600">Available Slots</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-[#674c7e]"></div>
                                    <span className="text-xs font-bold text-slate-600">Your Selection</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-[#4a345e]"></div>
                                    <span className="text-xs font-bold text-slate-600">Booked Class</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-slate-200 opacity-30"></div>
                                    <span className="text-xs font-bold text-slate-400">Off Day (Inactive)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-[380px] flex gap-4">
                        <SidePanel
                            topics={customTopics}
                            onTopicChange={handleTopicChange}
                            times={classTimes}
                            onTimeChange={(key, val) => setClassTimes(prev => ({ ...prev, [key]: val }))}
                            onSubmit={() => {
                                if (selectedSlotIds.length === 0) showNotification("Please select at least one slot", "error");
                                else setIsBookingModalOpen(true);
                            }}
                            onViewScheduled={() => setView("scheduled")}
                            inquiryNumber="+44 123456789"
                        />
                        <MonthStrip
                            selectedMonth={selectedMonthIdx}
                            onMonthChange={(idx) => {
                                setSelectedMonthIdx(idx);
                                setCurrentMonth(prev => prev.month(idx));
                            }}
                        />
                    </div>
                </div>
            </div>

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                selectedSlots={selectedSlotDetails}
                onRemoveSlot={(id) => setSelectedSlotIds(prev => prev.filter(i => i !== id))}
                onConfirm={handleConfirmBookings}
            />

            <Toast notification={notification} />
        </div>
    );
};

const Toast = ({ notification }: { notification: any }) => {
    if (!notification) return null;
    const isSuccess = notification.type === "success";
    return (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-5 duration-300 ${isSuccess ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}>
            {isSuccess ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            <span className="font-bold text-lg">{notification.message}</span>
        </div>
    );
};

export default MonthlySchedule;
