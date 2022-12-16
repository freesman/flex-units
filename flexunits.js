const qs = (selector, parent) => parent
  ? parent.querySelector(selector)
  : document.querySelector(selector);

const qsa = (selector, parent) => parent
  ? parent.querySelectorAll(selector)
  : document.querySelectorAll(selector);

const on = (el, type, func, options) =>
  el.addEventListener(type, func, options);

const off = (el, type, func, options) =>
  el.removeEventListener(type, func, options);

const htmlToElement = (element, html) => {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  template.content.childNodes.forEach(child => element.appendChild(child));
  return template.content.firstChild;
};

// colors
const c = {
  white: 'rgba(255, 255, 255, .8)',
  black: '#2c2c2c',
};

const presets = JSON.parse(localStorage.getItem('fuPresets')) || {};

const savedConfig = JSON.parse(localStorage.getItem('fuConfig'));

const config = savedConfig || {
  units: 'vw',
  viewport: 'D',
  enabled: true,
  vw: { D: 0, T: 0, M: 0},
  vh: { D: 0, T: 0, M: 0},
};

const styleHtml = `
<style>
.fu-ext-wrapper {
  position: relative;
  padding: 5px;
  height: 100%;
  box-sizing: border-box;
}

.fu-ext-main {
  position: absolute;
  top: 5px;
  bottom: 5px;
  left: 0;
  padding: 5px;
  display: flex;
  align-items: center;
  font-size: 20px;
  color: ${c.white};
  border: 1px solid ${c.white};
  border-radius: 10px;
  box-sizing: border-box;
}

.fu-ext-main-disabled {
  opacity: 0.5;
}

.fu-ext-main-disabled .fu-ext-input,
.fu-ext-main-disabled .fu-ext-units,
.fu-ext-main-disabled .fu-ext-viewport,
.fu-ext-main-disabled .fu-ext-settings,
.fu-ext-main-disabled .fu-ext-equal,
.fu-ext-main-disabled .fu-ext-result {
  display: none;
}

.fu-ext-input {
  margin: 0 10px;
  min-width: 20px;
  width: 20px;
  background-color: transparent;
  color: ${c.white};
  border-bottom: 1px solid ${c.white};
}

.fu-ext-result {
  padding: 0 10px;
  white-space: nowrap;
}

.fu-ext-units,
.fu-ext-viewport,
.fu-ext-settings,
.fu-ext-switch {
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
}

.fu-ext-units:hover,
.fu-ext-viewport:hover,
.fu-ext-settings:hover,
.fu-ext-switch:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.fu-ext-viewport {
  min-width: 18px;
  text-align: center;
}

.fu-ext-units {
  margin-right: 5px;
  min-width: 28px;
  text-align: center;
}

.fu-ext-units.m_fu-ext-vh {
  background-color: rgba(255, 255, 255, 0.5);
  color: #333;
}

.fu-ext-units.m_fu-ext-vh:hover {
  background-color: rgba(255, 255, 255, 0.6);
}

.fu-ext-viewport[data-fu-ext-viewport-color="D"] {
  background-color: rgba(196, 20, 20, 0.5);
}

.fu-ext-viewport[data-fu-ext-viewport-color="D"]:hover {
  background-color: rgba(196, 20, 20, 0.6);
}

.fu-ext-viewport[data-fu-ext-viewport-color="T"] {
  background-color: rgba(184, 176, 20, 0.5);
}

.fu-ext-viewport[data-fu-ext-viewport-color="T"]:hover {
  background-color: rgba(184, 176, 20, 0.6);
}

.fu-ext-viewport[data-fu-ext-viewport-color="M"] {
  background-color: rgba(70, 196, 20, 0.5);
}

.fu-ext-viewport[data-fu-ext-viewport-color="M"]:hover {
  background-color: rgba(70, 196, 20, 0.6);
}

.fu-ext-settings {
  margin: 0 5px;
}

.fu-ext-settings-main {
  display: none;
  position: absolute;
  top: 45px;
  right: 0;
  padding: 10px;
  background-color: ${c.black};
  border-radius: 5px;
  font-size: 14px;
  box-shadow: 0px 0px 10px 0px rgb(255 255 255 / 10%);
}

.fu-ext-settings-main.fu-ext-open {
  display: block;
}

.fu-ext-char {
  font-weight: 700;
  border: 1px solid ${c.white};
  padding: 0 2px;
  margin: 0 2px;
  border-radius: 4px;
}

.fu-ext-setting-block {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.fu-ext-save-preset-block {
  text-align: center;
}

.fu-ext-setting-title {
  width: 50px;
}

.fu-ext-setting-input {
  width: 70px;
  padding: 2px;
  border-radius: 3px;
}

.fu-ext-hr {
  margin: 20px 0;
}

.fu-ext-preset-name-input {
  width: 80%;
  margin-left 10%;
  padding: 5px;
}

.fu-ext-preset-save-btn {
  width: 80%;
  margin: 15px auto 0 auto;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: background-color 0.15s;
}

.fu-ext-preset-save-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.fu-ext-presets-body {
  max-height: 300px;
  overflow: auto;
  padding: 5px 0;
}

.fu-ext-preset {
  margin-top: 10px;
  padding: 0 7px;
  display: flex;
  justify-content: space-between;
}

.fu-ext-preset-apply,
.fu-ext-preset-del {
  position: relative;
  cursor: pointer;
}

.fu-ext-preset-apply {
  flex-grow: 1;
  margin-right: 20px;
}

.fu-ext-preset-apply.fu-ext-active {
  pointer-events: none;
}

.fu-ext-preset-apply.fu-ext-active::before {
  content: '\u221a';
  margin-right: 3px;
}

.fu-ext-preset-del::after,
.fu-ext-preset-apply::after {
  content: '';
  position: absolute;
  transition: background-color 0.15s;
  top: -5px;
  bottom: -5px;
  left: -7px;
  right: -7px;
  border-radius: 5px;
}

.fu-ext-preset-del:hover::after,
.fu-ext-preset-apply:hover::after {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
`;

