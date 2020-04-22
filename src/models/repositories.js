const { uuid, isUuid } = require("uuidv4");

class Repositories {
  constructor(title, techs, url) {
    this.title = title;
    this.techs = techs;
    this.url = url;
    this.likes = 0;
    this.id = uuid();
  }

  incrementLikes() {
    this.likes++;
  }

  decrementLikes() {
    if (this.likes) this.likes--;
  }
}

module.exports = Repositories;
