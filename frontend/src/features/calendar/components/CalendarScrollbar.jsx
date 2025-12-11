import { forwardRef } from 'react';
import './calendar.css';

const CalendarScrollbar = forwardRef(({ startYear, endYear, onChange, value }, ref) => {
    return (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-16 z-20 flex items-center gap-4">
            <span className="text-secondary font-mono">{startYear}</span>

            <input
                ref={ref}
                type="range"
                min="0"
                max="100"
                value={value || 0}
                step="0.01"
                onChange={onChange}
                className="calendar-slider flex-1"
            />


            <span className="text-secondary font-mono">{endYear}</span>
        </div>
    );
});

export default CalendarScrollbar;
