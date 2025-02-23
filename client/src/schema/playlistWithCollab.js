import * as Yup from "yup";

export const createPlaylistWithCollabSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters long.")
    .required("Name is required")
    .trim(),

  collaborators: Yup.array().of(
    Yup.string()
      .required("Collaborater is required")
      .matches(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId")
  ),
});
