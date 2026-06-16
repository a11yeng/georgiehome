const LEGACY_STORAGE_KEY = 'speakgrid-aac-board-v1';
const PROFILES_STORAGE_KEY = 'speakgrid-aac-profiles-v1';
const PROFILE_EXPORT_VERSION = 'speakgrid-profile-export-v1';
const ALL_PROFILES_EXPORT_VERSION = 'speakgrid-profiles-export-v1';

const defaultButtons = [
  { label: 'Rest', spoken: 'Rest', symbol: '😴', color: '#eef0ff', action: 'speak' },
  { label: 'Snack', spoken: 'Snack', symbol: '🍎', color: '#fff1df', action: 'speakFolder' },
  { label: 'Hug', spoken: 'Hug', symbol: '🤗', color: '#ffeef5', action: 'speak' },
  { label: 'Toys', spoken: 'Toys', symbol: '🧸', color: '#fff8cf', action: 'speakFolder' },
  { label: 'My words', spoken: '', symbol: '💬', color: '#e7f1ff', action: 'folder' },
  { label: 'Occupational Therapy', spoken: 'Occupational Therapy', symbol: '✋', color: '#eff8ed', action: 'speakFolder' }
];

const sampleFolderPages = {
  Snack: {
    columns: 3,
    rows: 3,
    buttons: [
      { label: 'Apple', spoken: 'Apple', symbol: '🍎', color: '#ffe8e8', action: 'speak' },
      { label: 'Cheese', spoken: 'Cheese', symbol: '🧀', color: '#fff8cf', action: 'speak' },
      { label: 'Blueberries', spoken: 'Blueberries', symbol: '🫐', color: '#e7f1ff', action: 'speak' },
      { label: 'Milk', spoken: 'Milk', symbol: '🥛', color: '#eef7ff', action: 'speak' },
      { label: 'Veggie Straws', spoken: 'Veggie Straws', symbol: '🥕', color: '#fff1df', action: 'speak' },
      { label: 'Goldfish', spoken: 'Goldfish', symbol: '🐟', color: '#fff8cf', action: 'speak' }
    ]
  },
  Toys: {
    columns: 3,
    rows: 3,
    buttons: [
      { label: 'Bubbles', spoken: 'Bubbles', symbol: '🫧', color: '#e7f7ff', action: 'speak' },
      { label: 'Music', spoken: 'Music', symbol: '🎵', color: '#f1edff', action: 'speak' },
      { label: 'Book', spoken: 'Book', symbol: '📚', color: '#fff1df', action: 'speak' },
      { label: 'Little People', spoken: 'Little People', symbol: '👥', color: '#eff8ed', action: 'speak' },
      { label: 'Baby Moana', spoken: 'Baby Moana', symbol: '🌺', color: '#ffeef5', action: 'speak' },
      { label: 'Stuffies', spoken: 'Stuffies', symbol: '🧸', color: '#fff8cf', action: 'speak' },
      { label: 'Puppy', spoken: 'Puppy', symbol: '🐶', color: '#ffe8e8', action: 'speak' }
    ]
  },
  'My words': {
    columns: 3,
    rows: 2,
    buttons: [
      { label: 'Hi', spoken: 'Hi', symbol: '👋', color: '#e7f1ff', action: 'speak' },
      { label: 'Bye', spoken: 'Bye', symbol: '👋', color: '#eef0ff', action: 'speak' },
      { label: 'Yes', spoken: 'Yes', symbol: '👍', color: '#e8f7e8', action: 'speak' },
      { label: 'No', spoken: 'No', symbol: '👎', color: '#ffe8e8', action: 'speak' },
      { label: 'More', spoken: 'More', symbol: '➕', color: '#edf3ff', action: 'speak' },
      { label: 'All done', spoken: 'All done', symbol: '✅', color: '#eff8ed', action: 'speak' }
    ]
  },
  'Occupational Therapy': {
    columns: 3,
    rows: 3,
    buttons: [
      { label: 'Stand', spoken: 'Stand', symbol: '🧍', color: '#eff8ed', action: 'speak' },
      { label: 'Bowling', spoken: 'Bowling', symbol: '🎳', color: '#f1edff', action: 'speak' },
      { label: 'Elmo', spoken: 'Elmo', symbol: '❤️', color: '#ffe8e8', action: 'speak' },
      { label: 'Go', spoken: 'Go', symbol: '▶️', color: '#e8f7e8', action: 'speak' },
      { label: 'Sit', spoken: 'Sit', symbol: '🪑', color: '#fff1df', action: 'speak' },
      { label: 'Oscar the Grouch', spoken: 'Oscar the Grouch', symbol: '🗑️', color: '#eff8ed', action: 'speak' },
      { label: 'Cookie Monster', spoken: 'Cookie Monster', symbol: '🍪', color: '#e7f1ff', action: 'speak' }
    ]
  }
};

