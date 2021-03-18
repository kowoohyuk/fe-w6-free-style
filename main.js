import Contextmenu from './src/javascript/contextmenu.js';
import Contentview from './src/javascript/contentview.js';
import Item from './src/javascript/item.js';

const itemTarget = document.getElementById('itemTarget');
const searchInput = document.getElementById('searchInput');
const contentview = document.getElementById('contentview');
const saveButton = document.getElementById('saveButton');
const shareButton = document.getElementById('shareButton');
const titleInput = document.getElementById('titleInput');

const init = async () => {
  const contextMenu = new Contextmenu(itemTarget);
  const contentView = new Contentview(contentview);
  const canvas = document.querySelector('.canvas');

  const treeId = location.pathname.slice(1);
  let item = null;
  let rootNode = null;
  if(treeId.length > 0) {
    const result = await fetch(`/memotree/${treeId}`);
    console.log(result);
    rootNode = await result.json();
  } else {
    let cache = getData();
    if(!cache) cache = setData();
    rootNode = JSON.parse(cache);
  }
  rootNode.root = itemTarget;
  rootNode.target = itemTarget;
  rootNode.menu = contextMenu;
  rootNode.view = contentView;
  rootNode.canvas = canvas;
  rootNode.rootItem = rootNode;
  titleInput.value = rootNode.title;
  item = new Item(rootNode);
  item.drawingLine();
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
  shareButton.addEventListener('click', () => {
    delete item._id;
    saveData(item);
    shareData(getData());
  });
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
  const result = dfs(item);
  result.title = titleInput.value;
  localStorage.setItem('memotree', JSON.stringify(result));
}
const shareData = async item => {
  const result = await fetch('/memotree', { 
    method: 'POST', 
    body: item, 
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } 
  });
  const id = await result.json();
  alert(id);
  location.href = location.origin + '/' + id;
}

init();