import { v4 as uuidv4 } from "uuid";
export class Register {
  constructor(username, email, password, image) {
    this.id = uuidv4();
    this.username = username;
    this.email = email;
    this.password = password;
    this.image = image;
    this.role = "artist";
    this.genreIds = [];
    this.followers = 0;
    this.albums_count = 0;
    this.description = "";
    this.trackIds = [];
    this.albumIds = [];
    this.social_media = {};
    this.status = "pending";
    this.isFrozen = false;
    this.isBanned = false;
    this.banExpiresAt = null;
    this.isDeleted = false;
  }
}
