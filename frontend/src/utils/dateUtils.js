export const formatDateRange = (startDateStr, endDateStr) => {
    if (!startDateStr) return '';

    const getParts = (dateStr) => {
        // Handle potentially different formats, but prioritize YYYY-MM-DD
        let d;
        if (dateStr.includes('-')) {
            const [year, month, day] = dateStr.split('T')[0].split('-');
            // Create date in local time to avoid timezone shifts
            d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
            d = new Date(dateStr);
        }

        return {
            month: d.toLocaleString('en-US', { month: 'short' }),
            year: d.getFullYear(),
            yearShort: "'" + d.getFullYear().toString().slice(2)
        };
    };

    const start = getParts(startDateStr);

    if (!endDateStr) {
        return `${start.month} ${start.yearShort} — Present`;
    }

    const end = getParts(endDateStr);

    if (start.year === end.year) {
        return `${start.month} — ${end.month} ${end.yearShort}`;
    }

    return `${start.month} ${start.yearShort} — ${end.month} ${end.yearShort}`;
};