const mainHtml = `
<div class="fu-ext-wrapper">
  <div class="fu-ext-main">
    <span class="fu-ext-switch">on</span>
    <span class="fu-ext-settings">&#9881;</span>
    <span class="fu-ext-units ${config.units}">${config.units}</span>
    <span class="fu-ext-viewport">${config.viewport}</span>

    <input class="fu-ext-input" />
    <span class="fu-ext-equal"> : </span>
    <span class="fu-ext-result">0</span>

    <div class="fu-ext-settings-main">
      <div class="fu-ext-settings-desktop">

        <div><span class="fu-ext-char">D</span>esktop</div>
        <div class="fu-ext-setting-block">
          <span class="fu-ext-setting-title">width: </span>
          <input class="fu-ext-setting-input fu-ext-d-w" value="${config.vw.D}" />
          <span> px</span>
        </div>
        <div class="fu-ext-setting-block">
          <span class="fu-ext-setting-title">height: </span>
          <input class="fu-ext-setting-input fu-ext-d-h" value="${config.vh.D}" />
          <span> px</span>
        </div>
        <hr class="fu-ext-hr" />

        <div><span class="fu-ext-char">T</span>ablet</div>
        <div class="fu-ext-setting-block">
          <span class="fu-ext-setting-title">width: </span>
          <input class="fu-ext-setting-input fu-ext-t-w" value="${config.vw.T}" />
          <span> px</span>
        </div>
        <div class="fu-ext-setting-block">
          <span class="fu-ext-setting-title">height: </span>
          <input class="fu-ext-setting-input fu-ext-t-h" value="${config.vh.T}" />
          <span> px</span>
        </div>
        <hr class="fu-ext-hr" />

        <div><span class="fu-ext-char">M</span>obile</div>
        <div class="fu-ext-setting-block">
          <span class="fu-ext-setting-title">width: </span>
          <input class="fu-ext-setting-input fu-ext-m-w" value="${config.vw.M}" />
          <span> px</span>
        </div>
        <div class="fu-ext-setting-block">
          <span class="fu-ext-setting-title">height: </span>
          <input class="fu-ext-setting-input fu-ext-m-h" value="${config.vh.M}" />
          <span> px</span>
        </div>
        <hr class="fu-ext-hr" />

        <div class="fu-ext-save-preset-block">
          <input class="fu-ext-setting-input fu-ext-preset-name-input" placeholder="preset name" />
          <div class="fu-ext-preset-save-btn">save preset</div>
        </div>

        <div class="fu-ext-presets-header">
          <hr class="fu-ext-hr" />
          <div class="fu-ext-setting-block">
            <span class="fu-ext-setting-title">Presets: </span>
          </div>
        </div>

        <div class="fu-ext-presets-body"></div>

      </div>

    </div>
  </div>
</div>
`;

const toolsEl = qs('[data-testid="set-tool-comments"]').parentElement;

htmlToElement(document.head, styleHtml);
htmlToElement(toolsEl, mainHtml);

