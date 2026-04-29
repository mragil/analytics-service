(function () {
  const scripts = document.querySelectorAll('script[data-api][data-site]');
  if (!scripts.length) return;

  const script = scripts[scripts.length - 1];
  const apiEndpoint = script.getAttribute('data-api');
  const siteId = script.getAttribute('data-site');

  function getSessionId() {
    let sid = localStorage.getItem('_analytics_sid');
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem('_analytics_sid', sid);
    }
    return sid;
  }

  function track() {
    const payload = {
      siteId,
      url: window.location.href,
      referrer: document.referrer || undefined,
      sessionId: getSessionId(),
      screenSize: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
    };

    const blob = new Blob([JSON.stringify(payload)], { type: 'text/plain;charset=UTF-8' });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(`${apiEndpoint}/track`, blob);
    } else {
      fetch(`${apiEndpoint}/track`, {
        method: 'POST',
        body: blob,
        keepalive: true,
      });
    }
  }

  track();

  let timeout;
  window.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      track();
    }
  });

  const origPushState = history.pushState;
  history.pushState = function () {
    origPushState.apply(this, arguments);
    clearTimeout(timeout);
    timeout = setTimeout(track, 100);
  };

  window.addEventListener('popstate', function () {
    clearTimeout(timeout);
    timeout = setTimeout(track, 100);
  });
})();
