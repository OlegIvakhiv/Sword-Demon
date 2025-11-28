const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');


const app = express();
const port = 3000;

app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    next();
});

// Підключення до бази даних
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Помилка підключення до БД:', err.message);
    } else {
        console.log('Успішне підключення до бази даних SQLite.');
    }
});

app.get('/api/products', (req, res) => {
    db.all(`SELECT * FROM products`, (err, rows) => {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        res.json(rows);
    });
});

// Налаштування EJS (системи шаблонів)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Обслуговування статичних файлів (CSS, зображення)
app.use(express.static(path.join(__dirname, 'public')));


// ГОЛОВНА СТОРІНКА (/)
app.get('/', (req, res) => {
    // Рендеримо views/main.ejs
    res.render('main', { category_title: "Home" });
});


//  СТОРІНКА МАГАЗИНУ (STORE)

app.get('/store', (req, res) => {
    res.render('store', { category_title: "Store" });
});


// ПРО НАС (ABOUT)

app.get('/about', (req, res) => {
    res.render('about', { category_title: "About" });
});


//  КОНТАКТИ (CONTACT)

app.get('/contact', (req, res) => {
    res.render('contact', { category_title: "Contact" });
});



//  /katanas (database.db)

app.get('/katanas', (req, res) => {
    const category = "Katana"; 
    
    db.all(`SELECT id, name, price, image_url FROM products WHERE category = ?`, [category], (err, products) => {
        if (err) {
            return res.status(500).send("Помилка БД при отриманні категорії Knives: " + err.message);
        }
        res.render('katanas', { 
            products: products, 
            category_title: category 
        });
    });
});


//  /knives (database.db)

app.get('/knives', (req, res) => {
    const category = "Knives"; 
    
    db.all(`SELECT id, name, price, image_url FROM products WHERE category = ?`, [category], (err, products) => {
        if (err) {
            return res.status(500).send("Помилка БД при отриманні категорії Knives: " + err.message);
        }
        // Рендеринг шаблону 'knives.ejs' 
        res.render('knives', { 
            products: products, 
            category_title: category 
        });
    });
});


// /armory ( database.db)

app.get('/armory', (req, res) => {
    const category = "Armory"; 
    
    db.all(`SELECT id, name, price, image_url FROM products WHERE category = ?`, [category], (err, products) => {
        if (err) {
            return res.status(500).send("Помилка БД при отриманні категорії Armory: " + err.message);
        }
        // Рендеринг шаблону 'armory.ejs' 
        res.render('armory', { 
            products: products, 
            category_title: category 
        });
    });
});



//  КАТЕГОРІЇ (Наприклад: /knives, /armory) 

// Цей маршрут залишається і працюватиме для інших категорій,
// які все ще використовують базу даних SQLite. Він тепер оголошений

app.get('/:category_name', (req, res) => {
    const category = req.params.category_name;
    
    // Запит до БД: вибрати всі продукти з цієї категорії
    db.all(`SELECT id, name, price, image_url FROM products WHERE category = ?`, [category], (err, products) => {
        if (err) {
            return res.status(500).send("Помилка БД при отриманні категорії: " + err.message);
        }
        
        // Рендеринг шаблону 'store.ejs' і передача даних про продукти
        res.render('store', { 
            category_title: category, 
            products: products 
        });
    });
});

/*
app.get('/product/:id', (req, res) => {
const productId = req.params.id;
    
    // ⭐ ВИКОРИСТОВУЄМО SELECT * ДЛЯ ОТРИМАННЯ ВСІХ ПОЛІВ, ВКЛЮЧАЮЧИ CATEGORY ⭐
    db.get(`SELECT * FROM products WHERE id = ?`, [productId], (err, product) => { 
        if (err) {
            return res.status(500).send("Помилка БД при отриманні продукту: " + err.message);
        }
        
        if (!product) {
            return res.status(404).send("Продукт не знайдено!");
        }

        res.render('product_detail', { 
            product: product, 
            category_title: product.name 
        });
    });
});
*/

app.get('/api/product/:id', (req, res) => {
    const productId = req.params.id;
    
    db.get(`SELECT * FROM products WHERE id = ?`, [productId], (err, product) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (!product) {
            return res.status(404).json({ error: "Продукт не знайдено!" });
        }

        res.json(product);
    });
});


// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер працює на http://localhost:${port}`);
});