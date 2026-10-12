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
    const contact = document.querySelector('.contact-block');
    const contactRect = contact.getBoundingClientRect();
    const contactStyles = getComputedStyle(contact);
    const contactGhost = contact.cloneNode(true);
    const compactLayout = window.innerWidth <= 850;
    const containerOffset = Math.max(0, (window.innerWidth - 1480) / 2);
    const pagePadding = compactLayout
      ? 20
      : Math.max(32, Math.min(window.innerWidth * 0.05, 88));
    const targetInset = compactLayout ? 20 : containerOffset + pagePadding;
    const targetSize = Math.max(48, Math.min(window.innerWidth * 0.062, 108.8));
    const targetContactSize = Math.max(16, Math.min(window.innerWidth * 0.0155, 24.8));
    const targetContactTop = compactLayout ? targetInset + 89.6 : targetInset;

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

    contactGhost.className = 'contact-transition-ghost';
    contactGhost.setAttribute('aria-hidden', 'true');
    Object.assign(contactGhost.style, {
      top: `${contactRect.top}px`,
      width: `${contactRect.width}px`,
      fontFamily: contactStyles.fontFamily,
      fontSize: contactStyles.fontSize,
      fontWeight: contactStyles.fontWeight,
      lineHeight: contactStyles.lineHeight
    });
    if (compactLayout) {
      contactGhost.style.left = `${contactRect.left}px`;
      contactGhost.style.setProperty('--target-contact-left', `${targetInset}px`);
    } else {
      contactGhost.style.right = `${window.innerWidth - contactRect.right}px`;
      contactGhost.style.setProperty('--target-contact-right', `${targetInset}px`);
    }
    contactGhost.style.setProperty('--target-contact-top', `${targetContactTop}px`);
    contactGhost.style.setProperty('--target-contact-size', `${targetContactSize}px`);

    document.body.appendChild(ghost);
    document.body.appendChild(contactGhost);
    document.body.classList.add('page-leaving');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ghost.classList.add('is-moving');
        contactGhost.classList.add('is-moving');
      });
    });
    window.setTimeout(() => { window.location.href = destination; }, 660);
  });
});
