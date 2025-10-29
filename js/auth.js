// Система авторизации и управления пользователями

// Проверка авторизации при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
});

// Обновление UI в зависимости от статуса авторизации
function updateAuthUI() {
    const currentUser = getCurrentUser();
    const loginForm = document.getElementById('login-form');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    
    if (currentUser) {
        // Пользователь авторизован
        if (loginForm) loginForm.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'flex';
            if (userName) userName.textContent = currentUser.username;
        }
        console.log('✅ Пользователь авторизован:', currentUser.username);
    } else {
        // Пользователь НЕ авторизован
        if (loginForm) loginForm.style.display = 'flex';
        if (userInfo) userInfo.style.display = 'none';
        console.log('ℹ️ Пользователь не авторизован');
    }
}

// Обработчик входа
async function handleLogin(event) {
    event.preventDefault();
    
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    
    if (!usernameInput || !passwordInput) {
        alert('Ошибка: поля формы не найдены');
        return;
    }
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    if (!username || !password) {
        alert('Пожалуйста, заполните все поля');
        return;
    }
    
    try {
        // Попытка входа через API
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Неверный логин или пароль');
        }
        
        const userData = await response.json();
        
        // Сохраняем данные пользователя в обоих местах для совместимости
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Обновляем UI
        updateAuthUI();
        
        // Очищаем форму
        usernameInput.value = '';
        passwordInput.value = '';
        
    } catch (error) {
        console.error('Login error:', error);
        alert(`Ошибка входа: ${error.message}`);
    }
}

// Обработчик выхода
function handleLogout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('user');
        updateAuthUI();
    }
}

// Получить текущего пользователя
function getCurrentUser() {
    // Проверяем оба ключа для обратной совместимости
    const userJson = localStorage.getItem('currentUser') || localStorage.getItem('user');
    if (!userJson) return null;
    
    try {
        return JSON.parse(userJson);
    } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('user');
        return null;
    }
}

// Проверка авторизации
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Требовать авторизацию для действия
function requireAuth(callback) {
    if (!isLoggedIn()) {
        alert('Для выполнения этого действия необходимо войти в систему');
        return false;
    }
    if (typeof callback === 'function') {
        callback();
    }
    return true;
}

console.log('🔐 Auth system loaded');
