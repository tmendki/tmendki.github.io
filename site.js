document.querySelectorAll('[data-page]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    event.preventDefault();
    const destination = link.href;
    const rect = link.getBoundingClientRect();
    const styles = getComputedStyle(link);
    const ghost = document.createElement('span');

    ghost.className = 'page-title-ghost';
    ghost.textContent = link.textContent.trim();
    Object.assign(ghost.style, {
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      fontFamily: styles.fontFamily,
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      letterSpacing: styles.letterSpacing,
      lineHeight: styles.lineHeight,
      textAlign: styles.textAlign,
      '--target-inset': `${Math.max(20, Math.min(window.innerWidth * 0.05, 88))}px`,
      '--target-size': `${Math.min(window.innerWidth * 0.062, 108)}px`
    });

    document.body.appendChild(ghost);
    document.body.classList.add('page-leaving');

    requestAnimationFrame(() => ghost.classList.add('is-moving'));
    window.setTimeout(() => { window.location.href = destination; }, 560);
  });
});

