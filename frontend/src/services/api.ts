import axios from 'axios';

const API_URL = 'http://localhost:8008/api';

const api = axios.create({
    baseURL: API_URL,
});

export const scheduleApi = {
    getSchedules: (month: number, year: number) =>
        api.get(`/schedules?month=${month}&year=${year}`),

    seedSchedules: (month: number, year: number) =>
        api.post('/schedules/seed', { month, year }),
};

export const bookingApi = {
    createBookings: (userId: string, scheduleIds: string[]) =>
        api.post('/bookings', { userId, scheduleIds }),

    getUserBookings: (userId: string) =>
        api.get(`/bookings/user/${userId}`),

    deleteBooking: (id: string) =>
        api.delete(`/bookings/${id}`),
};

export default api;