function uid(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function emptyButton() {
  return { label: '', spoken: '', symbol: '', image: '', color: '#ffffff', action: 'speak', targetPageId: '' };
}

function isButtonEmpty(button = {}) {
  return !button.label && !button.spoken && !button.symbol && !button.image && !button.targetPageId;
}

function meaningfulSlotCount(page = {}) {
  const buttons = Array.isArray(page.buttons) ? page.buttons : [];
  for (let i = buttons.length - 1; i >= 0; i--) {
    if (!isButtonEmpty(buttons[i])) return i + 1;
  }
  return 0;
}

function trimExtraEmptySlots(page = {}) {
  if (!Array.isArray(page.buttons)) page.buttons = [];
  const target = Math.max(Number(page.slotCount) || 0, meaningfulSlotCount(page), 1);
  page.slotCount = target;
  while (page.buttons.length > target && isButtonEmpty(page.buttons[page.buttons.length - 1])) {
    page.buttons.pop();
  }
  while (page.buttons.length < target) page.buttons.push(emptyButton());
}

function makePage(name, buttons = [], options = {}) {
  const normalizedButtons = buttons.map(button => normalizeButton(button));
  const parsedRows = Number(options.rows || 0);
  const parsedColumns = Number(options.columns || 0);
  const rows = parsedRows >= 1 ? parsedRows : 0;
  const columns = parsedColumns >= 1 ? parsedColumns : 0;
  const capacity = rows && columns ? rows * columns : 0;
  const slotCount = Math.max(normalizedButtons.length, capacity, 1);
  while (normalizedButtons.length < slotCount) normalizedButtons.push(emptyButton());
  return { id: uid('page'), name, rows: rows || undefined, columns: columns || undefined, slotCount, buttons: normalizedButtons };
}

function normalizeButton(button = {}) {
  return {
    label: button.label || '',
    spoken: button.spoken || '',
    symbol: button.symbol || '',
    image: button.image || '',
    color: button.color || '#ffffff',
    action: button.action === 'folder' || button.action === 'speakFolder' ? button.action : 'speak',
    targetPageId: button.targetPageId || ''
  };
}

function defaultBoard() {
  const homePage = makePage('Home', defaultButtons, { columns: 3, rows: 2 });
  const pages = [homePage];

  homePage.buttons.forEach(button => {
    if (button.action === 'folder' || button.action === 'speakFolder') {
      const folderName = button.label || 'Folder';
      const sample = sampleFolderPages[folderName] || { buttons: [] };
      const childButtons = Array.isArray(sample) ? sample : (sample.buttons || []);
      const childPage = makePage(folderName, childButtons, {
        columns: Array.isArray(sample) ? 3 : sample.columns,
        rows: Array.isArray(sample) ? 2 : sample.rows
      });
      button.targetPageId = childPage.id;
      pages.push(childPage);
    }
  });

  return {
    rows: 2,
    columns: 3,
    selection: 'release',
    rate: 0.9,
    showMessage: false,
    message: [],
    homePageId: homePage.id,
    currentPageId: homePage.id,
    currentGridPages: {},
    pageStack: [],
    pages
  };
}

function cloneBoard(board) {
  return JSON.parse(JSON.stringify(normalizeBoard(board)));
}

function normalizeBoard(board) {
  const fallback = defaultBoard();
  if (!board || typeof board !== 'object') return fallback;

  if (!Array.isArray(board.pages)) {
    const legacyRows = Number(board.rows || fallback.rows);
    const legacyColumns = Number(board.columns || fallback.columns);
    const homePage = makePage('Home', Array.isArray(board.buttons) ? board.buttons : fallback.pages[0].buttons, { rows: legacyRows, columns: legacyColumns });
    return {
      rows: legacyRows,
      columns: legacyColumns,
      selection: board.selection || fallback.selection,
      rate: Number(board.rate || fallback.rate),
      showMessage: Boolean(board.showMessage),
      message: Array.isArray(board.message) ? board.message : [],
      homePageId: homePage.id,
      currentPageId: homePage.id,
      currentGridPages: {},
      pageStack: [],
      pages: [homePage]
    };
  }

  const pages = board.pages.length ? board.pages.map(page => {
    const buttons = Array.isArray(page.buttons) ? page.buttons.map(button => normalizeButton(button)) : [];
    const pageRows = Math.max(1, Number(page.rows || board.rows || fallback.rows));
    const pageColumns = Math.max(1, Number(page.columns || board.columns || fallback.columns));
    return {
      id: page.id || uid('page'),
      name: page.name || 'Untitled folder',
      rows: pageRows,
      columns: pageColumns,
      slotCount: Math.max(Number(page.slotCount) || 0, meaningfulSlotCount({ buttons }), pageRows * pageColumns, 1),
      buttons
    };
  }) : fallback.pages;
  pages.forEach(page => trimExtraEmptySlots(page));

  const homePageId = pages.some(page => page.id === board.homePageId) ? board.homePageId : pages[0].id;
  const currentPageId = pages.some(page => page.id === board.currentPageId) ? board.currentPageId : homePageId;

  return {
    rows: Number(board.rows || fallback.rows),
    columns: Number(board.columns || fallback.columns),
    selection: board.selection || fallback.selection,
    rate: Number(board.rate || fallback.rate),
    showMessage: Boolean(board.showMessage),
    message: Array.isArray(board.message) ? board.message : [],
    homePageId,
    currentPageId,
    currentGridPages: board.currentGridPages && typeof board.currentGridPages === 'object' ? board.currentGridPages : {},
    pageStack: Array.isArray(board.pageStack) ? board.pageStack.filter(id => pages.some(page => page.id === id)) : [],
    pages
  };
}

let profilesState = loadProfiles();
let state = getCurrentProfile().board;
let editMode = false;
let activeIndex = null;
let tempImage = '';
let tempSymbol = '';
let pendingUnlockProfileId = null;

const grid = document.getElementById('grid');
const gridPager = document.getElementById('gridPager');
const editToggle = document.getElementById('editToggle');
const columnsSelect = document.getElementById('columnsSelect');
const rowsSelect = document.getElementById('rowsSelect');
const selectionMode = document.getElementById('selectionMode');
const rateInput = document.getElementById('rateInput');
const messageToggle = document.getElementById('messageToggle');
const sentenceBar = document.querySelector('.sentence-bar');
const messageText = document.getElementById('messageText');
const speakMessage = document.getElementById('speakMessage');
const clearMessage = document.getElementById('clearMessage');
const resetBoard = document.getElementById('resetBoard');
const boardSettings = document.getElementById('boardSettings');
const profileButton = document.getElementById('profileButton');
const currentPageName = document.getElementById('currentPageName');
const boardPath = document.getElementById('boardPath');
const backPage = document.getElementById('backPage');
const homePage = document.getElementById('homePage');
const renamePage = document.getElementById('renamePage');
const deletePage = document.getElementById('deletePage');

const editorDialog = document.getElementById('editorDialog');
const editingIndex = document.getElementById('editingIndex');
const labelInput = document.getElementById('labelInput');
const spokenInput = document.getElementById('spokenInput');
const buttonAction = document.getElementById('buttonAction');
const folderOptions = document.getElementById('folderOptions');
const folderSelect = document.getElementById('folderSelect');
const newFolderName = document.getElementById('newFolderName');
const symbolInput = document.getElementById('symbolInput');
const fileInput = document.getElementById('fileInput');
const urlInput = document.getElementById('urlInput');
const colorInput = document.getElementById('colorInput');
const imagePreview = document.getElementById('imagePreview');
const movePageSelect = document.getElementById('movePageSelect');
const moveSlotSelect = document.getElementById('moveSlotSelect');
const moveSwapButton = document.getElementById('moveSwapButton');

const profileDialog = document.getElementById('profileDialog');
const profileList = document.getElementById('profileList');
const newProfileName = document.getElementById('newProfileName');
const newProfilePasscode = document.getElementById('newProfilePasscode');
const currentProfilePasscode = document.getElementById('currentProfilePasscode');
const unlockDialog = document.getElementById('unlockDialog');
const unlockProfileName = document.getElementById('unlockProfileName');
const unlockPasscode = document.getElementById('unlockPasscode');
const unlockError = document.getElementById('unlockError');
const exportCurrentProfileButton = document.getElementById('exportCurrentProfile');
const exportAllProfilesButton = document.getElementById('exportAllProfiles');
const importProfilesButton = document.getElementById('importProfilesButton');
const importProfilesFile = document.getElementById('importProfilesFile');

function loadProfiles() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROFILES_STORAGE_KEY));
    if (saved?.profiles?.length) {
      saved.profiles.forEach(profile => { profile.board = normalizeBoard(profile.board); });
      return saved;
    }
  } catch {}

  let board = defaultBoard();
  try {
    const legacy = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY));
    if (legacy) board = normalizeBoard(legacy);
  } catch {}

  const id = uid('profile');
  const created = { currentProfileId: id, profiles: [{ id, name: 'Default', passcode: '', board }] };
  localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(created));
  return created;
}