const mainEl = qs('.fu-ext-main');
const resEl = qs('.fu-ext-result');
const inputEl = qs('.fu-ext-input');
const unitsEl = qs('.fu-ext-units');
const viewportEl = qs('.fu-ext-viewport');
const settingsEl = qs('.fu-ext-settings');
const switchEl = qs('.fu-ext-switch');
const settingsMainEl = qs('.fu-ext-settings-main');
const savePresetBtnEl = qs('.fu-ext-preset-save-btn');
const presetNameInputEl = qs('.fu-ext-preset-name-input');
const presetsHeaderEl = qs('.fu-ext-presets-header');
const presetsBodyEl = qs('.fu-ext-presets-body');

const d_w_inputEl = qs('.fu-ext-d-w');
const d_h_inputEl = qs('.fu-ext-d-h');
const t_w_inputEl = qs('.fu-ext-t-w');
const t_h_inputEl = qs('.fu-ext-t-h');
const m_w_inputEl = qs('.fu-ext-m-w');
const m_h_inputEl = qs('.fu-ext-m-h');

const copy = txt => navigator.clipboard.writeText(`${txt}${config.units}`);

const saveConfig = () => {
  localStorage.setItem('fuConfig', JSON.stringify(config));
};

const savePresets = () => {
  localStorage.setItem('fuPresets', JSON.stringify(presets));
};

const setUnitsColor = () => {
  if (config.units === 'vh') {
    unitsEl.classList.add('m_fu-ext-vh');
  } else {
    unitsEl.classList.remove('m_fu-ext-vh');
  }
};

setUnitsColor();

const setUnitsType = () => {
  if (config.units === 'vw') {
    config.units = 'vh';
  } else {
    config.units = 'vw';
  }
  setUnitsColor();
  saveConfig();
  unitsEl.textContent = config.units;
  setUnits();
};

const setViewportColor = () => viewportEl.setAttribute('data-fu-ext-viewport-color', config.viewport);

setViewportColor();

const setViewportType = () => {
  switch(config.viewport) {
    case 'D':
      config.viewport = 'T';
      break;
    case 'T':
      config.viewport = 'M';
      break;
    case 'M':
      config.viewport = 'D';
      break;
  }
  setViewportColor();
  saveConfig();
  viewportEl.textContent = config.viewport;
  setUnits();
};

const settingsClickAwayHandler = e => {
  if (!settingsMainEl.contains(e.target) && !settingsEl.contains(e.target)) {
    toggleSettings(false);
  }
};

const toggleSettings = toggle => {
  const _toggle = toggle ?? !settingsMainEl.classList.contains('fu-ext-open');
  if (_toggle) {
    settingsMainEl.classList.add('fu-ext-open');
    document.addEventListener('mousedown', settingsClickAwayHandler);
  }
  if (!_toggle) {
    settingsMainEl.classList.remove('fu-ext-open');
    document.removeEventListener('mousedown', settingsClickAwayHandler);
  }
};

const setEnabled = () => {
  if (config.enabled) {
    mainEl.classList.remove('fu-ext-main-disabled');
    switchEl.textContent = 'on';
  } else {
    mainEl.classList.add('fu-ext-main-disabled');
    switchEl.textContent = 'off';
    toggleSettings(false);
  }
};

setEnabled();

const toggleEnabled = () => {
  config.enabled = !config.enabled;
  saveConfig();
  setEnabled();
};

const setUnits = (val = inputEl.value, focusInput = false) => {
  if (!config.enabled) {
    return;
  }
  const numVal = Number(val.replace('px', '').replace(',', '.'));
  if (isNaN(numVal) && numVal !== 0) {
    return;
  }
  inputEl.style.width = `${val.length}ch`;
  const layoutSize = config[config.units][config.viewport];
  if (layoutSize <= 0) {
    toggleSettings(true);
    return;
  }
  inputEl.value = val;
  const res = (numVal / layoutSize) * 100;
  const resultVal = Math.round((res + Number.EPSILON) * 100) / 100;
  const resultText = `${resultVal}`;
  resEl.textContent = resultText;
  copy(resultVal);
  if (focusInput) {
    inputEl.focus();
  }
};

