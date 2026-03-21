document.addEventListener('DOMContentLoaded', async () => {
    window.renderCart = function() {
        const cartContainer = document.getElementById('cart-items-container');
        const cartTotalEl = document.getElementById('cart-total');
        const cart = window.getCart();
        let total = 0;
        
        if(cart.length === 0) {
            cartContainer.innerHTML = '<div class="text-center py-5 border bg-white"><h4 class="text-muted mb-4">Your cart is empty.</h4><a href="index.html" class="btn btn-dark px-4 py-2">Continue Shopping</a></div>';
            cartTotalEl.textContent = '₹0';
            return;
        }
        
        let html = '';
        cart.forEach(item => {
            const shoe = window.shoesData.find(s => s.id === item.id);
            if(shoe) {
                const itemTotal = shoe.price * item.qty;
                total += itemTotal;
                html += `
                   <div class="d-flex align-items-center border bg-white p-3 mb-3">
                      <img src="${shoe.image}" alt="${shoe.name}" style="width: 100px; height: 100px; object-fit: contain;" class="bg-light me-3 p-2">
                      <div class="flex-grow-1">
                          <h5 class="mb-1 text-dark">${shoe.name}</h5>
                          <small class="text-muted d-block mb-2">${shoe.category} | Size: UK 5</small>
                          <div class="text-danger fw-bold fs-6">₹${shoe.price.toLocaleString('en-IN')}</div>
                      </div>
                      <div class="mx-4 text-center">
                          <small class="text-muted d-block mb-1">Qty</small>
                          <span class="fw-bold fs-5 px-3 py-1 border bg-light">${item.qty}</span>
                      </div>
                      <div class="text-end ps-3 border-start" style="min-width: 120px;">
                          <div class="fw-bold fs-5 mb-2">₹${itemTotal.toLocaleString('en-IN')}</div>
                          <button class="btn btn-sm btn-outline-danger" onclick="window.removeFromCart('${shoe.id}')"><i class="bi bi-trash"></i> Remove</button>
                      </div>
                   </div>
                `;
            }
        });
        cartContainer.innerHTML = html;
        cartTotalEl.textContent = '₹' + total.toLocaleString('en-IN');
    };
    
    await window.shoesDataPromise;
    window.renderCart();
});