function saveProfiles() {
  localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profilesState));
}

function getCurrentProfile() {
  return profilesState.profiles.find(profile => profile.id === profilesState.currentProfileId) || profilesState.profiles[0];
}

function saveState() {
  const current = getCurrentProfile();
  current.board = state;
  saveProfiles();
}

function currentPage() {
  return state.pages.find(page => page.id === state.currentPageId) || state.pages[0];
}

function getPageName(id) {
  return state.pages.find(page => page.id === id)?.name || 'Folder';
}

function isValidPasscode(value, allowBlank = false) {
  if (allowBlank && value === '') return true;
  return /^\d{6}$/.test(value);
}

function setupSelect(select, min, max, current) {
  select.innerHTML = '';
  for (let i = min; i <= max; i++) {
    const option = document.createElement('option');
    option.value = String(i);
    option.textContent = String(i);
    if (i === Number(current)) option.selected = true;
    select.appendChild(option);
  }
}

function pageRows(page = currentPage()) {
  return Math.max(1, Number(page?.rows || state.rows || 1));
}

function pageColumns(page = currentPage()) {
  return Math.max(1, Number(page?.columns || state.columns || 1));
}

function capacityForPage(page = currentPage()) {
  return Math.max(1, pageRows(page) * pageColumns(page));
}

function syncControlsToState() {
  const page = currentPage();
  setupSelect(columnsSelect, 1, 8, pageColumns(page));
  setupSelect(rowsSelect, 1, 8, pageRows(page));
  selectionMode.value = state.selection;
  rateInput.value = state.rate;
  messageToggle.checked = Boolean(state.showMessage);
}

function gridCapacity(page = currentPage()) {
  return capacityForPage(page);
}

function totalSlotCount(page = currentPage()) {
  return Math.max(gridCapacity(page), Number(page.slotCount) || 0, meaningfulSlotCount(page), 1);
}

function gridPageCount(page = currentPage()) {
  return Math.max(1, Math.ceil(totalSlotCount(page) / gridCapacity(page)));
}

function getGridPageIndex(pageId = state.currentPageId) {
  if (!state.currentGridPages || typeof state.currentGridPages !== 'object') state.currentGridPages = {};
  const page = state.pages.find(item => item.id === pageId) || currentPage();
  const maxIndex = gridPageCount(page) - 1;
  const saved = Number(state.currentGridPages[pageId] || 0);
  const next = Math.min(Math.max(0, saved), maxIndex);
  state.currentGridPages[pageId] = next;
  return next;
}

function setGridPageIndex(index, pageId = state.currentPageId) {
  if (!state.currentGridPages || typeof state.currentGridPages !== 'object') state.currentGridPages = {};
  const page = state.pages.find(item => item.id === pageId) || currentPage();
  state.currentGridPages[pageId] = Math.min(Math.max(0, Number(index) || 0), gridPageCount(page) - 1);
}

function ensureVisibleButtonSlots() {
  const page = currentPage();
  if (!Array.isArray(page.buttons)) page.buttons = [];
  page.slotCount = Math.max(Number(page.slotCount) || 0, meaningfulSlotCount(page), 1);
  const capacity = gridCapacity();
  const gridPage = getGridPageIndex(page.id);
  const neededForVisiblePage = Math.max((gridPage + 1) * capacity, totalSlotCount(page));
  while (page.buttons.length < neededForVisiblePage) page.buttons.push(emptyButton());
}

function handleGridSizeChange(kind, value) {
  const page = currentPage();
  if (!Array.isArray(page.buttons)) page.buttons = [];
  const oldCapacity = gridCapacity(page);
  page.slotCount = Math.max(Number(page.slotCount) || 0, meaningfulSlotCount(page), oldCapacity, 1);
  trimExtraEmptySlots(page);

  page[kind] = Number(value);
  if (page.id === state.homePageId) state[kind] = Number(value);
  const newCapacity = gridCapacity(page);

  page.slotCount = Math.max(Number(page.slotCount) || 0, meaningfulSlotCount(page), newCapacity, 1);
  trimExtraEmptySlots(page);
  setGridPageIndex(0, page.id);

  syncControlsToState();
  render();
}

function setEditMode(enabled) {
  editMode = enabled;
  document.body.classList.toggle('editing', editMode);
  boardSettings.hidden = !editMode;
  editToggle.textContent = editMode ? 'Done editing' : 'Edit board';
  editToggle.setAttribute('aria-pressed', String(editMode));
  render();
}

function pagePath() {
  const ids = [...state.pageStack, state.currentPageId].filter(Boolean);
  const seen = [];
  ids.forEach(id => { if (!seen.includes(id)) seen.push(id); });
  if (!seen.length || seen[0] !== state.homePageId) seen.unshift(state.homePageId);
  return seen.filter(id => state.pages.some(page => page.id === id));
}

function updatePageNav() {
  const page = currentPage();
  currentPageName.textContent = page.name || 'Home';
  boardPath.textContent = pagePath().map(id => getPageName(id)).join(' › ');
  const atHome = state.currentPageId === state.homePageId;
  backPage.disabled = !state.pageStack.length;
  homePage.disabled = atHome;
  renamePage.hidden = !editMode;
  deletePage.hidden = !editMode || atHome;
}

