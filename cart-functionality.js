// cart-functionality.js - Central cart implementation

// Initialize cart from local storage or create empty cart
function initializeCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart;
}

// Save cart to local storage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(id, title, price, description, image) {
    const cart = initializeCart();
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            title: title,
            price: price,
            description: description,
            image: image,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartIndicator();
    return cart;
}

// Checkout now (add to cart and redirect)
function checkoutNow(id, title, price, description, image) {
    addToCart(id, title, price, description, image);
    window.location.href = 'cart.html';
}

// Update cart item quantity
function updateCartItemQuantity(id, quantity) {
    const cart = initializeCart();
    const item = cart.find(item => item.id === id);
    
    if (item) {
        item.quantity = quantity;
        saveCart(cart);
        updateCartIndicator();
    }
    
    return cart;
}

// Remove item from cart
function removeFromCart(id) {
    let cart = initializeCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    updateCartIndicator();
    return cart;
}

// Clear the entire cart
function clearCart() {
    localStorage.removeItem('cart');
    updateCartIndicator();
    return [];
}

// Calculate cart total
function calculateCartTotal() {
    const cart = initializeCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update cart count indicator
function updateCartIndicator() {
    const cart = initializeCart();
    const cartCount = document.getElementById('cart-count');
    
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        if (totalItems > 0) {
            cartCount.textContent = totalItems;
            cartCount.style.display = 'block';
        } else {
            cartCount.style.display = 'none';
        }
    }
}

// Show floating cart
function showFloatingCart() {
    const floatingCart = document.getElementById('floating-cart-modal');
    if (floatingCart) {
        renderFloatingCart();
        floatingCart.classList.add('show');
        
        // Add event listener to close button
        const closeBtn = document.getElementById('close-cart-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                floatingCart.classList.remove('show');
            });
        }
        
        // Add event listener to view cart button
        const viewCartBtn = document.getElementById('view-cart-btn');
        if (viewCartBtn) {
            viewCartBtn.addEventListener('click', function() {
                window.location.href = 'cart.html';
            });
        }
        
        // Add event listener to checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                window.location.href = 'cart.html';
            });
        }
    }
}

