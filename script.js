const isWomensPage = window.location.pathname.includes('womens.html');
const jsonSource = isWomensPage ? 'women_products.json' : 'products.json';

window.shoesDataPromise = fetch(jsonSource)
    .then(res => res.json())
    .then(data => {
        window.shoesData = data;
        return data;
    })
    .catch(err => {
        console.error('Failed to load ' + jsonSource + ':', err);
        window.shoesData = [];
        return [];
    });

// --- Global State Management ---
// Store data structurally for Cart and Wishlist
window.getCart = function() { return JSON.parse(localStorage.getItem('cart') || '[]'); };
window.getWishlist = function() { return JSON.parse(localStorage.getItem('wishlist') || '[]'); };
window.saveCart = function(cart) { localStorage.setItem('cart', JSON.stringify(cart)); };
window.saveWishlist = function(wishlist) { localStorage.setItem('wishlist', JSON.stringify(wishlist)); };

window.addToCart = function(productId, qty = 1) {
    if(!productId) return;
    let cart = window.getCart();
    let item = cart.find(i => i.id === productId);
    if(item) {
        item.qty += qty;
    } else {
        cart.push({ id: productId, qty: qty });
    }
    window.saveCart(cart);
    window.updateBadges();
};

window.removeFromCart = function(productId) {
    let cart = window.getCart().filter(i => i.id !== productId);
    window.saveCart(cart);
    if(window.renderCart) window.renderCart();
    window.updateBadges();
};

window.addToWishlist = function(productId) {
    if(!productId) return;
    let wishlist = window.getWishlist();
    if(!wishlist.includes(productId)) {
        wishlist.push(productId);
    }
    window.saveWishlist(wishlist);
    window.updateBadges();
};

window.removeFromWishlist = function(productId) {
    let wishlist = window.getWishlist().filter(id => id !== productId);
    window.saveWishlist(wishlist);
    if(window.renderWishlist) window.renderWishlist();
    window.updateBadges();
};

window.updateBadges = function() {
    const cartCount = window.getCart().reduce((sum, item) => sum + item.qty, 0);
    const wishlistCount = window.getWishlist().length;
    
    document.querySelectorAll('.cart-badge').forEach(b => {
        b.textContent = cartCount;
        b.style.display = parseInt(cartCount) > 0 ? 'inline-block' : 'none';
    });
    
    document.querySelectorAll('.wishlist-badge').forEach(b => {
        b.textContent = wishlistCount;
        b.style.display = parseInt(wishlistCount) > 0 ? 'inline-block' : 'none';
    });
};

// --- Navbar Component ---
window.renderNavbar = function() {
    const placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) return;

    placeholder.innerHTML = `
    <nav class="navbar navbar-expand-lg bg-white py-3 shadow-sm mb-4">
      <div class="container-fluid px-3 px-lg-5">
        <a class="navbar-brand fs-3 fw-medium" style="font-family: 'Times New Roman', Times, serif; letter-spacing: -0.5px;" href="index.html">Shoelpv</a>
        
        <div class="d-flex align-items-center gap-3 gap-lg-4 order-lg-2">
          <a href="#" class="text-dark text-decoration-none d-none d-sm-block"><i class="bi bi-person fs-5"></i></a>
          <a href="wishlist.html" class="text-dark text-decoration-none position-relative">
            <i class="bi bi-heart fs-5"></i>
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger wishlist-badge" style="font-size: 0.6rem; display: none;">0</span>
          </a>
          <a href="cart.html" class="text-dark text-decoration-none position-relative">
            <i class="bi bi-cart2 fs-5"></i>
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cart-badge" style="font-size: 0.6rem; display: none;">0</span>
          </a>
          <a href="#" class="btn btn-dark rounded-3 px-3 py-2 px-lg-4 d-none d-sm-block" style="font-family: monospace; font-size: 0.9rem;">Sign in</a>
          
          <button class="navbar-toggler border-0 px-0 shadow-none ms-1" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>

        <div class="collapse navbar-collapse order-lg-1" id="navbarContent">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0 gap-3 gap-lg-4 text-center mt-3 mt-lg-0">
            <li class="nav-item dropdown">
              <a class="nav-link text-dark text-decoration-none dropdown-toggle-custom d-flex align-items-center justify-content-center gap-1" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Catalog <i class="bi bi-chevron-down" style="font-size: 0.75rem; margin-top: 2px;"></i>
              </a>
              <ul class="dropdown-menu border-0 shadow-sm text-center text-lg-start">
                <li><a class="dropdown-item" href="#">Men</a></li>
                <li><a class="dropdown-item" href="#">Women</a></li>
                <li><a class="dropdown-item" href="#">Kids</a></li>
              </ul>
            </li>
            <li class="nav-item"><a class="nav-link text-dark" href="#">Sale</a></li>
            <li class="nav-item"><a class="nav-link text-dark" href="#">New Arrival</a></li>
            <li class="nav-item"><a class="nav-link text-dark" href="#">About</a></li>
          </ul>
        </div>
      </div>
    </nav>
    `;
    window.updateBadges();
};


