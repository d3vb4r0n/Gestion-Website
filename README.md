# 🏢 Gestion Website - Юридическая компания

Полноценный веб-сайт с REST API backend для лабораторной работы по веб-разработке.

<img src="https://img.shields.io/badge/Java-21-orange" alt="Java 21">
<img src="https://img.shields.io/badge/Spring%20Boot-3.5.7-brightgreen" alt="Spring Boot">
<img src="https://img.shields.io/badge/PostgreSQL-18-blue" alt="PostgreSQL">

---

## 📁 Структура проекта

```
Gestion-Website-main/
│
├── 📄 QUICK_START.md          ← НАЧНИ ОТСЮДА!
│
├── frontend/                  # Веб-сайт
│   ├── index.html             # Главная страница
│   ├── pages/
│   │   ├── catalog.html       # Каталог услуг
│   │   ├── contacts.html      # Контакты с формой
│   │   ├── about.html         # О компании
│   │   └── terms.html         # Условия
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   ├── map.js
│   │   └── api-integration.js # ← API функции для фронтенда
│   └── images/
│
└── backend/gestion/           # Spring Boot API
    ├── 📖 README.md           # Полная документация бэкенда
    ├── 📖 API_TESTS.md        # Примеры всех запросов
    ├── 📖 API_QUICK_REF.md    # Краткий справочник API
    ├── 📖 SUMMARY.md          # Что реализовано
    ├── 📖 CHECKLIST.md        # Чеклист тестирования
    ├── 🚀 start.sh            # Скрипт запуска (./start.sh)
    ├── build.gradle
    └── src/main/
        ├── java/com/d3vb4r0n/gestion/
        │   ├── GestionBackendApplication.java
        │   ├── config/         # Security, CORS
        │   ├── controller/     # REST endpoints
        │   ├── service/        # Бизнес-логика
        │   ├── repository/     # JPA репозитории
        │   ├── entity/         # Модели БД
        │   ├── dto/            # Data Transfer Objects
        │   └── exception/      # Обработка ошибок
        └── resources/
            └── application.yml # Конфигурация
```

---

## 🚀 Быстрый старт

### 1. Запусти PostgreSQL
```bash
docker ps | grep postgres       # Проверь статус
docker start my_postgres        # Запусти если нужно
```

### 2. Запусти бэкенд
```bash
cd backend/gestion
./start.sh
```

Сервер запустится на **http://localhost:8080**

### 3. Открой frontend
```bash
# Открой в браузере
open index.html
```

**Подробная инструкция:** См. `QUICK_START.md`

---

## 🎯 Что реализовано

### Backend (Spring Boot + PostgreSQL)

✅ **Пользователи**
- Регистрация с хэшированием паролей (BCrypt)
- Система входа
- Сохранение IP адреса и User-Agent при регистрации
- Роли: USER, ADMIN

✅ **Товары/Услуги**
- Полный CRUD (создание, чтение, обновление, удаление)
- Поиск по названию
- Фильтрация по категориям
- Управление доступностью
- Учёт остатков

✅ **Отзывы** (со страницы "Контакты")
- Создание отзывов с формы
- Система модерации (PENDING/APPROVED/REJECTED)
- Отметка "прочитано/непрочитано"
- Сохранение IP адреса отправителя

### Frontend

✅ **Страницы**
- Главная (index.html)
- Каталог услуг (catalog.html)
- Контакты с формой (contacts.html)
- О компании (about.html)
- Условия использования (terms.html)

✅ **Интеграция с API**
- Готовые JS функции в `api-integration.js`
- Автоматическая загрузка товаров
- Отправка отзывов с формы
- Поиск и фильтрация

### База данных (PostgreSQL)

✅ **3 таблицы с автосоздание при первом запуске:**
- **users** - пользователи (BCrypt пароли, IP, User-Agent)
- **products** - товары (название, цена, категория, изображение, остатки)
- **reviews** - отзывы (имя, email, сообщение, IP, статус модерации)

---

## 📖 Документация

| Файл | Что внутри |
|------|-----------|
| **QUICK_START.md** | Быстрый старт для нетерпеливых |
| **backend/gestion/README.md** | Полная документация бэкенда |
| **backend/gestion/API_TESTS.md** | Примеры curl запросов для всех endpoint'ов |
| **backend/gestion/API_QUICK_REF.md** | Краткий справочник API |
| **backend/gestion/SUMMARY.md** | Детальное описание что реализовано |
| **backend/gestion/CHECKLIST.md** | Чеклист для проверки всего функционала |

---

## 🔌 API Endpoints (краткий список)

```
Base URL: http://localhost:8080/api

Аутентификация:
  POST   /auth/register          - Регистрация пользователя
  POST   /auth/login             - Вход в систему
  GET    /auth/users             - Список пользователей
  GET    /auth/users/{id}        - Пользователь по ID

Товары/Услуги:
  GET    /products               - Все товары
  GET    /products/available     - Доступные товары
  GET    /products/{id}          - Товар по ID
  GET    /products/category/{c}  - Товары категории
  GET    /products/search?name=  - Поиск
  POST   /products               - Создать товар
  PUT    /products/{id}          - Обновить товар
  PATCH  /products/{id}/toggle-availability
  DELETE /products/{id}          - Удалить товар

Отзывы:
  POST   /reviews                - Создать отзыв
  GET    /reviews                - Все отзывы
  GET    /reviews/unread         - Непрочитанные
  GET    /reviews/status/{s}     - По статусу
  GET    /reviews/{id}           - Отзыв по ID
  PATCH  /reviews/{id}/read      - Отметить прочитанным
  PATCH  /reviews/{id}/status?status=  - Изменить статус
  DELETE /reviews/{id}           - Удалить отзыв
```

