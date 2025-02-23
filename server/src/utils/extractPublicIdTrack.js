function extractPublicIdImage(obj) {
  return obj.coverImage.split("/").reverse()[0].split(".")[0];
}

const extractPublicIAudio = (obj) => {
  let publicId = obj.previewUrl.split("/").pop().split(".")[0];
  return publicId;
};


// function extractPublicIAudio(obj) {
//   let publicId = obj.previewUrl.split("/").reverse()[0];
//   return decodeURIComponent(publicId);
// }

module.exports = { extractPublicIdImage, extractPublicIAudio };
