const setFeatureByPath = (path, value) => {
  let obj = window;
  const parts = path.split('.');
  while (parts.length > 1) obj = obj[parts.shift()];
  obj[parts[0]] = value;
};

function addFeature(features) {
  const feature = document.createElement('feature');
  features.forEach(attribute => {
    let element = attribute.type === 'nonInput' ? document.createElement('label') : document.createElement('input');
    if (attribute.type === 'nonInput') element.innerHTML = attribute.name;
    else {
      element.type = attribute.type;
      element.id = attribute.name;
    }

    if (attribute.attributes) {
      attribute.attributes.split(' ').map(attr => attr.split('=')).forEach(([key, value]) => {
        value = value ? value.replace(/"/g, '') : '';
        key === 'style' ? element.style.cssText = value : element.setAttribute(key, value);
      });
    }

    if (attribute.variable) element.setAttribute('setting-data', attribute.variable);
    if (attribute.dependent) element.setAttribute('dependent', attribute.dependent);
    if (attribute.className) element.classList.add(attribute.className);

    if (attribute.labeled) {
      const label = document.createElement('label');
      if (attribute.className) label.classList.add(attribute.className);
      if (attribute.attributes) {
        attribute.attributes.split(' ').map(attr => attr.split('=')).forEach(([key, value]) => {
          value = value ? value.replace(/"/g, '') : '';
          key === 'style' ? label.style.cssText = value : label.setAttribute(key, value);
        });
      }
      label.innerHTML = `${element.outerHTML} ${attribute.label}`;
      feature.appendChild(label);
    } else {
      feature.appendChild(element);
    }
  });
  dropdownMenu.innerHTML += feature.outerHTML;
}

function handleInput(ids, callback = null) {
  (Array.isArray(ids) ? ids.map(id => document.getElementById(id)) : [document.getElementById(ids)])
    .forEach(element => {
      if (!element) return;
      const setting = element.getAttribute('setting-data'),
        dependent = element.getAttribute('dependent'),
        handleEvent = (e, value) => {
          setFeatureByPath(setting, value);
          if (callback) callback(value, e);
        };

      if (element.type === 'checkbox') {
        element.addEventListener('change', (e) => {
          playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/5os0bypi.wav');
          handleEvent(e, e.target.checked);
          if (dependent) dependent.split(',').forEach(dep =>
            document.querySelectorAll(`.${dep}`).forEach(depEl =>
              depEl.style.display = e.target.checked ? null : "none"));
        });
      } else {
        element.addEventListener('input', (e) => handleEvent(e, e.target.value));
      }
    });
}

/* Watermark estilo "AMWARE" neon */
Object.assign(watermark.style, {
  position: 'fixed',
  top: '0',
  left: '85%',
  padding: '8px 16px',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: '1001',
  cursor: 'default',
  userSelect: 'none',
  transition: 'transform 0.3s ease',
  backdropFilter: 'blur(4px)'
});

if (device.mobile) watermark.style.left = '55%';

watermark.innerHTML = `
  <span style="
    font-size: 24px;
    font-weight: bold;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #80bfff;
    text-shadow:
      0 0 5px #80bfff,
      0 0 10px #80bfff,
      0 0 20px #1a75ff,
      0 0 30px #1a75ff;
  ">AMWARE</span>
`;

document.body.appendChild(watermark);

let isDragging = false, offsetX, offsetY;

watermark.addEventListener('mousedown', e => {
  if (!dropdownMenu.contains(e.target)) {
    isDragging = true;
    offsetX = e.clientX - watermark.offsetLeft;
    offsetY = e.clientY - watermark.offsetTop;
    watermark.style.transform = 'scale(0.9)';
  }
});
watermark.addEventListener('mouseup', () => {
  isDragging = false;
  watermark.style.transform = 'scale(1)';
});

document.addEventListener('mousemove', e => {
  if (isDragging) {
    let newX = Math.max(0, Math.min(e.clientX - offsetX, window.innerWidth - watermark.offsetWidth));
    let newY = Math.max(0, Math.min(e.clientY - offsetY, window.innerHeight - watermark.offsetHeight));
    Object.assign(watermark.style, { left: `${newX}px`, top: `${newY}px` });
    dropdownMenu.style.display = 'none';
  }
});

/* Dropdown atualizado visualmente */
Object.assign(dropdownMenu.style, {
  position: 'absolute',
  top: '100%',
  left: '0',
  width: '180px',
  backgroundColor: '#0b0b0d',
  borderRadius: '8px',
  color: '#80bfff',
  fontSize: '14px',
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  display: 'none',
  flexDirection: 'column',
  zIndex: '1000',
  padding: '8px',
  cursor: 'default',
  userSelect: 'none',
  transition: 'transform 0.3s ease',
  boxShadow: '0 0 10px rgba(128, 191, 255, 0.3)',
  border: '1px solid #1a75ff',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)'
});

dropdownMenu.innerHTML = `
  <style>
    feature {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 10px;
    }

    input[type="checkbox"] {
      appearance: none;
      width: 15px;
      height: 15px;
      background-color: #222;
      border: 1px solid #555;
      border-radius: 3px;
      margin-right: 6px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    input[type="checkbox"]:checked {
      background-color: #80bfff;
      border-color: #1a75ff;
    }

    input[type="text"], input[type="number"], input[type="range"] {
      width: 100%;
      border: 1px solid #333;
      color: #80bfff;
      background-color: transparent;
      padding: 4px;
      border-radius: 4px;
      font-family: 'Segoe UI', Tahoma, sans-serif;
      outline: none;
    }

    label {
      display: flex;
      align-items: center;
      font-family: 'Segoe UI', Tahoma, sans-serif;
      color: #80bfff;
      font-size: 14px;
      text-shadow:
        0 0 3px #80bfff,
        0 0 6px #1a75ff,
        0 0 10px #1a75ff;
    }
  </style>
`;

watermark.appendChild(dropdownMenu);

let featuresList = [
  { name: 'questionSpoof', type: 'checkbox', variable: 'features.questionSpoof', attributes: 'checked', labeled: true, label: 'Question Spoof' },
  { name: 'videoSpoof', type: 'checkbox', variable: 'features.videoSpoof', attributes: 'checked', labeled: true, label: 'Video Spoof' },
  { name: 'showAnswers', type: 'checkbox', variable: 'features.showAnswers', labeled: true, label: 'Answer Revealer' },
  { name: 'autoAnswer', type: 'checkbox', variable: 'features.autoAnswer', dependent: 'autoAnswerDelay,nextRecomendation,repeatQuestion', labeled: true, label: 'Auto Answer' },
  { name: 'repeatQuestion', className: 'repeatQuestion', type: 'checkbox', variable: 'features.repeatQuestion', attributes: 'style="display:none;"', labeled: true, label: 'Repeat Question' },
  { name: 'nextRecomendation', className: 'nextRecomendation', type: 'checkbox', variable: 'features.nextRecomendation', attributes: 'style="display:none;"', labeled: true, label: 'Recomendations' },
  { name: 'autoAnswerDelay', className: 'autoAnswerDelay', type: 'range', variable: 'features.autoAnswerDelay', attributes: 'style="display:none;" min="1" max="3" value="1"', labeled: false },
  { name: 'minuteFarm', type: 'checkbox', variable: 'features.minuteFarmer', labeled: true, label: 'Minute Farmer' },
  { name: 'customBanner', type: 'checkbox', variable: 'features.customBanner', labeled: true, label: 'Custom Banner' },
  { name: 'rgbLogo', type: 'checkbox', variable: 'features.rgbLogo', labeled: true, label: 'RGB Logo' },
  { name: 'darkMode', type: 'checkbox', variable: 'features.darkMode', attributes: 'checked', labeled: true, label: 'Dark Mode' },
  { name: 'onekoJs', type: 'checkbox', variable: 'features.onekoJs', labeled: true, label: 'onekoJs' },
  { name: 'Custom Username', type: 'nonInput' },
  { name: 'customName', type: 'text', variable: 'featureConfigs.customUsername', attributes: 'autocomplete="off"' },
  { name: 'Custom pfp', type: 'nonInput' },
  { name: 'customPfp', type: 'text', variable: 'featureConfigs.customPfp', attributes: 'autocomplete="off"' }
];

featuresList.push({ name: `${user.username} - UID: ${user.UID}`, type: 'nonInput', attributes: 'style="font-size:10px;"padding-left:5px;' });

addFeature(featuresList);

handleInput(['questionSpoof', 'videoSpoof', 'showAnswers', 'nextRecomendation', 'repeatQuestion', 'minuteFarm', 'customBanner', 'rgbLogo']);
handleInput(['customName', 'customPfp']);
handleInput('autoAnswer', checked => checked && !features.questionSpoof && (document.querySelector('[setting-data="features.questionSpoof"]').checked = features.questionSpoof = true));
handleInput('autoAnswerDelay', value => value && (featureConfigs.autoAnswerDelay = 4 - value));
handleInput('darkMode', checked => checked ? (DarkReader.setFetchMethod(window.fetch), DarkReader.enable()) : DarkReader.disable());
handleInput('onekoJs', checked => {
  onekoEl = document.getElementById('oneko');
  if (onekoEl) {
    onekoEl.style.display = checked ? null : "none";
  }
});

watermark.addEventListener('mouseenter', () => {
  dropdownMenu.style.display = 'flex';
  playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/3kd01iyj.wav');
});
watermark.addEventListener('mouseleave', e => {
  !watermark.contains(e.relatedTarget) && (dropdownMenu.style.display = 'none');
  playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/rqizlm03.wav');
});
