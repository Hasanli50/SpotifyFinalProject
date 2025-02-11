import * as Yup from "yup";

export const forgotPassSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please provide a valid email.")
    .matches(
      /@gmail\.com$|@mail\.ru$/,
      "Email must be from either Gmail or Mail.ru."
    )
    .required("Email cannot be empty."),
});
