export default class Contextmenu {
  constructor(target) {
    this.target = target;
    this.self = null;
    this.init();
  }
  init() {
    this.initMenu();
    this.render();
    this.target.addEventListener('contextmenu', e => this.handleContextmenuEvent(e));
  }
  initMenu() {
    this.menu = [
      { name : '폴더 생성', fn : () => this.addFolder() },
      { name : '파일 생성', fn : () => this.addFile() },
      { name : '이름 변경', fn : () => this.updateName() },
      { name : '글자 색상변경', fn : () => this.updateColor() },
      { name : '배경 색상변경', fn : () => this.updateBgColor() },
      { name : '테두리 색상변경', fn : () => this.updateBdColor() },
      { name : '삭제', fn : () => this.delete() },
    ];
  }
  render() {
    const ul = document.createElement('ul');
    ul.classList.add('contextmenu', 'popup', 'hidden');
    ul.insertAdjacentHTML('beforeend', this.menu.reduce((acc, item) => acc += `<li>${item.name}</li>`, ''));
    this.target.append(ul);
    this.self = ul;
  }
  handleContextmenuEvent(e) {
    const item = e.target.closest('.item');
    if(item) {
      // 1. item의 dataset을 가져옴
      // 2. 생성, 변경 등으로 정보 업데이트
      // 3. 로컬 스토리지에 변경 값 저장
      const obj = { ...item.dataset };
      console.log(obj);
      // console.log(localStorage.getItem('memotree'));
      e.preventDefault();
      e.stopPropagation();
      this.showFileContext(e.pageX - 48, e.pageY - 120);
    }
  }
  showFileContext(x, y) {
    this.self.style.cssText = `left: ${x}px; top: ${y}px`;
    this.self.classList.remove('hidden');
  }
};