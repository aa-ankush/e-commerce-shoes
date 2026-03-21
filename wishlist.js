document.addEventListener('DOMContentLoaded', async () => {
    window.renderWishlist = function() {
        const wishlistContainer = document.getElementById('wishlist-items-container');
        const wishlist = window.getWishlist();
        
        if(wishlist.length === 0) {
            wishlistContainer.innerHTML = '<div class="col-12 text-center py-5 bg-white border"><h4 class="text-muted mb-4">Your wishlist is empty.</h4><a href="index.html" class="btn btn-dark px-4 py-2">Explore Collection</a></div>';
            return;
        }
        
        let html = '';
        wishlist.forEach(id => {
            const shoe = window.shoesData.find(s => s.id === id);
            if(shoe) {
                html += `
                   <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                     <div class="product-card h-100 d-flex flex-column position-relative cursor-pointer bg-white border" style="min-width: unset; flex: 1;" onclick="window.location.href='product.html?id=${shoe.id}'">
                       <button class="btn btn-sm btn-light position-absolute top-0 end-0 m-2 rounded-circle" style="z-index: 10; border: 1px solid #ddd;" onclick="event.stopPropagation(); window.removeFromWishlist('${shoe.id}')" aria-label="Remove">
                          <i class="bi bi-x fs-5 text-dark"></i>
                       </button>
                       <img src="${shoe.image}" alt="${shoe.name}" class="product-image mb-3 mx-auto" draggable="false" style="max-height: 180px; object-fit: contain;">
                       <div class="mt-auto">
                         <h6 class="fw-bold mb-1 text-center">${shoe.name}</h6>
                         <div class="product-price text-center fw-bold text-danger mb-3">₹${shoe.price.toLocaleString('en-IN')}</div>
                         <button class="btn btn-outline-dark w-100 rounded-0 fw-bold" onclick="event.stopPropagation(); window.addToCart('${shoe.id}', 1); const originalText = this.innerHTML; this.innerHTML = '<i class=\\'bi bi-check-lg\\'></i> Added'; setTimeout(() => this.innerHTML = originalText, 1500);">Add To Cart</button>
                       </div>
                     </div>
                   </div>
                `;
            }
        });
        wishlistContainer.innerHTML = html;
    };
    
    await window.shoesDataPromise;
    window.renderWishlist();
});