document.addEventListener('DOMContentLoaded', async () => {
    // Render the dynamic Navbar on load
    window.renderNavbar();

    // Ensure data is loaded
    await window.shoesDataPromise;

    // --- Top banner close functionality ---
    const closeBannerBtn = document.getElementById('close-banner');
    const announcementBanner = document.getElementById('announcement-banner');

    if (closeBannerBtn && announcementBanner) {
        closeBannerBtn.addEventListener('click', () => {
            announcementBanner.style.opacity = '0';
            setTimeout(() => announcementBanner.style.display = 'none', 300);
        });
    }

    // --- Inject Product Cards (on Homepage) ---
    const productContainer = document.getElementById('product-container');

    if (productContainer && window.shoesData) {
        productContainer.innerHTML = '';
        
        let cardsHTML = '';
        window.shoesData.forEach(shoe => {
            cardsHTML += `
                <div class="product-card" style="cursor: pointer;" onclick="window.location.href='product.html?id=${shoe.id}'">
                  <div class="card-top">
                    <span class="card-number">${shoe.id}</span>
                    <span class="card-category">${shoe.category}</span>
                  </div>
                  <img src="${shoe.image}" alt="${shoe.name}" class="product-image" draggable="false">
                  <div class="product-price text-center fw-bold mb-3 fs-5">₹${shoe.price.toLocaleString('en-IN')}</div>
                  <button class="btn-add-to-cart" onclick="event.stopPropagation(); window.addToCart('${shoe.id}', 1);">Add To Cart</button>
                </div>
            `;
        });
        productContainer.innerHTML = cardsHTML;

        // Horizontal scrolling functionality
        const scrollLeftBtn = document.getElementById('scroll-left');
        const scrollRightBtn = document.getElementById('scroll-right');
        const cardWidthWithGap = 344;
        
        if (scrollLeftBtn) scrollLeftBtn.addEventListener('click', () => productContainer.scrollBy({ left: -cardWidthWithGap, behavior: 'smooth' }));
        if (scrollRightBtn) scrollRightBtn.addEventListener('click', () => productContainer.scrollBy({ left: cardWidthWithGap, behavior: 'smooth' }));

        // Mouse Drag to Scroll Logic
        let isDown = false;
        let startX;
        let scrollLeft;

        productContainer.style.cursor = 'grab';
        productContainer.style.userSelect = 'none'; 

        productContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            productContainer.style.cursor = 'grabbing';
            startX = e.pageX - productContainer.offsetLeft;
            scrollLeft = productContainer.scrollLeft;
        });

        productContainer.addEventListener('mouseleave', () => {
            isDown = false;
            productContainer.style.cursor = 'grab';
        });

        productContainer.addEventListener('mouseup', () => {
            isDown = false;
            productContainer.style.cursor = 'grab';
        });

        productContainer.addEventListener('mousemove', (e) => {
            if (!isDown) { return; }
            e.preventDefault();
            const x = e.pageX - productContainer.offsetLeft;
            const walk = (x - startX) * 2;
            productContainer.scrollLeft = scrollLeft - walk;
        });
    }

    // --- Inject Best Sellers (on Homepage) ---
    const bsGrid = document.getElementById('best-sellers-grid');
    const bsFeatured = document.getElementById('best-sellers-featured');
    
    if (bsGrid && bsFeatured && window.shoesData && window.shoesData.length >= 5) {
        bsGrid.innerHTML = '';
        bsFeatured.innerHTML = '';
        
        // 4 items for the grid
        const gridShoes = window.shoesData.slice(0, 4);
        let gridHTML = '';
        gridShoes.forEach((shoe, idx) => {
            let imgFile = idx % 2 === 0 ? 'shoe_1.png' : 'shoe_2.png';
            gridHTML += `
                <div class="col-6 mb-3">
                   <div class="bs-card mb-2" style="cursor: pointer;" onclick="window.location.href='product.html?id=${shoe.id}'">
                      <div class="position-relative d-flex align-items-center justify-content-center p-2 mt-2" style="background-color: #f6f6f6; border-radius: 16px; aspect-ratio: 4/3;">
                          <img src="${imgFile}" alt="${shoe.name}" style="width: 70%; height: auto; object-fit: contain; mix-blend-mode: darken;">
                      </div>
                      <div class="mt-3 ps-1">
                          <h6 class="mb-1 text-dark fs-6 text-truncate" style="font-weight: 500; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">${shoe.name}</h6>
                          <small class="text-muted d-block" style="font-size: 0.75rem;">Price • ₹${shoe.price.toLocaleString('en-IN')}</small>
                      </div>
                   </div>
                </div>
            `;
        });
        bsGrid.innerHTML = gridHTML;
        
        // 1 large featured item perfectly matching left section styling
        const fShoe = window.shoesData[6]; 
        const fHTML = `
           <div class="bs-card h-100 d-flex flex-column" style="cursor: pointer;" onclick="window.location.href='product.html?id=${fShoe.id}'">
              <div class="bs-img-box flex-grow-1 position-relative rounded-4 overflow-hidden" style="background-color: #e9ecef;">
                  <img src="Gemini_Generated_Image_ohqgloohqgloohqg.png" alt="Featured Lifestyle" class="w-100 h-100" style="object-fit: cover; object-position: center; position: absolute; top:0; left:0;">
              </div>
              <div class="mt-3">
                  <h6 class="mb-1 text-dark fs-6" style="font-weight: 500; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">${fShoe.name}</h6>
                  <small class="text-muted d-block" style="font-size: 0.75rem;">Price • ₹${fShoe.price.toLocaleString('en-IN')}</small>
              </div>
           </div>
        `;
        bsFeatured.innerHTML = fHTML;
    }

    // --- Inject Category Grid (mens.html / womens.html) ---
    const categoryGrid = document.getElementById('category-grid');
    if (categoryGrid && window.shoesData) {
        let gridHTML = '';
        window.shoesData.forEach((shoe, idx) => {
            let imgFile = idx % 2 === 0 ? 'shoe_1.png' : 'shoe_2.png';
            gridHTML += `
                <div class="col-12 col-md-4 col-lg-3">
                   <div class="product-card h-100 d-flex flex-column text-start" style="cursor: pointer; padding: 15px; border-radius: 16px; min-width: unset; max-width: unset;" onclick="window.location.href='product.html?id=${shoe.id}'">
                      <div class="card-top mb-2" style="margin-bottom: 15px;">
                        <span class="card-number" style="font-size: 0.65rem; width: 32px; height: 32px;">${shoe.id.replace('W','')}</span>
                        <span class="card-category text-truncate" style="font-size: 0.65rem; padding: 4px 10px; max-width: 140px;">${shoe.category}</span>
                      </div>
                      <img src="${imgFile}" alt="${shoe.name}" class="product-image mx-auto my-3" style="max-height: 180px; width: 100%; object-fit: contain; margin-bottom: 25px !important;" draggable="false">
                      <div class="mt-auto">
                         <h6 class="mb-2 text-dark fs-6 text-truncate" style="font-weight: 500;">${shoe.name}</h6>
                         <div class="product-price fw-bold mb-3 fs-6" style="color: #444;">₹${shoe.price.toLocaleString('en-IN')}</div>
                         <button class="btn-add-to-cart py-2 w-100" style="font-size: 0.8rem; border-radius: 4px;" onclick="event.stopPropagation(); window.addToCart('${shoe.id}', 1);">Add To Cart</button>
                      </div>
                   </div>
                </div>
            `;
        });
        categoryGrid.innerHTML = gridHTML;
    }
});
