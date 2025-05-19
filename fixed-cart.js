// fixed-cart.js - Unified cart functionality for WELS Cycling website

/**
 * Initialize the cart from localStorage
 * @returns {Array} Cart items array
 */
function initializeCart() {
    const cart = localStorage.getItem('wels-cart') ? JSON.parse(localStorage.getItem('wels-cart')) : [];
    return cart;
}

/**
 * Add an item to the cart
 * @param {Number} id - Product ID
 * @param {String} title - Product title/name
 * @param {Number} price - Product price
 * @param {String} description - Product description
 * @param {String} image - Product image URL
 */
function addToCart(id, title, price, description, image) {
    const cart = initializeCart();
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === id);
    
    if (existingItemIndex !== -1) {
        // Update quantity if product already exists
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item to cart
        cart.push({
            id: id,
            title: title,
            price: parseFloat(price),
            description: description,
            image: image,
            quantity: 1
        });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('wels-cart', JSON.stringify(cart));
    
    // Update cart indicator
    updateCartIndicator();
    
    return cart;
}

/**
 * Remove an item from the cart
 * @param {Number} id - Product ID to remove
 */
function removeFromCart(id) {
    let cart = initializeCart();
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('wels-cart', JSON.stringify(cart));
    
    // Update cart indicator
    updateCartIndicator();
    
    return cart;
}

/**
 * Update the quantity of an item in the cart
 * @param {Number} id - Product ID
 * @param {Number} quantity - New quantity
 */
function updateCartItemQuantity(id, quantity) {
    const cart = initializeCart();
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = quantity;
        localStorage.setItem('wels-cart', JSON.stringify(cart));
        
        // Update cart indicator
        updateCartIndicator();
    }
    
    return cart;
}

/**
 * Clear all items from the cart
 */
function clearCart() {
    localStorage.setItem('wels-cart', JSON.stringify([]));
    
    // Update cart indicator
    updateCartIndicator();
    
    return [];
}

/**
 * Get total number of items in cart
 * @returns {Number} Total quantity of all items
 */
