function extractPublicId(obj) {
  return obj.coverImage.split("/").reverse()[0].split(".")[0];
}

function extractPublicIdUser(obj) {
  return obj.image.split("/").reverse()[0].split(".")[0];
}

module.exports = { extractPublicId, extractPublicIdUser };
