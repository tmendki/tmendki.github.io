document.querySelectorAll('[data-page]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    event.preventDefault();
    const destination = link.href;
    const range = document.createRange();
    range.selectNodeContents(link);
    const textRect = range.getBoundingClientRect();
    const styles = getComputedStyle(link);
    const ghost = document.createElement('span');
    const compactLayout = window.innerWidth <= 850;
    const containerOffset = Math.max(0, (window.innerWidth - 1480) / 2);
    const pagePadding = compactLayout
      ? 20
      : Math.max(32, Math.min(window.innerWidth * 0.05, 88));
    const targetInset = compactLayout ? 20 : containerOffset + pagePadding;
    const targetSize = Math.max(48, Math.min(window.innerWidth * 0.062, 108.8));

    ghost.className = 'page-title-ghost';
    ghost.textContent = link.dataset.page === 'presentations'
      ? 'Presentations & pubs'
      : link.textContent.trim();

    Object.assign(ghost.style, {
      left: `${textRect.left}px`,
      top: `${textRect.top}px`,
      fontFamily: styles.fontFamily,
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      letterSpacing: styles.letterSpacing,
      lineHeight: styles.lineHeight
    });
    ghost.style.setProperty('--target-inset', `${targetInset}px`);
    ghost.style.setProperty('--target-size', `${targetSize}px`);

    document.body.appendChild(ghost);
    document.body.classList.add('page-leaving');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => ghost.classList.add('is-moving'));
    });
    window.setTimeout(() => { window.location.href = destination; }, 590);
  });
});
