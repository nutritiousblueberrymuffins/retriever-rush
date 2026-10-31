const CART_KEY = 'retriever_rush_cart';

//get cart from files
function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

//saving the cart
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
}

//adding to the cart
function addToCart(id, name, price, mode, icon) {
    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === id && item.mode === mode);
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ id, name, price, mode, icon, quantity: 1 });
    }
    
    saveCart(cart);
    alert(`Added "${name}" (${mode.toUpperCase()}) to your bag!`);
}

//removing an item
function removeFromCart(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    refreshCartView();
}

// Increase/Decrease items
function updateQuantity(index, delta) {
    let cart = getCart();
    if (cart[index]) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCart(cart);
        refreshCartView();
    }
}

// updating the bag icon
function updateCartBadge() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-count-badge');
    badges.forEach(badge => badge.textContent = totalCount);
}

// help to determin which page to refresh
function refreshCartView() {
    if (document.getElementById('cart-items-container')) {
        renderCartPage();
    }
    if (document.getElementById('checkout-items-list')) {
        renderCheckoutPage();
    }
}
