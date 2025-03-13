function extractPublicIdImage(obj) {
  return obj.coverImage.split("/").reverse()[0].split(".")[0];
}

const extractPublicIAudio = (obj) => {
  return obj.previewUrl.split("/").reverse()[0].split(".")[0];
};

module.exports = { extractPublicIdImage, extractPublicIAudio };
