function calculateWorkingHours(start, end) {
    const [startHour, startMinute, startPeriod] = parseTime(start);
    const [endHour, endMinute, endPeriod] = parseTime(end);

    const startDate = new Date(
        0,
        0,
        0,
        startHour + (startPeriod === 'PM' ? 12 : 0),
        startMinute
    );
    const endDate = new Date(
        0,
        0,
        0,
        endHour + (endPeriod === 'PM' ? 12 : 0),
        endMinute
    );

    let diff = endDate.getTime() - startDate.getTime();
    if (diff < 0) {
        diff = diff + 24 * 60 * 60 * 1000;
    }

    const hours = Math.round(diff / (1000 * 60 * 60));

    return hours;
}

function parseTime(time) {
    const [timePart, period] = time.split(' ');
    const [hour, minute] = timePart.split(':').map(Number);
    return [hour, minute, period];
}

module.exports = calculateWorkingHours;
