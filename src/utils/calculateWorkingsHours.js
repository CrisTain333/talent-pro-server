function calculateWorkingHours(start, end) {
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    const startDate = new Date(0, 0, 0, startHour, startMinute);
    const endDate = new Date(0, 0, 0, endHour, endMinute);

    let diff = endDate.getTime() - startDate.getTime();
    if (diff < 0) {
        diff = diff + 24 * 60 * 60 * 1000;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff - hours * 1000 * 60 * 60) / (1000 * 60));

    return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

module.exports = calculateWorkingHours;