function render() {
  ensureVisibleButtonSlots();
  messageToggle.checked = Boolean(state.showMessage);
  sentenceBar.hidden = !state.showMessage;
  updatePageNav();

  const page = currentPage();
  const capacity = gridCapacity();
  const gridPage = getGridPageIndex(page.id);
  const startIndex = gridPage * capacity;
  const visibleButtons = page.buttons.slice(startIndex, startIndex + capacity);
  while (visibleButtons.length < capacity) visibleButtons.push(emptyButton());

  grid.style.gridTemplateColumns = `repeat(${pageColumns(page)}, minmax(0, 1fr))`;
  grid.innerHTML = '';
  visibleButtons.forEach((button, offset) => {
    const index = startIndex + offset;
    if (!page.buttons[index]) page.buttons[index] = emptyButton();
    const el = document.createElement('button');
    el.type = 'button';
    el.dataset.index = String(index);
    const hasContent = button.label || button.spoken || button.symbol || button.image;
    el.className = `aac-button ${hasContent ? '' : 'empty'} ${button.action === 'folder' || button.action === 'speakFolder' ? 'folder-button' : ''}`;
    el.style.background = button.color || '#ffffff';
    const modeText = button.action === 'folder'
      ? `Open folder ${button.label || getPageName(button.targetPageId)}`
      : button.action === 'speakFolder'
        ? `Speak ${button.spoken || button.label || 'button'} and open folder ${getPageName(button.targetPageId)}`
        : button.spoken || button.label || 'Empty button';
    el.setAttribute('aria-label', editMode ? `Edit ${button.label || 'empty button'}` : modeText);

    const imageBox = document.createElement('span');
    imageBox.className = 'button-image';
    if (button.image) {
      const img = document.createElement('img');
      img.src = button.image;
      img.alt = '';
      imageBox.appendChild(img);
    } else if (button.symbol) {
      const symbol = document.createElement('span');
      symbol.className = 'button-symbol';
      symbol.textContent = button.symbol;
      imageBox.appendChild(symbol);
    } else {
      const empty = document.createElement('span');
      empty.className = 'edit-badge';
      empty.textContent = editMode ? '+ Add' : '';
      imageBox.appendChild(empty);
    }

    const label = document.createElement('span');
    label.className = 'button-label';
    label.textContent = button.label || (editMode ? 'Empty' : '');

    el.append(imageBox, label);
    if (button.action === 'folder' || button.action === 'speakFolder') {
      const folderMark = document.createElement('span');
      folderMark.className = 'folder-mark';
      folderMark.textContent = 'Folder';
      el.appendChild(folderMark);
    }

    el.addEventListener('pointerdown', event => handleButtonPointerDown(event, index));
    el.addEventListener('touchstart', event => handleButtonTouchStart(event, index), { passive: true });
    el.addEventListener('pointerup', event => {
      if (editMode) {
        el.classList.remove('pressed');
        openEditor(index);
      }
    });
    el.addEventListener('pointerleave', () => {
      if (editMode) el.classList.remove('pressed');
    });
    el.addEventListener('click', event => event.preventDefault());

    grid.appendChild(el);
  });
  renderGridPager();
  updateMessage();
  saveState();
}

function renderGridPager() {
  if (!gridPager) return;
  const page = currentPage();
  const count = gridPageCount(page);
  const current = getGridPageIndex(page.id);
  gridPager.innerHTML = '';
  gridPager.hidden = count <= 1;
  if (count <= 1) return;

  const label = document.createElement('span');
  label.className = 'pager-label';
  label.textContent = `Grid page ${current + 1} of ${count}`;
  gridPager.appendChild(label);

  for (let i = 0; i < count; i++) {
    const pageButton = document.createElement('button');
    pageButton.type = 'button';
    pageButton.className = i === current ? 'primary-btn' : 'secondary-btn';
    pageButton.textContent = String(i + 1);
    pageButton.setAttribute('aria-label', `Show grid page ${i + 1} of ${count}`);
    pageButton.setAttribute('aria-current', i === current ? 'page' : 'false');
    pageButton.addEventListener('click', () => {
      setGridPageIndex(i, page.id);
      render();
    });
    gridPager.appendChild(pageButton);
  }
}


function buttonIndexFromPoint(clientX, clientY) {
  const element = document.elementFromPoint(clientX, clientY);
  const buttonElement = element?.closest?.('.aac-button');
  if (!buttonElement || !grid.contains(buttonElement)) return -1;
  return Number(buttonElement.dataset.index);
}

function clearPressedButtons() {
  grid.querySelectorAll('.aac-button.pressed').forEach(button => button.classList.remove('pressed'));
}

function showPressedButtonAt(clientX, clientY) {
  clearPressedButtons();
  const index = buttonIndexFromPoint(clientX, clientY);
  if (index < 0) return;
  const target = grid.querySelector(`.aac-button[data-index="${index}"]`);
  target?.classList.add('pressed');
}


function handleButtonTouchStart(event, startIndex) {
  if (editMode || state.selection !== 'release') return;
  clearPressedButtons();
  const firstTouch = event.touches?.[0];
  if (firstTouch) showPressedButtonAt(firstTouch.clientX, firstTouch.clientY);

  const touchId = firstTouch?.identifier;

  const getTrackedTouch = list => {
    if (touchId === undefined) return list?.[0] || null;
    return Array.from(list || []).find(touch => touch.identifier === touchId) || null;
  };

  const handleMove = moveEvent => {
    const touch = getTrackedTouch(moveEvent.touches);
    if (!touch) return;
    showPressedButtonAt(touch.clientX, touch.clientY);
  };

  const handleEnd = endEvent => {
    const touch = getTrackedTouch(endEvent.changedTouches);
    if (!touch) return;
    const releaseIndex = buttonIndexFromPoint(touch.clientX, touch.clientY);
    clearPressedButtons();
    cleanup();
    if (releaseIndex >= 0) activateButton(releaseIndex);
  };

  const handleCancel = cancelEvent => {
    const touch = getTrackedTouch(cancelEvent.changedTouches);
    if (!touch) return;
    clearPressedButtons();
    cleanup();
  };

  const cleanup = () => {
    window.removeEventListener('touchmove', handleMove, { capture: true });
    window.removeEventListener('touchend', handleEnd, { capture: true });
    window.removeEventListener('touchcancel', handleCancel, { capture: true });
  };

  window.addEventListener('touchmove', handleMove, { capture: true, passive: true });
  window.addEventListener('touchend', handleEnd, { capture: true, passive: true });
  window.addEventListener('touchcancel', handleCancel, { capture: true, passive: true });
}

