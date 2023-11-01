const z = require("zod");

const userRegisterValidation = z.object({
  body: z.object({
    name: z.object({
      first_name: z
        .string({
          required_error: "First name is required",
        })
        .min(1)
        .max(255),
      last_name: z
        .string({
          required_error: "First name is required",
        })
        .min(1)
        .max(255),
    }),
    email: z
      .string({
        required_error: "email is required",
      })
      .min(1)
      .max(255)
      .email(),
    password: z
      .string({
        required_error: "password is require",
      })
      .min(8),
  }),
});

const LoginValidation = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .min(1)
      .max(255)
      .email(),
    password: z
      .string({
        required_error: "Password is require",
      })
      .min(8, {
        message: "password must contain at least 8 character(s)",
      }),
  }),
});

module.exports = {
  userRegisterValidation,
  LoginValidation,
};
