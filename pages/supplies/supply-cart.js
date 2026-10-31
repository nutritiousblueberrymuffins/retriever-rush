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
            <div class="form-card" style="display: flex; gap: 16px; align-items: center; padding: 16px;">
                <div style="background: #FFF9ED; border: 1px solid #E7E1D6; border-radius: 8px; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center;">
                    <img src="${item.icon}" alt="${item.name}" width="50" height="50">
                </div>
                <div style="flex: 1;">
                    <h3 style="margin: 0 0 4px; font-size: 1.1rem;">${item.name}</h3>
                    <p style="margin: 0; font-size: 0.875rem; color: #73716C;">
                        ${isBorrow ? 'Loan Item · Max 3 Days' : 'Store Purchase (Keep)'}
                    </p>
                    <span style="font-weight: 600; font-size: 0.9rem; color: #171717;">
                        ${isBorrow ? 'Free to borrow' : '$' + item.price.toFixed(2)}
                    </span>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <button onclick="updateQuantity(${index}, -1)" style="background: none; border: 1px solid #E7E1D6; border-radius: 50%; width: 28px; height: 28px; cursor: pointer;">
                        <img src="assets/minus.svg" alt="Decrease" width="12" height="12">
                    </button>
                    <span style="font-weight: 600;">${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)" style="background: none; border: 1px solid #E7E1D6; border-radius: 50%; width: 28px; height: 28px; cursor: pointer;">
                        <img src="assets/plus.svg" alt="Increase" width="12" height="12">
                    </button>
                </div>
                <button onclick="removeFromCart(${index})" style="background: none; border: none; cursor: pointer;" title="Remove">
                    <img src="assets/close.svg" alt="Remove" width="16" height="16">
                </button>
            </div>
        `;
    });

    const tax = subtotalBuy * 0.06; // 6% tax rate
    const grandTotal = subtotalBuy + tax;

    container.innerHTML = itemsHTML;

    sidebar.innerHTML = `
        <h2 style="margin: 0 0 16px; font-size: 1.25rem;">Order Summary</h2>
        <div style="display: grid; gap: 10px; font-size: 0.95rem; margin-bottom: 16px; border-bottom: 1px solid #E7E1D6; padding-bottom: 16px;">
            <div style="display: flex; justify-content: space-between;">
                <span style="color: #73716C;">Equipment Loans (${loanCount})</span>
                <span>$0.00</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="color: #73716C;">Supply Purchases</span>
                <span>$${subtotalBuy.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="color: #73716C;">Estimated Tax (6%)</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1.1rem; margin-bottom: 24px;">
            <span>Total</span>
            <span>$${grandTotal.toFixed(2)}</span>
        </div>
        <a href="checkout-supply.html" class="btn" style="width: 100%; text-align: center; justify-content: center; box-sizing: border-box;">
            Proceed to Checkout
            <img src="assets/arrow.svg" alt="Arrow Right" width="16" height="16">
        </a>
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
