// 1. Catálogo de Productos (¡Nombres reales y rutas de imágenes corregidas!)
const products = [
    // --- Laptops (3 Productos) ---
    { id: 101, name: "Laptop HP Pavilion Core i5 16GB", price: 1250.99, img: "img/1.jpg", category: "laptops" },
    { id: 102, name: "Acer Nitro 5 (i7/RTX 3050)", price: 1899.00, img: "img/2.jpg", category: "laptops" },
    { id: 103, name: "Lenovo Yoga C940 14'' Convertible", price: 850.50, img: "img/3.jpg", category: "laptops" },
    
    // --- Celulares (3 Productos) ---
    { id: 104, name: "Samsung Galaxy S24 Ultra 256GB", price: 999.00, img: "img/4.jpg", category: "celulares" },
    { id: 105, name: "Xiaomi Redmi Note 13 Pro", price: 299.00, img: "img/5.jpg", category: "celulares" },
    { id: 106, name: "Apple Watch Series 9 GPS 45mm", price: 399.00, img: "img/6.jpg", category: "celulares" }, 
    
    // --- Monitores (3 Productos) ---
    { id: 107, name: "Monitor LG UltraGear Curvo 2K 144Hz", price: 499.99, img: "img/7.jpg", category: "monitores" },
    { id: 108, name: "Samsung ViewFinity S8 27'' UHD", price: 350.00, img: "img/8.jpg", category: "monitores" },
    { id: 109, name: "ASUS ZenScreen Portátil USB-C", price: 180.00, img: "img/9.jpg", category: "monitores" },
    
    // --- Audio (3 Productos) ---
    { id: 110, name: "Sony WH-1000XM5 Audífonos ANC", price: 189.50, img: "img/10.jpg", category: "audio" },
    { id: 111, name: "JBL Flip 6 Altavoz Portable", price: 75.00, img: "img/11.jpg", category: "audio" },
    { id: 112, name: "Xiaomi Buds 4 Pro Inalámbricos", price: 45.00, img: "img/12.jpg", category: "audio" },

    // --- Accesorios (3 Productos) ---
    { id: 113, name: "Logitech G Pro Teclado Mecánico", price: 149.00, img: "img/13.jpg", category: "accesorios" },
    { id: 114, name: "Razer Viper V2 Pro Mouse Wireless", price: 75.00, img: "img/14.jpg", category: "accesorios" },
    { id: 115, name: "SSD Kingston NV2 2TB NVMe", price: 159.00, img: "img/15.jpg", category: "accesorios" }
];

let cart = []; // Array para almacenar los productos en el carrito

// --- FUNCIONES DEL CATÁLOGO Y BÚSQUEDA ---

/** Renderiza los productos en la cuadrícula, filtrando por categoría o término de búsqueda */
function renderProducts(filterTerm = 'all') {
    const grid = document.getElementById('productos-grid');
    grid.innerHTML = ''; 
    const lowerFilterTerm = filterTerm.toLowerCase();

    let filteredProducts = products;

    if (lowerFilterTerm !== 'all') {
        const isCategory = products.some(p => p.category === lowerFilterTerm);
        
        if (isCategory) {
            // Filtro por categoría (desde el menú)
            filteredProducts = products.filter(product => product.category === lowerFilterTerm);
        } else {
            // Filtro por término de búsqueda (desde la barra)
            filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(lowerFilterTerm) ||
                product.category.toLowerCase().includes(lowerFilterTerm)
            );
        }
    }

    if (filteredProducts.length === 0) {
        grid.innerHTML = `<p style="text-align: center; width: 100%; padding: 40px; font-size: 1.2em; color: #dc3545;">
            ❌ No se encontraron resultados para "${filterTerm}".
        </p>`;
        return;
    }

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('producto-card');
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}" class="product-image">
            
            <h3>${product.name}</h3>
            <p class="category-tag">Categoría: ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
            <p><strong>$${product.price.toFixed(2)}</strong></p>
            <button onclick="addToCart(${product.id})">Agregar al Carrito</button>
        `;
        grid.appendChild(card);
    });
}

// --- LÓGICA DEL CARRITO (Global) ---

/** Actualiza el contador del carrito en el header */
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    // Muestra u oculta el contador
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none'; 
}

/** Agrega un producto al carrito o incrementa su cantidad */
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    alert(`✅ ¡"${product.name}" añadido al carrito!`);
    renderCart();
    renderCartDropdown();
    updateCartCount();
}

/** Actualiza la cantidad de un producto en la tabla principal o lo elimina si la cantidad es 0 */
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    const quantity = parseInt(newQuantity);

    if (item && quantity > 0) {
        item.quantity = quantity;
    } else if (quantity === 0) {
        removeItem(productId, false); 
    }
    renderCart();
    renderCartDropdown();
    updateCartCount();
}

/** Elimina un producto del carrito */
function removeItem(productId, showAlert = true) {
    const product = products.find(p => p.id === productId);
    cart = cart.filter(item => item.id !== productId);
    
    if (showAlert) {
        alert(`❌ "${product.name}" ha sido eliminado del carrito.`);
    }
    renderCart();
    renderCartDropdown();
    updateCartCount();
}


// --- LÓGICA DE RENDERIZADO DEL CARRITO ---

/** Dibuja la tabla del carrito principal y calcula el total */
function renderCart() {
    const cartBody = document.getElementById('cart-body');
    const cartTotal = document.getElementById('cart-total');
    let total = 0;

    cartBody.innerHTML = ''; 

    if (cart.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="5" style="text-align: center; padding: 20px;">El carrito está vacío. ¡Añade algo de tecnología!</td>`;
        cartBody.appendChild(row);
    } else {
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span class="emoji">🛒</span> ${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <input type="number" min="0" value="${item.quantity}" 
                           onchange="updateQuantity(${item.id}, this.value)">
                </td>
                <td>$${subtotal.toFixed(2)}</td>
                <td><button onclick="removeItem(${item.id})">Eliminar</button></td>
            `;
            cartBody.appendChild(row);
        });
    }

    cartTotal.textContent = total.toFixed(2);
}

/** Renderiza el contenido del mini-carrito desplegable */
function renderCartDropdown() {
    const cartDropdownItems = document.getElementById('cart-dropdown-items');
    const cartDropdownTotal = document.getElementById('cart-dropdown-total');
    let total = 0;
    cartDropdownItems.innerHTML = '';

    if (cart.length === 0) {
        cartDropdownItems.innerHTML = '<p style="text-align: center; padding: 10px; color: #666;">Tu carrito está vacío.</p>';
        cartDropdownTotal.textContent = '0.00';
        return;
    }

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const dropdownItem = document.createElement('div');
        dropdownItem.classList.add('cart-dropdown-item');
        dropdownItem.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="item-actions">
                <span>$${subtotal.toFixed(2)}</span>
                <button class="remove-item-dropdown" onclick="removeItem(${item.id})"><i class="fas fa-times"></i></button>
            </div>
        `;
        cartDropdownItems.appendChild(dropdownItem);
    });

    cartDropdownTotal.textContent = total.toFixed(2);
}

