// Скрипт для загрузки товаров из БД на страницу каталога

// Загрузка товаров при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    if (window.location.pathname.includes('catalog.html')) {
        await loadCatalogFromDB();
    }
});

async function loadCatalogFromDB() {
    try {
        console.log('Загрузка товаров из БД...');
        const products = await fetch('http://localhost:8080/api/products/available')
            .then(res => res.json());
        
        console.log('Получено товаров:', products.length);
        
        if (products.length === 0) {
            console.warn('Товары не найдены в БД');
            return; // Оставляем статичный HTML
        }
        
        // Группируем товары по категориям
        const categories = {
            'Корпоративное право': [],
            'Семейное право': [],
            'Гражданское право': []
        };
        
        products.forEach(product => {
            if (categories[product.category]) {
                categories[product.category].push(product);
            }
        });
        
        // Обновляем каждую категорию
        updateCategory('corporate', 'Корпоративное право', categories['Корпоративное право']);
        updateCategory('family', 'Семейное право', categories['Семейное право']);
        updateCategory('civil', 'Гражданское право', categories['Гражданское право']);
        
        console.log('✅ Товары загружены из БД успешно!');
    } catch (error) {
        console.error('Ошибка загрузки товаров из БД:', error);
        console.log('Используются статичные товары из HTML');
    }
}

function updateCategory(categoryId, categoryName, products) {
    const categoryDiv = document.getElementById(categoryId);
    if (!categoryDiv || products.length === 0) return;
    
    const gridDiv = categoryDiv.querySelector('.services-grid');
    if (!gridDiv) return;
    
    // Очищаем текущие товары
    gridDiv.innerHTML = '';
    
    // Добавляем товары из БД
    products.forEach(product => {
        const card = createProductCard(product);
        gridDiv.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'service-card';
    
    // Обрабатываем путь к изображению
    let imagePath = product.imageUrl || '../images/default.jpg';
    // Если путь начинается с /images/, добавляем ..
    if (imagePath.startsWith('/images/')) {
        imagePath = '..' + imagePath;
    }
    
    card.innerHTML = `
        <div class="service-card__image">
            <img src="${imagePath}" alt="${product.name}" onerror="this.src='../images/default.jpg'">
        </div>
        <div class="service-card-content">
            <h3>${product.name}</h3>
            <p class="service-card-price">от ${product.price.toLocaleString('ru-RU')} ₽</p>
            <p class="service-card-brief">${truncateText(product.description, 80)}</p>
        </div>
        <div class="service-card-details">
            <div>
                <h3>${product.name}</h3>
                <p><strong>Цена:</strong> от ${product.price.toLocaleString('ru-RU')} ₽</p>
                <p>${product.description}</p>
                ${product.stock > 0 
                    ? `<p><strong>Доступно:</strong> ${product.stock} мест</p>` 
                    : '<p><strong>Временно недоступно</strong></p>'
                }
            </div>
            <button class="order-button" onclick="orderService('${escapeHtml(product.name)}')">Заказать услугу</button>
        </div>
    `;
    
    return card;
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

console.log('📦 Catalog loader script loaded');
