// Product data
const products = {
    tshirts: [
        {
            id: 't1',
            name: "Classic White T-Shirt",
            price: 3500,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            colors: ["#FFFFFF"],
            type: "tshirt"
        },
        {
            id: 't2',
            name: "Essential Black T-Shirt",
            price: 3500,
            image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            colors: ["#000000"],
            type: "tshirt"
        },
        {
            id: 't3',
            name: "Premium White T-Shirt",
            price: 4200,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            colors: ["#FFFFFF"],
            type: "tshirt"
        },
        {
            id: 't4',
            name: "Premium Black T-Shirt",
            price: 4200,
            image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            colors: ["#000000"],
            type: "tshirt"
        }
    ],
    hoodies: [
        {
            id: 'h1',
            name: "Classic White Hoodie",
            price: 7200,
            image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            colors: ["#FFFFFF"],
            type: "hoodie"
        },
        {
            id: 'h2',
            name: "Essential Black Hoodie",
            price: 7200,
            image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            colors: ["#000000"],
            type: "hoodie"
        },
        {
            id: 'h3',
            name: "Premium White Zip Hoodie",
            price: 8500,
            image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            colors: ["#FFFFFF"],
            type: "hoodie"
        },
        {
            id: 'h4',
            name: "Premium Black Zip Hoodie",
            price: 8500,
            image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            colors: ["#000000"],
            type: "hoodie"
        }
    ]
};

// Initialize cart
let cart = [];

// Display products
function displayProducts() {
    displayProductType('tshirt', products.tshirts);
    displayProductType('hoodie', products.hoodies);
}

