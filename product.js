document.addEventListener('DOMContentLoaded', async () => {

    // --- Dynamic Product Population ---
    await window.shoesDataPromise;
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId && window.shoesData) {
        const shoe = window.shoesData.find(s => s.id === productId);
        if (shoe) {
            const productTitle = document.getElementById('productTitle');
            const mainImage = document.getElementById('mainProductImage');
            const productSalePrice = document.getElementById('productSalePrice');
            const productMrpPrice = document.getElementById('productMrpPrice');
            const colorText = document.getElementById('colorText');

            if (productTitle) productTitle.textContent = shoe.name;
            if (mainImage) mainImage.src = shoe.image;
            if (productSalePrice) productSalePrice.textContent = `₹${shoe.price.toLocaleString('en-IN')}`;
            if (productMrpPrice) productMrpPrice.textContent = `₹${(shoe.price * 2).toLocaleString('en-IN')}`;
            if (colorText) colorText.textContent = `${shoe.name} / ${shoe.category}`;
            
            // Map the extensive description fields
            const dynDescr = document.getElementById('dynDescr');
            const dynOccasion = document.getElementById('dynOccasion');
            const dynInsole = document.getElementById('dynInsole');
            const dynCare = document.getElementById('dynCare');
            const dynMaterial = document.getElementById('dynMaterial');
            
            if (dynDescr && shoe.description) dynDescr.textContent = shoe.description;
            if (dynOccasion && shoe.occasion) dynOccasion.textContent = shoe.occasion;
            if (dynInsole && shoe.insole) dynInsole.textContent = shoe.insole;
            if (dynCare && shoe.care) dynCare.textContent = shoe.care;
            if (dynMaterial && shoe.material) dynMaterial.textContent = shoe.material;

            // Set the first thumbnail to the actual shoe image
            const thumbImgs = document.querySelectorAll('#thumbnailGallery img');
            if (thumbImgs.length > 0) thumbImgs[0].src = shoe.image;
        }
    }

    // --- Product Images Gallery ---
    const mainImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('#thumbnailGallery img');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
             // Basic image swap
             mainImage.src = thumb.src;
             // visual active state for thumbnail
             thumbnails.forEach(t => {
                 t.classList.remove('border-dark', 'border');
                 t.classList.add('border', 'border-light');
             });
             thumb.classList.remove('border-light');
             thumb.classList.add('border-dark', 'border');
        });
    });

    // --- Size Selection ---
    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Only allow selection if not disabled
            if(!btn.classList.contains('disabled')) {
                sizeBtns.forEach(b => {
                   b.classList.remove('active', 'btn-outline-dark');
                   b.classList.add('btn-outline-secondary');
                   b.style.borderColor = '#e0e0e0';
                   b.style.color = '#555';
                });
                
                btn.classList.add('active', 'btn-outline-dark');
                btn.classList.remove('btn-outline-secondary');
                btn.style.borderColor = '#999';
                btn.style.color = '#000';
            }
        });
    });

    // --- Quantity Selector ---
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    const qtyInput = document.getElementById('qtyInput');

    if (qtyMinus && qtyPlus && qtyInput) {
        qtyMinus.addEventListener('click', () => {
            let val = parseInt(qtyInput.value) || 1;
            if (val > 1) {
                qtyInput.value = val - 1;
            }
        });

        qtyPlus.addEventListener('click', () => {
            let val = parseInt(qtyInput.value) || 1;
            if (val < 10) { 
                qtyInput.value = val + 1;
            }
        });
        
        // Ensure manual input stays valid
        qtyInput.addEventListener('change', () => {
            let val = parseInt(qtyInput.value);
            if(isNaN(val) || val < 1) qtyInput.value = 1;
        });
    }

    // --- Add to Cart & Wishlist ---
    const addToCartBtn = document.getElementById('addToCartBtn');
    const addToWishlistBtn = document.getElementById('addToWishlistBtn');
    const wishlistIcon = document.getElementById('wishlistIcon');

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const qty = parseInt(document.getElementById('qtyInput').value) || 1;
            if(window.addToCart && productId) {
                window.addToCart(productId, qty);
                const origText = addToCartBtn.textContent;
                addToCartBtn.textContent = 'ADDED!';
                setTimeout(() => addToCartBtn.textContent = origText, 1500);
            }
        });
    }

    if (addToWishlistBtn) {
        addToWishlistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if(window.addToWishlist && productId && !wishlistIcon.classList.contains('bi-heart-fill')) {
                window.addToWishlist(productId);
                wishlistIcon.classList.remove('bi-heart');
                wishlistIcon.classList.add('bi-heart-fill', 'text-danger');
            }
        });
    }

    // --- You May Also Like (Related Products) ---
    const relatedGrid = document.getElementById('related-grid');
    if (relatedGrid && window.shoesData && window.shoesData.length > 0) {
        // Exclude the currently viewed product
        const otherShoes = window.shoesData.filter(s => s.id !== productId);
        
        // Randomly shuffle array and select robust sub-array of 4
        const shuffled = otherShoes.sort(() => 0.5 - Math.random());
        const selectedRelated = shuffled.slice(0, 4);
        
        let relatedHTML = '';
        selectedRelated.forEach((shoe, idx) => {
            let imgFile = idx % 2 === 0 ? 'shoe_1.png' : 'shoe_2.png';
            relatedHTML += `
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
                         <button class="btn-add-to-cart py-2 w-100" style="font-size: 0.8rem; border-radius: 4px;" onclick="event.stopPropagation(); window.handleAddToCart(this, '${shoe.id}');">Add To Cart</button>
                      </div>
                   </div>
                </div>
            `;
        });
        relatedGrid.innerHTML = relatedHTML;
    }

});
