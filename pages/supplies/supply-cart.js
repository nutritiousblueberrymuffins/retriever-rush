// Author: Gabriela Jurado-Fuentes
// Cart Management for Student Market Module

function getCart() {
    const cart = localStorage.getItem('retriever_rush_cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('retriever_rush_cart', JSON.stringify(cart));
}

function updateCartBadge() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const badges = document.querySelectorAll('.cart-count-badge');
    badges.forEach(badge => {
        badge.textContent = totalCount;
    });
}

function addToCart(id, name, price, mode, icon) {
    const cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === id && item.mode === mode);
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ id, name, price, mode, icon, quantity: 1 });
    }
    
    saveCart(cart);
    updateCartBadge();
    alert(`${name} (${mode === 'borrow' ? 'Free Loan' : 'Purchase'}) added to cart!`);
}

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    updateCartBadge();
    renderCartPage();
}

function renderCartPage() {
    const container = document.getElementById('cart-items-container');
    const sidebar = document.getElementById('cart-summary-sidebar');
    if (!container || !sidebar) return;

    const cart = getCart();

    if (cart.length === 0) {
        window.location.href = 'empty-supply.html';
        return;
    }

    let html = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        html += `
            <div class="form-card" style="display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:16px;">
                    <img src="${item.icon}" width="48" height="48" alt="${item.name}">
                    <div>
                        <h3 style="margin:0;">${item.name}</h3>
                        <span class="badge-status">${item.mode === 'borrow' ? 'Free Loan (3-Day)' : 'Purchase'}</span>
                        <p style="margin:4px 0 0; color:var(--muted);">$${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                </div>
                <button type="button" onclick="removeFromCart(${index})" class="btn btn-secondary btn-sm">Remove</button>
            </div>
        `;
    });

    container.innerHTML = html;

    const tax = subtotal * 0.06;
    const total = subtotal + tax;

    sidebar.innerHTML = `
        <h2>Order Summary</h2>
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span>Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span>Tax (6%)</span>
            <span>$${tax.toFixed(2)}</span>
        </div>
        <hr style="border:0; border-top:1px solid var(--border); margin:12px 0;">
        <div style="display:flex; justify-content:space-between; margin-bottom:16px; font-weight:700; font-size:1.1rem;">
            <span>Total</span>
            <span>$${total.toFixed(2)}</span>
        </div>
        <a href="checkout-supply.html" class="btn" style="width:100%; text-align:center;">Proceed to Checkout →</a>
    `;
}

function renderCheckoutPage() {
    const listContainer = document.getElementById('checkout-items-list');
    const totalBox = document.getElementById('checkout-total-box');
    if (!listContainer || !totalBox) return;

    const cart = getCart();
    let html = '';
    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        html += `
            <li style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.95rem;">
                <span>${item.name} (${item.mode === 'borrow' ? 'Loan' : 'Buy'}) x${item.quantity}</span>
                <span>$${itemTotal.toFixed(2)}</span>
            </li>
        `;
    });

    const tax = subtotal * 0.06;
    const total = subtotal + tax;

    listContainer.innerHTML = html;
    totalBox.innerHTML = `
        <span>Total Due:</span>
        <span>$${total.toFixed(2)}</span>
    `;
}
