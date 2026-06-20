(function () {
  var PASSWORD = '123';
  var KEY = 'ksusha_portfolio_auth_v1';

  try {
    if (sessionStorage.getItem(KEY) === 'ok') return;
  } catch (e) {}

  document.documentElement.style.visibility = 'hidden';

  var entered = window.prompt('Введите пароль для входа на сайт');

  if (entered === PASSWORD) {
    try {
      sessionStorage.setItem(KEY, 'ok');
    } catch (e) {}
    document.documentElement.style.visibility = '';
    return;
  }

  window.stop();
  document.documentElement.style.visibility = '';
  document.documentElement.innerHTML = '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Доступ закрыт</title></head><body style="margin:0;display:grid;place-items:center;min-height:100vh;background:#101114;color:#fff;font-family:Manrope,Arial,sans-serif;"><div class="password-denied" style="text-align:center;padding:24px;"><h1 style="margin:0 0 10px;font-size:20px;">Доступ закрыт</h1><p style="margin:0 0 18px;opacity:.8;">Неверный пароль</p><button type="button" onclick="location.reload()" style="appearance:none;border:1px solid rgba(255,255,255,.28);border-radius:4px;background:transparent;color:#fff;padding:10px 14px;font:inherit;font-size:13px;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;">Попробовать снова</button></div></body>';
  throw new Error('Access denied');
})();
