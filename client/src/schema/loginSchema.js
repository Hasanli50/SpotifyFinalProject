import * as yup from "yup";


export const loginSchema = yup.object().shape({
  username: yup.string()
    .min(3, "Username must be at least 3 characters long.")
    .required("Username is required")
    .trim(),
  password: yup.string()
    .min(6, "Password must be at least 6 characters long.")
    .matches(/\d/, "Password must contain at least one number.")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter.")
    .required("Password is required.")
    .trim(),
});
