export default class Item {
  constructor({_id, menu, target, view, author, parent = null, type, name, content = '', childs = [], index, color = '#000', border_color = '#000', bg_color = '#fff'}) {
    this._id = _id;
    this.menu = menu;
    this.target = target;
    this.author = author;
    this.type = type;
    this.name = name;
    this.content = content;
    this.childs = childs;
    this.index = index;
    this.color = color;
    this.border_color = border_color;
    this.bg_color = bg_color;
    this.parent = parent;
    this.view = view;
    this.init();
  }
  init() {
    this.node = document.createElement('div');
    this.render();
    this.setStyles();
    this.setChilds();
    this.createEvent();
  }
  render() {
    this.node.classList.add('item', `item-${this.type}`);
    this.node.insertAdjacentHTML('beforeend', `<input class="item__tag" value="${this.name}">`);
    this.node.insertAdjacentHTML('beforeend', `<div class="item__children"></div>`);
    this.target.append(this.node);
  }
  setStyles() {
    const tag = this.node.firstElementChild;
    tag.style.color = this.color;
    tag.style.borderColor = this.border_color;
    tag.style.backgroundColor = this.bg_color;
  }
  setChilds() {
    if(this.childs.length > 0) {
      this.childs = this.childs.map(v => {
        v.target = this.node.lastElementChild;
        v.view = this.view;
        v.menu = this.menu;
        v.parent = this;
        return new Item(v);
      });
    }
  }
  createEvent() {
    this.node.addEventListener('contextmenu', e => this.menu.openMenu(e, this));
    this.node.firstElementChild.addEventListener('focusout', e => this.handleName(e));
    if(this.type === 'file')
      this.node.addEventListener('dblclick', () => this.view.openView(this));
  }
  handleName(e) {
    if(this.name !== e.target.value) {
      this.name = e.target.value;
    }
  }
  addChild(type) {
    const data = {
      target : this.node.lastElementChild,
      menu : this.menu,
      author : this.author,
      name : '이름 없음',
      parent : this,
      view : this.view,
      type
    }
    const item = new Item(data);
    this.childs.push(item);
    item.evFocusNameTag();
  }
  evFocusNameTag() {
    this.node.firstElementChild.focus();
  }
  delete() {
    this.childs.forEach(v => {
      v.delete();
    });
    if(this.parent) {
      this.parent.childs = this.parent.childs.filter(v => {
        v !== this;
      });
    }
    this.node.remove();
  }
  toObject() {
    return {
      _id: this._id,
      type: this.type,
      author: this.author,
      name : this.name,
      border_color : this.border_color,
      color : this.color,
      bg_color : this.bg_color,
      content : this.content,
    };
  }
}
