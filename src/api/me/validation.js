const z = require('zod');

const userUpdateValidation = z.object({
    body: z.object({
        name: z
            .object({
                first_name: z
                    .string()
                    .min(2, {
                        message: 'First name is too short'
                    })
                    .max(255)
                    .optional(),
                last_name: z
                    .string()
                    .min(2, {
                        message: 'Last name is too short'
                    })
                    .max(255)
                    .optional()
            })
            .optional(),

        password: z.string().min(8).optional()
    })
});

module.exports = {
    userUpdateValidation
};
