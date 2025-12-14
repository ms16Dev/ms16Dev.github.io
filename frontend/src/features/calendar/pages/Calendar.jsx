import { useRef } from 'react';
import { useCalendarData } from '../hooks/useCalendarData';
import { useTimelineCalculations } from '../hooks/useTimelineCalculations';
import { useCalendarInteraction } from '../hooks/useCalendarInteraction';
import CalendarTimeline from '../components/CalendarTimeline';
import CalendarScrollbar from '../components/CalendarScrollbar';
import CalendarYearCounter from '../components/CalendarYearCounter';

const Calendar = () => {
    const { events, settings } = useCalendarData();
    const { startYear, endYear, totalYears, totalWidth, getEventStyle } = useTimelineCalculations(settings);

    const containerRef = useRef(null);
    const trackRef = useRef(null);

    const { currentYear, handleScroll, progress } = useCalendarInteraction({
        trackRef,
        totalWidth,
        totalYears,
        startYear,
        endYear,
        initialYear: settings.calendar_start_year
    });

    return (
        <div ref={containerRef} className="h-screen w-full bg-surface text-primary overflow-hidden relative font-sans transition-colors duration-300">
            <CalendarYearCounter year={currentYear} />

            <CalendarTimeline
                ref={trackRef}
                totalWidth={totalWidth}
                totalYears={totalYears}
                startYear={startYear}
                events={events}
                getEventStyle={getEventStyle}
            />

            <CalendarScrollbar
                startYear={startYear}
                endYear={endYear}
                value={progress * 100}
                onChange={handleScroll}
            />
        </div>
    );

};

export default Calendar;

