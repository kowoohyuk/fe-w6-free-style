// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/javascript/contextmenu.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Contextmenu {
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
    this.menu = [{
      name: '폴더 생성',
      fn: () => this.addFolder()
    }, {
      name: '파일 생성',
      fn: () => this.addFile()
    }, {
      name: '글자 색상변경',
      fn: e => this.showColorPicker(e)
    }, {
      name: '배경 색상변경',
      fn: e => this.showColorPicker(e)
    }, {
      name: '테두리 색상변경',
      fn: e => this.showColorPicker(e)
    }, {
      name: '삭제',
      fn: () => this.deleteItem()
    }];
  }

  render() {
    const ul = document.createElement('ul');
    ul.classList.add('contextmenu', 'popup', 'hidden');
    ul.insertAdjacentHTML('beforeend', this.menu.reduce((acc, item, index) => acc += "<li data-index=\"".concat(index, "\">").concat(item.name, "</li>"), ''));
    this.target.append(ul);
    this.self = ul;
    this.renderColorPicker();
  }

  renderColorPicker() {
    const colors = ['black', 'gray', 'skyblue', 'forestgreen', 'red', 'violet', 'sienna'];
    this.target.insertAdjacentHTML('beforeend', colors.reduce((acc, cur) => acc += "<span class=\"color\" data-color=\"".concat(cur, "\" style=\"background-color:").concat(cur, "\";></span>"), '<div class="color-picker hidden">') + '</div>');
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

    switch (this.colorPicker.dataset.index) {
      case '2':
        this.selected.color = color;
        break;

      case '3':
        this.selected.bg_color = color;
        break;

      case '4':
        this.selected.border_color = color;
        break;

      default:
        break;
    }

    ;
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
    if (this.selected.type === 'file') {
      this.self.childNodes[0].classList.add('hidden');
      this.self.childNodes[1].classList.add('hidden');
    } else {
      this.self.childNodes[0].classList.remove('hidden');
      this.self.childNodes[1].classList.remove('hidden');
    }

    this.self.style.cssText = "left: ".concat(x, "px; top: ").concat(y, "px");
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

}

exports.default = Contextmenu;
;
},{}],"src/javascript/contentview.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Contentview {
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
    this.text.innerHTML = "<h3>".concat(this.selected.name, "</h3><p>").concat(this.selected.content.replace(/\r\n/g, '<br>'), "</p>");
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

