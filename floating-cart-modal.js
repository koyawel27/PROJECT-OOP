// floating-cart-modal.js - Implement floating cart modal functionality

/**
 * Initialize the floating cart modal
 * This should be included after shared-cart.js
 */
function initializeFloatingCart() {
    // Create modal HTML structure if it doesn't exist
    if (!document.getElementById('floating-cart-modal')) {
        const modalHTML = `
            <div id="floating-cart-modal" class="floating-cart-modal">
                <div class="floating-cart-content">
                    <div class="floating-cart-header">
                        <h3>Your Shopping Cart</h3>
                        <button id="close-cart-modal" class="close-cart-modal">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div id="floating-cart-items" class="floating-cart-items">
                        <!-- Cart items will be loaded here -->
                    </div>
                    <div class="floating-cart-footer">
                        <div class="floating-cart-total">
                            <span>Total:</span>
                            <span id="floating-cart-total-amount">₱0.00</span>
                        </div>
                        <div class="floating-cart-actions">
                            <a href="cart.html" class="view-cart-btn">View Cart</a>
                            <button id="floating-checkout-btn" class="floating-checkout-btn">Checkout</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Append modal to body
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer.firstElementChild);
        
        // Add modal styles
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .floating-cart-modal {
                display: none;
                position: fixed;
                top: 0;
                right: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1000;
                justify-content: flex-end;.floating-cart-content {
    width: 500px; /* was 400px */
    max-width: 95%; /* slightly more room on smaller screens */
    height: 100%;
    background-color: #fff;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
    padding: 10px; /* optional: adds breathing room inside */
}

            }
            
            .floating-cart-content {
                width: 400px;
                max-width: 90%;
                height: 100%;
                background-color: #fff;
                box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
                display: flex;
                flex-direction: column;
                transform: translateX(100%);
                transition: transform 0.3s ease-in-out;
            }
            
            .floating-cart-modal.show {
                display: flex;
            }
            
            .floating-cart-modal.show .floating-cart-content {
                transform: translateX(0);
            }
            
            .floating-cart-header {
                padding: 15px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: #f8f8f8;
            }
            
            .floating-cart-header h3 {
                margin: 0;
                font-size: 18px;
            }
            
            .close-cart-modal {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #666;
            }
            
            .floating-cart-items {
                flex: 1;
                overflow-y: auto;
                padding: 15px;
            }
            
            .floating-cart-item {
                display: flex;
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 1px solid #eee;
                position: relative;
            }
            
            .floating-cart-item-image {
                width: 70px;
                height: 70px;
                background-size: contain;
                background-position: center;
                background-repeat: no-repeat;
                margin-right: 15px;
                border: 1px solid #eee;
                border-radius: 4px;
            }
            
            .floating-cart-item-details {
                flex: 1;
            }
            
            .floating-cart-item-title {
                font-weight: bold;
                margin-bottom: 5px;
                font-size: 14px;
            }
            
            .floating-cart-item-price {
                color: #333;
                margin-bottom: 5px;
                font-size: 15px;
            }
            
            .floating-cart-item-quantity {
                font-size: 13px;
                color: #666;
            }
            
            .floating-cart-item-remove {
                position: absolute;
                top: 0;
                right: 0;
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                font-size: 14px;
            }
            
            .floating-cart-footer {
                padding: 15px;
                border-top: 1px solid #eee;it
                background-color: #f8f8f8;
            }
            
            .floating-cart-total {
                display: flex;
                justify-content: space-between;
                font-weight: bold;
                margin-bottom: 15px;
                font-size: 16px;
            }
            
            .floating-cart-actions {
                display: flex;
                gap: 10px;
            }
            
            .view-cart-btn, .floating-checkout-btn {
                flex: 1;
                padding: 10px;
                text-align: center;
                border-radius: 4px;
                font-weight: bold;
                cursor: pointer;
                text-decoration: none;
            }
            
            .view-cart-btn {
                background-color: #eee;
                color: #333;
                border: 1px solid #ddd;
            }
            
            .floating-checkout-btn {
                background-color: var(--primary-color, #C0392B);
                color: white;
                border: none;
            }
            
            .empty-floating-cart {
                text-align: center;
                padding: 30px 15px;
                color: #999;
            }
            
            .empty-floating-cart i {
                font-size: 40px;
                margin-bottom: 10px;
                display: block;
            }
            
            .continue-shopping-btn {
                display: inline-block;
                margin-top: 15px;
                color: var(--primary-color, #C0392B);
                text-decoration: none;
            }
            
            .floating-cart-quantity-controls {
                display: flex;
                align-items: center;
                margin-top: 5px;
            }
            
            .floating-cart-qty-btn {
    width: 32px;
    height: 32px;
    background-color: var(--primary-color, #C0392B);
    border: none;
    border-radius: 50%;
    color: white;
    font-weight: bold;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.floating-cart-qty-btn:hover {
    background-color: #a93226;
}

.floating-cart-item-remove {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: transparent;
    border: none;
    color: #C0392B;
    font-size: 20px;
    cursor: pointer;
    padding: 4px;
    height: 32px;
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s ease;
}

.floating-cart-item-remove:hover {
    background-color: #f8d7da;
}

            
            .floating-cart-qty {
                margin: 0 8px;
                font-size: 14px;
            } 
            
            /* Mobile responsive styles */
            @media (max-width: 500px) {
                .floating-cart-content {
                    width: 90%;
                }
            }
        `;
        document.head.appendChild(styleElement);
        
        // Add event listeners
        setupCartModalEvents();
    }
}

