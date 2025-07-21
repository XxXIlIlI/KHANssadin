const setFeatureByPath = (path, value) => {
  let obj = window;
  const parts = path.split('.');
  for (let i = 0; i < parts.length - 1; i++) {
    obj = obj[parts[i]] ?? (obj[parts[i]] = {});
  }
  obj[parts[parts.length - 1]] = value;
};

const createElementWithAttributes = (tag, attributes = {}) => {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'style') {
      element.style.cssText = value;
    } else if (key === 'className') {
      element.classList.add(value);
    } else {
      element.setAttribute(key, value);
    }
  });
  return element;
};

const addFeature = (features, container) => {
  const feature = createElementWithAttributes('feature', { className: 'feature' });
  features.forEach(({ name, type, variable, attributes, dependent, className, labeled, label }) => {
    const isInput = type !== 'nonInput';
    const element = createElementWithAttributes(isInput ? 'input' : 'label', {
      type: isInput ? type : undefined,
      id: isInput ? name : undefined,
      innerHTML: isInput ? undefined : name,
      'setting-data': variable,
      dependent,
      className,
    });

    if (attributes) {
      attributes.split(' ').forEach(attr => {
        const [key, value = ''] = attr.split('=');
        element.setAttribute(key, value.replace(/"/g, ''));
      });
    }

    if (labeled) {
      const labelElement = createElementWithAttributes('label', { className });
      labelElement.innerHTML = `${element.outerHTML} ${label}`;
      feature.appendChild(labelElement);
    } else {
      feature.appendChild(element);
    }
  });
  container.innerHTML += feature.outerHTML;
};

const handleInput = (ids, callback) => {
  const elements = (Array.isArray(ids) ? ids : [ids]).map(id => document.getElementById(id)).filter(Boolean);
  elements.forEach(element => {
    const setting = element.getAttribute('setting-data');
    const dependent = element.getAttribute('dependent');
    const handleEvent = (e, value) => {
      setFeatureByPath(setting, value);
      if (callback) callback(value, e);
    };

    const eventType = element.type === 'checkbox' ? 'change' : 'input';
    element.addEventListener(eventType, e => {
      const value = element.type === 'checkbox' ? e.target.checked : e.target.value;
      if (element.type === 'checkbox') {
        playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/5os0bypi.wav');
        if (dependent) {
          dependent.split(',').forEach(dep => {
            document.querySelectorAll(`.${dep}`).forEach(depEl => {
              depEl.style.display = e.target.checked ? '' : 'none';
            });
          });
        }
      }
      handleEvent(e, value);
    });
  });
};

const setupWatermark = () => {
  const watermark = createElementWithAttributes('div', {
    id: 'watermark',
    style: `
      position: fixed;
      top: 10px;
      left: ${device.mobile ? '55%' : '85%'};
      padding: 10px 20px;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1001;
      cursor: pointer;
      user-select: none;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      backdrop-filter: blur(6px);
      box-shadow: 0 4px 15px rgba(128, 191, 255, 0.4);
    `,
  });

  watermark.innerHTML = `
    <span style="
      font-size: 26px;
      font-weight: 700;
      font-family: 'Montserrat', sans-serif;
      color: #66ccff;
      text-shadow: 0 0 8px #66ccff, 0 0 12px #3399ff, 0 0 16px #3399ff;
    ">KHANSSADIN</span>
  `;

  document.body.appendChild(watermark);
  return watermark;
};

const setupDropdown = (watermark) => {
  const dropdownMenu = createElementWithAttributes('div', {
    id: 'dropdownMenu',
    style: `
      position: absolute;
      top: 100%;
      left: 0;
      width: 200px;
      background: linear-gradient(145deg, #0d0d0f, #1a1a1e);
      border-radius: 10px;
      color: #66ccff;
      font-size: 14px;
      font-family: 'Montserrat', sans-serif;
      display: none;
      flex-direction: column;
      z-index: 1000;
      padding: 12px;
      box-shadow: 0 6px 20px rgba(128, 191, 255, 0.5);
      border: 1px solid #3399ff;
      backdrop-filter: blur(8px);
      transition: transform 0.3s ease, opacity 0.3s ease;
    `,
  });

  dropdownMenu.innerHTML = `
    <style>
      .feature {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px;
      }
      input[type="checkbox"] {
        appearance: none;
        width: 16px;
        height: 16px;
        background: #1a1a1e;
        border: 2px solid #66ccff;
        border-radius: 4px;
        margin-right: 8px;
        cursor: pointer;
        transition: background 0.2s, border-color 0.2s;
      }
      input[type="checkbox"]:checked {
        background: #66ccff;
        border-color: #3399ff;
      }
      input[type="text"], input[type="number"], input[type="range"] {
        width: 100%;
        border: 1px solid #3399ff;
        color: #66ccff;
        background: transparent;
        padding: 6px;
        border-radius: 6px;
        font-family: 'Montserrat', sans-serif;
        outline: none;
        transition: border-color 0.2s;
      }
      input[type="text"]:focus, input[type="number"]:focus, input[type="range"]:focus {
        border-color: #80bfff;
        box-shadow: 0 0 5px rgba(128, 191, 255, 0.5);
      }
      label {
        display: flex;
        align-items: center;
        font-family: 'Montserrat', sans-serif;
        color: #66ccff;
        font-size: 14px;
        text-shadow: 0 0 4px #66ccff, 0 0 8px #3399ff;
      }
      label:hover {
        color: #80bfff;
      }
    </style>
  `;

  watermark.appendChild(dropdownMenu);
  return dropdownMenu;
};

const setupDrag = (watermark) => {
  let isDragging = false, offsetX, offsetY;
  watermark.addEventListener('mousedown', e => {
    if (!dropdownMenu.contains(e.target)) {
      isDragging = true;
      offsetX = e.clientX - watermark.offsetLeft;
      offsetY = e.clientY - watermark.offsetTop;
      watermark.style.transform = 'scale(0.95)';
    }
  });

  watermark.addEventListener('mouseup', () => {
    isDragging = false;
    watermark.style.transform = 'scale(1)';
  });

  document.addEventListener('mousemove', e => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(e.clientX - offsetX, window.innerWidth - watermark.offsetWidth));
      const newY = Math.max(0, Math.min(e.clientY - offsetY, window.innerHeight - watermark.offsetHeight));
      watermark.style.left = `${newX}px`;
      watermark.style.top = `${newY}px`;
      dropdownMenu.style.display = 'none';
    }
  });
};

