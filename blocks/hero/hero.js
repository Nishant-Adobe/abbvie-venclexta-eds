export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const picture = block.querySelector('picture');
  const heading = block.querySelector('h1') || block.querySelector('h2');

  block.textContent = '';

  if (picture) {
    picture.classList.add('hero-bg');
    block.append(picture);
  }

  const content = document.createElement('div');
  content.className = 'hero-content';

  if (heading) content.append(heading);

  block.append(content);
}
