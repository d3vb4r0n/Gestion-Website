// 🔌 Интеграция Frontend с Backend API

// ============================================
// 1. КОНФИГУРАЦИЯ
// ============================================

const API_BASE_URL = 'http://localhost:8080/api';

// Вспомогательная функция для запросов
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ============================================
// 2. СТРАНИЦА: РЕГИСТРАЦИЯ/ВХОД (pages/auth.html)
// ============================================

// Регистрация
async function registerUser(formData) {
    const data = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        phoneNumber: formData.get('phone')
    };
    
    try {
        const response = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        // Сохраняем данные пользователя в обоих местах для совместимости
        localStorage.setItem('user', JSON.stringify(response));
        localStorage.setItem('currentUser', JSON.stringify(response));
        
        // Обновляем UI если доступна функция
        if (typeof updateAuthUI === 'function') {
            updateAuthUI();
        }
        
        window.location.href = '/index.html';
    } catch (error) {
        alert(`Ошибка регистрации: ${error.message}`);
    }
}

// Вход
async function loginUser(formData) {
    const data = {
        username: formData.get('username'),
        password: formData.get('password')
    };
    
    try {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        // Сохраняем данные пользователя в обоих местах для совместимости
        localStorage.setItem('user', JSON.stringify(response));
        localStorage.setItem('currentUser', JSON.stringify(response));
        
        // Обновляем UI если доступна функция
        if (typeof updateAuthUI === 'function') {
            updateAuthUI();
        }
        
        window.location.href = '/index.html';
    } catch (error) {
        alert(`Ошибка входа: ${error.message}`);
    }
}

// Пример формы регистрации
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await registerUser(formData);
});

// Пример формы входа
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await loginUser(formData);
});

// ============================================
// 3. СТРАНИЦА: КАТАЛОГ (pages/catalog.html)
// ============================================

// Загрузка всех товаров
async function loadProducts() {
    try {
        const products = await apiRequest('/products/available');
        displayProducts(products);
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
    }
}

