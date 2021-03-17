export default class Contentview {
  constructor(target) {
    this.target = target;
    this.init();
  }
  init() {
    this.setButton();
    this.setTextTag();
    this.render();
    this.createEvent();
  }
  render() {
    this.target.append(this.button);
    this.target.append(this.text);
  }
  setButton() {
    const button = document.createElement('button');
    button.textContent = 'X';
    this.button = button;
  }
  setTextTag() {
    const text = document.createElement('div');
    this.text = text;
  }
  createEvent() {
    this.button.addEventListener('click', () => this.hideView());
  }
  openView(data) {
    this.text.innerHTML = `<h3>${data.name}</h3><p>${data.content.replace(/\r\n/g, '<br>')}</p>`;
    this.target.classList.add('active');
  }
  hideView() {
    this.target.classList.remove('active');
  }
}

