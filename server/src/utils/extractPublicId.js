function extractPublicId(obj) {
  return obj.image.split("/").reverse()[0].split(".")[0];
}

module.exports = extractPublicId;
