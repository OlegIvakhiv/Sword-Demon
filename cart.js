// public/js/cart.js (Новий файл або блок скрипту)

document.addEventListener('DOMContentLoaded', () => {
    // 1. Функція додавання товару
    window.addToCart = function(productId, productName, productPrice) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Перевіряємо, чи товар вже є в кошику
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: parseFloat(productPrice),
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount(cart.length); // Оновлюємо лічильник
        alert(`${productName} додано до кошика!`); // Сповіщення користувачу
    };

    // 2. Функція оновлення лічильника кошика (в шапці)
    function updateCartCount(count) {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = count;
        }
    }

    // 3. Ініціалізація лічильника при завантаженні сторінки
    const initialCart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount(initialCart.length);
});