exports.default = Contentview;
},{}],"src/javascript/item.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Item {
  constructor({
    _id,
    menu,
    root,
    target,
    view,
    author,
    parent = null,
    type,
    name,
    content = '',
    childs = [],
    index,
    color = '#000',
    border_color = '#000',
    bg_color = '#fff',
    canvas,
    rootItem
  }) {
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
    this.node.classList.add('item', "item-".concat(this.type));
    this.node.insertAdjacentHTML('beforeend', "<input class=\"item__tag\" value=\"".concat(this.name, "\">"));
    this.node.insertAdjacentHTML('beforeend', "<div class=\"item__children\"></div>");
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
    if (this.childs.length > 0) {
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
    if (this.type === 'file') this.node.addEventListener('dblclick', () => this.view.openView(this));
  }

  handleName(e) {
    if (this.name !== e.target.value) {
      this.name = e.target.value;
    }
  }

  addChild(type) {
    const data = {
      target: this.node.lastElementChild,
      menu: this.menu,
      author: this.author,
      name: '',
      parent: this,
      view: this.view,
      canvas: this.canvas,
      root: this.root,
      rootItem: this.rootItem,
      type
    };
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

    if (this.parent) {
      this.parent.childs = this.parent.childs.filter(v => v !== this);
    }

    this.node.remove();
    this.updatePosition();
    this.drawingLine();
  }

  toObject() {
    return {
      _id: this._id,
      type: this.type,
      author: this.author,
      name: this.name,
      border_color: this.border_color,
      color: this.color,
      bg_color: this.bg_color,
      content: this.content,
      startX: this.startX,
      endX: this.endX,
      y: this.y
    };
  }

  drawingLine() {
    const rootRect = this.root.getBoundingClientRect();
    const canvas = this.canvas;
    canvas.width = rootRect.width;
    canvas.height = rootRect.height;
    const rootClass = this.updatePosition();
    if (!rootClass) return;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();

    const dfs = item => {
      if (!item) return;
      const {
        endX,
        y
      } = item;
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
    if (!this.parent) return this;

    const getRootClass = item => {
      if (item.parent === null) return item;
      return getRootClass(item.parent);
    };

    const dfs = item => {
      if (!item) return;
      item.setPosition();
      item.childs.forEach(v => {
        dfs(v);
      });
    };

    const rootClass = getRootClass(this.parent);
    if (!rootClass) return;
    dfs(rootClass);
    return rootClass;
  }

}

exports.default = Item;
},{}],"main.js":[function(require,module,exports) {
"use strict";

var _contextmenu = _interopRequireDefault(require("./src/javascript/contextmenu.js"));

var _contentview = _interopRequireDefault(require("./src/javascript/contentview.js"));

var _item = _interopRequireDefault(require("./src/javascript/item.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const itemTarget = document.getElementById('itemTarget');
const searchInput = document.getElementById('searchInput');
const contentview = document.getElementById('contentview');
const saveButton = document.getElementById('saveButton');
const shareButton = document.getElementById('shareButton');
const titleInput = document.getElementById('titleInput');

const init = async () => {
  const contextMenu = new _contextmenu.default(itemTarget);
  const contentView = new _contentview.default(contentview);
  const canvas = document.querySelector('.canvas');
  const treeId = location.pathname.slice(1);
  let item = null;
  let rootNode = null;

  if (treeId.length > 0) {
    const result = await fetch("/memotree/".concat(treeId));
    rootNode = await result.json();
  } else {
    let cache = getData();
    if (!cache) cache = setData();
    rootNode = JSON.parse(cache);
  }

  rootNode.root = itemTarget;
  rootNode.target = itemTarget;
  rootNode.menu = contextMenu;
  rootNode.view = contentView;
  rootNode.canvas = canvas;
  rootNode.rootItem = rootNode;

  if (rootNode.title) {
    titleInput.value = rootNode.title;
  }

  item = new _item.default(rootNode);
  item.drawingLine();

  const handlePopup = target => {
    if (!target.closest('.popup')) {
      document.querySelectorAll('.popup').forEach(v => v.classList.add('hidden'));
    }
  };

  const searchItem = target => {
    if (target.value === '') return;
    const list = document.querySelectorAll('.item__tag');
    list.forEach(v => {
      if (v.value.includes(target.value)) {
        v.classList.add('on-search');
      } else {
        v.classList.remove('on-search');
      }
    });
  };

  searchInput.addEventListener('keyup', ({
    target
  }) => searchItem(target));
  window.addEventListener('click', ({
    target
  }) => handlePopup(target));
  window.addEventListener('contextmenu', ({
    target
  }) => handlePopup(target));
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
    status: 1
  };
  localStorage.setItem('memotree', JSON.stringify(defaultData));
  return localStorage.getItem('memotree');
};

const saveData = item => {
  const dfs = item => {
    if (!item) return;
    const result = item.toObject();
    result.childs = item.childs.map(v => dfs(v));
    return result;
  };

  const result = dfs(item);
  result.title = titleInput.value;
  localStorage.setItem('memotree', JSON.stringify(result));
};

const shareData = async item => {
  const result = await fetch('/memotree', {
    method: 'POST',
    body: item,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
  const id = await result.json();
  alert('새로운 주소가 생성되었습니다!');
  location.href = location.origin + '/' + id;
};

init();
},{"./src/javascript/contextmenu.js":"src/javascript/contextmenu.js","./src/javascript/contentview.js":"src/javascript/contentview.js","./src/javascript/item.js":"src/javascript/item.js"}],"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56425" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map