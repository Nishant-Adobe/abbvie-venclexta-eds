export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const picture = block.querySelector('picture');

  const contentRow = rows.find((row) => row.querySelector('h1') || row.querySelector('h2'));
  const ctaRow = rows.find((row) => {
    const links = row.querySelectorAll('a');
    return links.length >= 2 && !row.querySelector('h1') && !row.querySelector('h2');
  });
  const footnoteRow = rows.find((row) => {
    const p = row.querySelector('p');
    return p && !row.querySelector('a') && !row.querySelector('h1') && !row.querySelector('picture') && row !== contentRow;
  });

  block.textContent = '';

  if (picture) {
    picture.classList.add('hero-bg');
    block.append(picture);
  }

  const content = document.createElement('div');
  content.className = 'hero-content';

  if (contentRow) {
    const heading = contentRow.querySelector('h1') || contentRow.querySelector('h2');
    if (heading) content.append(heading);
  }

  if (ctaRow) {
    const ctaContainer = document.createElement('div');
    ctaContainer.className = 'hero-ctas';
    const links = ctaRow.querySelectorAll('a');
    links.forEach((link) => {
      link.classList.remove('button', 'primary', 'secondary');
      ctaContainer.append(link);
    });
    content.append(ctaContainer);
  }

  if (footnoteRow) {
    const p = footnoteRow.querySelector('p');
    if (p) {
      p.className = 'hero-footnote';
      content.append(p);
    }
  }

  block.append(content);
}
