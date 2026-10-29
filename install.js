'use strict';
(() => {
  const button = document.querySelector('#install-app');
  const dialog = document.querySelector('#install-guide');
  const nativeButton = document.querySelector('#native-install');
  const nativeWrap = document.querySelector('#native-install-wrap');
  const status = document.querySelector('#install-status');
  const standalone = matchMedia('(display-mode: standalone)');
  let installPrompt = null;
  const isInstalled = () => standalone.matches || navigator.standalone === true;
  function renderButton(installed){
    const label=installed?'설치 안내':'앱 설치';
    button.innerHTML='<span class="action-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M10 3h6M13 1v10m-4-4 4 4 4-4M8 17h4"/></svg></span><span class="action-label">'+label+'</span>';
    button.setAttribute('aria-label',installed?'설치 안내 (홈 화면에서 실행 중)':'앱 설치 안내');
    button.title=installed?'설치 안내':'앱 설치 안내';
  }
  function update() {
    const installed = isInstalled();
    renderButton(installed);
    nativeWrap.hidden = installed || !installPrompt;
    if (installed) {
      status.textContent = '홈 화면에서 실행 중이에요. 다음에도 이 아이콘으로 활동을 이어가세요.';
      status.hidden = false;
    }
  }
  async function requestInstall() {
    const prompt = installPrompt;
    if (!prompt) return false;
    installPrompt = null;
    nativeButton.disabled = true;
    try {
      await prompt.prompt();
      const result = await prompt.userChoice;
      status.textContent = result.outcome === 'accepted'
        ? '설치를 요청했어요. 기기의 안내에 따라 완료한 뒤 홈 화면의 아이콘을 확인하세요.'
        : '나중에 추가해도 괜찮아요. 아래 방법으로 언제든 홈 화면에 추가할 수 있어요.';
    } catch {
      status.textContent = '이 브라우저에서는 아래 안내를 따라 홈 화면에 추가해 주세요.';
    } finally {
      status.hidden = false;
      nativeButton.disabled = false;
      update();
    }
    return true;
  }
  function openGuide() {
    update();
    if (!dialog.open) dialog.showModal();
  }
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    update();
  });
  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    nativeWrap.hidden = true;
    status.hidden = false;
    status.textContent = '설치가 완료되었어요. 홈 화면에서 체험 한 장을 찾아보세요.';
    renderButton(true);
  });
  button.addEventListener('click', async () => {
    // prompt() must run directly from the user's click when the browser offers it.
    if (installPrompt && !isInstalled()) {
      const requested = requestInstall();
      openGuide();
      await requested;
    } else openGuide();
  });
  nativeButton.addEventListener('click', requestInstall);
  for (const id of ['close-install','done-install']) {
    document.getElementById(id).addEventListener('click', () => dialog.close());
  }
  standalone.addEventListener('change', update);
  document.querySelector('#install-local-note').hidden = !['localhost','127.0.0.1','::1','[::1]'].includes(location.hostname);
  const agent = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(agent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const preferred = isIOS ? '#install-ios' : /Android/.test(agent) ? '#install-android' : '#install-desktop';
  document.querySelector(preferred).classList.add('recommended-device');
  update();
})();
