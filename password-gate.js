(function () {
  var PASSWORD = '123';
  var KEY = 'ksusha_portfolio_auth_v1';

  try {
    if (sessionStorage.getItem(KEY) === 'ok') return;
  } catch (e) {}

  var entered = window.prompt('Введите пароль для входа на сайт');

  if (entered === PASSWORD) {
    try {
      sessionStorage.setItem(KEY, 'ok');
    } catch (e) {}
    return;
  }

  document.documentElement.innerHTML = '<head><meta charset="utf-8"><title>Доступ закрыт</title></head><body style="margin:0;display:grid;place-items:center;min-height:100vh;background:#101114;color:#fff;font-family:Manrope,Arial,sans-serif;"><div style="text-align:center;padding:24px;"><h1 style="margin:0 0 10px;font-size:20px;">Доступ закрыт</h1><p style="margin:0;opacity:.8;">Неверный пароль</p></div></body>';
})();
