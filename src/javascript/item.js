export default class Item {
  constructor({_id, menu, root, target, view, author, parent = null, type, name, content = '', childs = [], index, color = '#000', border_color = '#000', bg_color = '#fff', canvas, rootItem}) {
    this._id = _id;
    this.menu = menu;
    this.root = root;
    this.target = target;
    this.author = author;
    this.canvas = canvas;
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
    this.rootItem = rootItem;
    this.init();
  }
  init() {
    this.node = document.createElement('div');
    this.render();
    this.setStyles();
    this.setChilds();
    this.createEvent();
    this.setPosition();
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
  setPosition() {
    const thisPosition = this.node.firstElementChild.getBoundingClientRect();
    this.startX = thisPosition.x;
    this.endX = thisPosition.x + thisPosition.width;
    this.y = thisPosition.y - thisPosition.height / 2;
  }
  setChilds() {
    if(this.childs.length > 0) {
      this.childs = this.childs.map(v => {
        v.target = this.node.lastElementChild;
        v.root = this.root;
        v.view = this.view;
        v.menu = this.menu;
        v.canvas = this.canvas;
        v.parent = this;
        v.rootItem = this.rootItem;
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
      name : '',
      parent : this,
      view : this.view,
      canvas : this.canvas,
      root : this.root,
      rootItem : this.rootItem,
      type
    }
    const item = new Item(data);
    this.childs.push(item);
    this.drawingLine();
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
      this.parent.childs = this.parent.childs.filter(v => v !== this);
    }
    this.node.remove();
    this.parent.drawingLine();
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
      startX : this.startX,
      endX : this.endX,
      y : this.y,
    };
  }
  drawingLine() {
    const rootRect = this.root.getBoundingClientRect();
    const canvas = this.canvas;
    canvas.width = rootRect.width;
    canvas.height = rootRect.height;
    const rootClass = this.updatePosition();
    if(!rootClass) return;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    const dfs = item => {
      if(!item) return;
      const { endX, y } = item;
      ctx.moveTo(endX - 48, y - 80);
      item.childs.forEach(v => {
        ctx.lineTo(v.startX - 48, v.y - 80);
        ctx.moveTo(endX - 48, y - 80);
      });
      item.childs.forEach(v => {
        dfs(v);
      });
    };
    dfs(rootClass);
    ctx.stroke();
  }
  updatePosition() {
    if(!this.parent) return this;
    const getRootClass = item => {
      if(item.parent === null) return item;
      return getRootClass(item.parent);
    };
    const dfs = item => {
      if(!item) return;
      item.setPosition();
      item.childs.forEach(v => {
        dfs(v);
      });
    };
    const rootClass = getRootClass(this.parent);
    if(!rootClass) return;
    dfs(rootClass);
    return rootClass;
  }
}