const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navigation.classList.remove('is-open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Открыть меню');
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    navigation.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Открыть меню');
  }
});

const tabs = [...document.querySelectorAll('[data-audience]')];
const panel = document.querySelector('#audience-panel');
const audiences = {
  family: 'Если родители живут одни, в другом городе или остаются дома, пока вы на работе.',
  self: 'Если вы цените самостоятельность и хотите иметь простой способ обратиться за помощью, когда рядом никого нет.'
};
function selectAudience(tab) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  panel.setAttribute('aria-labelledby', tab.id);
  panel.querySelector('p').textContent = audiences[tab.dataset.audience];
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectAudience(tab));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const target = event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs[tabs.length - 1] : tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    selectAudience(target);
    target.focus();
  });
});

const demoDialog = document.querySelector('#demo-dialog');
const policyDialog = document.querySelector('#policy-dialog');
let demoTimers = [];
const sos = document.querySelector('#demo-sos');
const status = document.querySelector('#demo-status');
const description = document.querySelector('#demo-description');
const resetButton = document.querySelector('#demo-reset');
function resetDemo() {
  demoTimers.forEach(clearTimeout);
  demoTimers = [];
  sos.disabled = false;
  sos.classList.remove('is-active', 'is-complete');
  status.textContent = 'Готовы попробовать?';
  description.textContent = 'Это демонстрация — реальный вызов не производится.';
  resetButton.hidden = true;
}
document.querySelectorAll('[data-open-demo]').forEach(button => button.addEventListener('click', () => { resetDemo(); demoDialog.showModal(); }));
document.querySelector('[data-open-policy]').addEventListener('click', () => policyDialog.showModal());
document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
[demoDialog, policyDialog].forEach(dialog => {
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { if (dialog === demoDialog) resetDemo(); });
});
sos.addEventListener('click', () => {
  sos.disabled = true;
  sos.classList.add('is-active');
  status.textContent = '01 · Сигнал поступает оператору';
  description.textContent = 'Не нужно искать номер или открывать приложение.';
  demoTimers.push(setTimeout(() => {
    status.textContent = '02 · Оператор выходит на связь';
    description.textContent = 'Уточняет, что произошло и какая помощь нужна.';
  }, 1700));
  demoTimers.push(setTimeout(() => {
    sos.classList.remove('is-active');
    sos.classList.add('is-complete');
    status.textContent = '03 · Помощь и связь с близкими';
    description.textContent = 'Действует по согласованному порядку реагирования. Это пример, а не реальный вызов.';
    resetButton.hidden = false;
  }, 3500));
});
resetButton.addEventListener('click', resetDemo);

const form = document.querySelector('#consultation-form');
const phone = document.querySelector('#phone');
const phoneError = document.querySelector('#phone-error');
phone.addEventListener('input', () => {
  phoneError.textContent = '';
  phone.removeAttribute('aria-invalid');
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const digits = phone.value.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) {
    phoneError.textContent = 'Введите номер телефона: от 10 до 15 цифр.';
    phone.setAttribute('aria-invalid', 'true');
    phone.focus();
    return;
  }
  const nameInput = document.querySelector('#name');
  if (!nameInput.value.trim()) {
    nameInput.setCustomValidity('Пожалуйста, укажите имя.');
    nameInput.reportValidity();
    return;
  }
  const recipient = document.querySelector('#recipient');
  document.querySelector('#result-summary').textContent = `${nameInput.value.trim()}, ${phone.value.trim()}. ${recipient.options[recipient.selectedIndex].text}.`;
  form.hidden = true;
  const result = document.querySelector('#form-result');
  result.hidden = false;
  result.tabIndex = -1;
  result.focus();
});
document.querySelector('#name').addEventListener('input', event => event.target.setCustomValidity(''));
document.querySelector('#edit-request').addEventListener('click', () => {
  document.querySelector('#form-result').hidden = true;
  form.hidden = false;
  document.querySelector('#name').focus();
});
document.querySelector('#year').textContent = new Date().getFullYear();
