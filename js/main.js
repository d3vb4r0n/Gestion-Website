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

// Автозаполнение формы контакта для авторизованных пользователей
function autofillFeedbackForm() {
    // Проверяем наличие авторизованного пользователя
    const currentUser = getCurrentUser ? getCurrentUser() : null;
    
    if (currentUser) {
        // Заполняем поля формы если они существуют
        const nameInput = document.getElementById('feedback-name');
        const emailInput = document.getElementById('feedback-email');
        const phoneInput = document.getElementById('feedback-phone');
        
        if (nameInput && currentUser.username) {
            nameInput.value = currentUser.username;
            nameInput.readOnly = true;
            nameInput.style.backgroundColor = '#f0f0f0';
        }
        
        if (emailInput && currentUser.email) {
            emailInput.value = currentUser.email;
            emailInput.readOnly = true;
            emailInput.style.backgroundColor = '#f0f0f0';
        }
        
        if (phoneInput && currentUser.phoneNumber) {
            phoneInput.value = currentUser.phoneNumber;
            phoneInput.readOnly = true;
            phoneInput.style.backgroundColor = '#f0f0f0';
        }
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
async function handleRegistration(event) {
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
    
    // Отправка данных на сервер
    try {
        const formData = new FormData();
        formData.set('username', name);
        formData.set('email', email);
        formData.set('phone', phone);
        formData.set('password', password);
        
        if (typeof registerUser === 'function') {
            await registerUser(formData);
            // Закрываем модальное окно и очищаем форму
            closeRegistrationModal();
            event.target.reset();
        } else {
            // Фоллбэк если api-integration.js не загружен
            closeRegistrationModal();
            event.target.reset();
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Ошибка при регистрации. Попробуйте позже.');
    }
}

// Обработка формы отзыва на странице контактов
async function handleFeedback(event) {
    event.preventDefault();
    
    const name = document.getElementById('feedback-name').value;
    const email = document.getElementById('feedback-email').value;
    const phone = document.getElementById('feedback-phone')?.value || '';
    const service = document.getElementById('feedback-service').value;
    const message = document.getElementById('feedback-message').value;
    
    // Отправка данных на сервер
    try {
        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('phone', phone);
        formData.set('message', service ? `Услуга: ${service}\n\n${message}` : message);
        
        if (typeof submitReview === 'function') {
            await submitReview(formData);
            // Очистка формы после успешной отправки
            if (event.target && typeof event.target.reset === 'function') {
                event.target.reset();
                // Восстанавливаем +7 в поле телефона
                const phoneInput = document.getElementById('feedback-phone');
                if (phoneInput) phoneInput.value = '+7';
            }
        } else {
            // Фоллбэк если api-integration.js не загружен
            alert('Спасибо за ваш отзыв, ' + name + '!\nМы свяжемся с вами по адресу ' + email);
            if (event.target && typeof event.target.reset === 'function') {
                event.target.reset();
            }
        }
    } catch (error) {
        console.error('Feedback error:', error);
        alert('Ошибка при отправке отзыва. Попробуйте позже.');
    }
}

// Обработка заказа услуги
function orderService(serviceName) {
    alert('Спасибо за интерес к услуге "' + serviceName + '"!\n\nДля оформления заявки:\n1. Позвоните по телефону +7 (916) 777-77-77\n2. Напишите на email: info@gestion.ru\n3. Зарегистрируйтесь на сайте и оставьте заявку в личном кабинете');
}

// Плавная прокрутка к якорям
document.addEventListener('DOMContentLoaded', function() {
    // Автозаполнение формы контакта для авторизованных пользователей
    autofillFeedbackForm();
    
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
