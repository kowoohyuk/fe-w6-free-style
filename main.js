import Contextmenu from './src/javascript/contextmenu.js';

const init = () => {
  const itemWrap = document.getElementById('itemWrap');
  const searchInput = document.getElementById('searchInput');
  const contentView = document.getElementById('contentView');
  const contextMenu = new Contextmenu(itemWrap);
  window.addEventListener('click', ({ target }) => handlePopup(target));
  window.addEventListener('contextmenu', ({ target }) => handlePopup(target));
  // const handleRClick = e => {
  //   if(e.target.closest('.item')) {

  //   }
  // }
  contentView.firstElementChild.addEventListener('click', () => {
    contentView.classList.remove('active');
  });
  itemWrap.addEventListener('dblclick', ({ target }) => handleDBClick(target));
  const handleDBClick = target => {
    const file = target.closest('.item-file');
    if(file) {
      const obj = { ...file.dataset };
      console.log(obj);
      contentView.lastElementChild.innerHTML = '';
      contentView.lastElementChild.innerHTML += '<h3>' + obj.name + '</h3>';
      contentView.lastElementChild.innerHTML += obj.content.replace(/\\r\\n/g, '<br>');
      contentView.classList.add('active');
    }
  }
  const handlePopup = target => {
    if(!target.closest('.popup')) {
      document.querySelectorAll('.popup').forEach(v => v.classList.add('hidden'));
    }
  }

  const testData = {
    _id: 'blabla',
    type: 'folder',
    author: '*',
    name: '프론트엔드',
    content: '',
    parent: '', // 이거 고민..
    status: 1,
    index: 0,
    depth: 0,
    color: '#000',
    bg_color: '#fff',
    bd_color: '#000',
    childs: [
      {
        type: 'folder',
        author: '*',
        name: '자바스크립트',
        content: '',
        status: 1,
        index: 0,
        depth: 1,
        color: '#000',
        bg_color: '#fff',
        bd_color: '#000',
        childs: [
          {
            type: 'file',
            author: '*',
            name: '참고 사이트',
            content: 'MDN : https://developer.mozilla.org/ko/\r\nJAVASCRIPT INFO : https://ko.javascript.info/\r\n제로초 : https://www.zerocho.com/\r\n포이에마웹 : https://poiemaweb.com/',
            status: 1,
            index: 0,
            depth: 2,
            color: '#000',
            bg_color: '#fff',
            bd_color: '#000',
            childs: []
          }
        ]
      },
      {
        type: 'folder',
        author: '*',
        name: 'HTML',
        content: '',
        status: 1,
        index: 1,
        depth: 1,
        color: '#000',
        bg_color: '#fff',
        bd_color: '#000',
      }
    ],
  };
  // localStorage.setItem('memotree', JSON.stringify(testData));
  // console.log(JSON.parse(localStorage.getItem('memotree')));
  const searchItem = target => {
    if(target.value === '') return;
    const list = document.querySelectorAll('.item');
    list.forEach(v => {
      if(v.dataset.name.includes(target.value)) {
        v.classList.add('on-search');
      } else {
        v.classList.remove('on-search');
      }
    });
  };
  searchInput.addEventListener('keyup', ({ target }) => searchItem(target));
}

init();