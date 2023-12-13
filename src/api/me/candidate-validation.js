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
        user: z.string({
            required_error: 'user Id is required'
        }),
        industry: industrySchema,
        job_status: z.enum([
            'EMPLOYED',
            'NOT_EMPLOYED',
            'STUDENT'
        ]),
        employment_type: z.enum([
            'FULL_TIME',
            'PART_TIME',
            'INTERN'
        ]),
        work_location: z.string({
            required_error: 'work location is required'
        }),
        work_remotely: z.boolean(),
        desired_salary: desiredSalarySchema,
        phone: z.string({
            required_error: 'phone is required'
        }),
        portfolio: z.string({
            required_error: 'portfolio is required'
        }),
        resume: z.string().optional()
    })
});

const candidateInfoUpdateProfileSchema = z.object({
    body: z.object({
        phone: z.string({
            required_error: 'phone is required'
        }),
        location: z.string({
            required_error: 'location is required'
        }),
        industry: z.string({
            required_error: 'industry is required'
        }),
        job_status: z.string({
            required_error: 'job status is required'
        })
    })
});

const experienceUpdateSchema = z.object({
    body: z.object({
        company_name: z.string({
            required_error: 'company name is required'
        }),
        designation: z.string({
            required_error: 'designation is required'
        }),
        job_type: z.string({
            required_error: 'job type is required'
        }),
        start_date: z.string({
            required_error: 'start date is required'
        }),
        end_date: z
            .string({
                required_error: 'end date is required'
            })
            .optional(),
        work_currently: z.boolean({
            required_error: 'work currently is required'
        })
    })
});

// company_name: values.company_name,
//         designation: values.designation,
//         job_type: values.job_type,
//         start_date: values.start_date,
//         end_date: values.end_date,
//         work_currently: values.work_currently,

module.exports = {
    candidateProfileSchema,
    candidateInfoUpdateProfileSchema,
    experienceUpdateSchema
};
