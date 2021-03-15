export class Item {
  constructor({_id, author, type, name, content, parent, index, color = '#000', border_color = '#000'}) {
    this.id = _id;
    this.author = author;
    this.type = type;
    this.name = name;
    this.content = content;
    this.parent = parent;
    this.index = index;
    this.color = color;
    this.border_color = border_color;
    this.init();
  }
  init() {
    console.log(this);
  }
}
