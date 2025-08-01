// Global variables
let products = [];
let cart = [];
let currentUser = null;

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
    loadCartFromStorage();
    updateCartDisplay();
});

// Setup event listeners
function setupEventListeners() {
    // Category filter buttons
    document.querySelectorAll('[data-category]').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterProducts(category);
            
            // Update active button
            document.querySelectorAll('[data-category]').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Cart icon click
    document.getElementById('cartIcon').addEventListener('click', function(e) {
        e.preventDefault();
        showCart();
    });

    // Login button click
    document.getElementById('loginBtn').addEventListener('click', function(e) {
        e.preventDefault();
        showLoginModal();
    });

    // Login form submit
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
}

// Load products from API
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to sample data if API is not available
        loadSampleProducts();
    }
}

// Load sample products (fallback)
function loadSampleProducts() {
    products = [
        {
            id: 1,
            name: "Classic Analog Watch",
            brand: "TimeMaster",
            price: 299.99,
            category: "Analog",
            image: "images/watch1.jpg",
            description: "Elegant classic analog watch with leather strap",
            features: ["Water resistant", "Leather strap", "Japanese movement"],
            inStock: true
        },
        {
            id: 2,
            name: "Digital Sports Watch",
            brand: "SportTech",
            price: 199.99,
            category: "Digital",
            image: "images/watch2.jpg",
            description: "High-performance digital sports watch",
            features: ["GPS tracking", "Heart rate monitor", "Water resistant"],
            inStock: true
        },
        {
            id: 3,
            name: "Luxury Chronograph",
            brand: "LuxTime",
            price: 899.99,
            category: "Luxury",
            image: "images/watch3.jpg",
            description: "Premium chronograph watch with premium materials",
            features: ["Swiss movement", "Sapphire crystal", "Stainless steel"],
            inStock: true
        },
        {
            id: 4,
            name: "Smart Watch Pro",
            brand: "TechWear",
            price: 399.99,
            category: "Smart",
            image: "images/watch4.jpg",
            description: "Advanced smartwatch with health monitoring",
            features: ["Bluetooth", "Fitness tracking", "Notifications"],
            inStock: true
        }
    ];
    displayProducts(products);
}

// Display products in the grid
function displayProducts(productsToShow) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-lg-3 col-md-6 mb-4';
    
    col.innerHTML = `
        <div class="card product-card h-100">
            <div class="position-relative">
                <img src="${product.image}" class="card-img-top" alt="${product.name}" 
                     onerror="this.src='images/default-watch.jpg'">
                <span class="category-badge">${product.category}</span>
                <span class="price-tag">$${product.price}</span>
            </div>
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text text-muted">${product.brand}</p>
                <p class="card-text flex-grow-1">${product.description}</p>
                <div class="mt-auto">
                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus me-1"></i>Add to Cart
                        </button>
                        <button class="btn btn-outline-secondary btn-sm" onclick="viewProduct(${product.id})">
                            <i class="fas fa-eye me-1"></i>View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// Filter products by category
function filterProducts(category) {
    if (category === 'all') {
        displayProducts(products);
    } else {
        const filteredProducts = products.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
        );
        displayProducts(filteredProducts);
    }
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCartToStorage();
    updateCartDisplay();
    showNotification('Product added to cart!', 'success');
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartDisplay();
    showNotification('Product removed from cart!', 'info');
}

// Update cart quantity
function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            saveCartToStorage();
            updateCartDisplay();
        }
    }
}

// Update cart display
function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Show cart modal
function showCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-muted">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
    } else {
        let cartHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartHTML += `
                <div class="d-flex align-items-center mb-3 p-3 border rounded">
                    <img src="${item.image}" alt="${item.name}" class="me-3" style="width: 60px; height: 60px; object-fit: cover;">
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${item.name}</h6>
                        <p class="mb-1 text-muted">$${item.price}</p>
                        <div class="d-flex align-items-center">
                            <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <div class="text-end">
                        <p class="mb-1 fw-bold">$${itemTotal.toFixed(2)}</p>
                        <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        cartItems.innerHTML = cartHTML;
        cartTotal.textContent = total.toFixed(2);
    }
    
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    cartModal.show();
}

// Checkout function
function checkout() {
    if (!currentUser) {
        showLoginModal();
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'warning');
        return;
    }
    
    // Here you would typically redirect to a checkout page or process the order
    showNotification('Proceeding to checkout...', 'info');
    // For demo purposes, we'll just clear the cart
    setTimeout(() => {
        cart = [];
        saveCartToStorage();
        updateCartDisplay();
        bootstrap.Modal.getInstance(document.getElementById('cartModal')).hide();
        showNotification('Order placed successfully!', 'success');
    }, 2000);
}

// Show login modal
function showLoginModal() {
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
}

// Handle login
async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            
            document.getElementById('loginBtn').textContent = currentUser.name;
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            showNotification('Login successful!', 'success');
        } else {
            const error = await response.json();
            showNotification(error.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed. Please try again.', 'error');
    }
}

// View product details
function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        // For demo purposes, show product info in an alert
        // In a real app, you'd navigate to a product detail page
        alert(`Product: ${product.name}\nBrand: ${product.brand}\nPrice: $${product.price}\nDescription: ${product.description}`);
    }
}

// Scroll to products section
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Search products
function searchProducts(query) {
    if (!query.trim()) {
        displayProducts(products);
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    
    displayProducts(filteredProducts);
}

// Export functions for global access
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.viewProduct = viewProduct;
window.scrollToProducts = scrollToProducts;
window.checkout = checkout;