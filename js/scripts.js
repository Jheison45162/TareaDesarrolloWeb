// --- Módulo de Gestión de Productos y Datos ---
const products = [];
const CART_STORAGE_KEY = 'shoppingCart';

// Función para leer y parsear el archivo productos.txt
async function loadProducts() {
    try {
        const response = await fetch('data/productos.txt');
        if (!response.ok) {
            throw new Error(`Error al cargar el archivo de datos: ${response.statusText}`);
        }
        const text = await response.text();
        const lines = text.trim().split('\n');

        lines.forEach(line => {
            const parts = line.split(',');
        if (parts.length === 6) {
        products.push({
         id: parseInt(parts[0].trim()),
        name: parts[1].trim(),
        price: parseFloat(parts[2].trim()),
        description: parts[3].trim(),
        featured: parts[4].trim() === '1',
        image: parts[5].trim()
    });
}

        });
        
        console.log("Productos cargados:", products);
        renderProducts();
    } catch (error) {
        console.error("Fallo al cargar los productos:", error);
    }
}

// Función para renderizar el catálogo de productos
function renderProducts() {
    const cardList = document.getElementById('product-card-list');
    const tableBody = document.getElementById('product-table')?.querySelector('tbody');
    const featuredList = document.getElementById('featured-list');

    // 1. Renderizar Listado de Productos (Tarjetas y Tabla)
    if (cardList || tableBody) {
        products.forEach(product => {
            // Renderizar como Tarjeta
            if (cardList) {
                const cardHtml = `
                    <div class="product-card">
                       <img src="${product.image}" alt="${product.name}">
                       <h4>${product.name}</h4>
                       <p>${product.description}</p>
                       <div class="price">$${product.price.toFixed(2)}</div>
                       <button class="btn primary add-to-cart" data-id="${product.id}">Agregar al Carrito</button>
                    </div>
                `;
                cardList.innerHTML += cardHtml;
            }

            // Renderizar como Fila de Tabla
            if (tableBody) {
                const rowHtml = `
                    <tr>
                        <td data-label="ID">${product.id}</td>
                        <td data-label="Nombre">${product.name}</td>
                        <td data-label="Precio">$${product.price.toFixed(2)}</td>
                        <td data-label="Descripción">${product.description}</td>
                        <td data-label="Acción"><button class="btn primary add-to-cart" data-id="${product.id}">Añadir</button></td>
                    </tr>
                `;
                tableBody.innerHTML += rowHtml;
            }
        });
    }

    // 2. Renderizar Productos Destacados (index.html)
    if (featuredList) {
        const featuredProducts = products.filter(p => p.featured);
        featuredProducts.forEach(product => {
            const cardHtml = `
                <div class="product-card">
                    <h4>${product.name}</h4>
                    <p>${product.description}</p>
                    <div class="price">$${product.price.toFixed(2)}</div>
                    <button class="btn primary add-to-cart" data-id="${product.id}">Agregar al Carrito</button>
                </div>
            `;
            featuredList.innerHTML += cardHtml;
        });
    }
    
    // Asignar eventos 'Agregar al Carrito' después de que se hayan renderizado
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            addItemToCart(productId);
        });
    });
}


// --- Módulo de Carrito de Compras ---

let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];

// Guarda el carrito en localStorage y actualiza la interfaz
function saveCartAndRender() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
}

// Actualiza el contador de productos en el nav
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// Agrega un producto al carrito
function addItemToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
    }

    saveCartAndRender();
    alert(`✅ ¡Producto "${product.name}" agregado al carrito!`);
}

// Elimina un producto del carrito
window.removeItemFromCart = function(id) {
    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        const removedItemName = cart[itemIndex].name;
        cart.splice(itemIndex, 1);
        saveCartAndRender();
        alert(`🗑️ ¡Producto "${removedItemName}" eliminado del carrito!`);
    }
}

// Renderiza los items en el modal del carrito
function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartSubtotalSpan = document.getElementById('cart-subtotal');
    let subtotal = 0;

    if (!cartItemsDiv || !cartSubtotalSpan) return;

    cartItemsDiv.innerHTML = ''; // Limpiar contenido previo

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>El carrito está vacío.</p>';
        cartSubtotalSpan.textContent = '$0.00';
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const itemHtml = `
            <div class="cart-item">
                <span>${item.name} (${item.quantity})</span>
                <span>$${itemTotal.toFixed(2)}</span>
                <button class="btn secondary" onclick="removeItemFromCart(${item.id})">X</button>
            </div>
        `;
        cartItemsDiv.innerHTML += itemHtml;
    });

    cartSubtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
}

// Inicialización de la lógica del carrito (modal, contador)
function initCart() {
    const cartModal = document.getElementById('cart-modal');
    const cartButton = document.getElementById('cart-button');
    const closeButton = document.querySelector('#cart-modal .close-button');
    const checkoutButton = document.getElementById('checkout-button');

    // Manejar apertura y cierre del modal
    if (cartButton) {
        cartButton.addEventListener('click', (e) => {
            e.preventDefault();
            updateCartDisplay();
            cartModal.style.display = 'block';
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Manejar el botón de pagar
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cart.length > 0) {
                alert(`🎉 ¡Pago de $${document.getElementById('cart-subtotal').textContent.replace('$', '')} simulado con éxito!`);
                cart = []; // Vaciar el carrito
                saveCartAndRender();
                cartModal.style.display = 'none';
            } else {
                alert('El carrito está vacío. Agrega productos antes de pagar.');
            }
        });
    }

    updateCartCount(); // Cargar el contador al inicio
}


// --- Módulo de Formulario de Contacto ---

function validateForm(event) {
    event.preventDefault(); // Evitar el envío por defecto
    const form = event.target;
    let isValid = true;

    // Obtener campos
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    // Función de ayuda para mostrar errores
    const setError = (input, message) => {
        const errorElement = document.getElementById(input.id + '-error');
        errorElement.textContent = message;
        input.classList.add('input-error');
        isValid = false;
    };
    
    // Función de ayuda para limpiar errores
    const clearError = (input) => {
        const errorElement = document.getElementById(input.id + '-error');
        errorElement.textContent = '';
        input.classList.remove('input-error');
    };

    // Validación de Nombre (mínimo 3 caracteres)
    clearError(nameInput);
    if (nameInput.value.trim().length < 3) {
        setError(nameInput, 'El nombre debe tener al menos 3 caracteres.');
    }

    // Validación de Email (formato básico)
    clearError(emailInput);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
        setError(emailInput, 'Por favor, introduce un correo electrónico válido.');
    }

    // Validación de Asunto (selección)
    clearError(subjectInput);
    if (subjectInput.value === '') {
        setError(subjectInput, 'Debes seleccionar un asunto.');
    }

    // Validación de Mensaje (mínimo 10 caracteres)
    clearError(messageInput);
    if (messageInput.value.trim().length < 10) {
        setError(messageInput, 'El mensaje debe tener al menos 10 caracteres.');
    }

    const formStatus = document.getElementById('form-status');
    formStatus.textContent = '';
    formStatus.classList.remove('success', 'error');

    if (isValid) {
        // Simulación de envío exitoso
        formStatus.textContent = '✅ Mensaje enviado con éxito. Pronto te contactaremos.';
        formStatus.classList.add('success');
        form.reset(); // Limpiar formulario
    } else {
        formStatus.textContent = '❌ Por favor, corrige los errores del formulario.';
        formStatus.classList.add('error');
    }
}

// Inicialización de la validación del formulario de contacto
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', validateForm);
    }
}


// --- Inicialización de la Aplicación ---
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    initCart();
    initContactForm();
});