/**
 * Setup event listeners for the cart modal
 */
function setupCartModalEvents() {
    // Close modal button
    const closeButton = document.getElementById('close-cart-modal');
    if (closeButton) {
        closeButton.addEventListener('click', toggleCartModal);
    }
    
    // Close when clicking outside the modal content
    const modal = document.getElementById('floating-cart-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                toggleCartModal();
            }
        });
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('floating-checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            // Redirect to cart page for checkout
            window.location.href = 'cart.html';
        });
    }
    
    // Update cart icon click behavior
    const cartIcon = document.querySelector('#navbar li a[href="cart.html"]');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            // Only prevent default if we're not on the cart page
            const currentPage = window.location.pathname.split("/").pop();
            if (currentPage !== 'cart.html') {
                e.preventDefault();
                toggleCartModal();
            }
        });
    }
}

/**
 * Toggle cart modal visibility
 */
function toggleCartModal() {
    const modal = document.getElementById('floating-cart-modal');
    if (modal) {
        modal.classList.toggle('show');
        
        // If opening the modal, update its contents
        if (modal.classList.contains('show')) {
            updateFloatingCartContents();
        }
        
        // Prevent body scrolling when modal is open
        document.body.style.overflow = modal.classList.contains('show') ? 'hidden' : '';
    }
}

/**
 * Update floating cart contents from cart data
 */
function updateFloatingCartContents() {
    const cartItemsContainer = document.getElementById('floating-cart-items');
    const cartTotalElement = document.getElementById('floating-cart-total-amount');
    const cart = initializeCart();
    
    if (cartItemsContainer) {
        // Clear existing items
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            // Show empty cart message
            cartItemsContainer.innerHTML = `
                <div class="empty-floating-cart">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <p>Your cart is empty</p>
                    <a href="product.html" class="continue-shopping-btn" onclick="toggleCartModal()">Continue Shopping</a>
                </div>
            `;
        } else {
            // Populate with cart items
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'floating-cart-item';
                itemElement.innerHTML = `
                    <div class="floating-cart-item-image" style="background-image: url('${item.image}')"></div>
                    <div class="floating-cart-item-details">
                        <div class="floating-cart-item-title">${item.title}</div>
                        <div class="floating-cart-item-price">₱${parseFloat(item.price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                        <div class="floating-cart-quantity-controls">
                            <div class="floating-cart-qty-btn floating-cart-decrease" data-id="${item.id}">-</div>
                            <span class="floating-cart-qty">${item.quantity}</span>
                            <div class="floating-cart-qty-btn floating-cart-increase" data-id="${item.id}">+</div>
                        </div>
                    </div>
                    <button class="floating-cart-item-remove" data-id="${item.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
            
            // Add event listeners for quantity changes and item removal
            addFloatingCartItemEvents();
        }
    }
    
    // Update total
    if (cartTotalElement) {
        cartTotalElement.textContent = `₱${calculateCartTotal().toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
}

/**
 * Add event listeners to floating cart items
 */
function addFloatingCartItemEvents() {
    // Remove items
    document.querySelectorAll('.floating-cart-item-remove').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            
            // Add fade-out animation
            const itemElement = this.closest('.floating-cart-item');
            itemElement.style.transition = 'opacity 0.3s ease';
            itemElement.style.opacity = '0';
            
            setTimeout(() => {
                // Remove from cart
                removeFromCart(id);
                // Update cart display
                updateFloatingCartContents();
                // Update cart indicator
                updateCartIndicator();
            }, 300);
        });
    });
    
    // Increase quantity
    document.querySelectorAll('.floating-cart-increase').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const cart = initializeCart();
            const item = cart.find(item => item.id === id);
            
            if (item) {
                // Update quantity
                updateCartItemQuantity(id, item.quantity + 1);
                // Update cart display
                updateFloatingCartContents();
                // Update cart indicator
                updateCartIndicator();
            }
        });
    });
    
    // Decrease quantity
    document.querySelectorAll('.floating-cart-decrease').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const cart = initializeCart();
            const item = cart.find(item => item.id === id);
            
            if (item && item.quantity > 1) {
                // Update quantity
                updateCartItemQuantity(id, item.quantity - 1);
                // Update cart display
                updateFloatingCartContents();
                // Update cart indicator
                updateCartIndicator();
            } else if (item && item.quantity === 1) {
                // Remove item if quantity would be 0
                const itemElement = this.closest('.floating-cart-item');
                itemElement.style.transition = 'opacity 0.3s ease';
                itemElement.style.opacity = '0';
                
                setTimeout(() => {
                    removeFromCart(id);
                    updateFloatingCartContents();
                    updateCartIndicator();
                }, 300);
            }
        });
    });
}

// Initialize the floating cart when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeFloatingCart();
});