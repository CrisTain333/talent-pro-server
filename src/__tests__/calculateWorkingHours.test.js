/* eslint-disable node/no-unpublished-require */
const { describe, it, expect } = require('@jest/globals');
const calculateWorkingHours = require('../utils/calculateWorkingsHours');

describe('calculateWorkingHours', () => {
    it('should calculate working hours between start and end times', () => {
        const start = '09:00';
        const end = '17:30';

        const result = calculateWorkingHours(start, end);
        expect(result).toBe('8:30');
    });

    it('should handle overnight working hours', () => {
        const start = '22:00';
        const end = '06:00';

        const result = calculateWorkingHours(start, end);
        expect(result).toBe('8:00');
    });

    it('should handle start time after end time', () => {
        const start = '20:00';
        const end = '06:00';

        const result = calculateWorkingHours(start, end);
        expect(result).toBe('10:00');
    });

    // Add more test cases to cover different scenarios

    it('should return 0 when start and end times are the same', () => {
        const start = '09:00';
        const end = '09:00';

        const result = calculateWorkingHours(start, end);
        expect(result).toBe('0:00');
    });
});
