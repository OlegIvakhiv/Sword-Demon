const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    // Створення Таблиці Продуктів
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        image_url TEXT,
        total_length TEXT,
        blade_length TEXT,
        steel_grade TEXT,
        description TEXT
    )`);

    db.run("DELETE FROM products", (err) => {
        if (err) {
            console.error("Помилка очищення таблиці:", err.message);
        } else {
            console.log("Таблиця 'products' очищена.");
        }
    });

    //  Додавання Прикладу Продукту (якщо таблиця порожня)
    const stmt = db.prepare(`INSERT INTO products 
      (name, price, category, image_url, total_length, blade_length, steel_grade, description) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

    //  КАТАНИ (Category: Katana)

    stmt.run("Katana 8201 (KATANA) red+black", 39.99, "Katana", 
        "/images/87222019668456.webp", "1010 мм", "725 мм", "440 C", "Традиційна японська катана з червоно-чорною обмоткою, ідеальна для колекції.");
    
    stmt.run("Katana 17905 (KATANA DAMASK)", 49.99, "Katana", 
        "/images/68195012142779.webp", "1040 мм", "710 мм", "Дамаська сталь", "Вишукана катана з лезом з дамаської сталі, що має унікальний візерунок.");

    stmt.run("Katana 20969 (KATANA)", 29.99, "Katana", 
        "/images/30171938398456.webp", "980 мм", "680 мм", "420J2", "Стандартна, міцна катана, відмінний вибір для початківців.");
    
    stmt.run("Katana 20969 (Червона)", 29.99, "Katana", 
        "/images/13947 (katana)_1.jpg", "980 мм", "680 мм", "420J2", "Та ж модель 20969, але з яскравою червоною обмоткою руків'я.");

    stmt.run("Katana 20969 (Темна)", 29.99, "Katana", 
        "/images/2928744421_w640_h640_2928744421.webp", "980 мм", "680 мм", "420J2", "Модель 20969 у стриманому, повністю чорному дизайні.");
    
    stmt.run("Самурайський Меч Grand Way", 29.99, "Katana", 
        "/images/samurayskiy-mech-grand-way-katana-19959-katana-69498208947337.webp", "1000 мм", "700 мм", "440C", "Класичний меч від Grand Way для шанувальників самурайської культури.");



    //  НОЖІ (Category: Knives)


    stmt.run("KA-BAR USMC 1217 plain edge", 146.99, "Knives", 
        "/images/KA1217_01_ka-bar-ka1217-01.webp", "300 мм", "178 мм", "1095 Cro-Van", "Легендарний бойовий ніж, який використовувався Корпусом морської піхоти США.");

    stmt.run("Spyderco Paramilitary 2 C81GP2 pocket knife", 119.99, "Knives", 
        "/images/SPC81GP2_01_spyderco.webp", "210 мм", "87 мм", "CPM-S45VN", "Один з найбільш популярних складаних ножів у світі, відомий механізмом Compression Lock.");

    stmt.run("Buck 110 Folding Hunter", 99.99, "Knives", 
        "/images/Buck-110_01_buck-v201902.webp", "219 мм", "95 мм", "420HC", "Класичний складаний мисливський ніж, відомий своєю надійністю та латунним больстером.");

    stmt.run("CRKT CEO Flipper 7097 pocket knife", 69.99, "Knives", 
        "/images/CK-7097_01_crkt.webp", "194 мм", "80 мм", "8Cr13MoV", "Елегантний та тонкий складаний ніж, що ідеально маскується як ручка.");



    //  БРОНЯ (Category: Armory)


    stmt.run("“The Wayward Knight” Black Armor", 3699.99, "Armory", 
        "/images/black-armor-kit-the-wayward-knight-22.jpg", null, null, "М'яка сталь", "Повний набір чорної готичної броні, що надає власнику похмурий, але величний вигляд.");

    stmt.run("Gothic Armour Knight", 5599.99, "Armory", 
        "/images/medieval-knight-gothic-plate-armour-kit-33.jpg", null, null, "Загартована сталь", "Детально відтворений комплект готичної броні, епохи пізнього Середньовіччя.");

    stmt.run("Sitten Bascinet Helmet", 339.99, "Armory", 
        "/images/medieval-helmet-bascinet-of-german-origin-xiv-6.jpg", null, null, "14-й калібр сталі", "Історична репліка шолома Бацинет німецького походження XIV століття.");

    stmt.run("Armour “The Kingmaker”", 5899.99, "Armory", 
        "/images/full-armour-the-kingmaker-1.jpg", null, null, "Загартована сталь", "Розкішний набір обладунків, створений за зразком XV століття, для знатних полководців.");

    stmt.run("Armor “The King's Guard”", 3559.99, "Armory", 
        "/images/medieval-western-knights-armor-kit-the-kings-guard.jpg", null, null, "М'яка сталь", "Обладунки королівської гвардії, що поєднують захист та естетику Західної Європи.");

    stmt.run("Bascinet “The Wayward Knight”", 559.99, "Armory", 
        "/images/the-wayward-knight-blackened-klappvisor-bascinet-xiv-century-helmet-with-visor-6.jpg", null, null, "16-й калібр сталі", "Почорнений шолом-бацинет з рухомим забралом.");

    stmt.finalize();

    console.log("Всі дані успішно додані до таблиці 'products'.");
    db.close();
});