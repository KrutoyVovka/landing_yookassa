/* ==========================================================
   Модальное окно: открытие и закрытие
   ========================================================== */
const modal = document.getElementById('payment-modal');
const openModalButton = document.getElementById('open-modal');
const closeModalButton = document.getElementById('close-modal');

// Открыть попап
function openModal() {
  modal.showModal();
  document.body.classList.add('modal-open');
}

// Закрыть попап
function closeModal() {
  modal.close();
}

openModalButton.addEventListener('click', openModal);
closeModalButton.addEventListener('click', closeModal);

// Закрытие по клику вне окна (клик попадает на сам <dialog>, т.е. на фон)
modal.addEventListener('click', function (event) {
  if (event.target === modal) {
    closeModal();
  }
});

// Событие close срабатывает и при нажатии Esc — снимаем блокировку прокрутки
modal.addEventListener('close', function () {
  document.body.classList.remove('modal-open');
});

/* ==========================================================
   Валидация полей формы
   ========================================================== */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Проверка одного поля, возвращает текст ошибки или пустую строку
function getFieldError(input) {
  const value = input.value.trim();

  if (value === '') {
    return 'Заполните это поле';
  }
  if (input.type === 'email' && !EMAIL_PATTERN.test(value)) {
    return 'Введите корректный email';
  }
  if (input.type === 'tel' && value.replace(/\D/g, '').length < 10) {
    return 'Введите корректный номер телефона';
  }
  return '';
}

// Показать или скрыть ошибку под полем
function showFieldError(input, message) {
  const errorElement = input.parentElement.querySelector('.field__error');
  input.classList.toggle('is-invalid', message !== '');
  input.setAttribute('aria-invalid', message !== '' ? 'true' : 'false');
  if (errorElement) {
    errorElement.textContent = message;
  }
}

// Проверка всей формы: все поля заполнены и чекбокс отмечен
function isFormValid(form) {
  const inputs = form.querySelectorAll('.field input');
  const checkbox = form.querySelector('input[type="checkbox"]');
  const fieldsValid = Array.from(inputs).every(function (input) {
    return getFieldError(input) === '';
  });
  return fieldsValid && checkbox.checked;
}

// Включение / отключение кнопки «Перейти к оплате»
function updateSubmitState(form) {
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = !isFormValid(form);
}

// Сбор данных участника из формы
function getFormData(form) {
  const data = {};
  form.querySelectorAll('.field input').forEach(function (input) {
    data[input.name] = input.value.trim();
  });
  return data;
}

/* ==========================================================
   Подключение логики ко всем формам оплаты на странице
   ========================================================== */
document.querySelectorAll('.js-payment-form').forEach(function (form) {
  const inputs = form.querySelectorAll('.field input');

  inputs.forEach(function (input) {
    // При вводе: убираем ошибку, если поле стало корректным, и обновляем кнопку
    input.addEventListener('input', function () {
      if (input.classList.contains('is-invalid') && getFieldError(input) === '') {
        showFieldError(input, '');
      }
      updateSubmitState(form);
    });

    // При уходе с поля: показываем ошибку, если она есть
    input.addEventListener('blur', function () {
      showFieldError(input, getFieldError(input));
    });
  });

  form.querySelector('input[type="checkbox"]').addEventListener('change', function () {
    updateSubmitState(form);
  });

  // Отправка формы: повторная проверка и запуск оплаты
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    inputs.forEach(function (input) {
      showFieldError(input, getFieldError(input));
    });

    if (isFormValid(form)) {
      startYooKassaPayment(getFormData(form));
    }
  });
});

/* ==========================================================
   Запуск оплаты через ЮKassa
   ========================================================== */
function startYooKassaPayment(participant) {
  console.log('Инициация оплаты...', participant);
  // Здесь будет вызов API ЮKassa
}
