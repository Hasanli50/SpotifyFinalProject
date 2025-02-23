import * as Yup from "yup";

export const signUpSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters long.")
    .required("Username is required")
    .trim(),
  email: Yup.string()
    .email("Please provide a valid email.")
    .matches(
      /@gmail\.com$|@mail\.ru$/,
      "Email must be from either Gmail or Mail.ru."
    )
    .required("Email cannot be empty."),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long.")
    .matches(/\d/, "Password must contain at least one number.")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter.")
    .required("Password is required.")
    .trim(),

  image: Yup.mixed()
    .test(
      "fileType",
      "Only image files (PNG, JPG, JPEG) are allowed.",
      (value) => {
        if (!value) return true;
        const validTypes = ["image/png", "image/jpeg", "image/jpg"];
        return validTypes.includes(value.type) && !value.name.endsWith(".jfif");
      }
    )
    .test("fileSize", "File size must be less than 5MB", (value) => {
      if (!value) return true;
      return value && value.size <= 5 * 1024 * 1024;
    }),
});
