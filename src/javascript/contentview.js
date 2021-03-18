export default class Contentview {
  constructor(target) {
    this.target = target;
    this.init();
  }
  init() {
    this.render();
  }
  render() {
    this.renderTextTag();
    this.renderCloseButton();
    this.renderModifyButton();
    this.renderCompleteButton();
    this.renderCancelButton();
  }
  renderCloseButton() {
    const button = document.createElement('button');
    button.classList.add('button__close');
    button.textContent = 'X';
    this.target.append(button);
    button.addEventListener('click', () => this.hideView());
  }
  renderModifyButton() {
    const button = document.createElement('button');
    button.classList.add('button__modify');
    button.textContent = '수정하기';
    this.target.append(button);
    this.modifyButton = button;
    button.addEventListener('click', () => this.modifyView());
  }
  renderCompleteButton() {
    const completeButton = document.createElement('button');
    completeButton.classList.add('button__update');
    completeButton.classList.add('hidden');
    completeButton.textContent = '완료';
    this.target.append(completeButton);
    this.completeButton = completeButton;
    completeButton.addEventListener('click', () => this.updateText());
  }
  renderCancelButton() {
    const cancelButton = document.createElement('button');
    cancelButton.classList.add('button__cancel');
    cancelButton.classList.add('hidden');
    cancelButton.textContent = '취소';
    this.target.append(cancelButton);
    this.cancelButton = cancelButton;
    cancelButton.addEventListener('click', () => this.removeModifyView());
  }
  renderTextTag() {
    const text = document.createElement('div');
    this.text = text;
    this.target.append(text);
  }
  openView(data) {
    this.selected = data;
    this.setText();
    this.target.classList.add('active');
  }
  setText() {
    this.text.innerHTML = `<h3>${this.selected.name}</h3><p>${this.selected.content.replace(/\r\n/g, '<br>')}</p>`;
  }
  hideView() {
    this.target.classList.remove('active');
  }
  modifyView() {
    const textarea = document.createElement('textarea');
    this.text.lastElementChild.classList.add('hidden');
    this.textarea = textarea;
    this.target.append(textarea);
    textarea.focus();
    textarea.value = this.selected.content;
    this.toggleButton();
  }
  updateText() {
    this.selected.content = this.textarea.value.replace(/(?:\r\n|\r|\n)/g, '\r\n');
    this.setText();
    this.removeModifyView();
  }
  removeModifyView() {
    this.textarea.remove();
    this.text.lastElementChild.classList.remove('hidden');
    this.toggleButton();
  }
  toggleButton() {
    this.modifyButton.classList.toggle('hidden');
    this.cancelButton.classList.toggle('hidden');
    this.completeButton.classList.toggle('hidden');
  }
}

