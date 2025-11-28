const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');


const app = express();
const port = 3000;

app.use(session({
    secret: 'secret-demon-key-123', 
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 години
}));

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
app.use(express.json());
// Обслуговування статичних файлів (CSS, зображення)
app.use(express.static(path.join(__dirname, 'public')));

const getAllProducts = () => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./database.db');
        // Запит на отримання всіх товарів (або тільки катан, якщо змінити запит)
        const sql = 'SELECT * FROM products'; 
        db.all(sql, [], (err, rows) => {
            db.close();
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
};

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


app.get('/cart', async (req, res) => {
    const cartItems = req.session.cart || []; 
    
    const productIds = cartItems.map(item => item.id);

    const placeholders = productIds.map(() => '?').join(',');
    
    const db = new sqlite3.Database('./database.db');
    
    const getCartProducts = () => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM products WHERE id IN (${placeholders})`;
            
            db.all(sql, productIds, (err, rows) => {
                db.close();
                if (err) {
                    console.error('Помилка при запиті товарів для кошика:', err.message);
                    return reject(err);
                }
                
                const cartProducts = rows.map(product => {
                    const sessionItem = cartItems.find(item => item.id === product.id);
                    return {
                        ...product,
                        quantity: sessionItem ? sessionItem.quantity : 0, // Додаємо кількість
                        total_price: product.price * (sessionItem ? sessionItem.quantity : 0) // Рахуємо загальну вартість
                    };
                });
                
                resolve(cartProducts);
            });
        });
    };

    try {
        const cartProducts = await getCartProducts();

        const total = cartProducts.reduce((sum, item) => sum + item.total_price, 0);

        console.log("✅ РЕНДЕРИНГ КОШИКА: Успішно! Рендеримо 'cart.ejs'");
        res.render('cart', { cartProducts, total });
    } catch (error) {
        console.error("❌ ПОМИЛКА МАРШРУТУ /cart:", error);
        res.status(500).send("Помилка сервера при завантаженні кошика.");
    }
});


// МАРШРУТ ДОДАВАННЯ ТОВАРУ
app.post('/cart/add/:id', (req, res) => {
    const productId = parseInt(req.params.id);

    if (!req.session.cart) {
        req.session.cart = []; 
    }

    const existingItem = req.session.cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1; 
    } else {
        req.session.cart.push({ id: productId, quantity: 1 });
    }

    console.log('Кошик оновлено:', req.session.cart);
    res.json({ success: true, cart: req.session.cart });
});

app.post('/cart/remove/:id', (req, res) => {
    const productId = parseInt(req.params.id);

    if (!req.session.cart) {
        req.session.cart = [];
    }

    req.session.cart = req.session.cart.filter(item => item.id !== productId);

    console.log('Кошик після видалення:', req.session.cart);
    res.json({ success: true, cart: req.session.cart });
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


// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер працює на http://localhost:${port}`);
});