// Render floating cart items
function renderFloatingCart() {
    const cartItemsContainer = document.getElementById('floating-cart-items');
    const cartTotalElement = document.getElementById('floating-cart-total');
    
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        const cart = initializeCart();
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
            if (cartTotalElement) {
                cartTotalElement.textContent = '₱0.00';
            }
            return;
        }
        
        // Display up to 3 items in floating cart
        const displayItems = cart.slice(0, 3);
        displayItems.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'floating-cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="floating-item-image">
                <div class="floating-item-details">
                    <div class="floating-item-title">${item.title}</div>
                    <div class="floating-item-price">₱${parseFloat(item.price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} × ${item.quantity}</div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Show "and more items" message if there are more than 3 items
        if (cart.length > 3) {
            const moreItems = document.createElement('div');
            moreItems.className = 'more-items-message';
            moreItems.textContent = `And ${cart.length - 3} more item(s)`;
            cartItemsContainer.appendChild(moreItems);
        }
        
        // Update total
        if (cartTotalElement) {
            const total = calculateCartTotal();
            cartTotalElement.textContent = `₱${total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        }
    }
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Show success message
function showSuccessMessage(message) {
    const successMsg = document.getElementById('success-message');
    const successText = document.getElementById('success-text');
    
    if (successMsg && successText) {
        successText.textContent = message;
        successMsg.classList.add('show');
        
        setTimeout(() => {
            successMsg.classList.remove('show');
        }, 3000);
    }
}

// Show loading overlay
function showLoading() {
    const loader = document.getElementById('loader-overlay');
    if (loader) {
        loader.classList.add('active');
    }
}

// Hide loading overlay
function hideLoading() {
    const loader = document.getElementById('loader-overlay');
    if (loader) {
        loader.classList.remove('active');
    }
}

// Setup product page functionality
function setupProductPage() {
    // Add event listeners for add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            
            const productCard = this.closest('.product-card');
            if (!productCard) return;
            
            const productData = getProductDataFromCard(productCard);
            
            // Add animation to button
            this.classList.add('added-animation');
            setTimeout(() => {
                this.classList.remove('added-animation');
            }, 500);
            
            // Add to cart
            addToCart(
                productData.id,
                productData.title,
                productData.price,
                productData.description,
                productData.image
            );
            
            // Show toast notification
            showToast(`${productData.title} added to cart`);
            
            // Show floating cart
            showFloatingCart();
        });
    });
    
    // Add event listeners for checkout now buttons
    const checkoutNowButtons = document.querySelectorAll('.checkout-now');
    checkoutNowButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            
            const productCard = this.closest('.product-card');
            if (!productCard) return;
            
            const productData = getProductDataFromCard(productCard);
            
            // Add animation to button
            this.classList.add('added-animation');
            setTimeout(() => {
                this.classList.remove('added-animation');
            }, 500);
            
            // Show toast notification
            showToast(`${productData.title} added to cart - redirecting to checkout...`);
            
            // Redirect after a short delay
            setTimeout(() => {
                checkoutNow(
                    productData.id,
                    productData.title,
                    productData.price,
                    productData.description,
                    productData.image
                );
            }, 800);
        });
    });
}

// Helper function to extract product data
function getProductDataFromCard(productCard) {
    const productId = parseInt(productCard.getAttribute('data-id'));
    const productTitle = productCard.querySelector('.product-title')?.textContent || '';
    const productPriceText = productCard.querySelector('.product-price')?.textContent || '0';
    const productPrice = parseFloat(productPriceText.replace(/[^0-9.]/g, ''));
    const productDescription = productCard.querySelector('.product-description')?.textContent || '';
    
    // Get the image URL
    let productImage;
    const imageDiv = productCard.querySelector('.product-image');
    if (imageDiv) {
        const bgStyle = window.getComputedStyle(imageDiv).backgroundImage;
        if (bgStyle && bgStyle !== 'none') {
            productImage = bgStyle.replace(/^url\(['"](.+)['"]\)$/, '$1');
        } else {
            productImage = '/api/placeholder/200/150';
        }
    } else {
        productImage = '/api/placeholder/200/150';
    }
    
    return {
        id: productId,
        title: productTitle,
        price: productPrice,
        description: productDescription,
        image: productImage
    };
}

// Setup cart page functionality
function setupCartPage() {
    // Render the cart items
    renderCart();
    
    // Add event listeners for the cart actions
    setupCartEventListeners();
}

// Render cart items
function renderCart() {
    const cartContainer = document.getElementById('cart-container');
    if (!cartContainer) return;
    
    // Clear the container
    cartContainer.innerHTML = '';
    
    const cart = initializeCart();
    
    if (cart.length === 0) {
        // Show empty cart message
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-cart-shopping"></i>
                <p>Your cart is empty</p>
                <a href="product.html" class="continue-shopping">Continue Shopping</a>
            </div>
        `;
        return;
    }
    
    // Create cart items
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.setAttribute('data-id', item.id);
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="item-image">
            <div class="item-details">
                <div class="item-title">${item.title}</div>
                <div class="item-price">₱${parseFloat(item.price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                <div class="item-description">${item.description}</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn increase" data-id="${item.id}">+</button>
            </div>
            <button class="remove-btn" data-id="${item.id}">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        cartContainer.appendChild(cartItem);
    });
    
    // Add cart summary
    const cartSummary = document.createElement('div');
    cartSummary.className = 'cart-summary';
    
    // Add promo code section
    const promoCode = document.createElement('div');
    promoCode.className = 'promo-code';
    promoCode.innerHTML = `
        <input type="text" placeholder="Promo Code">
        <button>Apply</button>
    `;
    
    cartSummary.appendChild(promoCode);
    
    // Add cart total
    cartSummary.innerHTML += `
        <div class="cart-total">
            <span>Total:</span>
            <span>₱${calculateCartTotal().toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </div>
        <button class="checkout-btn">Proceed to Checkout</button>
        <div class="cart-actions">
            <button class="clear-cart">Clear Cart</button>
            <a href="product.html" style="color: #333; text-decoration: none;">Continue Shopping</a>
        </div>
    `;
    
    cartContainer.appendChild(cartSummary);
}

