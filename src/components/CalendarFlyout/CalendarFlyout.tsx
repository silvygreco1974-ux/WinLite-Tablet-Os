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
        bottom: '60px',
        right: '12px',
      }}
      className={`fixed w-[92vw] sm:w-[340px] p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex flex-col select-none ${
        isDark
          ? 'bg-[#1c212d]/98 border-[#343e52] text-[#e2e8f0] shadow-black/70'
          : 'bg-white/98 border-[#e2e8f0] text-[#1e293b] shadow-2xl shadow-slate-900/20'
      }`}
    >
      {/* Time Header */}
      <div className="pb-3 border-b border-slate-500/15">
        <div className="text-3xl font-light font-mono tracking-tight">
          {currentDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        <div
          style={{ color: settings.accentColor || '#0078d4' }}
          className="text-sm font-semibold capitalize mt-1"
        >
          {currentDate.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="py-3 flex items-center justify-between">
        <span className="text-sm font-bold">
          {monthNames[month]} {year}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={prevMonth}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-[#28303f] text-slate-300' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-[#28303f] text-slate-300' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Weekday Row */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400 font-bold mb-1">
        {daysOfWeek.map(d => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="py-2" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const today = isToday(day);
          return (
            <div
              key={`day-${day}`}
              style={{
                backgroundColor: today ? (settings.accentColor || '#0078d4') : undefined
              }}
              className={`py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                today
                  ? 'text-white font-bold shadow-xs'
                  : isDark ? 'hover:bg-[#28303f] text-slate-300' : 'hover:bg-slate-100 text-slate-800'
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
