export default async function decorate(block) {
  const rows = [...block.children];

  // Row 0: background image
  const bgRow = rows[0];
  const bgPic = bgRow?.querySelector('picture');
  const bgImg = bgRow?.querySelector('img');

  // Row 1: heading
  const headingRow = rows[1];
  const heading = headingRow?.querySelector('h2');

  // Row 2: subtitle
  const subtitleRow = rows[2];
  const subtitle = subtitleRow?.querySelector('p');

  // Row 3: field labels
  const fieldsRow = rows[3];
  const fieldLabels = [...(fieldsRow?.children || [])].map(
    (cell) => cell.textContent.trim(),
  ).filter(Boolean);

  // Row 4: button text
  const buttonRow = rows[4];
  const buttonText = buttonRow?.textContent?.trim() || 'Sign Up';

  // Clear block
  block.textContent = '';

  // Background
  const bgDiv = document.createElement('div');
  bgDiv.className = 'newsletter-bg';
  if (bgPic) {
    bgDiv.appendChild(bgPic);
  } else if (bgImg) {
    bgDiv.appendChild(bgImg);
  }
  block.appendChild(bgDiv);

  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'newsletter-overlay';
  block.appendChild(overlay);

  // Content wrapper (two columns)
  const content = document.createElement('div');
  content.className = 'newsletter-content';

  // Left column: heading + subtitle
  const left = document.createElement('div');
  left.className = 'newsletter-header';
  if (heading) left.appendChild(heading);
  if (subtitle) {
    subtitle.className = 'newsletter-subtitle';
    left.appendChild(subtitle);
  }
  content.appendChild(left);

  // Right column: form
  const form = document.createElement('form');
  form.className = 'newsletter-form';
  form.addEventListener('submit', (e) => e.preventDefault());

  fieldLabels.forEach((label) => {
    const group = document.createElement('div');
    group.className = 'newsletter-field';
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    const input = document.createElement('input');
    input.type = label.toLowerCase().includes('email') ? 'email' : 'text';
    input.placeholder = `*${label}`;
    input.name = label.toLowerCase().replace(/\s+/g, '_');
    input.required = true;
    group.appendChild(labelEl);
    group.appendChild(input);
    form.appendChild(group);
  });

  // Terms checkbox
  const terms = document.createElement('div');
  terms.className = 'newsletter-terms';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'newsletter-terms';
  const termsLabel = document.createElement('label');
  termsLabel.htmlFor = 'newsletter-terms';
  termsLabel.textContent = '*By signing up, you agree to receive communications from Watkins Glen International in accordance with our Privacy Policy and Terms of Use.';
  terms.appendChild(checkbox);
  terms.appendChild(termsLabel);
  form.appendChild(terms);

  // Required note
  const req = document.createElement('p');
  req.className = 'newsletter-required';
  req.textContent = '* Required';
  form.appendChild(req);

  // Submit
  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.className = 'btn btn-primary';
  btn.textContent = buttonText;
  form.appendChild(btn);

  content.appendChild(form);
  block.appendChild(content);

  // Make parent section full-width
  const section = block.closest('main > div') || block.parentElement;
  if (section) section.classList.add('full-width');
}