const setupToggle = (watermark, dropdownMenu) => {
  watermark.addEventListener('click', e => {
    if (dropdownMenu.contains(e.target) || e.target.tagName !== 'SPAN') return;
    const isVisible = dropdownMenu.style.display === 'flex';
    dropdownMenu.style.display = isVisible ? 'none' : 'flex';
    playAudio(isVisible
      ? 'https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/rqizlm03.wav'
      : 'https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/3kd01iyj.wav'
    );
  });
};

const watermark = setupWatermark();
const dropdownMenu = setupDropdown(watermark);
setupDrag(watermark);
setupToggle(watermark, dropdownMenu);

const featuresList = [
  { name: 'questionSpoof', type: 'checkbox', variable: 'features.questionSpoof', attributes: 'checked', labeled: true, label: 'Question Spoof' },
  { name: 'videoSpoof', type: 'checkbox', variable: 'features.videoSpoof', attributes: 'checked', labeled: true, label: 'Video Spoof' },
  { name: 'showAnswers', type: 'checkbox', variable: 'features.showAnswers', labeled: true, label: 'Answer Revealer' },
  { name: 'autoAnswer', type: 'checkbox', variable: 'features.autoAnswer', dependent: 'autoAnswerDelay,nextRecomendation,repeatQuestion', labeled: true, label: 'Auto Answer' },
  { name: 'repeatQuestion', className: 'repeatQuestion', type: 'checkbox', variable: 'features.repeatQuestion', attributes: 'style="display:none;"', labeled: true, label: 'Repeat Question' },
  { name: 'nextRecomendation', className: 'nextRecomendation', type: 'checkbox', variable: 'features.nextRecomendation', attributes: 'style="display:none;"', labeled: true, label: 'Recomendations' },
  { name: 'autoAnswerDelay', className: 'autoAnswerDelay', type: 'range', variable: 'features.autoAnswerDelay', attributes: 'style="display:none;" min="1" max="3" value="1"', labeled: false },
  { name: 'minuteFarm', type: 'checkbox', variable: 'features.minuteFarmer', labeled: true, label: 'Minute Farmer' },
  { name: 'customBanner', type: 'checkbox', variable: 'features.customBanner', labeled: true, label: 'Custom Banner' },
  { name: 'darkMode', type: 'checkbox', variable: 'features.darkMode', attributes: 'checked', labeled: true, label: 'Dark Mode' },
  { name: 'Custom Username', type: 'nonInput' },
  { name: 'customName', type: 'text', variable: 'featureConfigs.customUsername', attributes: 'autocomplete="off"' },
  { name: 'Custom pfp', type: 'nonInput' },
  { name: 'customPfp', type: 'text', variable: 'featureConfigs.customPfp', attributes: 'autocomplete="off"' },
  { name: `${user.username} - UID: ${user.UID}`, type: 'nonInput', attributes: 'style="font-size:10px;padding-left:5px;"' },
];

addFeature(featuresList, dropdownMenu);
handleInput(['questionSpoof', 'videoSpoof', 'showAnswers', 'nextRecomendation', 'repeatQuestion', 'minuteFarm', 'customBanner', 'rgbLogo']);
handleInput(['customName', 'customPfp']);
handleInput('autoAnswer', checked => {
  if (checked && !features.questionSpoof) {
    const spoofCheckbox = document.querySelector('[setting-data="features.questionSpoof"]');
    spoofCheckbox.checked = features.questionSpoof = true;
  }
});
handleInput('autoAnswerDelay', value => {
  if (value) featureConfigs.autoAnswerDelay = 4 - value;
});
handleInput('darkMode', checked => {
  if (checked) {
    DarkReader.setFetchMethod(window.fetch);
    DarkReader.enable();
  } else {
    DarkReader.disable();
  }
});
