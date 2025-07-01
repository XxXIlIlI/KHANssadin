const phrases = [ 
    "[💎] Pastel de strogonoff.",
    "[💎] Nix programou isso.",
    "[💎] Hardtekk é muito bom.",
    "[💎] kassadin level 16.",
    "[💎] Porque você ligou isso?",
    "[💎] não sei oque colocar aqui :c" 
];

setInterval(() => { 
    const greeting = document.querySelector('.stp-animated-banner h2');
    if (greeting&&features.customBanner) greeting.textContent = phrases[Math.floor(Math.random() * phrases.length)];
}, 3000);