**Полный список с примерами:** `backend/gestion/API_TESTS.md`

---

## 💻 Технологии

### Backend
- **Java 21** (OpenJDK)
- **Spring Boot 3.5.7** (Web, Data JPA, Security)
- **Hibernate 6.6** (ORM)
- **PostgreSQL 18** (в Docker)
- **BCrypt** (хэширование паролей)
- **Gradle 8.14** (сборка)
- **Lombok** (уменьшение boilerplate)

### Frontend
- **HTML5, CSS3, JavaScript**
- **Fetch API** для запросов к backend
- **LocalStorage** для хранения данных пользователя

### Инфраструктура
- **Docker** (PostgreSQL контейнер)
- **CORS** настроен для работы frontend-backend

---

## 🧪 Тестирование

### Автоматическое тестирование
```bash
cd backend/gestion
./gradlew test
```

### Ручное тестирование
Используй файл `backend/gestion/CHECKLIST.md` - там полный чеклист с примерами.

### Пример: Регистрация пользователя
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 🔒 Безопасность

✅ **Реализовано:**
- BCrypt хэширование паролей (cost factor 10)
- Сохранение IP адресов для аудита
- Валидация входных данных
- Global Exception Handler
- CORS политика

⚠️ **Для production добавить:**
- JWT токены для аутентификации
- Rate limiting (защита от спама)
- HTTPS
- Более строгие CORS правила
- Input sanitization
- SQL injection защита (уже есть через JPA)

---

## 📊 Примеры использования

### JavaScript: Загрузка товаров
```javascript
async function loadProducts() {
    const response = await fetch('http://localhost:8080/api/products/available');
    const products = await response.json();
    
    products.forEach(product => {
        console.log(`${product.name} - ${product.price} ₽`);
    });
}

loadProducts();
```

### JavaScript: Отправка отзыва
```javascript
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    const response = await fetch('http://localhost:8080/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
    if (response.ok) {
        alert('Спасибо! Ваше сообщение отправлено.');
    }
});
```

**Больше примеров:** См. `js/api-integration.js`

---

## 🗄️ База данных

### Подключение к PostgreSQL
```bash
docker exec -it my_postgres psql -U postgres
```

### Полезные SQL команды
```sql
-- Список таблиц
\dt

-- Пользователи
SELECT id, username, email, role, ip_address FROM users;

-- Товары
SELECT id, name, category, price, is_available FROM products;

-- Отзывы
SELECT id, name, email, status, is_read, created_at FROM reviews;

-- Выход
\q
```

---

## 🛠 Решение проблем

### Сервер не запускается

**Проблема:** "Unsupported class file major version 69"  
**Решение:**
```bash
brew install openjdk@21
export JAVA_HOME="/opt/homebrew/opt/openjdk@21"
export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"
cd backend/gestion
./gradlew clean build
```

### PostgreSQL недоступен

**Проблема:** "Connection refused"  
**Решение:**
```bash
docker ps | grep postgres      # Проверь статус
docker start my_postgres       # Запусти если нужно
```

### curl не подключается к серверу

**Проблема:** "Failed to connect to localhost port 8080"  
**Решение:**
1. Убедись что сервер запущен: `lsof -i :8080`
2. Проверь что не прервал сервер через Ctrl+C
3. Перезапусти: `cd backend/gestion && ./start.sh`

**Больше решений:** См. `backend/gestion/README.md` → "Решение проблем"

---

## 🎓 Для лабораторной работы

**Что можно показать преподавателю:**

1. ✅ RESTful API с правильной архитектурой
2. ✅ Spring Boot + PostgreSQL интеграция
3. ✅ BCrypt хэширование паролей
4. ✅ IP tracking для безопасности
5. ✅ Модерация контента (отзывы)
6. ✅ CRUD операции
7. ✅ Поиск и фильтрация
8. ✅ Frontend-Backend интеграция
9. ✅ Обработка ошибок
10. ✅ Полная документация

---

## 📦 Развёртывание

### Локальная разработка
```bash
# Backend
cd backend/gestion
./start.sh

# Frontend
open index.html  # или запусти веб-сервер
```

### Сборка JAR (для production)
```bash
cd backend/gestion
./gradlew bootJar

# JAR файл будет в: build/libs/gestion-0.0.1-SNAPSHOT.jar

# Запуск JAR
java -jar build/libs/gestion-0.0.1-SNAPSHOT.jar
```

### Docker (опционально, для будущего)
```bash
# TODO: Создать Dockerfile
# TODO: Создать docker-compose.yml
```

---

## 👨‍💻 Автор

**Максим Пивицин**  
Лабораторная работа по веб-разработке  
2025

---

## 📄 Лицензия

Учебный проект для лабораторной работы

---

## 🔗 Полезные ссылки

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Gradle Documentation](https://docs.gradle.org/)
- [REST API Best Practices](https://restfulapi.net/)

---

## 📞 Поддержка

Если что-то не работает:
1. Проверь `QUICK_START.md`
2. Посмотри `backend/gestion/CHECKLIST.md`
3. Изучи `backend/gestion/README.md` → раздел "Решение проблем"

**Готово к использованию! 🚀**