// Display specific product type
function displayProductType(type, items) {
    const grid = document.getElementById(`${type}Grid`);
    if (!grid) return;

    grid.innerHTML = items.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>Rs. ${product.price.toLocaleString('en-NP')}</p>
                <div class="color-options">
                    ${product.colors.map(color => `
                        <div class="color-option${product.colors.length === 1 ? ' selected' : ''}" 
                             style="background-color: ${color}; border: 1px solid #ddd;"
                             data-color="${color}">
                        </div>
                    `).join('')}
                </div>
                <button class="add-to-cart-btn">Add to Cart</button>
            </div>
        </div>
    `).join('');

    // Add event listeners
    grid.querySelectorAll('.product-card').forEach(card => {
        const productId = card.dataset.id;
        const product = items.find(p => p.id === productId);

        // Color selection
        card.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', () => {
                card.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        // Add to cart
        card.querySelector('.add-to-cart-btn').addEventListener('click', () => {
            const selectedColor = card.querySelector('.color-option.selected')?.dataset.color;
            if (!selectedColor) {
                alert('Please select a color');
                return;
            }
            addToCart(product, selectedColor);
        });
    });
}

// Add to cart
function addToCart(product, color) {
    const existingItem = cart.find(item => item.id === product.id && item.color === color);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            color,
            quantity: 1
        });
    }

    saveCartToLocalStorage();
    updateCartCount();
    showCartNotification(product);
}

// Update cart count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems.toString();
    }
}

// Show cart notification
function showCartNotification(product) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <p>${product.name} added to cart</p>
        <p>Total: Rs. ${calculateTotal().toLocaleString('en-NP')}</p>
    `;

    // Remove existing notification if any
    const existingNotification = document.querySelector('.cart-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    document.body.appendChild(notification);
    notification.style.display = 'block';

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Calculate total
function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Save cart to local storage
function saveCartToLocalStorage() {
    localStorage.setItem('rtcloth_cart', JSON.stringify(cart));
}

// Load cart from local storage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('rtcloth_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Promo codes and shipping rates
const promoCodes = {
    'WELCOME10': { discount: 0.10, type: 'percentage' },
    'FREESHIP': { discount: 100, type: 'fixed', applyTo: 'shipping' },
    'SAVE500': { discount: 500, type: 'fixed' }
};

const shippingRates = {
    standard: 100,
    express: 250,
    pickup: 0
};

let appliedPromo = null;
let verifiedPhone = false;

// Setup checkout functionality
function setupCheckout() {
    const cartIcon = document.querySelector('.cart-icon');
    const checkoutModal = document.getElementById('checkoutModal');
    const closeModal = document.querySelector('.close-modal');
    
    // Open checkout modal
    cartIcon.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }
        checkoutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateCartSummary();
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        checkoutModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            checkoutModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    setupPromoCode();
    setupPhoneVerification();
    setupPaymentMethods();
    setupOrderTracking();
    setupCheckoutForm();
}

// Setup promo code functionality
function setupPromoCode() {
    const promoInput = document.getElementById('promoCode');
    const applyButton = document.getElementById('applyPromo');
    
    applyButton.addEventListener('click', () => {
        const code = promoInput.value.trim().toUpperCase();
        const promo = promoCodes[code];
        
        if (promo) {
            appliedPromo = { code, ...promo };
            document.querySelector('.discount').style.display = 'flex';
            updateCartSummary();
            alert('Promo code applied successfully!');
        } else {
            alert('Invalid promo code');
        }
    });
}

// Setup phone verification
function setupPhoneVerification() {
    const verifyBtn = document.getElementById('verifyPhone');
    const verificationSection = document.getElementById('phoneVerification');
    const submitOTP = document.getElementById('submitOTP');
    
    verifyBtn.addEventListener('click', () => {
        const phone = document.getElementById('phone').value;
        if (validatePhone(phone)) {
            // Simulate OTP sending
            verificationSection.style.display = 'flex';
            alert('OTP sent to your phone number');
        } else {
            alert('Please enter a valid phone number');
        }
    });
    
    submitOTP.addEventListener('click', () => {
        const otp = document.getElementById('verificationCode').value;
        if (otp === '1234') { // Simulate OTP verification
            verifiedPhone = true;
            verificationSection.style.display = 'none';
            alert('Phone number verified successfully!');
        } else {
            alert('Invalid OTP');
        }
    });
}

// Setup payment methods
function setupPaymentMethods() {
    const paymentOptions = document.getElementsByName('payment');
    const paymentDetails = document.getElementById('paymentDetails');
    
    paymentOptions.forEach(option => {
        option.addEventListener('change', () => {
            // Hide all payment details sections
            document.querySelectorAll('.payment-detail-section').forEach(section => {
                section.style.display = 'none';
            });
            
            // Show selected payment details
            const selectedDetails = document.getElementById(`${option.value}Details`);
            if (selectedDetails) {
                selectedDetails.style.display = 'block';
            }
        });
    });
}

// Setup checkout form
function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkoutForm');
    
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!verifiedPhone) {
            alert('Please verify your phone number');
            return;
        }

        const formData = {
            orderId: generateOrderId(),
            customerInfo: {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                province: document.getElementById('province').value,
                city: document.getElementById('city').value
            },
            shipping: {
                method: document.querySelector('input[name="shipping"]:checked').value,
                cost: calculateShipping()
            },
            payment: {
                method: document.querySelector('input[name="payment"]:checked').value,
                details: getPaymentDetails()
            },
            items: cart,
            subtotal: calculateSubtotal(),
            discount: calculateDiscount(),
            total: calculateTotal(),
            status: 'pending',
            trackingStatus: [
                {
                    status: 'Order Placed',
                    date: new Date().toISOString(),
                    complete: true
                },
                {
                    status: 'Payment Confirmation',
                    date: null,
                    complete: false
                },
                {
                    status: 'Processing',
                    date: null,
                    complete: false
                },
                {
                    status: 'Shipped',
                    date: null,
                    complete: false
                },
                {
                    status: 'Delivered',
                    date: null,
                    complete: false
                }
            ]
        };

        // Save order
        saveOrder(formData);
        
        // Send confirmation email (simulated)
        sendOrderConfirmation(formData);
        
        // Clear cart
        cart = [];
        saveCartToLocalStorage();
        updateCartCount();
        
        // Show success message
        alert(`Order placed successfully!\nYour order ID is: ${formData.orderId}\n\n${
            formData.payment.method === 'cod' 
                ? 'Your order will be delivered within 3-5 business days.'
                : 'Please complete your payment to confirm the order.'
        }`);
        
        // Close modal
        checkoutModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Get payment details based on selected method
