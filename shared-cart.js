// shared-cart.js - Unified cart functionality for WELS Cycling website

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
    
    // Update floating cart if it exists
    if (typeof updateFloatingCartContents === 'function') {
        updateFloatingCartContents();
    }
    
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
    
    // Update floating cart if it exists
    if (typeof updateFloatingCartContents === 'function') {
        updateFloatingCartContents();
    }
    
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
        
        // Update floating cart if it exists
        if (typeof updateFloatingCartContents === 'function') {
            updateFloatingCartContents();
        }
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
    
    // Update floating cart if it exists
    if (typeof updateFloatingCartContents === 'function') {
        updateFloatingCartContents();
    }
    
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

// Initialize the cart indicator when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateCartIndicator();
});