import { useMemo } from 'react';

export const YEAR_WIDTH = 1200; // 100px per month

export const useTimelineCalculations = (settings) => {
    const { startYear, endYear, totalYears, totalWidth } = useMemo(() => {
        const start = settings.calendar_start_year;
        const end = settings.calendar_end_year;
        const total = end - start + 1;
        return {
            startYear: start,
            endYear: end,
            totalYears: total,
            totalWidth: total * YEAR_WIDTH
        };
    }, [settings]);

    const getEventStyle = (event, index) => {
        const startDate = new Date(event.start_date);
        const startYearVal = startDate.getFullYear();
        const startMonth = startDate.getMonth();

        // Calculate offset from start of timeline
        const yearsFromStart = startYearVal - startYear;
        const monthsFromStart = yearsFromStart * 12 + startMonth;

        const left = (monthsFromStart / (totalYears * 12)) * totalWidth;

        // Duration width (min 1 month)
        const endDate = event.end_date ? new Date(event.end_date) : startDate;
        const durationMonths = ((endDate.getFullYear() - startYearVal) * 12) + (endDate.getMonth() - startMonth) + 1;
        const width = (durationMonths / (totalYears * 12)) * totalWidth;

        // Stagger vertical position to avoid overlap (simple modulo for now)
        const top = 150 + (index % 5) * 70;

        return {
            left: `${left}px`,
            width: `${Math.max(width, 80)}px`, // Min width for visibility
            top: `${top}px`
        };
    };

    return { startYear, endYear, totalYears, totalWidth, getEventStyle };
};
