document.addEventListener('DOMContentLoaded', () => {
    console.log('Cart.js loaded');
    
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Initialize cart count
    function updateCartCount() {
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }
    
    updateCartCount();

    // Cart Modal Toggle
    const cartModal = document.getElementById("cartModal");
    const cartButton = document.querySelector(".cart");
    
    if (cartButton) {
        cartButton.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (cartModal) {
                cartModal.classList.add('show');
                updateCartDisplay();
            } else {
                console.error('Cart modal not found');
            }
        });
    } else {
        console.error('Cart button not found');
    }

    // Close cart modal
    const closeButton = document.querySelector(".btn-close");
    if (closeButton && cartModal) {
        closeButton.addEventListener("click", () => {
            cartModal.classList.remove('show');
        });
    }

    // Add to Cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
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
            updateCartCount();
            updateCartDisplay();
            showAddToCartSuccess(button);
        });
    });

    function validateForm() {
        let isValid = true;
        const fields = [
            { id: 'name', type: 'text', required: true },
            { id: 'email', type: 'email', required: true },
            { id: 'phone', type: 'tel', required: true },
            { id: 'address', type: 'text', required: true },
            { id: 'pincode', type: 'text', required: true }
        ];

        fields.forEach(field => {
            const input = document.getElementById(field.id);
            input.classList.remove('is-invalid');

            if (field.required && !input.value.trim()) {
                input.classList.add('is-invalid');
                isValid = false;
            } else if (field.type === 'email' && !/\S+@\S+\.\S+/.test(input.value)) {
                input.classList.add('is-invalid');
                isValid = false;
            } else if ((field.type === 'tel' || field.id === 'pincode') && !/^\d+$/.test(input.value)) {
                input.classList.add('is-invalid');
                isValid = false;
            }
        });

        return isValid;
    }

    function updateCartDisplay() {
        cartItems.innerHTML = '';

        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="text-center">Your cart is empty</p>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'cart-table';

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th></th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Cost</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        cart.forEach((item) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${item.img}" alt="${item.name}" class="cart-item-img" style="width: 50px; height: auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);"></td>
                <td>${item.name}</td>
                <td>
                    <div class="quantity-controls">
                        <button class="decrease" data-id="${item.id}"><i class="fas fa-minus"></i></button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="increase" data-id="${item.id}"><i class="fas fa-plus"></i></button>
                    </div>
                </td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>₹${(item.price * item.quantity).toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        cartItems.appendChild(table);

        // Prepare cart details for submission
        const cartDetails = cart.map(item => {
            return `Name: ${item.name}, Quantity: ${item.quantity}, Price: ₹${item.price.toFixed(2)}, Cost: ₹${(item.price * item.quantity).toFixed(2)}`;
        }).join('\n');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `Total: ₹${total.toFixed(2)}`;

        const cartDetailsField = document.getElementById('cart-details');
        cartDetailsField.value = `${cartDetails}\nTotal: ₹${total.toFixed(2)}`;

        attachCartEventListeners();
    }

    function attachCartEventListeners() {
        document.querySelectorAll(".quantity-controls button").forEach(button => {
            button.addEventListener("click", function() {
                const id = this.dataset.id;
                const item = cart.find(i => i.id === id);
                
                if (this.classList.contains("increase")) {
                    item.quantity += 1;
                } else if (this.classList.contains("decrease") && item.quantity > 1) {
                    item.quantity -= 1;
                }
                
                sessionStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();
                updateCartDisplay();
            });
        });

        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", function() {
                const id = this.dataset.id;
                cart = cart.filter(item => item.id !== id);
                sessionStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();
                updateCartDisplay();
            });
        });
    }

    function showAddToCartSuccess(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Added!';
        button.classList.add('success');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('success');
        }, 2000);
    }

    // Handle form submission
    const checkoutButton = document.querySelector(".modal-footer .btn-primary");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", (e) => {
            e.preventDefault();
            if (validateForm()) {
                const form = document.getElementById("checkout-form");
                const formData = new FormData(form);

                fetch(form.action, {
                    method: form.method,
                    body: formData,
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("Order submitted successfully!");
                        cart = [];
                        sessionStorage.removeItem("cart");
                        updateCartCount();
                        cartModal.classList.remove('show');
                    } else {
                        alert("There was an error submitting your order. Please try again.");
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("There was an error submitting your order. Please try again.");
                });
            } else {
                alert("Please correct the highlighted fields.");
            }
        });
    }

    updateCartDisplay();
}); 