function handleButtonPointerDown(event, startIndex) {
  if (editMode) {
    event.currentTarget.classList.add('pressed');
    return;
  }

  if (event.pointerType === 'touch' && state.selection === 'release') return;

  clearPressedButtons();

  if (state.selection === 'touch') {
    event.currentTarget.classList.add('pressed');
    activateButton(startIndex);
    return;
  }

  showPressedButtonAt(event.clientX, event.clientY);

  const pointerId = event.pointerId;

  const handleMove = moveEvent => {
    if (moveEvent.pointerId !== pointerId) return;
    showPressedButtonAt(moveEvent.clientX, moveEvent.clientY);
  };

  const handleUp = upEvent => {
    if (upEvent.pointerId !== pointerId) return;
    const releaseIndex = buttonIndexFromPoint(upEvent.clientX, upEvent.clientY);
    clearPressedButtons();
    cleanup();
    if (releaseIndex >= 0) activateButton(releaseIndex);
  };

  const handleCancel = cancelEvent => {
    if (cancelEvent.pointerId !== pointerId) return;
    clearPressedButtons();
    cleanup();
  };

  const cleanup = () => {
    window.removeEventListener('pointermove', handleMove, { capture: true });
    window.removeEventListener('pointerup', handleUp, { capture: true });
    window.removeEventListener('pointercancel', handleCancel, { capture: true });
  };

  window.addEventListener('pointermove', handleMove, { capture: true, passive: false });
  window.addEventListener('pointerup', handleUp, { capture: true, passive: false });
  window.addEventListener('pointercancel', handleCancel, { capture: true, passive: false });
}

function activateButton(index) {
  const button = currentPage().buttons[index];
  if (!button) return;
  const phrase = (button.spoken || button.label || '').trim();

  if (button.action === 'folder') {
    openFolder(button.targetPageId);
    return;
  }

  if (button.action === 'speakFolder') {
    if (phrase) {
      state.message.push(phrase);
      updateMessage();
      speak(phrase);
      saveState();
    }
    openFolder(button.targetPageId);
    return;
  }

  if (!phrase) return;
  state.message.push(phrase);
  updateMessage();
  speak(phrase);
  saveState();
}

function openFolder(pageId) {
  if (!state.pages.some(page => page.id === pageId)) return;
  if (state.currentPageId !== pageId) state.pageStack.push(state.currentPageId);
  state.currentPageId = pageId;
  syncControlsToState();
  render();
}

function goBackPage() {
  const previous = state.pageStack.pop();
  if (!previous) return;
  state.currentPageId = previous;
  syncControlsToState();
  render();
}

function goHomePage() {
  state.currentPageId = state.homePageId;
  state.pageStack = [];
  syncControlsToState();
  render();
}

function speak(text) {
  if (!('speechSynthesis' in window)) {
    alert('This browser does not support built-in speech synthesis. Try Safari or Chrome.');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = Number(state.rate || 0.9);
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function updateMessage() {
  messageText.textContent = state.message.join(' ');
}

function refreshFolderSelect(selectedId = '') {
  folderSelect.innerHTML = '';
  const newOption = document.createElement('option');
  newOption.value = '';
  newOption.textContent = 'Create a new folder page';
  folderSelect.appendChild(newOption);
  state.pages.forEach(page => {
    if (page.id === currentPage().id) return;
    const option = document.createElement('option');
    option.value = page.id;
    option.textContent = page.name;
    if (page.id === selectedId) option.selected = true;
    folderSelect.appendChild(option);
  });
}


function ensureButtonActionOptions() {
  if (!buttonAction) return;
  const options = [
    ['speak', 'Speak aloud'],
    ['folder', 'Open folder/page'],
    ['speakFolder', 'Speak aloud + open folder/page']
  ];
  options.forEach(([value, text]) => {
    if (!buttonAction.querySelector(`option[value="${value}"]`)) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = text;
      buttonAction.appendChild(option);
    }
  });
}

function updateEditorActionUI() {
  const isFolder = buttonAction.value === 'folder' || buttonAction.value === 'speakFolder';
  folderOptions.hidden = !isFolder;
  spokenInput.closest('label').hidden = buttonAction.value === 'folder';
  if (isFolder && !labelInput.value.trim() && newFolderName.value.trim()) labelInput.value = newFolderName.value.trim();
}

function refreshPlacementOptions(index) {
  if (!movePageSelect || !moveSlotSelect) return;
  const capacity = gridCapacity();
  const page = currentPage();
  const count = gridPageCount(page);
  const currentTargetPage = Math.floor(index / capacity);
  movePageSelect.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const option = document.createElement('option');
    option.value = String(i);
    option.textContent = `Page ${i + 1}`;
    if (i === currentTargetPage) option.selected = true;
    movePageSelect.appendChild(option);
  }
  refreshMoveSlotOptions(index);
}

function refreshMoveSlotOptions(index) {
  if (!movePageSelect || !moveSlotSelect) return;
  const capacity = gridCapacity();
  const selectedPage = Number(movePageSelect.value || 0);
  const currentSlot = index % capacity;
  moveSlotSelect.innerHTML = '';
  for (let i = 0; i < capacity; i++) {
    const option = document.createElement('option');
    option.value = String(i);
    option.textContent = `Spot ${i + 1}`;
    if (i === currentSlot && selectedPage === Math.floor(index / capacity)) option.selected = true;
    moveSlotSelect.appendChild(option);
  }
}

function swapActiveButtonPlacement() {
  if (activeIndex === null || Number.isNaN(Number(activeIndex))) return;
  const page = currentPage();
  const capacity = gridCapacity();
  const targetIndex = Number(movePageSelect.value || 0) * capacity + Number(moveSlotSelect.value || 0);
  const maxNeeded = targetIndex + 1;
  page.slotCount = Math.max(Number(page.slotCount) || 0, maxNeeded, meaningfulSlotCount(page), 1);
  while (page.buttons.length < maxNeeded) page.buttons.push(emptyButton());
  const fromIndex = Number(activeIndex);
  if (targetIndex === fromIndex) return;
  const fromButton = page.buttons[fromIndex] || emptyButton();
  page.buttons[fromIndex] = page.buttons[targetIndex] || emptyButton();
  page.buttons[targetIndex] = fromButton;
  activeIndex = targetIndex;
  editingIndex.value = String(targetIndex);
  setGridPageIndex(Math.floor(targetIndex / capacity), page.id);
  refreshPlacementOptions(targetIndex);
  render();
  alert(`Button swapped to page ${Math.floor(targetIndex / capacity) + 1}, spot ${(targetIndex % capacity) + 1}.`);
}

