import * as Yup from "yup";

export const albumSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters long.")
    .required("Name is required")
    .trim(),

  coverImage: Yup.mixed()
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
