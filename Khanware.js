const ver = "V3.1.1";
let isDev = false;

const repoPath = `https://raw.githubusercontent.com/XxXIlIlI/KASSADIN/refs/heads/${isDev ? "dev/" : "main/"}`;

let device = {
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i.test(navigator.userAgent),
    apple: /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent)
};

let user = {
    username: "Username",
    nickname: "Nickname",
    UID: 0
}

let loadedPlugins = [];

const unloader = document.createElement('unloader');
const dropdownMenu = document.createElement('dropDownMenu');
const watermark = document.createElement('watermark');
const statsPanel = document.createElement('statsPanel');
const splashScreen = document.createElement('splashScreen');

window.features = {
    questionSpoof: true,
    videoSpoof: true,
    showAnswers: false,
    autoAnswer: false,
    customBanner: false,
    nextRecomendation: false,
    repeatQuestion: false,
    minuteFarmer: false,
    rgbLogo: false
};
window.featureConfigs = {
    autoAnswerDelay: 3,
    customUsername: "",
    customPfp: ""
};

document.addEventListener('contextmenu', (e) => !window.disableSecurity && e.preventDefault());
document.addEventListener('keydown', (e) => {
    if (!window.disableSecurity && (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)))) {
        e.preventDefault();
    }
});
console.log(Object.defineProperties(new Error, {
    toString: {
        value() {
            (new Error).stack.includes('toString@') && location.reload();
        }
    },
    message: {
        get() {
            location.reload();
        }
    }
}));

document.head.appendChild(Object.assign(document.createElement("style"), {
    innerHTML: "@font-face{font-family:'MuseoSans';src:url('https://corsproxy.io/?url=https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ynddewua.ttf')format('truetype')}"
}));
document.head.appendChild(Object.assign(document.createElement('style'), {
    innerHTML: "::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #f1f1f1; } ::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #555; }"
}));
document.querySelector("link[rel~='icon']").href = 'https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ukh0rq22.png';

class EventEmitter {
    constructor() {
        this.events = {}
    }
    on(t, e) {
        if (typeof t === "string") t = [t];
        t.forEach(t => {
            this.events[t] || (this.events[t] = []);
            this.events[t].push(e)
        })
    }
    off(t, e) {
        if (typeof t === "string") t = [t];
        t.forEach(t => {
            this.events[t] && (this.events[t] = this.events[t].filter(t => t !== e))
        })
    }
    emit(t, ...e) {
        this.events[t] && this.events[t].forEach(t => {
            t(...e)
        })
    }
    once(t, e) {
        if (typeof t === "string") t = [t];
        let s = (...i) => {
            e(...i), this.off(t, s)
        };
        this.on(t, s)
    }
};
const plppdo = new EventEmitter();

new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList)
        if (mutation.type === 'childList') plppdo.emit('domChanged');
}).observe(document.body, { childList: true, subtree: true });

window.debug = function (text) { };
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const playAudio = url => { const audio = new Audio(url); audio.play(); debug(`🔊 Playing audio from ${url}`); };
const findAndClickBySelector = selector => {
    const element = document.querySelector(selector);
    if (element) {
        element.click();
        sendToast(`⭕ Pressionando ${selector}...`, 1000);
    }
};

function sendToast(text, duration = 5000, gravity = 'bottom') {
    Toastify({
        text: text,
        duration: duration,
        gravity: gravity,
        position: "center",
        stopOnFocus: true,
        style: { background: "#000000" }
    }).showToast();
    debug(text);
};

// 👇 MODIFICADO: Splash screen com estilo "AMWARE"
async function showSplashScreen() {
    splashScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.5s ease;
        user-select: none;
    `;

    splashScreen.innerHTML = `
        <span style="
            font-size: 48px;
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

    document.body.appendChild(splashScreen);
    setTimeout(() => splashScreen.style.opacity = '1', 10);
}

async function hideSplashScreen() {
    splashScreen.style.opacity = '0';
    setTimeout(() => splashScreen.remove(), 1000);
};

async function loadScript(url, label) {
    return fetch(url).then(response => response.text()).then(script => {
        loadedPlugins.push(label);
        eval(script);
    });
}
async function loadCss(url) {
    return new Promise((resolve) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        link.onload = () => resolve();
        document.head.appendChild(link);
    });
}

function setupMenu() {
    loadScript(repoPath + 'visuals/mainMenu.js', 'mainMenu');
    loadScript(repoPath + 'visuals/statusPanel.js', 'statusPanel');
    loadScript(repoPath + 'visuals/widgetBot.js', 'widgetBot');
    if (isDev) loadScript(repoPath + 'visuals/devTab.js', 'devTab');
}

function setupMain() {
    loadScript(repoPath + 'functions/questionSpoof.js', 'questionSpoof');
    loadScript(repoPath + 'functions/videoSpoof.js', 'videoSpoof');
    loadScript(repoPath + 'functions/minuteFarm.js', 'minuteFarm');
    loadScript(repoPath + 'functions/spoofUser.js', 'spoofUser');
    loadScript(repoPath + 'functions/answerRevealer.js', 'answerRevealer');
    loadScript(repoPath + 'functions/rgbLogo.js', 'rgbLogo');
    loadScript(repoPath + 'functions/customBanner.js', 'customBanner');
    loadScript(repoPath + 'functions/autoAnswer.js', 'autoAnswer');
}

if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
    alert("❌ Khanware Failed to Injected!\n\nVocê precisa executar o Khanware no site do Khan Academy! (https://pt.khanacademy.org/)");
    window.location.href = "https://pt.khanacademy.org/";
}

showSplashScreen();

loadScript('https://raw.githubusercontent.com/adryd325/oneko.js/refs/heads/main/oneko.js', 'onekoJs').then(() => {
    onekoEl = document.getElementById('oneko');
    onekoEl.style.backgroundImage = "url('https://raw.githubusercontent.com/adryd325/oneko.js/main/oneko.gif')";
    onekoEl.style.display = "none";
});
loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin').then(() => {
    DarkReader.setFetchMethod(window.fetch);
    DarkReader.enable();
});
loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css', 'toastifyCss');
loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
    .then(async () => {
        await fetch(`https://${window.location.hostname}/api/internal/graphql/getFullUserProfile`, {
            headers: {
                accept: "*/*",
                "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/json",
                priority: "u=1, i",
                "sec-ch-ua": '"Chromium";v="134", "Not:A-Brand";v="24", "Brave";v="134"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "sec-gpc": "1",
                "x-ka-fkey": "1"
            },
            referrer: "https://pt.khanacademy.org/profile/me/teacher/kaid_589810246138844031185299/class/6245691961556992",
            referrerPolicy: "strict-origin-when-cross-origin",
            body: '{"operationName":"getFullUserProfile","variables":{},"query":"query getFullUserProfile($kaid: String, $username: String) {...}"}',
            method: "POST",
            mode: "cors",
            credentials: "include"
        }).then(async response => {
            let data = await response.json();
            user = {
                nickname: data.data.user.nickname,
                username: data.data.user.username,
                UID: data.data.user.id.slice(-5)
            };
        });

        sendToast("🌿 Khanware injetado com sucesso!");
        playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
        await delay(500);
        sendToast(`⭐ Bem vindo(a) de volta: ${user.nickname}`);
        if (device.apple) {
            await delay(500);
            sendToast(`🪽 Que tal comprar um Samsung?`);
        }
        loadedPlugins.forEach(plugin => sendToast(`🪝 ${plugin} Loaded!`, 2000, 'top'));
        hideSplashScreen();
        setupMenu();
        setupMain();
        console.clear();
    });