function openEditor(index) {
  activeIndex = index;
  const button = currentPage().buttons[index] || emptyButton();
  editingIndex.value = String(index);
  labelInput.value = button.label || '';
  spokenInput.value = button.spoken || '';
  buttonAction.value = ['speak', 'folder', 'speakFolder'].includes(button.action) ? button.action : 'speak';
  refreshFolderSelect(button.targetPageId || '');
  newFolderName.value = '';
  tempSymbol = button.symbol || '';
  tempImage = button.image || '';
  symbolInput.value = tempSymbol;
  urlInput.value = button.image && /^https?:/.test(button.image) ? button.image : '';
  fileInput.value = '';
  colorInput.value = button.color || '#ffffff';
  updateEditorActionUI();
  refreshPlacementOptions(index);
  renderPreview();
  editorDialog.showModal();
}

function renderPreview() {
  imagePreview.innerHTML = '';
  if (tempImage) {
    const img = document.createElement('img');
    img.src = tempImage;
    img.alt = '';
    imagePreview.appendChild(img);
  } else if (tempSymbol) {
    imagePreview.textContent = tempSymbol;
  }
}

function saveEditor() {
  const index = Number(editingIndex.value);
  let action = ['folder', 'speakFolder'].includes(buttonAction.value) ? buttonAction.value : 'speak';
  let targetPageId = '';

  if (action === 'folder' || action === 'speakFolder') {
    targetPageId = folderSelect.value;
    const folderName = newFolderName.value.trim() || labelInput.value.trim() || 'New folder';
    if (!targetPageId) {
      const childPage = makePage(folderName, [], { rows: pageRows(currentPage()), columns: pageColumns(currentPage()) });
      state.pages.push(childPage);
      targetPageId = childPage.id;
    }
    if (!labelInput.value.trim()) labelInput.value = folderName;
  }

  const page = currentPage();
  page.slotCount = Math.max(Number(page.slotCount) || 0, index + 1, meaningfulSlotCount(page), 1);
  while (page.buttons.length <= index) page.buttons.push(emptyButton());

  page.buttons[index] = {
    label: labelInput.value.trim(),
    spoken: action === 'folder' ? '' : spokenInput.value.trim(),
    symbol: symbolInput.value.trim(),
    image: tempImage,
    color: colorInput.value || '#ffffff',
    action,
    targetPageId
  };
  editorDialog.close();
  render();
}

function clearEditorButton() {
  const index = Number(editingIndex.value);
  const page = currentPage();
  while (page.buttons.length <= index) page.buttons.push(emptyButton());
  page.buttons[index] = emptyButton();
  trimExtraEmptySlots(page);
  editorDialog.close();
  render();
}

function deleteEditorButtonSlot() {
  const index = Number(editingIndex.value);
  if (Number.isNaN(index)) return;
  const page = currentPage();
  const button = page.buttons[index] || emptyButton();
  const previousSlotCount = Math.max(Number(page.slotCount) || 0, meaningfulSlotCount(page), 1);
  if (index >= previousSlotCount && isButtonEmpty(button)) {
    alert('This is already an empty filler spot. Nothing needs to be deleted.');
    return;
  }
  const name = button.label || button.spoken || `spot ${index + 1}`;
  if (!confirm(`Delete this button slot (${name})? Later buttons will shift forward to fill the gap.`)) return;

  while (page.buttons.length <= index) page.buttons.push(emptyButton());
  page.buttons.splice(index, 1);
  page.slotCount = Math.max(meaningfulSlotCount(page), previousSlotCount - 1, 1);
  trimExtraEmptySlots(page);

  const currentGridPage = getGridPageIndex(page.id);
  setGridPageIndex(Math.min(currentGridPage, gridPageCount(page) - 1), page.id);
  editorDialog.close();
  render();
}

function renameCurrentPage() {
  const page = currentPage();
  const next = prompt('Rename this folder/page:', page.name || 'Folder');
  if (!next?.trim()) return;
  page.name = next.trim();
  render();
}

function deleteCurrentPage() {
  const page = currentPage();
  if (page.id === state.homePageId) return;
  if (!confirm(`Delete the folder/page "${page.name}"? Buttons that link to it will be cleared.`)) return;
  state.pages = state.pages.filter(item => item.id !== page.id);
  state.pages.forEach(parent => {
    parent.buttons = parent.buttons.map(button => button.targetPageId === page.id ? emptyButton() : button);
  });
  state.currentPageId = state.homePageId;
  state.pageStack = [];
  render();
}

function renderProfileList() {
  profileList.innerHTML = '';
  const currentId = getCurrentProfile().id;
  profilesState.profiles.forEach(profile => {
    const row = document.createElement('div');
    row.className = 'profile-row';
    const name = document.createElement('div');
    name.innerHTML = `<strong>${escapeHtml(profile.name)}</strong><span>${profile.passcode ? 'Locked with passcode' : 'No passcode'}${profile.id === currentId ? ' · Current' : ''}</span>`;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = profile.id === currentId ? 'secondary-btn' : 'primary-btn';
    button.textContent = profile.id === currentId ? 'Current' : 'Switch';
    button.disabled = profile.id === currentId;
    button.addEventListener('click', () => requestProfileSwitch(profile.id));
    row.append(name, button);
    profileList.appendChild(row);
  });
}

