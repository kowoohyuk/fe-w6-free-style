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
      { name : '글자 색상변경', fn : () => this.updateColor() },
      { name : '배경 색상변경', fn : () => this.updateBgColor() },
      { name : '테두리 색상변경', fn : () => this.updateBdColor() },
      { name : '삭제', fn : () => this.deleteItem() },
    ];
  }
  render() {
    const ul = document.createElement('ul');
    ul.classList.add('contextmenu', 'popup', 'hidden');
    ul.insertAdjacentHTML('beforeend', this.menu.reduce((acc, item, index) => acc += `<li data-index="${index}">${item.name}</li>`, ''));
    this.target.append(ul);
    this.self = ul;
  }
  createEvent() {
    this.self.addEventListener('click', e => this.handleMenuEvent(e.target.dataset.index));
  }
  handleMenuEvent(index) {
    this.menu[index].fn();
    this.hideFileContext();
  }
  addFolder() {
    this.selected.addChild('folder');
  }
  addFile() {
    this.selected.addChild('file');
  }
  updateColor() {
    alert('만들고 있어요...');
  }
  updateBgColor() {
    alert('만들고 있어요...');
  }
  updateBdColor() {
    alert('만들고 있어요...');
  }
  deleteItem() {
    this.selected.delete();
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
  }
};