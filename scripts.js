document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    
    // Prevent default link behavior
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const id = button.dataset.id;
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            const img = button.dataset.img;

            const existingItem = cart.find((item) => item.id === id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, img, quantity: 1 });
            }

            sessionStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            showAddToCartSuccess(button);
        });
    });

    // Update Cart Count
    function updateCartCount() {
        const cartCount = document.getElementById("cart-count");
        if (cartCount) {
            cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }

    // Initialize cart count on page load
    updateCartCount();

    // Cart Modal Toggle
    const cartIcon = document.getElementById("cart-icon");
    const cartModal = document.getElementById("cart-modal");
    
    if (cartIcon && cartModal) {
        cartIcon.addEventListener("click", (e) => {
            e.preventDefault();
            cartModal.classList.remove("hidden");
            cartModal.classList.add("show");
            updateCartDisplay();
        });
    }

    // Update Cart Display
    function updateCartDisplay() {
        const cartItemsContainer = document.getElementById("cart-items");
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = "";
        
        cart.forEach((item) => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "cart-item";
            itemDiv.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="price">₹${item.price}</p>
                    <div class="quantity-controls">
                        <button class="decrease" data-id="${item.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="increase" data-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="cart-item-subtotal">
                    <p>₹${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        document.getElementById("cart-total").textContent = `Total: ₹${total.toFixed(2)}`;

        // Attach event listeners to new buttons
        attachCartEventListeners();
    }

    function attachCartEventListeners() {
        // Quantity controls
        document.querySelectorAll(".quantity-controls button").forEach(button => {
            button.addEventListener("click", (e) => {
                const id = button.dataset.id;
                const item = cart.find(i => i.id === id);
                
                if (button.classList.contains("increase")) {
                    item.quantity += 1;
                } else if (button.classList.contains("decrease") && item.quantity > 1) {
                    item.quantity -= 1;
                }
                
                sessionStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();
                updateCartDisplay();
            });
        });

        // Remove items
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", () => {
                const id = button.dataset.id;
                cart = cart.filter(item => item.id !== id);
                sessionStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();
                updateCartDisplay();
            });
        });
    }

    // Close cart modal
    const closeButton = document.getElementById("close-cart");
    if (closeButton) {
        closeButton.addEventListener("click", () => {
            cartModal.classList.remove("show");
            cartModal.classList.add("hidden");
        });
    }

    // Close modal when clicking outside
    if (cartModal) {
        cartModal.addEventListener("click", (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove("show");
                cartModal.classList.add("hidden");
            }
        });
    }

    // Submit Cart
    document.getElementById("checkout-form").addEventListener("submit", (e) => {
        e.preventDefault();

        const customerDetails = {
            fullName: document.getElementById("full-name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            cart,
        };

        console.log("Order Submitted:", customerDetails);
        alert("Order submitted successfully!");
        cart = [];
        sessionStorage.removeItem("cart");
        updateCartCount();
        document.getElementById("close-cart").click();
    });

    // Add this to your Add to Cart click handler
    function showAddToCartSuccess(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Added!';
        button.classList.add('success');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('success');
        }, 2000);
    }
});