const setActivePresets = () => {
  const presetsKeys = Object.keys(presets);
  qsa('.fu-ext-preset .fu-ext-active').forEach(activePresetEl => {
    activePresetEl.classList.remove('fu-ext-active');
  });
  presetsKeys.forEach(presetName => {
    const preset = presets[presetName];
    const isVW = preset.vw.D == config.vw.D
      && preset.vw.T == config.vw.T
      && preset.vw.M == config.vw.M;
    const isVH = preset.vh.D == config.vh.D
      && preset.vh.T == config.vh.T
      && preset.vh.M == config.vh.M;
    if (isVW && isVH) {
      qs(`.fu-ext-preset-apply[data-fu-ext-preset-name="${presetName}"]`).classList.add('fu-ext-active');
    }
  });
};

const setPresets = () => {
  const presetsKeys = Object.keys(presets);
  const isPresets = presetsKeys.length > 0;
  presetsHeaderEl.style.display = isPresets ? '' : 'none';
  let presetsBody = '';
  presetsKeys.forEach(presetName => {
    presetsBody += `
      <div class="fu-ext-preset">
        <div class="fu-ext-preset-apply" data-fu-ext-preset-name="${presetName}">${presetName}</div>
        <div class="fu-ext-preset-del" data-fu-ext-preset-name="${presetName}">&#10006;</div>
      </div>
    `;
  });
  presetsBodyEl.innerHTML = presetsBody;
  qsa('.fu-ext-preset .fu-ext-preset-apply').forEach(presetApplyEl => {
    on(presetApplyEl, 'click', applyPresetHandler);
  });
  qsa('.fu-ext-preset .fu-ext-preset-del').forEach(presetDelEl => {
    on(presetDelEl, 'click', deletePresetHandler);
  });
  setActivePresets();
};

document.addEventListener('click', async () => {
  const val = await navigator.clipboard.readText();
  if (val.includes('px')) {
    setUnits(val);
  }
});

document.addEventListener('mouseup', () => {
    if(window.getSelection().toString().length) {
      const val = window.getSelection().toString();
      if (val.includes('px')) {
        setUnits(val);
      }
    }
});

const savePresetHandler = () => {
  const presetName = presetNameInputEl.value.trim();
  if (presetName) {
    presets[presetName] = { vw: { ...config.vw }, vh: { ...config.vh } };
    savePresets();
    setPresets();
    presetNameInputEl.value = '';
  }
};

const applyPresetHandler = e => {
  const presetName = e.currentTarget.textContent;
  const preset = presets[presetName];
  config.vw = { ...preset.vw };
  config.vh = { ...preset.vh };
  d_w_inputEl.value = config.vw.D;
  d_h_inputEl.value = config.vh.D;
  t_w_inputEl.value = config.vw.T;
  t_h_inputEl.value = config.vh.T;
  m_w_inputEl.value = config.vw.M;
  m_h_inputEl.value = config.vh.M;
  saveConfig();
  setActivePresets();
};

const deletePresetHandler = e => {
  const presetName = e.currentTarget.getAttribute('data-fu-ext-preset-name');
  delete presets[presetName];
  savePresets();
  setPresets();
};

on(inputEl, 'input', () => setUnits(inputEl.value, true));
on(inputEl, 'focus', () => inputEl.select());
on (unitsEl, 'click', setUnitsType);
on (viewportEl, 'click', setViewportType);
on(settingsEl, 'click', () => toggleSettings());
on(switchEl, 'click', toggleEnabled);
on(savePresetBtnEl, 'click', savePresetHandler);
on(presetNameInputEl, 'keydown', e => {
  if (e.key === 'Enter') {
    savePresetHandler();
  }
});

on(d_w_inputEl, 'input', () => {
  config.vw.D = d_w_inputEl.value;
  setActivePresets();
  saveConfig();
  setUnits();
  d_w_inputEl.focus();
});
on(d_h_inputEl, 'input', () => {
  config.vh.D = d_h_inputEl.value;
  setActivePresets();
  saveConfig();
  setUnits();
  d_h_inputEl.focus();
});
on(t_w_inputEl, 'input', () => {
  config.vw.T = t_w_inputEl.value;
  setActivePresets();
  saveConfig();
  setUnits();
  t_w_inputEl.focus();
});
on(t_h_inputEl, 'input', () => {
  config.vh.T = t_h_inputEl.value;
  setActivePresets();
  saveConfig();
  setUnits();
  t_h_inputEl.focus();
});
on(m_w_inputEl, 'input', () => {
  config.vw.M = m_w_inputEl.value;
  setActivePresets();
  saveConfig();
  setUnits();
  m_w_inputEl.focus();
});
on(m_h_inputEl, 'input', () => {
  config.vh.M = m_h_inputEl.value;
  setActivePresets();
  saveConfig();
  setUnits();
  m_h_inputEl.focus();
});

setPresets();
