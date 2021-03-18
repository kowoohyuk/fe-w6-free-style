export default class Contextmenu {
  constructor(target) {
    this.target = target;
    this.selected = null;
    this.self = null;
    this.init();
  }
  init() {
    this.initMenu();
    this.render();
    this.createEvent();
  }
  initMenu() {
    this.menu = [
      { name : '폴더 생성', fn : () => this.addFolder() },
      { name : '파일 생성', fn : () => this.addFile() },
      { name : '글자 색상변경', fn : e => this.showColorPicker(e) },
      { name : '배경 색상변경', fn : e => this.showColorPicker(e) },
      { name : '테두리 색상변경', fn : e => this.showColorPicker(e) },
      { name : '삭제', fn : () => this.deleteItem() },
    ];
  }
  render() {
    const ul = document.createElement('ul');
    ul.classList.add('contextmenu', 'popup', 'hidden');
    ul.insertAdjacentHTML('beforeend', this.menu.reduce((acc, item, index) => acc += `<li data-index="${index}">${item.name}</li>`, ''));
    this.target.append(ul);
    this.self = ul;
    this.renderColorPicker();
  }
  renderColorPicker() {
    const colors = ['black', 'gray', 'skyblue', 'forestgreen', 'red', 'violet', 'sienna'];
    this.target.insertAdjacentHTML('beforeend', 
      colors.reduce(
        (acc, cur) => acc += `<span class="color" data-color="${cur}" style="background-color:${cur}";></span>`, 
        '<div class="color-picker hidden">'
      ) + '</div>'
    );
    this.colorPicker = this.target.lastElementChild;
  }
  createEvent() {
    this.self.addEventListener('click', e => this.handleMenuEvent(e));
    this.colorPicker.addEventListener('click', e => this.handleColor(e));
  }
  handleMenuEvent(e) {
    const index = e.target.dataset.index;
    this.menu[index].fn(e);
  }
  addFolder() {
    this.selected.addChild('folder');
    this.hideFileContext();
  }
  addFile() {
    this.selected.addChild('file');
    this.hideFileContext();
  }
  handleColor(e) {
    const color = e.target.dataset.color;
    switch(this.colorPicker.dataset.index) {
      case '2': this.selected.color = color; break;
      case '3': this.selected.bg_color = color; break;
      case '4': this.selected.border_color = color; break;
      default: break;
    };
    this.selected.setStyles();
    this.hideColorPicker();
  }
  deleteItem() {
    this.selected.delete();
    this.hideFileContext();
  }
  openMenu(e, target) {
    this.selected = target;
    e.stopPropagation();
    e.preventDefault();
    this.showFileContext(e.pageX - 48, e.pageY - 120);
  }
  showFileContext(x, y) {
    if(this.selected.type === 'file') {
      this.self.childNodes[0].classList.add('hidden');
      this.self.childNodes[1].classList.add('hidden');
    } else {
      this.self.childNodes[0].classList.remove('hidden');
      this.self.childNodes[1].classList.remove('hidden');     
    }
    this.self.style.cssText = `left: ${x}px; top: ${y}px`;
    this.self.classList.remove('hidden');
  }
  hideFileContext() {
    this.self.classList.add('hidden');
    this.colorPicker.classList.add('hidden');
  }
  showColorPicker(e) {
    const left = Number(this.self.style.left.replace('px', '')) + Number(this.self.getBoundingClientRect().width);
    const top = Number(this.self.style.top.replace('px', '')) + Number(this.self.childNodes[0].getBoundingClientRect().height * e.target.dataset.index);
    this.colorPicker.dataset.index = e.target.dataset.index;
    this.colorPicker.style.left = left + 'px';
    this.colorPicker.style.top = top + 'px';
    this.colorPicker.classList.remove('hidden');
  }
  hideColorPicker() {
    this.colorPicker.classList.add('hidden');
  }
};