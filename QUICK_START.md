# 🚀 Gestion Website - Быстрый старт

## Структура проекта

```
Gestion-Website-main/
├── frontend/              # HTML, CSS, JS файлы сайта
│   ├── index.html
│   ├── pages/
│   ├── css/
│   └── js/
│       └── api-integration.js  # ← Готовые функции для работы с API
│
└── backend/gestion/       # Spring Boot REST API
    ├── README.md          # Полная документация бэкенда
    ├── API_TESTS.md       # Примеры всех API запросов
    ├── SUMMARY.md         # Что было сделано
    ├── start.sh           # Скрипт запуска (./start.sh)
    └── src/               # Исходный код
```

---

## ⚡ Быстрый запуск бэкенда

### Шаг 1: Убедись что PostgreSQL запущен

```bash
# Проверь
docker ps | grep postgres

# Если не запущен, запусти
docker start my_postgres
```

### Шаг 2: Запусти сервер

```bash
cd backend/gestion
./start.sh
```

Сервер запустится на **http://localhost:8080**

### Шаг 3: Тестируй API (в ДРУГОМ терминале)

```bash
# Регистрация
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "email": "test@test.ru", "password": "12345"}'

# Создать товар
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Дизайн", "description": "Услуга", "price": 5000, "category": "Дизайн", "stock": 10}'

# Отправить отзыв
curl -X POST http://localhost:8080/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"name": "Иван", "email": "ivan@test.ru", "message": "Отличный сервис!"}'
```

**Больше примеров:** `backend/gestion/API_TESTS.md`

---

## 🌐 Интеграция Frontend с Backend

### В HTML файлах добавь:

```html
<script src="/js/api-integration.js"></script>
```

### Примеры использования:

**Каталог товаров (pages/catalog.html):**
```javascript
// Загрузить товары при загрузке страницы
loadProducts();

// Поиск
document.getElementById('searchInput').addEventListener('input', (e) => {
    searchProducts(e.target.value);
});
```

**Страница контактов (pages/contacts.html):**
```javascript
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await submitReview(formData);
});
```

**Все функции описаны в:** `js/api-integration.js`

---

## 📚 Документация

| Файл | Описание |
|------|----------|
| **backend/gestion/README.md** | Полная документация бэкенда |
| **backend/gestion/API_TESTS.md** | Примеры всех API запросов |
| **backend/gestion/SUMMARY.md** | Что было реализовано |
| **js/api-integration.js** | Готовые JS функции для frontend |

---

## 🛠 Что реализовано

### Backend (Spring Boot + PostgreSQL):

✅ **Пользователи**
- Регистрация с хэшированием паролей (BCrypt)
- Вход в систему
- Сохранение IP адреса и User-Agent

✅ **Товары**
- CRUD операции (создать, читать, обновить, удалить)
- Поиск и фильтрация
- Категории

✅ **Отзывы** (со страницы "Контакты")
- Создание отзывов
- Модерация (одобрение/отклонение)
- Отметка "прочитано"

### Frontend интеграция:

✅ Готовые JavaScript функции для:
- Регистрации/входа
- Загрузки товаров
- Отправки отзывов
- Админ-панели

---

## 🔧 Решение проблем

### Сервер не запускается

```bash
# Проверь версию Java
java -version  # Должна быть 21

# Если нет, установи
brew install openjdk@21
export JAVA_HOME="/opt/homebrew/opt/openjdk@21"
export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"
```

### PostgreSQL не доступен

```bash
# Проверь статус
docker ps | grep postgres

# Запусти контейнер
docker start my_postgres

# Или создай новый
docker run -d --name my_postgres \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 postgres:latest
```

### curl не работает

Убедись что:
1. Сервер запущен (`./gradlew bootRun` работает)
2. Используешь ДРУГОЙ терминал для curl
3. Порт 8080 свободен: `lsof -i :8080`

---

## 🎯 API Endpoints (краткий список)

```
Аутентификация:
  POST   /api/auth/register      - Регистрация
  POST   /api/auth/login         - Вход
  GET    /api/auth/users         - Все пользователи

Товары:
  GET    /api/products           - Все товары
  GET    /api/products/available - Доступные
  GET    /api/products/{id}      - По ID
  POST   /api/products           - Создать
  PUT    /api/products/{id}      - Обновить
  DELETE /api/products/{id}      - Удалить

Отзывы:
  POST   /api/reviews            - Создать отзыв
  GET    /api/reviews            - Все отзывы
  GET    /api/reviews/unread     - Непрочитанные
  PATCH  /api/reviews/{id}/read  - Отметить прочитанным
  PATCH  /api/reviews/{id}/status?status=APPROVED  - Одобрить
  DELETE /api/reviews/{id}       - Удалить
```

**Полный список с примерами:** `backend/gestion/API_TESTS.md`

---

## 📊 База данных

PostgreSQL создаст автоматически 3 таблицы:
- **users** - пользователи (с хэшированными паролями, IP, User-Agent)
- **products** - товары (название, цена, категория, изображение)
- **reviews** - отзывы (имя, email, сообщение, IP, статус модерации)

Проверить данные:
```bash
docker exec -it my_postgres psql -U postgres
\dt
SELECT * FROM users;
\q
```

---

## 🎓 Для лабораторной работы

**Можно показать:**
1. REST API с правильной архитектурой (Controller → Service → Repository)
2. Работу с PostgreSQL через JPA/Hibernate
3. Безопасность (BCrypt для паролей)
4. Трекинг пользователей (IP, User-Agent)
5. Модерацию контента (отзывы)
6. Интеграцию frontend-backend

---

**Вопросы?** Смотри полную документацию в `backend/gestion/README.md`
