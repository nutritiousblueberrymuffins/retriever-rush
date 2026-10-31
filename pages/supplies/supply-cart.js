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

//updating the cart and adding the numbers + taxes math.
function renderCartPage() {
    const container = document.getElementById('cart-items-container');
    const sidebar = document.getElementById('cart-summary-sidebar');
    if (!container || !sidebar) return;

    const cart = getCart();

    if (cart.length === 0) {
        window.location.href = 'empty-supply.html';
        return;
    }

    let itemsHTML = '';
    let subtotalBuy = 0;
    let loanCount = 0;

    cart.forEach((item, index) => {
        const isBorrow = item.mode === 'borrow';
        const itemTotal = item.price * item.quantity;
        if (isBorrow) loanCount += item.quantity;
        else subtotalBuy += itemTotal;

        itemsHTML += `
            <div class="form-card cart-item-card">
                <div class="cart-item-img">
                    <img src="${item.icon}" alt="${item.name}" width="50" height="50">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="muted-text">
                        ${isBorrow ? 'Loan Item · Max 3 Days' : 'Store Purchase (Keep)'}
                    </p>
                    <span class="price-tag">
                        ${isBorrow ? 'Free to borrow' : '$' + item.price.toFixed(2)}
                    </span>
                </div>
                <div class="quantity-controls">
                    <button type="button" onclick="updateQuantity(${index}, -1)" class="qty-btn">
                        <img src="assets/minus.svg" alt="Decrease" width="12" height="12">
                    </button>
                    <span>${item.quantity}</span>
                    <button type="button" onclick="updateQuantity(${index}, 1)" class="qty-btn">
                        <img src="assets/plus.svg" alt="Increase" width="12" height="12">
                    </button>
                </div>
                <button type="button" onclick="removeFromCart(${index})" class="remove-btn" title="Remove">
                    <img src="assets/close.svg" alt="Remove" width="16" height="16">
                </button>
            </div>
        `;
    });

    const tax = subtotalBuy * 0.06;
    const grandTotal = subtotalBuy + tax;

    container.innerHTML = itemsHTML;

    sidebar.innerHTML = `
        <h2>Order Summary</h2>
        <div class="summary-rows">
            <div class="summary-row">
                <span>Equipment Loans (${loanCount})</span>
                <span>$0.00</span>
            </div>
            <div class="summary-row">
                <span>Supply Purchases</span>
                <span>$${subtotalBuy.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Estimated Tax (6%)</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
        </div>
        <div class="summary-total">
            <span>Total</span>
            <span>$${grandTotal.toFixed(2)}</span>
        </div>
        <a href="checkout-supply.html" class="btn btn-full">
            Proceed to Checkout
            <img src="assets/arrow.svg" alt="Arrow Right" width="16" height="16">
        </a>
    `;
}

//to render checkout page
function renderCheckoutPage() {
    const list = document.getElementById('checkout-items-list');
    const totalBox = document.getElementById('checkout-total-box');
    if (!list || !totalBox) return;

    const cart = getCart();
    if (cart.length === 0) {
        list.innerHTML = `<li class="empty-item-notice">No items selected in your cart.</li>`;
        totalBox.innerHTML = `<span>Total Due at Pickup/Checkout:</span><strong>$0.00</strong>`;
        return;
    }

    let listHTML = '';
    let subtotalBuy = 0;

    cart.forEach(item => {
        const isBorrow = item.mode === 'borrow';
        const itemTotal = item.price * item.quantity;
        if (!isBorrow) subtotalBuy += itemTotal;

        listHTML += `
            <li class="checkout-item-row">
                <div>
                    <strong>${item.name} (${item.quantity}x)</strong>
                    <div class="muted-text">
                        ${isBorrow ? 'Free Loan · Return within 3 days' : 'Store Purchase · Yours to keep'}
                    </div>
                </div>
                <strong>
                    ${isBorrow ? 'Free Loan ($0.00)' : '$' + itemTotal.toFixed(2)}
                </strong>
            </li>
        `;
    });

    const grandTotal = subtotalBuy * 1.06;

    list.innerHTML = listHTML;
    totalBox.innerHTML = `
        <span>Total Due at Pickup/Checkout:</span>
        <strong>$${grandTotal.toFixed(2)} <small class="muted-text">(incl. tax)</small></strong>
    `;
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
    }
}
