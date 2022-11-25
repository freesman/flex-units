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
.fu-ext-copy {
  position: absolute;
  z-index: -10;
  opacity: 0;
}
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
  cursor: pointer;
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
</style>
`;

const mainHtml = `
<div class="fu-ext-wrapper">
  <div class="fu-ext-main">
    <input class="fu-ext-copy" />

    <input class="fu-ext-input" />
    <span class="fu-ext-equal"> : </span>
    <span class="fu-ext-result">0</span>

    <span class="fu-ext-units">${config.units}</span>
    <span class="fu-ext-viewport">${config.viewport}</span>
    <span class="fu-ext-settings">&#9881;</span>
    <span class="fu-ext-switch">on</span>

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
          <input class="fu-ext-setting-input fu-ext-t-h" value="${config.vw.T}" />
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
          <input class="fu-ext-setting-input fu-ext-m-h" value="${config.vw.M}" />
          <span> px</span>
        </div>

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
const copyEl = qs('.fu-ext-copy');
const unitsEl = qs('.fu-ext-units');
const viewportEl = qs('.fu-ext-viewport');
const settingsEl = qs('.fu-ext-settings');
const switchEl = qs('.fu-ext-switch');
const settingsMainEl = qs('.fu-ext-settings-main');

const d_w_inputEl = qs('.fu-ext-d-w');
const d_h_inputEl = qs('.fu-ext-d-h');
const t_w_inputEl = qs('.fu-ext-t-w');
const t_h_inputEl = qs('.fu-ext-t-h');
const m_w_inputEl = qs('.fu-ext-m-w');
const m_h_inputEl = qs('.fu-ext-m-h');

const copy = txt => {
  copyEl.value = `${txt}${config.units}`;
  copyEl.select();
  document.execCommand('copy');
}

const saveConfig = () => {
  localStorage.setItem('fuConfig', JSON.stringify(config));
};

const setUnitsType = () => {
  if (config.units === 'vw') {
    config.units = 'vh';
  } else {
    config.units = 'vw';
  }
  saveConfig();
  unitsEl.textContent = config.units;
  setUnits();
};

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
  saveConfig();
  viewportEl.textContent = config.viewport;
  setUnits();
};

const toggleSettings = toggle => {
  if (toggle === true) {
    settingsMainEl.classList.add('fu-ext-open');
    return;
  }
  if (toggle === false) {
    settingsMainEl.classList.remove('fu-ext-open');
    return;
  }
  if (settingsMainEl.classList.contains('fu-ext-open')) {
    settingsMainEl.classList.remove('fu-ext-open');
  } else {
    settingsMainEl.classList.add('fu-ext-open');
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
  inputEl.style.width = `${val.length}ch`;
  const layoutSize = config[config.units][config.viewport];
  const numVal = Number(val.replace('px', '').replace(',', '.'));
  if (isNaN(numVal) && numVal !== 0) {
    return;
  }
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

document.addEventListener('copy', () => {
  navigator.clipboard.readText().then(val => {
    if (val.includes('px')) {
        setUnits(val);
      }
  });
});

document.addEventListener('mouseup', () => {
    if(window.getSelection().toString().length) {
      const val = window.getSelection().toString();
      if (val.includes('px')) {
        setUnits(val);
      }
    }
});

on(inputEl, 'input', () => setUnits(inputEl.value, true));
on (unitsEl, 'click', setUnitsType);
on (viewportEl, 'click', setViewportType);
on(settingsEl, 'click', toggleSettings);
on(switchEl, 'click', toggleEnabled);

on(d_w_inputEl, 'input', () => {
  config.vw.D = d_w_inputEl.value;
  saveConfig();
  setUnits();
  d_w_inputEl.focus();
});
on(d_h_inputEl, 'input', () => {
  config.vh.D = d_h_inputEl.value;
  saveConfig();
  setUnits();
  d_h_inputEl.focus();
});
on(t_w_inputEl, 'input', () => {
  config.vw.T = t_w_inputEl.value;
  saveConfig();
  setUnits();
  t_w_inputEl.focus();
});
on(t_h_inputEl, 'input', () => {
  config.vh.T = t_h_inputEl.value;
  saveConfig();
  setUnits();
  t_h_inputEl.focus();
});
on(m_w_inputEl, 'input', () => {
  config.vw.M = m_w_inputEl.value;
  saveConfig();
  setUnits();
  m_w_inputEl.focus();
});
on(m_h_inputEl, 'input', () => {
  config.vh.M = m_h_inputEl.value;
  saveConfig();
  setUnits();
  m_h_inputEl.focus();
});