function escapeHtml(text) {
  return String(text).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function createProfile() {
  const name = newProfileName.value.trim();
  const passcode = newProfilePasscode.value.trim();
  if (!name) {
    alert('Enter a profile name.');
    return;
  }
  if (!isValidPasscode(passcode, true)) {
    alert('Passcode must be exactly 6 digits, or blank for no passcode.');
    return;
  }
  const newId = uid('profile');
  profilesState.profiles.push({ id: newId, name, passcode, board: defaultBoard() });
  profilesState.currentProfileId = newId;
  state = getCurrentProfile().board;
  newProfileName.value = '';
  newProfilePasscode.value = '';
  saveProfiles();
  syncControlsToState();
  renderProfileList();
  setEditMode(false);
}

function requestProfileSwitch(profileId) {
  const profile = profilesState.profiles.find(item => item.id === profileId);
  if (!profile) return;
  if (!profile.passcode) {
    switchProfile(profileId);
    return;
  }
  pendingUnlockProfileId = profileId;
  unlockProfileName.textContent = `Enter the passcode for ${profile.name}.`;
  unlockPasscode.value = '';
  unlockError.textContent = '';
  unlockDialog.showModal();
  setTimeout(() => unlockPasscode.focus(), 50);
}

function switchProfile(profileId) {
  const profile = profilesState.profiles.find(item => item.id === profileId);
  if (!profile) return;
  saveState();
  profilesState.currentProfileId = profileId;
  state = normalizeBoard(profile.board);
  profile.board = state;
  saveProfiles();
  syncControlsToState();
  renderProfileList();
  setEditMode(false);
}

function unlockPendingProfile() {
  const profile = profilesState.profiles.find(item => item.id === pendingUnlockProfileId);
  if (!profile) return;
  if (unlockPasscode.value.trim() !== profile.passcode) {
    unlockError.textContent = 'Incorrect passcode.';
    return;
  }
  unlockDialog.close();
  switchProfile(profile.id);
}

function saveCurrentPasscode() {
  const passcode = currentProfilePasscode.value.trim();
  if (!isValidPasscode(passcode, true)) {
    alert('Passcode must be exactly 6 digits, or blank to remove the passcode.');
    return;
  }
  getCurrentProfile().passcode = passcode;
  currentProfilePasscode.value = '';
  saveProfiles();
  renderProfileList();
  alert(passcode ? 'Passcode saved.' : 'Passcode removed.');
}

function duplicateCurrentProfile() {
  const current = getCurrentProfile();
  const copyName = prompt('Name for the duplicated profile:', `${current.name} copy`);
  if (!copyName) return;
  const newId = uid('profile');
  profilesState.profiles.push({ id: newId, name: copyName.trim(), passcode: '', board: cloneBoard(current.board) });
  profilesState.currentProfileId = newId;
  state = getCurrentProfile().board;
  saveProfiles();
  syncControlsToState();
  renderProfileList();
  setEditMode(false);
}

function deleteCurrentProfile() {
  if (profilesState.profiles.length <= 1) {
    alert('At least one profile is required.');
    return;
  }
  const current = getCurrentProfile();
  if (!confirm(`Delete ${current.name}? This permanently removes this profile from this browser.`)) return;
  profilesState.profiles = profilesState.profiles.filter(profile => profile.id !== current.id);
  profilesState.currentProfileId = profilesState.profiles[0].id;
  state = getCurrentProfile().board;
  saveProfiles();
  syncControlsToState();
  renderProfileList();
  setEditMode(false);
}

function slugifyFilename(text) {
  return String(text || 'profile')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'profile';
}

function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function profileForExport(profile) {
  return {
    id: profile.id,
    name: profile.name || 'Imported profile',
    passcode: profile.passcode || '',
    board: cloneBoard(profile.board)
  };
}

function exportCurrentProfile() {
  saveState();
  const profile = getCurrentProfile();
  const payload = {
    type: PROFILE_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    app: 'SpeakGrid AAC',
    profile: profileForExport(profile)
  };
  downloadJson(`speakgrid-${slugifyFilename(profile.name)}-profile.json`, payload);
}

function exportAllProfiles() {
  saveState();
  const payload = {
    type: ALL_PROFILES_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    app: 'SpeakGrid AAC',
    currentProfileId: profilesState.currentProfileId,
    profiles: profilesState.profiles.map(profileForExport)
  };
  downloadJson('speakgrid-all-profiles.json', payload);
}

function uniqueProfileName(baseName) {
  const base = String(baseName || 'Imported profile').trim() || 'Imported profile';
  const names = new Set(profilesState.profiles.map(profile => profile.name));
  if (!names.has(base)) return base;
  let i = 2;
  while (names.has(`${base} ${i}`)) i += 1;
  return `${base} ${i}`;
}

function prepareImportedProfile(profile, options = {}) {
  const keepId = Boolean(options.keepId);
  const forcedId = options.id;
  const importedName = String(profile?.name || 'Imported profile').trim() || 'Imported profile';
  const passcode = String(profile?.passcode || '').trim();
  return {
    id: forcedId || (keepId && profile?.id ? String(profile.id) : uid('profile')),
    name: options.name || importedName,
    passcode: isValidPasscode(passcode, true) ? passcode : '',
    board: normalizeBoard(profile?.board)
  };
}

function profilesFromImportPayload(payload) {
  if (!payload || typeof payload !== 'object') return [];

  if (payload.type === PROFILE_EXPORT_VERSION && payload.profile) {
    return [payload.profile];
  }

  if (payload.type === ALL_PROFILES_EXPORT_VERSION && Array.isArray(payload.profiles)) {
    return payload.profiles;
  }

  if (Array.isArray(payload.profiles)) {
    return payload.profiles;
  }

  if (payload.profile) {
    return [payload.profile];
  }

  if (payload.board || payload.name) {
    return [payload];
  }

  return [];
}

function importSingleProfile(importedProfile) {
  const importedName = String(importedProfile?.name || 'Imported profile').trim() || 'Imported profile';
  const existing = profilesState.profiles.find(profile => profile.name === importedName);

  if (existing && confirm(`A profile named "${importedName}" already exists on this device.

Choose OK to replace it, or Cancel to import as a new copy.`)) {
    const replacement = prepareImportedProfile(importedProfile, { id: existing.id, name: existing.name });
    const index = profilesState.profiles.findIndex(profile => profile.id === existing.id);
    profilesState.profiles[index] = replacement;
    profilesState.currentProfileId = replacement.id;
  } else {
    const nextName = uniqueProfileName(importedName);
    const added = prepareImportedProfile(importedProfile, { name: nextName });
    profilesState.profiles.push(added);
    profilesState.currentProfileId = added.id;
  }
}

function importManyProfiles(importedProfiles) {
  const replaceAll = confirm(`This file contains ${importedProfiles.length} profiles.

Choose OK to replace all profiles on this device, or Cancel to add them as imported copies.`);

  if (replaceAll) {
    const prepared = importedProfiles.map(profile => prepareImportedProfile(profile, { keepId: true }));
    const seen = new Set();
    prepared.forEach(profile => {
      if (!profile.id || seen.has(profile.id)) profile.id = uid('profile');
      seen.add(profile.id);
    });
    profilesState = {
      currentProfileId: prepared[0].id,
      profiles: prepared.length ? prepared : [{ id: uid('profile'), name: 'Default', passcode: '', board: defaultBoard() }]
    };
  } else {
    importedProfiles.forEach(importedProfile => {
      const nextName = uniqueProfileName(importedProfile?.name || 'Imported profile');
      profilesState.profiles.push(prepareImportedProfile(importedProfile, { name: nextName }));
    });
    profilesState.currentProfileId = profilesState.profiles[profilesState.profiles.length - 1].id;
  }
}

function importProfilesFromObject(payload) {
  const importedProfiles = profilesFromImportPayload(payload).filter(profile => profile && typeof profile === 'object');
  if (!importedProfiles.length) {
    alert('This file does not look like a SpeakGrid profile export.');
    return;
  }

  saveState();

  if (importedProfiles.length === 1) {
    importSingleProfile(importedProfiles[0]);
  } else {
    importManyProfiles(importedProfiles);
  }

  state = normalizeBoard(getCurrentProfile().board);
  getCurrentProfile().board = state;
  saveProfiles();
  syncControlsToState();
  renderProfileList();
  render();
  alert(`Imported ${importedProfiles.length} profile${importedProfiles.length === 1 ? '' : 's'}.`);
}

function importProfilesFromFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = event => {
    try {
      const payload = JSON.parse(String(event.target.result || '{}'));
      importProfilesFromObject(payload);
    } catch {
      alert('The selected file could not be read as JSON.');
    } finally {
      if (importProfilesFile) importProfilesFile.value = '';
    }
  };
  reader.onerror = () => {
    alert('The selected file could not be read.');
    if (importProfilesFile) importProfilesFile.value = '';
  };
  reader.readAsText(file);
}

