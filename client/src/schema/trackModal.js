import * as Yup from 'yup';

export const songSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .trim(),

  artistId: Yup.string()
    .matches(/^[0-9a-fA-F]{24}$/, "Artist ID must be a valid MongoDB ID")
    .required("Artist ID is required"),

  duration: Yup.number()
    .positive("Duration must be a positive number")
    .required("Duration is required"),

  genreId: Yup.string()
    .matches(/^[0-9a-fA-F]{24}$/, "Genre ID must be a valid MongoDB ID")
    .required("Genre is required"),

  type: Yup.string()
    .oneOf(["single", "album"], 'Type must be either "single" or "album"')
    .required("Type is required"),

  premiumOnly: Yup.boolean(),

  collaboratedArtistIds: Yup.array()
    .of(Yup.string().matches(/^[0-9a-fA-F]{24}$/, "Collaborated Artist IDs must be valid MongoDB IDs"))
    .optional(),

  coverImage: Yup.mixed()
    .required("Cover image is required")
    .test("fileType", "Only image files (PNG, JPG, JPEG) are allowed.", (value) => {
      if (!value) return false;
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      return validTypes.includes(value.type);
    })
    .test("fileSize", "File size must be less than 5MB", (value) => {
      if (!value) return true;
      return value.size <= 5 * 1024 * 1024;
    }),

  previewUrl: Yup.mixed()
    .required("Audio preview is required")
    .test("fileType", "Only audio files (MP3, WAV) are allowed.", (value) => {
      if (!value) return false;
      const validTypes = ["audio/mpeg", "audio/wav"];
      return validTypes.includes(value.type);
    })
    .test("fileSize", "File size must be less than 5MB", (value) => {
      if (!value) return true;
      return value.size <= 5 * 1024 * 1024;
    })
});
