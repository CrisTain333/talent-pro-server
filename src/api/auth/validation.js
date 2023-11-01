const z = require("zod");

const userRegisterValidation = z.object({
  body: z.object({
    name: z.object({
      first_name: z.string().min(1).max(255),
      last_name: z.string().min(1).max(255),
    }),
    email: z.string().min(1).max(255),
    password: z.string().min(8), // You can adjust the minimum password length as needed
  }),
});

module.exports = { userRegisterValidation };
