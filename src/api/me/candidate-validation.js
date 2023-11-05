const z = require('zod');
const industrySchema = z.object({
    label: z.string({
        required_error: 'industry label is required'
    }),
    value: z.string({
        required_error: 'industry value is required'
    })
});

const desiredSalarySchema = z.object({
    minimum: z
        .number({
            required_error:
                'minimum desired salary is required'
        })
        .min(0),
    maximum: z
        .number({
            required_error: ' maximum salary is required'
        })
        .min(0)
});

const candidateProfileSchema = z.object({
    body: z.object({
        userId: z.string({
            required_error: 'user Id is required'
        }),
        industry: industrySchema,
        job_status: z.enum([
            'Employed',
            'Not Employed',
            'Student'
        ]),
        employment_type: z.enum([
            'Full time',
            'Part-time',
            'Intern'
        ]),
        work_location: z.string({
            required_error: 'work location is required'
        }),
        work_remotely: z.boolean(),
        desired_salary: desiredSalarySchema,
        resume: z.string().optional()
    })
});

module.exports = {
    candidateProfileSchema
};
