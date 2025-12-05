// 1. Catálogo de Productos (Tu array de productos)
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


// ------------------------------------------------------------------
// --- FUNCIONES DEL CATÁLOGO Y CARRITO (Tus funciones originales) ---
// ------------------------------------------------------------------

/** Renderiza los productos en la cuadrícula, filtrando por categoría o término de búsqueda */
function renderProducts(filterTerm = 'all') {
    const grid = document.getElementById('productos-grid');
    grid.innerHTML = ''; 
    const lowerFilterTerm = filterTerm.toLowerCase();

    let filteredProducts = products;

    if (lowerFilterTerm !== 'all') {
        const isCategory = products.some(p => p.category === lowerFilterTerm);
        
        if (isCategory) {
            filteredProducts = products.filter(product => product.category === lowerFilterTerm);
        } else {
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

// ... (El resto de tus funciones: updateCartCount, addToCart, updateQuantity, removeItem, renderCart, renderCartDropdown, toggleCartDropdown, checkout) ...
// Por espacio, se omiten aquí, pero deben estar TODAS presentes en tu archivo.
// ... (FIN DE LAS FUNCIONES DEL CATÁLOGO Y CARRITO) ...


// ------------------------------------------------------------------
// --- FUNCIONES DEL CARRUSEL (Slider) ---
// ------------------------------------------------------------------

// Estas funciones deben estar envueltas en un Listener para ejecutarse después del DOMContentLoaded
let currentIndex = 0;
let autoSlide;

function showSlide(index) {
    const slides = document.querySelectorAll('.slider-slide');
    const totalSlides = slides.length;
    const dotsContainer = document.querySelector('.slider-indicators');

    if (index >= totalSlides) {
        index = 0;
    } else if (index < 0) {
        index = totalSlides - 1;
    }
    
    currentIndex = index;
    
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    slides[currentIndex].classList.add('active');
    
    updateDots();
}

function updateDots() {
    const dotsContainer = document.querySelector('.slider-indicators');
    if (!dotsContainer) return;

    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentIndex) {
            dot.classList.add('active');
        }
    });
}

function startAutoSlide() {
    const intervalTime = 5000;
    autoSlide = setInterval(() => {
        showSlide(currentIndex + 1);
    }, intervalTime);
}

function resetAutoSlide() {
    clearInterval(autoSlide);
    startAutoSlide();
}


// ------------------------------------------------------------------
// --- INICIALIZACIÓN Y LISTENERS (Event Handlers) ---
// ------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DEL CARRUSEL ---
    // Solo si los elementos existen (para evitar errores)
    const slides = document.querySelectorAll('.slider-slide');
    if (slides.length > 0) {
        showSlide(currentIndex);
        startAutoSlide();

        const prevBtn = document.querySelector('.slider-nav-btn.prev');
        const nextBtn = document.querySelector('.slider-nav-btn.next');
        const dotsContainer = document.querySelector('.slider-indicators');

        if (prevBtn) prevBtn.addEventListener('click', () => { showSlide(currentIndex - 1); resetAutoSlide(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { showSlide(currentIndex + 1); resetAutoSlide(); });
        
        if (dotsContainer) dotsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('dot')) {
                const dotIndex = Array.from(dotsContainer.children).indexOf(event.target);
                showSlide(dotIndex);
                resetAutoSlide();
            }
        });
    }


    // --- LÓGICA DEL MENÚ: SCROLL SUAVE + FILTRADO ---
    const catalogoSection = document.getElementById('productos');
    
    // 1. FILTRO DE CATEGORÍAS (Submenú): Unificado
    document.querySelectorAll('.submenu a').forEach(link => {
        link.addEventListener('click', (event) => {
            
            event.preventDefault(); // Detiene el salto instantáneo
            
            const category = event.target.dataset.category;
            const targetId = event.target.getAttribute('href'); // Obtiene #productos
            const targetElement = document.querySelector(targetId);

            // SCROLL: Si el elemento existe, iniciamos el desplazamiento
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth' 
                });
            }

            // FILTRADO: Retrasamos el renderizado para que el scroll empiece primero
            setTimeout(() => {
                renderProducts(category);
                
                // Cierra el mini-carrito si estaba abierto
                const cartDropdown = document.getElementById('cart-dropdown');
                if (cartDropdown) cartDropdown.classList.remove('show');
                
                // Opcional: Cerrar el menú principal si tu CSS no lo hace
                // link.closest('.dropdown-menu').classList.remove('active');
                
            }, 300); // 300ms es suficiente para que la animación inicie

        });
    });

    // 2. Enlace "Todos los Productos" (También con scroll)
    const allProductsLink = document.querySelector('.main-menu li a[href="#productos"]');
    if (allProductsLink) {
        allProductsLink.addEventListener('click', (event) => {
            event.preventDefault();
            
            if (catalogoSection) {
                catalogoSection.scrollIntoView({ behavior: 'smooth' });
            }

            setTimeout(() => {
                renderProducts('all');
            }, 300);
        });
    }


    // ... (El resto de tus Listeners: búsqueda, cuenta de usuario, cerrar carrito al clickear fuera, etc.) ...


    // 3. INICIALIZACIÓN FINAL
    renderProducts('all'); 
    // Asegúrate de que las otras funciones de renderizado (Carrito) se llamen aquí si las necesitas en el inicio.
    // renderCart(); 
    // renderCartDropdown(); 
    // updateCartCount(); 
});
