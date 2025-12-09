const CalendarYearCounter = ({ year }) => {
    return (
        <div className="absolute top-24 left-10 z-0 pointer-events-none">
            <h1 className="text-[15vw] font-bold text-primary/30 leading-none tracking-tighter transition-all duration-300">
                {year}
            </h1>
        </div>
    );
};

export default CalendarYearCounter;
