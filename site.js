const shellSelector = '.home-shell, .content-shell';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function markSharedElements(link) {
  if (!link.matches('[data-page]')) return;

  document.querySelectorAll('[data-page]').forEach((pageLink) => {
    pageLink.style.viewTransitionName = 'none';
  });
  link.style.viewTransitionName = 'page-title';

  const contact = document.querySelector('.contact-block');
  if (contact) contact.style.viewTransitionName = 'page-contact';
}

function replacePage(nextDocument, nextUrl, updateHistory) {
  const currentShell = document.querySelector(shellSelector);
  const nextShell = nextDocument.querySelector(shellSelector);

  if (!currentShell || !nextShell) throw new Error('Page shell not found');

  currentShell.replaceWith(document.importNode(nextShell, true));
  document.body.className = nextDocument.body.className;
  document.title = nextDocument.title;

  if (updateHistory) history.pushState({}, '', nextUrl);

  bindInternalNavigation();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

async function navigate(nextUrl, updateHistory = true, sourceLink = null) {
  try {
    const response = await fetch(nextUrl, { headers: { 'X-Requested-With': 'site-navigation' } });
    if (!response.ok) throw new Error(`Navigation failed: ${response.status}`);

    const nextDocument = new DOMParser().parseFromString(await response.text(), 'text/html');
    const swap = () => replacePage(nextDocument, nextUrl, updateHistory);

    if (sourceLink) markSharedElements(sourceLink);

    if (!reduceMotion.matches && typeof document.startViewTransition === 'function') {
      await document.startViewTransition(swap).finished;
      return;
    }

    const currentShell = document.querySelector(shellSelector);
    if (!reduceMotion.matches && currentShell) {
      await currentShell.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 130, easing: 'ease-out', fill: 'forwards' }
      ).finished;
    }

    swap();

    const nextShell = document.querySelector(shellSelector);
    if (!reduceMotion.matches && nextShell) {
      nextShell.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 210, easing: 'ease-out' }
      );
    }
  } catch (error) {
    window.location.href = nextUrl;
  }
}

function bindInternalNavigation() {
  document.querySelectorAll('a[href]').forEach((link) => {
    if (link.dataset.navigationBound === 'true' || link.target === '_blank') return;

    const url = new URL(link.href, window.location.href);
    const isSitePage = url.origin === window.location.origin && url.pathname.endsWith('.html');
    if (!isSitePage) return;

    link.dataset.navigationBound = 'true';
    link.addEventListener('click', (event) => {
      const isStandardNavigation = event.button === 0
        && !event.metaKey
        && !event.ctrlKey
        && !event.shiftKey
        && !event.altKey;

      if (!isStandardNavigation) return;

      event.preventDefault();
      navigate(url.href, true, link);
    });
  });
}

bindInternalNavigation();

window.addEventListener('popstate', () => {
  navigate(window.location.href, false);
});
