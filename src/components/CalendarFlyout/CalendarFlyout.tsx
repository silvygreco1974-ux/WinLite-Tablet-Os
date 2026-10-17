import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useOS } from '../../context/OSContext';

export const CalendarFlyout: React.FC = () => {
  const { settings } = useOS();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());

  const isDark = settings.theme === 'dark';

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const daysOfWeek = ['Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa', 'Do'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    // Convert Sunday (0) to 6, Monday (1) to 0
    return day === 0 ? 6 : day - 1;
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  const isToday = (day: number) => {
    return (
      day === currentDate.getDate() &&
      month === currentDate.getMonth() &&
      year === currentDate.getFullYear()
    );
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        zIndex: 9000,
        bottom: '56px',
        right: '12px',
      }}
      className={`fixed w-[92vw] sm:w-[320px] p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex flex-col select-none ${
        isDark
          ? 'bg-slate-900/90 border-slate-700/80 text-white shadow-black/60'
          : 'bg-white/95 border-slate-200/90 text-slate-800 shadow-slate-900/30'
      }`}
    >
      {/* Time Header */}
      <div className="pb-3 border-b border-slate-500/10">
        <div className="text-3xl font-light font-mono tracking-tight">
          {currentDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        <div className="text-xs text-blue-500 font-medium capitalize mt-0.5">
          {currentDate.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="py-3 flex items-center justify-between">
        <span className="text-xs font-semibold">
          {monthNames[month]} {year}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className={`p-1 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className={`p-1 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Weekday Row */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-400 font-semibold mb-1">
        {daysOfWeek.map(d => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="py-1.5" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const today = isToday(day);
          return (
            <div
              key={`day-${day}`}
              className={`py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                today
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};
