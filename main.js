import Contextmenu from './src/javascript/contextmenu.js';
import Contentview from './src/javascript/contentview.js';
import Item from './src/javascript/item.js';

const init = () => {
  const itemTarget = document.getElementById('itemTarget');
  const searchInput = document.getElementById('searchInput');
  const contentview = document.getElementById('contentview');
  const saveButton = document.getElementById('saveButton');
  const contextMenu = new Contextmenu(itemTarget);
  const contentView = new Contentview(contentview);
  
  let cache = getData();
  if(!cache) cache = setData();
  const cacheItem = JSON.parse(cache);
  cacheItem.target = itemTarget;
  cacheItem.menu = contextMenu;
  cacheItem.view = contentView;
  const item = new Item(cacheItem);

  const handlePopup = target => {
    if(!target.closest('.popup')) {
      document.querySelectorAll('.popup').forEach(v => v.classList.add('hidden'));
    }
  };

  const searchItem = target => {
    if(target.value === '') return;
    const list = document.querySelectorAll('.item__tag');
    list.forEach(v => {
      if(v.value.includes(target.value)) {
        v.classList.add('on-search');
      } else {
        v.classList.remove('on-search');
      }
    });
  };
  searchInput.addEventListener('keyup', ({ target }) => searchItem(target));

  window.addEventListener('click', ({ target }) => handlePopup(target));
  window.addEventListener('contextmenu', ({ target }) => handlePopup(target));
  saveButton.addEventListener('click', () => saveData(item));
};

const getData = () => localStorage.getItem('memotree');
const setData = () => {
  const defaultData = {
    _id: null,
    type: 'folder',
    author: '*',
    name: '제목 없음',
    parent: null,
    status: 1,
  };
  localStorage.setItem('memotree', JSON.stringify(defaultData));
  return localStorage.getItem('memotree');
};
const saveData = item => {
  const dfs = item => {
    if(!item) return;
    const result = item.toObject();
    result.childs = item.childs.map(v => dfs(v));
    return result;
  };
  localStorage.setItem('memotree', JSON.stringify(dfs(item)));
}

init();