/** Toggle del mini-carrito (mostrar/ocultar) */
function toggleCartDropdown() {
    document.getElementById('cart-dropdown').classList.toggle('show');
}

/** Simula el proceso de pago */
function checkout() {
    if (cart.length === 0) {
        alert("El carrito está vacío. Por favor, agregue productos.");
        return;
    }
    
    const total = document.getElementById('cart-total').textContent;
    alert(`🎉 ¡Pago exitoso! Total: $${total}. Recibirás un correo de confirmación pronto.`);
    
    cart = [];
    renderCart();
    renderCartDropdown(); 
    updateCartCount(); 
    toggleCartDropdown(); 
}


// --- VALIDACIÓN DEL FORMULARIO DE CONTACTO ---

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    const messageElement = document.getElementById('form-message');
    
    messageElement.classList.remove('success', 'error'); 
    messageElement.style.display = 'none';

    // 1. Validación de campos vacíos
    if (nombre === "" || email === "" || mensaje === "") {
        messageElement.textContent = "⚠️ Error: Todos los campos son obligatorios.";
        messageElement.classList.add('error');
        messageElement.style.display = 'block';
        return;
    }
    
    // 2. Validación de formato de email (RegExp básica)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        messageElement.textContent = "❌ Error: Por favor, ingrese una dirección de correo válida.";
        messageElement.classList.add('error');
        messageElement.style.display = 'block';
        return;
    }

    // Si la validación pasa:
    messageElement.textContent = "✅ ¡Tu consulta ha sido enviada! Te contactaremos en breve.";
    messageElement.classList.add('success');
    messageElement.style.display = 'block';

    this.reset();
});


// --- INICIALIZACIÓN Y LISTENERS (Event Handlers) ---

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. FILTRO DE CATEGORÍAS (Submenú)
    document.querySelectorAll('.submenu a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const category = event.target.dataset.category;
            renderProducts(category);
            document.getElementById('cart-dropdown').classList.remove('show');
        });
    });

    // Enlace "Todos los Productos"
    document.querySelector('.main-menu li:first-child a').addEventListener('click', (event) => {
        event.preventDefault();
        renderProducts('all');
    });

    // 2. FUNCIONALIDAD DE BARRA DE BÚSQUEDA
    const searchButton = document.querySelector('.search-bar button');
    const searchInput = document.querySelector('.search-bar input');

    const executeSearch = () => {
        const searchTerm = searchInput.value.trim();
        renderProducts(searchTerm);
    };

    searchButton.addEventListener('click', executeSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            executeSearch();
        }
    });

    // 3. ENLACES DE CUENTA DE USUARIO (Simulación)
    document.querySelectorAll('.dropdown-content a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            alert(`Función "${event.target.textContent.trim()}" simulada. Se necesitaría lógica de autenticación (backend) para funcionar.`);
        });
    });

    // 4. CERRAR MINI-CARRITO AL CLICKEAR FUERA
    window.onclick = function(event) {
        if (!event.target.matches('.cart-btn') && !event.target.closest('.cart-btn')) {
            const dropdown = document.getElementById('cart-dropdown');
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
    }

    // Inicializa todos los componentes
    renderProducts('all'); 
    renderCart(); 
    renderCartDropdown(); 
    updateCartCount(); 
});