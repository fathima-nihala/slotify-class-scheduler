import React, { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { scheduleApi, bookingApi } from "../services/api";
import DayCell from "./schedule/DayCell";
import MonthStrip from "./schedule/MonthStrip";
import SidePanel from "./schedule/SidePanel";
import BookingModal from "./schedule/BookingModal";
import ScheduledClasses from "./schedule/ScheduledClasses";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    // Auth State (Assuming user is in Redux)
    const { user } = useSelector((state: any) => state.auth);
    const userId = user?.id || "guest"; // Fallback for testing if redux not ready

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

    // Dynamic Topics State
    const [customTopics, setCustomTopics] = useState<string[]>([
        "Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5", "Topic 6", "Topic 7"
    ]);

    // Derived State
    const startOfMonth = currentMonth.startOf("month");
    const daysInMonth = currentMonth.daysInMonth();
    const startDay = startOfMonth.day();

    // Fetch Schedules
    const fetchSchedules = async () => {
        try {
            const res = await scheduleApi.getSchedules(currentMonth.month(), currentMonth.year());
            console.log("Fetched schedules:", res.data.length);
            setAvailableSchedules(res.data);

            // Seed automatically for the current view if empty
            if (res.data.length === 0) {
                console.log("Seeding current month...");
                await scheduleApi.seedSchedules(currentMonth.month(), currentMonth.year());
                const reFetch = await scheduleApi.getSchedules(currentMonth.month(), currentMonth.year());
                setAvailableSchedules(reFetch.data);
            }
        } catch (err) {
            console.error("Error fetching schedules:", err);
        }
    };

    // Update topics based on fetched schedule if available
    useEffect(() => {
        if (availableSchedules.length > 0) {
            const unique = Array.from(new Set(availableSchedules.map(s => s.topic)));
            if (unique.length > 0) setCustomTopics(unique);
        }
    }, [availableSchedules]);

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

    // Handle Topic Change (Local for now, could be synced to API)
    const handleTopicChange = (idx: number, newTopic: string) => {
        const newTopics = [...customTopics];
        newTopics[idx] = newTopic;
        setCustomTopics(newTopics);

        // Update topics in available schedules locally for UI consistency
        setAvailableSchedules(prev => prev.map(s => {
            const dayNum = dayjs(s.date).date();
            if ((dayNum - 1) % 7 === idx) {
                return { ...s, topic: newTopic };
            }
            return s;
        }));
    };

    // Format data for ScheduledClasses component (Page 3)
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
        console.log("Toggling slot ID:", id);
        setSelectedSlotIds(prev => {
            const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
            console.log("New Selected IDs:", next);
            return next;
        });
    };

    const handleConfirmBookings = async () => {
        try {
            await bookingApi.createBookings(userId, selectedSlotIds);
            setSelectedSlotIds([]);
            setIsBookingModalOpen(false);
            await fetchBookings();
            setView("scheduled");
        } catch (err) {
            alert("Failed to book slots. Some might be already booked.");
        }
    };

    const handleDeleteBooking = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this booking?")) {
            try {
                await bookingApi.deleteBooking(id);
                await fetchBookings();
            } catch (err) {
                console.error(err);
            }
        }
    };

    // Selected Slot Details for Modal
    const selectedSlotDetails = useMemo(() => {
        return selectedSlotIds.map(id => {
            const slot = availableSchedules.find(s => s.id === id);
            const d = dayjs(slot?.date);
            const topicIdx = (d.date() - 1) % 7;
            return {
                id: id,
                day: d.date(),
                topic: slot?.topic || customTopics[topicIdx] || "",
                label: `Day ${topicIdx + 1}`
            };
        });
    }, [selectedSlotIds, availableSchedules, customTopics]);

    if (view === "scheduled") {
        return (
            <div className="min-h-screen bg-[#fafafa] p-4 md:p-8">
                <ScheduledClasses
                    groups={groupedBookings}
                    onDelete={handleDeleteBooking}
                    onAddNew={() => setView("calendar")}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] p-2 sm:p-4 md:p-8 font-sans text-slate-800">
            <div className="max-w-[1280px] mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-slate-900">Select your slots</h1>
                    <div className="flex flex-col items-end w-full md:w-auto">
                        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Monthly Schedule</h2>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setCurrentMonth(prev => prev.subtract(1, "month"))}
                                className="p-1 hover:bg-slate-100 rounded-md transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6 text-slate-400" />
                            </button>
                            <span className="text-xl font-medium text-[#c0b4d4]">
                                {currentMonth.format("MMMM YYYY")}
                            </span>
                            <button
                                onClick={() => setCurrentMonth(prev => prev.add(1, "month"))}
                                className="p-1 hover:bg-slate-100 rounded-md transition-colors"
                            >
                                <ChevronRight className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Calendar Grid */}
                    <div className="flex-1 overflow-x-auto lg:overflow-visible">
                        <div className="min-w-[600px] lg:min-w-0">
                            <div className="grid grid-cols-7 mb-4">
                                {WEEK_DAYS.map((day) => (
                                    <div key={day} className="text-center text-sm font-medium text-[#c0b4d4] uppercase">
                                        {day}
                                    </div>
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

                                    // Find schedule for THIS specific day
                                    const schedule = availableSchedules.find(s => dayjs(s.date).isSame(dateObj, 'day'));
                                    const isBooked = userBookings.some(b => dayjs(b.schedule.date).isSame(dateObj, 'day'));
                                    const isSelected = selectedSlotIds.includes(schedule?.id || "");

                                    // Logic: 
                                    // 1. SELECTED (current session): bg-[#674c7e] + border
                                    // 2. BOOKED (previously saved): bg-[#4a345e] (slightly darker)
                                    // 3. AVAILABLE: bg-[#e6e0f3]

                                    let cellBg = "bg-[#f5f6f7]";
                                    let cellText = "text-[#9ca3af]";

                                    if (isSelected) {
                                        cellBg = "bg-[#674c7e]";
                                        cellText = "text-white";
                                    } else if (isBooked) {
                                        cellBg = "bg-[#4a345e]"; // Even darker for booked classes
                                        cellText = "text-white";
                                    } else if (schedule) {
                                        cellBg = "bg-[#e6e0f3]";
                                        cellText = "text-[#7e699f]";
                                    }

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
                                                if (isBooked) {
                                                    alert("This slot is already booked!");
                                                    return;
                                                }
                                                if (schedule) {
                                                    toggleSlot(schedule.id);
                                                } else {
                                                    alert("Please select a date with an active slot pattern (Purple cells)");
                                                }
                                            }}
                                        />
                                    );
                                })}

                                {Array.from({ length: (7 - (startDay + daysInMonth) % 7) % 7 }).map((_, i) => (
                                    <DayCell key={`end-${i}`} day={i + 1} isFiller bgColor="bg-[#f5f6f7]" textColor="text-slate-400" />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="w-full lg:w-[380px] flex gap-4">
                        <SidePanel
                            topics={customTopics}
                            onTopicChange={handleTopicChange}
                            onSubmit={() => selectedSlotIds.length > 0 && setIsBookingModalOpen(true)}
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
        </div>
    );
};

export default MonthlySchedule;