function getPaymentDetails() {
    const method = document.querySelector('input[name="payment"]:checked').value;
    switch (method) {
        case 'esewa':
            return { esewaId: document.getElementById('esewaId').value };
        case 'khalti':
            return { khaltiId: document.getElementById('khaltiId').value };
        case 'imepay':
            return { imepayId: document.getElementById('imepayId').value };
        case 'bank':
            return {
                transactionId: document.getElementById('transactionId').value,
                proofFile: document.getElementById('paymentProof').files[0]?.name
            };
        default:
            return {};
    }
}

// Setup order tracking
function setupOrderTracking() {
    const trackOrder = document.getElementById('trackOrder');
    const trackingResult = document.getElementById('trackingResult');
    
    trackOrder.addEventListener('click', () => {
        const orderId = document.getElementById('orderTrackingId').value;
        const order = getOrder(orderId);
        
        if (order) {
            displayTrackingStatus(order.trackingStatus);
        } else {
            trackingResult.innerHTML = '<p>Order not found</p>';
        }
    });
}

// Display tracking status
function displayTrackingStatus(statuses) {
    const trackingResult = document.getElementById('trackingResult');
    trackingResult.innerHTML = statuses.map(status => `
        <div class="tracking-status">
            <div class="status-dot ${status.complete ? 'status-complete' : 'status-pending'}"></div>
            <div class="status-info">
                <h4>${status.status}</h4>
                ${status.date ? `<p>${new Date(status.date).toLocaleString()}</p>` : ''}
            </div>
        </div>
    `).join('');
}

// Update cart summary
function updateCartSummary() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Color: <span style="display: inline-block; width: 12px; height: 12px; background-color: ${item.color}; border: 1px solid #ddd; border-radius: 50%;"></span></p>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <div class="cart-item-price">Rs. ${(item.price * item.quantity).toLocaleString('en-NP')}</div>
        </div>
    `).join('');

    updateTotals();
}

// Update totals
function updateTotals() {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping();
    const discount = calculateDiscount();
    const total = subtotal + shipping - discount;

    document.getElementById('cartSubtotal').textContent = `Rs. ${subtotal.toLocaleString('en-NP')}`;
    document.getElementById('shippingCost').textContent = `Rs. ${shipping.toLocaleString('en-NP')}`;
    document.getElementById('discountAmount').textContent = `-Rs. ${discount.toLocaleString('en-NP')}`;
    document.getElementById('cartTotal').textContent = `Rs. ${total.toLocaleString('en-NP')}`;
}

// Calculate subtotal
function calculateSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Calculate shipping
function calculateShipping() {
    const selectedShipping = document.querySelector('input[name="shipping"]:checked');
    return selectedShipping ? shippingRates[selectedShipping.value] : shippingRates.standard;
}

// Calculate discount
function calculateDiscount() {
    if (!appliedPromo) return 0;

    const subtotal = calculateSubtotal();
    const shipping = calculateShipping();

    if (appliedPromo.type === 'percentage') {
        return subtotal * appliedPromo.discount;
    } else if (appliedPromo.type === 'fixed') {
        if (appliedPromo.applyTo === 'shipping') {
            return Math.min(shipping, appliedPromo.discount);
        }
        return Math.min(subtotal, appliedPromo.discount);
    }
    return 0;
}

// Calculate total
function calculateTotal() {
    return calculateSubtotal() + calculateShipping() - calculateDiscount();
}

// Validate phone number (Nepal format)
function validatePhone(phone) {
    return /^[9][678]\d{8}$/.test(phone);
}

// Generate order ID
function generateOrderId() {
    return 'RTC' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
}

// Save order to local storage
function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('rtcloth_orders') || '[]');
    orders.push(order);
    localStorage.setItem('rtcloth_orders', JSON.stringify(orders));
}

// Get order from local storage
function getOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('rtcloth_orders') || '[]');
    return orders.find(order => order.orderId === orderId);
}

// Send order confirmation email (simulated)
function sendOrderConfirmation(order) {
    console.log('Sending order confirmation email to', order.customerInfo.email, order);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    loadCartFromLocalStorage();
    setupCheckout();
});
