import React, { useState, useMemo } from 'react';

/**
 * NativeCalendar Component
 * 
 * Implements Day, Week, and Month views for SellAgent meetings.
 */
const NativeCalendar = ({ meetings = [] }) => {
    const [view, setView] = useState('WEEK'); // DAY, WEEK, MONTH
    const [currentDate, setCurrentDate] = useState(new Date());

    const timeSlots = Array.from({ length: 10 }, (_, i) => i + 9); // 09:00 to 18:00

    // Date Helpers
    const startOfWeek = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Start from Monday
        d.setHours(0, 0, 0, 0);
        return new Date(d.setDate(diff));
    };

    const addDays = (date, days) => {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    };

    const isSameDay = (d1, d2) => {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    // Navigation
    const navigate = (direction) => {
        let newDate = new Date(currentDate);
        if (view === 'DAY') newDate.setDate(newDate.getDate() + direction);
        else if (view === 'WEEK') newDate.setDate(newDate.getDate() + direction * 7);
        else if (view === 'MONTH') newDate.setMonth(newDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    // View Renders
    const WeekView = () => {
        const monday = startOfWeek(currentDate);
        const weekDays = Array.from({ length: 7 }, (_, i) => addDays(monday, i));

        return (
            <div className="calendar-grid week-view overflow-auto" style={{ maxHeight: '700px' }}>
                <table className="table table-bordered mb-0 bg-white" style={{ minWidth: '800px' }}>
                    <thead className="sticky-top bg-light">
                        <tr>
                            <th style={{ width: '80px' }}>Time</th>
                            {weekDays.map(day => (
                                <th key={day.toISOString()} className={isSameDay(day, new Date()) ? 'bg-primary-soft' : ''}>
                                    <div className="small text-muted text-uppercase">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                    <div className="fs-5">{day.getDate()}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlots.map(hour => (
                            <tr key={hour}>
                                <td className="text-muted small py-4">{hour.toString().padStart(2, '0')}:00</td>
                                {weekDays.map(day => {
                                    const dayMeetings = meetings.filter(m => {
                                        const mDate = new Date(m.startTime);
                                        return isSameDay(mDate, day) && mDate.getHours() === hour;
                                    });

                                    return (
                                        <td key={day.toISOString()} style={{ height: '80px', position: 'relative' }}>
                                            {dayMeetings.map(m => (
                                                <div
                                                    key={m.meeting_id}
                                                    className={`calendar-meeting-box ${m.status === 'Confirmed' ? 'bg-dark text-white' : 'bg-light text-dark border'}`}
                                                    onClick={() => m.joinUrl && window.open(m.joinUrl, '_blank')}
                                                    title={`${m.prospectName} - ${m.companyName}`}
                                                >
                                                    <div className="x-small fw-bold text-truncate">{m.prospectName}</div>
                                                    <div className="x-small opacity-75 text-truncate">{m.companyName}</div>
                                                </div>
                                            ))}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const DayView = () => {
        return (
            <div className="calendar-grid day-view overflow-auto" style={{ maxHeight: '700px' }}>
                <table className="table table-bordered mb-0 bg-white">
                    <thead className="sticky-top bg-light">
                        <tr>
                            <th style={{ width: '100px' }}>Time</th>
                            <th>{currentDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlots.map(hour => {
                            const dayMeetings = meetings.filter(m => {
                                const mDate = new Date(m.startTime);
                                return isSameDay(mDate, currentDate) && mDate.getHours() === hour;
                            });

                            return (
                                <tr key={hour}>
                                    <td className="text-muted small py-5">{hour.toString().padStart(2, '0')}:00</td>
                                    <td style={{ height: '100px', position: 'relative' }}>
                                        {dayMeetings.map(m => (
                                            <div
                                                key={m.meeting_id}
                                                className={`calendar-meeting-box p-3 rounded-2 shadow-sm ${m.status === 'Confirmed' ? 'bg-dark text-white' : 'bg-light text-dark border'}`}
                                                onClick={() => m.joinUrl && window.open(m.joinUrl, '_blank')}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className="fw-bold">{m.prospectName}</div>
                                                <div className="small opacity-75">{m.companyName} &bull; {m.status}</div>
                                                {m.joinUrl && <div className="mt-2 x-small text-info text-decoration-underline">Click to Join</div>}
                                            </div>
                                        ))}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    const MonthView = () => {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const startDay = startOfMonth.getDay();
        const daysInMonth = endOfMonth.getDate();

        const days = [];
        for (let i = 0; i < startDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));

        return (
            <div className="month-view bg-white p-3 border rounded">
                <div className="row g-0 border-bottom mb-2 text-center text-muted small fw-bold">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="col py-2">{d}</div>)}
                </div>
                <div className="row g-0 border-start border-top">
                    {days.map((day, idx) => {
                        const dayMeetings = day ? meetings.filter(m => isSameDay(new Date(m.startTime), day)) : [];
                        return (
                            <div
                                key={idx}
                                className={`col-7-grid border-end border-bottom p-2 ${!day ? 'bg-light opacity-25' : ''}`}
                                style={{ height: '120px', width: '14.28%' }}
                            >
                                {day && (
                                    <>
                                        <div className="small text-muted mb-1">{day.getDate()}</div>
                                        {dayMeetings.length > 0 && (
                                            <div className="badge bg-primary-soft text-primary w-100 py-1 fw-normal">
                                                &bull; {dayMeetings.length} Meeting{dayMeetings.length > 1 ? 's' : ''}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const getRangeLabel = () => {
        if (view === 'DAY') return currentDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        if (view === 'WEEK') {
            const monday = startOfWeek(currentDate);
            const sunday = addDays(monday, 6);
            return `${monday.getDate()} ${monday.toLocaleDateString('en-US', { month: 'short' })} – ${sunday.getDate()} ${sunday.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
        }
        return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    return (
        <div className="native-calendar">
            {/* Header / Controls */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="btn-group shadow-sm">
                    <button className={`btn btn-sm ${view === 'DAY' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setView('DAY')}>Day</button>
                    <button className={`btn btn-sm ${view === 'WEEK' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setView('WEEK')}>Week</button>
                    <button className={`btn btn-sm ${view === 'MONTH' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setView('MONTH')}>Month</button>
                </div>

                <div className="d-flex align-items-center gap-3">
                    <h6 className="mb-0 fw-bold">{getRangeLabel()}</h6>
                    <div className="btn-group shadow-sm">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setCurrentDate(new Date())}>Today</button>
                        <button className="btn btn-sm btn-outline-secondary px-3" onClick={() => navigate(-1)}> {`<<`} <i className="bi bi-chevron-left"></i></button>
                        <button className="btn btn-sm btn-outline-secondary px-3" onClick={() => navigate(1)}><i className="bi bi-chevron-right"></i> {`>>`}</button>
                    </div>
                </div>
            </div>

            {/* View Render */}
            <div className="calendar-content">
                {view === 'DAY' && <DayView />}
                {view === 'WEEK' && <WeekView />}
                {view === 'MONTH' && <MonthView />}
            </div>

            {/* Inline Styles for Calendar */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .calendar-meeting-box {
                    padding: 4px 8px;
                    border-radius: 4px;
                    margin-bottom: 2px;
                    cursor: pointer;
                    transition: transform 0.1s ease;
                    overflow: hidden;
                    white-space: nowrap;
                }
                .calendar-meeting-box:hover {
                    transform: scale(1.02);
                }
                .bg-primary-soft { background-color: rgba(13, 110, 253, 0.05); }
                .x-small { font-size: 0.7rem; }
                .col-7-grid { flex: 0 0 14.285%; max-width: 14.285%; }
            `}} />
        </div>
    );
};

export default NativeCalendar;