// Отображение товаров
function displayProducts(products) {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    container.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.imageUrl || '/images/default-product.jpg'}" 
                 alt="${product.name}"
                 class="product-image">
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">${product.price.toLocaleString('ru-RU')} ₽</span>
                    ${product.stock > 0 
                        ? `<span class="product-stock">В наличии: ${product.stock}</span>`
                        : `<span class="product-out-of-stock">Нет в наличии</span>`
                    }
                </div>
                <button onclick="viewProduct(${product.id})" class="btn-view">
                    Подробнее
                </button>
            </div>
        </div>
    `).join('');
}

// Фильтрация по категории
async function filterByCategory(category) {
    try {
        const products = category === 'all' 
            ? await apiRequest('/products/available')
            : await apiRequest(`/products/category/${encodeURIComponent(category)}`);
        displayProducts(products);
    } catch (error) {
        console.error('Ошибка фильтрации:', error);
    }
}

// Поиск товаров
async function searchProducts(query) {
    if (!query || query.length < 2) {
        loadProducts();
        return;
    }
    
    try {
        const products = await apiRequest(`/products/search?name=${encodeURIComponent(query)}`);
        displayProducts(products);
    } catch (error) {
        console.error('Ошибка поиска:', error);
    }
}

// Просмотр деталей товара
async function viewProduct(productId) {
    try {
        const product = await apiRequest(`/products/${productId}`);
        
        // Показываем модальное окно с деталями
        showProductModal(product);
    } catch (error) {
        alert('Ошибка загрузки информации о товаре');
    }
}

function showProductModal(product) {
    // Создаём модальное окно
    const modal = document.getElementById('productModal') || createProductModal();
    modal.querySelector('.modal-title').textContent = product.name;
    modal.querySelector('.modal-image').src = product.imageUrl || '/images/default-product.jpg';
    modal.querySelector('.modal-category').textContent = product.category;
    modal.querySelector('.modal-description').textContent = product.description;
    modal.querySelector('.modal-price').textContent = `${product.price.toLocaleString('ru-RU')} ₽`;
    modal.style.display = 'block';
}

// Инициализация при загрузке страницы каталога
if (document.getElementById('productsContainer')) {
    loadProducts();
    
    // Поиск
    document.getElementById('searchInput')?.addEventListener('input', (e) => {
        searchProducts(e.target.value);
    });
    
    // Фильтры категорий
    document.querySelectorAll('.category-filter').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.target.dataset.category;
            filterByCategory(category);
        });
    });
}

// ============================================
// 4. СТРАНИЦА: КОНТАКТЫ (pages/contacts.html)
// ============================================

// Отправка отзыва/сообщения
async function submitReview(formData) {
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone') || null,
        message: formData.get('message')
    };
    
    try {
        const response = await apiRequest('/reviews', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
        // НЕ вызываем reset() здесь - это сделает вызывающая функция
        
        return response;
    } catch (error) {
        alert(`Ошибка отправки: ${error.message}`);
        throw error; // Пробрасываем ошибку для обработки выше
    }
}

// Форма контактов
document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Валидация
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const name = formData.get('name');
    const message = formData.get('message');
    
    if (!name || name.length < 2) {
        alert('Пожалуйста, введите ваше имя');
        return;
    }
    
    if (!email || !email.includes('@')) {
        alert('Пожалуйста, введите корректный email');
        return;
    }
    
    if (!message || message.length < 10) {
        alert('Пожалуйста, напишите сообщение (минимум 10 символов)');
        return;
    }
    
    await submitReview(formData);
});

// ============================================
// 5. АДМИН-ПАНЕЛЬ (pages/admin.html)
// ============================================

// Загрузка всех отзывов
async function loadReviews() {
    try {
        const reviews = await apiRequest('/reviews');
        displayReviews(reviews);
    } catch (error) {
        console.error('Ошибка загрузки отзывов:', error);
    }
}

// Загрузка непрочитанных отзывов
async function loadUnreadReviews() {
    try {
        const reviews = await apiRequest('/reviews/unread');
        displayReviews(reviews);
        
        // Обновляем счётчик
        document.getElementById('unreadCount').textContent = reviews.length;
    } catch (error) {
        console.error('Ошибка загрузки отзывов:', error);
    }
}

// Отображение отзывов
function displayReviews(reviews) {
    const container = document.getElementById('reviewsContainer');
    if (!container) return;
    
    container.innerHTML = reviews.map(review => `
        <div class="review-card ${review.isRead ? 'read' : 'unread'}" data-id="${review.id}">
            <div class="review-header">
                <strong>${review.name}</strong>
                <span class="review-status status-${review.status.toLowerCase()}">${review.status}</span>
            </div>
            <div class="review-meta">
                <span>📧 ${review.email}</span>
                ${review.phone ? `<span>📱 ${review.phone}</span>` : ''}
                <span>🕒 ${new Date(review.createdAt).toLocaleString('ru-RU')}</span>
                <span>🌐 ${review.ipAddress || 'N/A'}</span>
            </div>
            <p class="review-message">${review.message}</p>
            <div class="review-actions">
                ${!review.isRead ? `
                    <button onclick="markAsRead(${review.id})" class="btn-small">
                        Отметить прочитанным
                    </button>
                ` : ''}
                ${review.status === 'PENDING' ? `
                    <button onclick="updateReviewStatus(${review.id}, 'APPROVED')" class="btn-approve">
                        Одобрить
                    </button>
                    <button onclick="updateReviewStatus(${review.id}, 'REJECTED')" class="btn-reject">
                        Отклонить
                    </button>
                ` : ''}
                <button onclick="deleteReview(${review.id})" class="btn-delete">
                    Удалить
                </button>
            </div>
        </div>
    `).join('');
}

// Отметить как прочитанный
async function markAsRead(reviewId) {
    try {
        await apiRequest(`/reviews/${reviewId}/read`, { method: 'PATCH' });
        loadReviews(); // Перезагрузить список
    } catch (error) {
        alert('Ошибка обновления статуса');
    }
}

// Изменить статус отзыва
async function updateReviewStatus(reviewId, status) {
    try {
        await apiRequest(`/reviews/${reviewId}/status?status=${status}`, { method: 'PATCH' });
        loadReviews();
    } catch (error) {
        alert('Ошибка обновления статуса');
    }
}

// Удалить отзыв
async function deleteReview(reviewId) {
    if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) return;
    
    try {
        await apiRequest(`/reviews/${reviewId}`, { method: 'DELETE' });
        loadReviews();
    } catch (error) {
        alert('Ошибка удаления отзыва');
    }
}

// Управление товарами
async function loadAllProducts() {
    try {
        const products = await apiRequest('/products');
        displayAdminProducts(products);
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
    }
}

async function createProduct(formData) {
    const data = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        category: formData.get('category'),
        imageUrl: formData.get('imageUrl'),
        stock: parseInt(formData.get('stock')),
        isAvailable: formData.get('isAvailable') === 'on'
    };
    
    try {
        await apiRequest('/products', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        alert('Товар успешно добавлен!');
        loadAllProducts();
    } catch (error) {
        alert(`Ошибка создания товара: ${error.message}`);
    }
}

async function toggleProductAvailability(productId) {
    try {
        await apiRequest(`/products/${productId}/toggle-availability`, { method: 'PATCH' });
        loadAllProducts();
    } catch (error) {
        alert('Ошибка изменения доступности');
    }
}

async function deleteProduct(productId) {
    if (!confirm('Удалить этот товар?')) return;
    
    try {
        await apiRequest(`/products/${productId}`, { method: 'DELETE' });
        loadAllProducts();
    } catch (error) {
        alert('Ошибка удаления товара');
    }
}

// Инициализация админ-панели
if (document.getElementById('reviewsContainer')) {
    loadUnreadReviews();
    
    // Автообновление каждые 30 секунд
    setInterval(loadUnreadReviews, 30000);
}

// ============================================
// 6. ОБЩИЕ ФУНКЦИИ
// ============================================

// Проверка авторизации
function isLoggedIn() {
    return localStorage.getItem('user') !== null;
}

// Получить данные текущего пользователя
function getCurrentUser() {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
}

// Выход
function logout() {
    localStorage.removeItem('user');
    window.location.href = '/index.html';
}

// Отображение имени пользователя в header
function updateUserDisplay() {
    const user = getCurrentUser();
    const userDisplay = document.getElementById('userDisplay');
    
    if (userDisplay && user) {
        userDisplay.innerHTML = `
            <span>Привет, ${user.username}!</span>
            <button onclick="logout()">Выйти</button>
        `;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    updateUserDisplay();
});

// ============================================
// 7. ОБРАБОТКА ОШИБОК
// ============================================

// Глобальный обработчик ошибок сети
window.addEventListener('unhandledrejection', (event) => {
    console.error('Необработанная ошибка:', event.reason);
    
    if (event.reason.message.includes('Failed to fetch')) {
        alert('Ошибка подключения к серверу. Убедитесь, что backend запущен на http://localhost:8080');
    }
});
