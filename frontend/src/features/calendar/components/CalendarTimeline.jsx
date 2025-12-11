import { forwardRef } from 'react';
import CalendarEvent from './CalendarEvent';
import { YEAR_WIDTH } from '../hooks/useTimelineCalculations';

const CalendarTimeline = forwardRef(({ totalWidth, totalYears, startYear, events, getEventStyle }, ref) => {
    return (
        <div ref={ref} className="absolute top-0 left-0 h-full flex items-center" style={{ width: totalWidth }}>
            {/* Grid & Markers */}
            {Array.from({ length: totalYears }).map((_, yearIdx) => {
                const year = startYear + yearIdx;
                return (
                    <div key={year} className="h-full border-l border-secondary/30 relative transition-colors duration-300" style={{ width: YEAR_WIDTH }}>
                        <div className="absolute top-4 left-4 text-2xl font-bold text-primary">{year}</div>
                        {/* Months */}
                        <div className="absolute bottom-32 left-0 w-full flex justify-between px-4  text-secondary text-sm uppercase tracking-widest">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                                <span key={m}>{m}</span>
                            ))}
                        </div>
                    </div>
                );
            })}

            {/* Events */}
            {events.map((event, i) => (
                <CalendarEvent
                    key={event.id}
                    event={event}
                    index={i}
                    style={getEventStyle(event, i)}
                />
            ))}
        </div>
    );
});

export default CalendarTimeline;
