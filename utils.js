import { palettes } from './constants.js';

export function showToast(message, type = 'success') { 
    const c = document.getElementById('toast-container'); 
    if(!c) return; 
    const t = document.createElement('div'); 
    t.className = `toast ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white font-bold py-2 px-4 rounded-lg shadow-lg mb-2 opacity-0 transform translate-y-2`; t.textContent = message; c.appendChild(t); 
    setTimeout(() => t.classList.remove('opacity-0', 'translate-y-2'), 100); 
    setTimeout(() => { t.classList.add('opacity-0'); t.addEventListener('transitionend', () => t.remove()); }, 4000); 
}

export function openModal(title, body, size = 'lg') { 
    const m = document.getElementById('modal-template'); 
    const mc = document.getElementById('modal-content'); 
    if(!m || !mc) return; 
    document.getElementById('modal-title').innerText = title; 
    document.getElementById('modal-body').innerHTML = body; 
    mc.className = mc.className.replace(/max-w-\S+/g, `max-w-${size}`); 
    m.classList.remove('hidden'); 
    m.classList.add('flex'); 
}

export function closeModal() {
    const m = document.getElementById('modal-template');
    if (m) m.classList.add('hidden');
}

export function setPageTitle(title) { 
    const el = document.getElementById('page-title'); 
    if (el) el.textContent = title; 
}

export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}

export function applyTheme(themeName = 'sky') {
    const palette = palettes[themeName] || palettes.sky;
    const root = document.documentElement;
    Object.keys(palette).forEach(key => root.style.setProperty(`--primary-${key}`, palette[key]));
    const todayRgb = hexToRgb(palette['500']);
    if (todayRgb) {
         root.style.setProperty('--fc-today-bg-color', `rgba(${todayRgb.r}, ${todayRgb.g}, ${todayRgb.b}, 0.1)`);
    }
}
