import { v4 as uuidv4 } from "uuid";
export class Album {
  constructor(name, coverImage, artistId) {
    this.id = uuidv4();
    this.name = name;
    this.coverImage = coverImage;
    this.artistId = artistId;
    this.trackCount = 0;
    this.trackIds = [];
    this.monthlyPlayCount = 0;
  }
}
