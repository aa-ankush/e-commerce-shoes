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
});
