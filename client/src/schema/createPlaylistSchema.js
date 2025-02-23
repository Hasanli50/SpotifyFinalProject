import * as Yup from "yup";

export const createPlaylistSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters long.")
    .required("Name is required")
    .trim(),
});