// Setup event listeners for cart page
function setupCartEventListeners() {
    // Increase quantity
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const cart = initializeCart();
            const item = cart.find(item => item.id === id);
            
            if (item) {
                showLoading();
                
                setTimeout(() => {
                    updateCartItemQuantity(id, item.quantity + 1);
                    renderCart();
                    setupCartEventListeners(); // Re-attach event listeners
                    hideLoading();
                    showSuccessMessage("Quantity updated");
                }, 300);
            }
        });
    });
    
    // Decrease quantity
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const cart = initializeCart();
            const item = cart.find(item => item.id === id);
            
            if (item && item.quantity > 1) {
                showLoading();
                
                setTimeout(() => {
                    updateCartItemQuantity(id, item.quantity - 1);
                    renderCart();
                    setupCartEventListeners(); // Re-attach event listeners
                    hideLoading();
                    showSuccessMessage("Quantity updated");
                }, 300);
            }
        });
    });
    
    // Remove item
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const cartItem = this.closest('.cart-item');
            
            cartItem.classList.add('removing');
            
            setTimeout(() => {
                removeFromCart(id);
                renderCart();
                setupCartEventListeners(); // Re-attach event listeners
                showSuccessMessage("Item removed from cart");
            }, 500);
        });
    });
    
    // Clear cart
    const clearCartBtn = document.querySelector('.clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear your cart?')) {
                showLoading();
                
                setTimeout(() => {
                    clearCart();
                    renderCart();
                    setupCartEventListeners(); // Re-attach event listeners
                    hideLoading();
                    showSuccessMessage("Cart cleared");
                }, 500);
            }
        });
    }
    
    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            showLoading();
            
            setTimeout(() => {
                hideLoading();
                showSuccessMessage('Thank you for your order! Your items will be shipped soon.');
                
                setTimeout(() => {
                    clearCart();
                    renderCart();
                    setupCartEventListeners(); // Re-attach event listeners
                }, 2000);
            }, 1500);
        });
    }
    
    // Promo code
    const promoButton = document.querySelector('.promo-code button');
    if (promoButton) {
        promoButton.addEventListener('click', function() {
            const promoInput = document.querySelector('.promo-code input');
            const promoCode = promoInput.value.trim();
            
            if (promoCode) {
                showLoading();
                
                setTimeout(() => {
                    hideLoading();
                    
                    if (promoCode.toUpperCase() === 'WELS10') {
                        showSuccessMessage("Promo code applied! 10% discount");
                        promoInput.disabled = true;
                        promoButton.disabled = true;
                        promoButton.textContent = "Applied";
                        promoButton.style.backgroundColor = "#2ecc71";
                        
                        const totalElement = document.querySelector('.cart-total span:last-child');
                        const currentTotal = calculateCartTotal();
                        const discountedTotal = currentTotal * 0.9; // 10% off
                        totalElement.innerHTML = `₱${discountedTotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} <span style="font-size: 14px; color: #2ecc71;">(10% off)</span>`;
                    } else {
                        alert('Invalid promo code');
                    }
                }, 1000);
            }
        });
    }
}

// Initialize functionality based on current page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the product page
    if (window.location.pathname.includes('product.html')) {
        setupProductPage();
    }
    
    // Check if we're on the cart page
    if (window.location.pathname.includes('cart.html')) {
        setupCartPage();
    }
    
    // Always update the cart
    updateCartIndicator();
});