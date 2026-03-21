document.addEventListener('DOMContentLoaded', async () => {
    // Wait for core JSON data to fetch successfully
    await window.shoesDataPromise;

    const checkoutContainer = document.getElementById('checkout-items-container');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const totalEl = document.getElementById('checkout-total');
    const countEl = document.getElementById('checkout-item-count');
    const cart = window.getCart();
    
    // Safety check: redirect to cart if arriving at checkout with an empty cart
    if(cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    let total = 0;
    let itemCount = 0;
    let html = '';
    
    // Map cart items exactly like cart.html but heavily styled for a compact right column
    cart.forEach(item => {
        const shoe = window.shoesData.find(s => s.id === item.id);
        if(shoe) {
            const itemTotal = shoe.price * item.qty;
            total += itemTotal;
            itemCount += item.qty;
            html += `
                <div class="d-flex align-items-center mb-4">
                   <div class="position-relative me-3">
                       <div class="border" style="border-radius: 8px; overflow: hidden; background: #fff;">
                           <img src="${shoe.image}" alt="${shoe.name}" class="p-2" style="width: 75px; height: 75px; object-fit: contain;">
                       </div>
                       <span class="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-dark border border-white opacity-100 fs-6 shadow-sm" style="min-width: 25px;">${item.qty}</span>
                   </div>
                   <div class="flex-grow-1 pe-3">
                       <h6 class="mb-1 text-dark fw-bold fs-6">${shoe.name}</h6>
                       <small class="text-muted d-block mb-1" style="font-size: 0.75rem;">${shoe.category}</small>
                       <small class="text-muted" style="font-size: 0.75rem;">Size: UK 5</small>
                   </div>
                   <div class="text-end fw-bold text-dark fs-6 ms-2">
                       ₹${itemTotal.toLocaleString('en-IN')}
                   </div>
                </div>
            `;
        }
    });

    // Hydrate the DOM
    checkoutContainer.innerHTML = html;
    subtotalEl.textContent = '₹' + total.toLocaleString('en-IN');
    totalEl.textContent = '₹' + total.toLocaleString('en-IN');
    countEl.textContent = itemCount;

    // --- Bootstrap Native Form Validation Logic ---
    const form = document.getElementById('checkoutForm');
    
    form.addEventListener('submit', event => {
        event.preventDefault(); // Stop normal HTTP submission
        event.stopPropagation();
        
        // Native HTML5 API check via Bootstrap wrapper
        if (form.checkValidity()) {
            // Form is valid - process order simulate
            
            // 1. Clear cart array in memory & localstorage
            window.saveCart([]);
            window.updateBadges(); // navbar auto updates
            
            // 2. Launch success modal
            const successModal = new bootstrap.Modal(document.getElementById('orderSuccessModal'));
            successModal.show();
        } else {
            // Form is invalid - trigger Bootstrap red borders / invalid feedback visibility
            form.classList.add('was-validated');
            
            // Auto scroll to top to show user the first invalid input
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, false);
});
