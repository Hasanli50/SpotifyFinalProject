import * as Yup from "yup";


export const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters long.")
    .required("Username is required")
    .trim(),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long.")
    .matches(/\d/, "Password must contain at least one number.")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter.")
    .required("Password is required.")
    .trim(),
});