function init() {
  syncControlsToState();

  columnsSelect.addEventListener('change', () => handleGridSizeChange('columns', columnsSelect.value));
  rowsSelect.addEventListener('change', () => handleGridSizeChange('rows', rowsSelect.value));
  selectionMode.addEventListener('change', () => { state.selection = selectionMode.value; render(); });
  rateInput.addEventListener('input', () => { state.rate = Number(rateInput.value); saveState(); });
  messageToggle.addEventListener('change', () => { state.showMessage = messageToggle.checked; render(); });

  editToggle.addEventListener('click', () => setEditMode(!editMode));
  backPage.addEventListener('click', goBackPage);
  homePage.addEventListener('click', goHomePage);
  renamePage.addEventListener('click', renameCurrentPage);
  deletePage.addEventListener('click', deleteCurrentPage);

  profileButton.addEventListener('click', () => { renderProfileList(); currentProfilePasscode.value = ''; profileDialog.showModal(); });
  document.getElementById('closeProfiles').addEventListener('click', () => profileDialog.close());
  document.getElementById('createProfile').addEventListener('click', createProfile);
  document.getElementById('savePasscode').addEventListener('click', saveCurrentPasscode);
  document.getElementById('duplicateProfile').addEventListener('click', duplicateCurrentProfile);
  document.getElementById('deleteProfile').addEventListener('click', deleteCurrentProfile);
  exportCurrentProfileButton?.addEventListener('click', exportCurrentProfile);
  exportAllProfilesButton?.addEventListener('click', exportAllProfiles);
  importProfilesButton?.addEventListener('click', () => importProfilesFile?.click());
  importProfilesFile?.addEventListener('change', () => importProfilesFromFile(importProfilesFile.files?.[0]));
  document.getElementById('unlockProfile').addEventListener('click', unlockPendingProfile);
  document.getElementById('cancelUnlock').addEventListener('click', () => unlockDialog.close());
  unlockPasscode.addEventListener('keydown', event => { if (event.key === 'Enter') unlockPendingProfile(); });

  speakMessage.addEventListener('click', () => {
    const text = state.message.join(' ').trim();
    if (text) speak(text);
  });
  clearMessage.addEventListener('click', () => { state.message = []; render(); });

  resetBoard.addEventListener('click', () => {
    if (!confirm('Reset to the sample board? This replaces the current profile board and folders.')) return;
    state = defaultBoard();
    getCurrentProfile().board = state;
    syncControlsToState();
    render();
  });

  buttonAction.addEventListener('change', updateEditorActionUI);
  movePageSelect?.addEventListener('change', () => refreshMoveSlotOptions(Number(editingIndex.value)));
  moveSwapButton?.addEventListener('click', swapActiveButtonPlacement);
  newFolderName.addEventListener('input', () => {
    if ((buttonAction.value === 'folder' || buttonAction.value === 'speakFolder') && !folderSelect.value && !labelInput.value.trim()) labelInput.value = newFolderName.value.trim();
  });

  document.getElementById('saveButton').addEventListener('click', saveEditor);
  document.getElementById('deleteButton').addEventListener('click', clearEditorButton);
  document.getElementById('deleteSlotButton')?.addEventListener('click', deleteEditorButtonSlot);
  document.getElementById('cancelEditor').addEventListener('click', () => editorDialog.close());
  document.getElementById('closeEditor').addEventListener('click', () => editorDialog.close());
  document.getElementById('clearImage').addEventListener('click', () => { tempImage = ''; urlInput.value = ''; renderPreview(); });

  symbolInput.addEventListener('input', () => { tempSymbol = symbolInput.value.trim(); if (tempSymbol) tempImage = ''; renderPreview(); });
  document.querySelectorAll('.symbol-library button').forEach(button => {
    button.addEventListener('click', () => {
      tempSymbol = button.textContent;
      tempImage = '';
      symbolInput.value = tempSymbol;
      urlInput.value = '';
      renderPreview();
    });
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      tempImage = String(event.target.result);
      tempSymbol = '';
      symbolInput.value = '';
      urlInput.value = '';
      renderPreview();
    };
    reader.readAsDataURL(file);
  });

  urlInput.addEventListener('input', () => {
    tempImage = urlInput.value.trim();
    if (tempImage) {
      tempSymbol = '';
      symbolInput.value = '';
    }
    renderPreview();
  });


  setEditMode(false);
}

init();
