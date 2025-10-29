package com.d3vb4r0n.gestion.service;

import com.d3vb4r0n.gestion.entity.Product;
import com.d3vb4r0n.gestion.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final ProductRepository productRepository;
    
    @Override
    public void run(String... args) {
        // Проверяем, есть ли уже товары в БД
        if (productRepository.count() > 0) {
            System.out.println("База данных уже содержит товары. Пропускаем инициализацию.");
            return;
        }
        
        System.out.println("Инициализация базы данных товарами из каталога...");
        
        // Корпоративное право
        createProduct("Регистрация бизнеса", 
            "Полное юридическое сопровождение регистрации ООО, ИП, АО. Комплексная услуга по регистрации юридических лиц и индивидуальных предпринимателей.", 
            new BigDecimal("15000"), "Корпоративное право", "/images/yuri.jpg", 100);
        
        createProduct("Корпоративные договоры", 
            "Разработка и проверка договоров для бизнеса. Профессиональная подготовка любых корпоративных договоров с учетом специфики вашего бизнеса.", 
            new BigDecimal("20000"), "Корпоративное право", "/images/corp.jpg", 100);
        
        createProduct("Арбитражные споры", 
            "Представительство в арбитражных судах. Защита интересов вашей компании в арбитражных судах всех инстанций.", 
            new BigDecimal("50000"), "Корпоративное право", "/images/arbsud.webp", 100);
        
        // Семейное право
        createProduct("Брачный договор", 
            "Составление и нотариальное заверение брачного договора. Защитите имущественные интересы с помощью грамотно составленного брачного договора.", 
            new BigDecimal("10000"), "Семейное право", "/images/brakdog.webp", 100);
        
        createProduct("Развод и раздел имущества", 
            "Юридическое сопровождение бракоразводного процесса. Профессиональная помощь в расторжении брака и справедливом разделе совместно нажитого имущества.", 
            new BigDecimal("25000"), "Семейное право", "/images/razvod.webp", 100);
        
        createProduct("Алименты и опека", 
            "Взыскание алиментов, оформление опеки. Защита прав детей и законных интересов родителей в вопросах алиментов и опеки.", 
            new BigDecimal("15000"), "Семейное право", "/images/babydengi.png", 100);
        
        // Гражданское право
        createProduct("Сделки с недвижимостью", 
            "Юридическое сопровождение купли-продажи недвижимости. Безопасные сделки с недвижимостью под контролем опытных юристов.", 
            new BigDecimal("30000"), "Гражданское право", "/images/nedviga.jpg", 100);
        
        createProduct("Наследственные дела", 
            "Оформление наследства, споры о наследстве. Помощь в получении наследства и разрешении наследственных споров.", 
            new BigDecimal("20000"), "Гражданское право", "/images/blackmoney.jpg", 100);
        
        createProduct("Взыскание долгов", 
            "Взыскание задолженности в судебном порядке. Эффективное взыскание долгов через суд и исполнительное производство.", 
            new BigDecimal("18000"), "Гражданское право", "/images/otborbabla.jpg", 100);
        
        System.out.println("База данных успешно инициализирована! Добавлено " + productRepository.count() + " товаров.");
    }
    
    private void createProduct(String name, String description, BigDecimal price, String category, String imageUrl, int stock) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setCategory(category);
        product.setImageUrl(imageUrl);
        product.setStock(stock);
        product.setIsAvailable(true);
        productRepository.save(product);
    }
}
