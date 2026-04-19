import { getConfig } from '../ak.js';

const { codeBase } = getConfig();

export default async function loadIcons(icons) {
  for (const icon of icons) {
    const name = icon.classList[1].substring(5);
    const url = `${codeBase}/img/icons/${name}.svg`;
    try {
      const resp = await fetch(url);
      if (resp.ok) {
        const svgText = await resp.text();
        const temp = document.createElement('div');
        temp.innerHTML = svgText;
        const svg = temp.querySelector('svg');
        if (svg) {
          svg.classList.add(...icon.classList);
          icon.insertAdjacentElement('afterend', svg);
          icon.remove();
          continue;
        }
      }
    } catch {
      // Fallback to use element
    }
    const svg = `<svg class="${icon.className}">
        <use href="${url}#${name}"></use>
    </svg>`;
    icon.insertAdjacentHTML('afterend', svg);
    icon.remove();
  }
}