function getCartItemCount() {
    const cart = initializeCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Calculate total price of all items in cart
 * @returns {Number} Total price
 */
function calculateCartTotal() {
    const cart = initializeCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Update the cart indicator in the navigation bar
 */
function updateCartIndicator() {
    const count = getCartItemCount();
    
    // Try to find existing cart count element
    let cartCountElement = document.getElementById('cart-count');
    
    // If it doesn't exist, create it
    if (!cartCountElement) {
        const cartLink = document.querySelector('#navbar li a[href="cart.html"]');
        if (cartLink) {
            cartCountElement = document.createElement('span');
            cartCountElement.className = 'cart-count';
            cartCountElement.id = 'cart-count';
            cartLink.appendChild(cartCountElement);
        }
    }
    
    // Update the count
    if (cartCountElement) {
        cartCountElement.textContent = count;
        
        // Show/hide based on count
        if (count > 0) {
            cartCountElement.style.display = 'flex';
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}

/**
 * Process checkout and save order to history
 * @returns {Object} Order details including items, total, and timestamp
 */
function processCheckout() {
    const cart = initializeCart();
    const total = calculateCartTotal();
    const discountAmount = getDiscountAmount(); // Get the discount amount from the promo code

    if (cart.length === 0) {
        return null; // Cannot checkout with empty cart
    }

    // Apply the promo code discount to the total amount
    const discountedTotal = total - discountAmount;

    // Create order object
    const order = {
        orderId: generateOrderId(),
        items: [...cart],
        total: discountedTotal,
        timestamp: new Date().toISOString(),
        status: 'completed'
    };

    // Save to order history
    saveToOrderHistory(order);

    // Clear the cart
    clearCart();

    return order;
}

function getDiscountAmount() {
    const promoCode = document.getElementById('promo-code').value;
    if (promoCode.toUpperCase() === 'WELS10') {
        return 0.1 * calculateCartTotal(); // 10% discount
    } else {
        return 0;
    }
}

/**
 * Generate a unique order ID
 * @returns {String} Unique order ID
 */
function generateOrderId() {
    return 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

/**
 * Save order to order history in localStorage
 * @param {Object} order - Order details
 */
function saveToOrderHistory(order) {
    const orderHistory = localStorage.getItem('wels-order-history') 
        ? JSON.parse(localStorage.getItem('wels-order-history')) 
        : [];
    
    orderHistory.push(order);
    localStorage.setItem('wels-order-history', JSON.stringify(orderHistory));
}

/**
 * Get order history from localStorage
 * @returns {Array} Array of past orders
 */
function getOrderHistory() {
    return localStorage.getItem('wels-order-history') 
        ? JSON.parse(localStorage.getItem('wels-order-history')) 
        : [];
}

/**
 * Display checkout success message
 * @param {String} message - Success message to display
 * @param {Number} duration - How long to show the message (ms)
 */
function showCheckoutSuccess(message, duration = 3000) {
    // Create success message element if it doesn't exist
    let successElement = document.getElementById('checkout-success');
    
    if (!successElement) {
        successElement = document.createElement('div');
        successElement.id = 'checkout-success';
        successElement.style.position = 'fixed';
        successElement.style.top = '20px';
        successElement.style.left = '50%';
        successElement.style.transform = 'translateX(-50%)';
        successElement.style.backgroundColor = '#4CAF50';
        successElement.style.color = 'white';
        successElement.style.padding = '15px 20px';
        successElement.style.borderRadius = '5px';
        successElement.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        successElement.style.zIndex = '1000';
        successElement.style.textAlign = 'center';
        document.body.appendChild(successElement);
    }
    
    // Set message and show
    successElement.innerHTML = `
        <i class="fa-solid fa-check-circle" style="margin-right: 10px;"></i>
        ${message}
    `;
    successElement.style.display = 'block';
    
    // Hide after duration
    setTimeout(() => {
        successElement.style.display = 'none';
    }, duration);
}

/**
 * Show loading indicator during checkout
 */
function showCheckoutLoading() {
    // Create loading element if it doesn't exist
    let loadingElement = document.getElementById('checkout-loading');
    
    if (!loadingElement) {
        loadingElement = document.createElement('div');
        loadingElement.id = 'checkout-loading';
        loadingElement.style.position = 'fixed';
        loadingElement.style.top = '0';
        loadingElement.style.left = '0';
        loadingElement.style.width = '100%';
        loadingElement.style.height = '100%';
        loadingElement.style.backgroundColor = 'rgba(0,0,0,0.5)';
        loadingElement.style.display = 'flex';
        loadingElement.style.justifyContent = 'center';
        loadingElement.style.alignItems = 'center';
        loadingElement.style.zIndex = '1000';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.style.width = '50px';
        spinner.style.height = '50px';
        spinner.style.border = '5px solid #f3f3f3';
        spinner.style.borderTop = '5px solid #3498db';
        spinner.style.borderRadius = '50%';
        spinner.style.animation = 'spin 1s linear infinite';
        
        // Add animation style
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        loadingElement.appendChild(spinner);
        document.body.appendChild(loadingElement);
    }
    
    loadingElement.style.display = 'flex';
}

/**
 * Hide checkout loading indicator
 */
function hideCheckoutLoading() {
    const loadingElement = document.getElementById('checkout-loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

// FLOATING CART FUNCTIONALITY
// ==========================

/**
 * Show the floating cart modal
 */
function showFloatingCart() {
    const modal = document.getElementById('floating-cart-modal');
    if (!modal) {
        initializeCartModal();
    }
    
    // Render cart items
    renderFloatingCartItems();
    
    // Show modal with animation
    document.getElementById('floating-cart-modal').classList.add('show');
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}

/**
 * Hide the floating cart modal
 */
function hideFloatingCart() {
    const modal = document.getElementById('floating-cart-modal');
    if (modal) {
        modal.classList.remove('show');
        // Restore body scrolling
        document.body.style.overflow = '';
    }
}

/**
 * Create the floating cart modal structure in the DOM
 */
function initializeCartModal() {
    // Check if modal already exists
    if (document.getElementById('floating-cart-modal')) {
        return;
    }
    
    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'floating-cart-modal';
    modal.className = 'floating-cart-modal';
    
    // Create modal content
    modal.innerHTML = `
        <div class="floating-cart-content">
            <div class="floating-cart-header">
                <h3>Your Cart</h3>
                <button class="close-cart-btn">&times;</button>
            </div>
            <div class="floating-cart-items" id="floating-cart-items">
                <!-- Cart items will be loaded here -->
            </div>
            <div class="floating-cart-footer">
                <div class="cart-total">
                    <span>Total:</span>
                    <span id="floating-cart-total">₱0.00</span>
                </div>
                <div class="cart-actions">
                    <button class="view-cart-btn">View Cart</button>
                    <button class="checkout-btn">Checkout</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to the body
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeBtn = modal.querySelector('.close-cart-btn');
    closeBtn.addEventListener('click', hideFloatingCart);
    
    const viewCartBtn = modal.querySelector('.view-cart-btn');
    viewCartBtn.addEventListener('click', function() {
        window.location.href = 'cart.html';
    });
    
    const checkoutBtn = modal.querySelector('.checkout-btn');
    checkoutBtn.addEventListener('click', function() {
        window.location.href = 'cart.html';
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideFloatingCart();
        }
    });
}

/**
 * Render items in the floating cart modal
 */
function renderFloatingCartItems() {
    const cartItemsContainer = document.getElementById('floating-cart-items');
    const cartTotalElement = document.getElementById('floating-cart-total');
    
    if (!cartItemsContainer) return;
    
    // Clear existing items
    cartItemsContainer.innerHTML = '';
    
    const cart = initializeCart();
    
    if (cart.length === 0) {
        // Show empty cart message
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <i class="fa-solid fa-cart-shopping"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        if (cartTotalElement) {
            cartTotalElement.textContent = '₱0.00';
        }
        return;
    }
    
    // Add items to floating cart
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'floating-cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="item-image">
            <div class="item-details">
                <div class="item-title">${item.title}</div>
                <div class="item-price">₱${parseFloat(item.price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                <div class="item-quantity">Qty: ${item.quantity}</div>
            </div>
            <button class="remove-item-btn" data-id="${item.id}">
                <i class="fa-solid fa-times"></i>
            </button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Update total
    if (cartTotalElement) {
        const total = calculateCartTotal();
        cartTotalElement.textContent = `₱${total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            const id = parseInt(this.getAttribute('data-id'));
            removeFromCart(id);
            renderFloatingCartItems(); // Re-render cart items
        });
    });
}

/**
 * Function to be called when "Checkout Now" is clicked on product page
 */
function checkoutNow(id, title, price, description, image) {
    // First add the item to cart
    addToCart(id, title, price, description, image);
    
    // Then redirect to the cart page
    window.location.href = 'cart.html';
    
    return initializeCart();
}

/**
 * Initialize floating cart event listeners
 */
function initFloatingCart() {
    // Only do this once
    if (window.floatingCartInitialized) return;
    window.floatingCartInitialized = true;
    
    // Setup event listener for cart icon in navbar
    const cartIcon = document.querySelector('#navbar li a[href="cart.html"]');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            // Only prevent default if cart has items
            if (getCartItemCount() > 0) {
                e.preventDefault();
                showFloatingCart();
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize once
    if (window.cartInitialized) return;
    window.cartInitialized = true;
    
    updateCartIndicator();
    initFloatingCart();
    initializeCartModal();
});