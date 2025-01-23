document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Add to Cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent default link behavior and propagation
            const id = button.dataset.id;
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            const img = button.dataset.img;

            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, img, quantity: 1 });
            }

            sessionStorage.setItem("cart", JSON.stringify(cart));
            updateCartDisplay();
            updateCartCount();
            showAddToCartSuccess(button);
        });
    });

    function updateCartDisplay() {
        cartItems.innerHTML = '';
        
        cart.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.img}" alt="${item.name}">
                </div>
                <div>
                    <h6 class="my-0">${item.name}</h6>
                    <small class="text-muted">Quantity: ${item.quantity}</small>
                </div>
                <span>₹${(item.price * item.quantity).toFixed(2)}</span>
            `;
            cartItems.appendChild(li);
        });

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `₹${total.toFixed(2)}`;
    }

    function updateCartCount() {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    function showAddToCartSuccess(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fa fa-check text-primary me-2"></i>Added!';
        button.classList.add('success');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('success');
        }, 2000);
    }

    // Initialize
    updateCartCount();
    updateCartDisplay();
});
