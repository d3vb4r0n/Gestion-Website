// Функции для модального окна регистрации
function openRegistrationModal() {
    const modal = document.getElementById('registrationModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeRegistrationModal() {
    const modal = document.getElementById('registrationModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modal = document.getElementById('registrationModal');
    if (event.target === modal) {
        closeRegistrationModal();
    }
}

// Обработка формы регистрации
function handleRegistration(event) {
    event.preventDefault();
    
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const phone = document.getElementById('reg-phone').value;
    const password = document.getElementById('reg-password').value;
    const passwordConfirm = document.getElementById('reg-password-confirm').value;
    const agreement = document.getElementById('reg-agreement').checked;
    
    // Проверка паролей
    if (password !== passwordConfirm) {
        alert('Пароли не совпадают!');
        return;
    }
    
    // Проверка согласия на обработку данных
    if (!agreement) {
        alert('Необходимо согласие на обработку персональных данных');
        return;
    }
    
    // Здесь будет отправка данных на сервер
    // Пока просто показываем сообщение
    alert('Спасибо за регистрацию, ' + name + '!\nПисьмо с подтверждением отправлено на ' + email);
    
    // Закрываем модальное окно и очищаем форму
    closeRegistrationModal();
    event.target.reset();
}

// Обработка формы отзыва на странице контактов
function handleFeedback(event) {
    event.preventDefault();
    
    const name = document.getElementById('feedback-name').value;
    const email = document.getElementById('feedback-email').value;
    const service = document.getElementById('feedback-service').value;
    const message = document.getElementById('feedback-message').value;
    
    // Здесь будет отправка данных на сервер
    // Пока просто показываем сообщение
    alert('Спасибо за ваш отзыв, ' + name + '!\nМы свяжемся с вами по адресу ' + email);
    
    // Очищаем форму
    event.target.reset();
}

// Обработка заказа услуги
function orderService(serviceName) {
    alert('Спасибо за интерес к услуге "' + serviceName + '"!\n\nДля оформления заявки:\n1. Позвоните по телефону +7 (916) 777-77-77\n2. Напишите на email: info@gestion.ru\n3. Зарегистрируйтесь на сайте и оставьте заявку в личном кабинете');
}

// Плавная прокрутка к якорям
document.addEventListener('DOMContentLoaded', function() {
    // Обработка якорей на странице каталога
    if (window.location.hash) {
        setTimeout(function() {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }
    
    // Форматирование телефонных номеров
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(function(input) {
        // Устанавливаем начальное значение +7
        if (!input.value) {
            input.value = '+7';
        }
        
        input.addEventListener('input', function(e) {
            let value = e.target.value;
            
            // Убираем все кроме цифр и плюса
            value = value.replace(/[^\d+]/g, '');
            
            // Проверяем, что начинается с +7
            if (!value.startsWith('+7')) {
                value = '+7';
            }
            
            // Ограничиваем длину ('+7' + 10 цифр)
            if (value.length > 12) {
                value = value.substring(0, 12);
            }
            
            e.target.value = value;
        });
        
        // Запрещаем удаление +7
        input.addEventListener('keydown', function(e) {
            if ((e.key === 'Backspace' || e.key === 'Delete') && e.target.value === '+7') {
                e.preventDefault();
            }
        });
    });
});
