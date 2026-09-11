// ================= CART.JS =================

document.addEventListener("DOMContentLoaded", () => {

    const cartItemsContainer = document.getElementById("cartItems");
    const emptyCart = document.getElementById("emptyCart");
    const cartCount = document.getElementById("cartCount");
    const cartItemCount = document.getElementById("cartItemCount");

    const subtotalElement = document.getElementById("subtotal");
    const deliveryElement = document.getElementById("deliveryCharge");
    const discountElement = document.getElementById("discount");
    const totalElement = document.getElementById("cartTotal");

    const clearCartBtn = document.getElementById("clearCartBtn");
    const checkoutBtn = document.getElementById("checkoutBtn");

    const couponCode = document.getElementById("couponCode");
    const applyCouponBtn = document.getElementById("applyCouponBtn");
    const couponMessage = document.getElementById("couponMessage");


    // ================= CART DATA =================

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let discount = 0;

    let appliedCoupon = false;


    // ================= FORMAT PRICE =================

    function formatPrice(price) {

        return "₹" + Number(price).toLocaleString("en-IN");

    }


    // ================= SAVE CART =================

    function saveCart() {

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

    }


    // ================= UPDATE CART COUNT =================

    function updateCartCount() {

        const count = cart.reduce(
            (total, item) =>
                total + (Number(item.quantity) || 1),
            0
        );

        if (cartCount) {
            cartCount.textContent = count;
        }

        if (cartItemCount) {

            cartItemCount.textContent =
                `${count} ${count === 1 ? "Item" : "Items"}`;

        }

    }


    // ================= CALCULATE TOTAL =================

    function calculateTotals() {

        const subtotal = cart.reduce(
            (total, item) => {

                const price =
                    Number(item.price) || 0;

                const quantity =
                    Number(item.quantity) || 1;

                return total + (price * quantity);

            },
            0
        );


        let delivery = 0;

        // Free delivery for orders >= ₹1000
        // Otherwise ₹99

        if (subtotal > 0 && subtotal < 1000) {
            delivery = 99;
        }


        const finalDiscount =
            Math.min(discount, subtotal);


        const total =
            subtotal +
            delivery -
            finalDiscount;


        if (subtotalElement) {

            subtotalElement.textContent =
                formatPrice(subtotal);

        }


        if (deliveryElement) {

            deliveryElement.textContent =
                delivery === 0
                    ? "FREE"
                    : formatPrice(delivery);

        }


        if (discountElement) {

            discountElement.textContent =
                finalDiscount > 0
                    ? "-" + formatPrice(finalDiscount)
                    : "₹0";

        }


        if (totalElement) {

            totalElement.textContent =
                formatPrice(total);

        }


        return {
            subtotal,
            delivery,
            discount: finalDiscount,
            total
        };

    }


    // ================= RENDER CART =================

    function renderCart() {

        if (!cartItemsContainer) {
            return;
        }


        cartItemsContainer.innerHTML = "";


        if (cart.length === 0) {

            if (emptyCart) {
                emptyCart.style.display = "block";
            }

            cartItemsContainer.style.display = "none";

            if (checkoutBtn) {
                checkoutBtn.disabled = true;
            }

            updateCartCount();

            calculateTotals();

            return;
        }


        if (emptyCart) {
            emptyCart.style.display = "none";
        }

        cartItemsContainer.style.display = "block";


        cart.forEach((item, index) => {

            const quantity =
                Number(item.quantity) || 1;

            const price =
                Number(item.price) || 0;

            const itemTotal =
                price * quantity;


            const cartItem =
                document.createElement("div");

            cartItem.className = "cart-item";

            cartItem.dataset.index = index;


            cartItem.innerHTML = `

                <div class="cart-item-image">

                    ${
                        item.image
                            ? `<img
                                src="${escapeHTML(item.image)}"
                                alt="${escapeHTML(item.name || "Product")}"
                              >`
                            : `<span>
                                ${item.icon || "🛍️"}
                              </span>`
                    }

                </div>


                <div class="cart-item-details">

                    <span class="cart-item-category">

                        ${escapeHTML(
                            item.category || "Product"
                        )}

                    </span>


                    <h3>

                        ${escapeHTML(
                            item.name || "Product"
                        )}

                    </h3>


                    ${
                        item.description
                            ? `<p>
                                ${escapeHTML(item.description)}
                               </p>`
                            : ""
                    }


                    <span class="stock-status">
                        ✓ In Stock
                    </span>

                </div>


                <div class="cart-item-price">

                    <span class="current-price">

                        ${formatPrice(price)}

                    </span>

                    ${
                        item.originalPrice
                            ? `<span class="original-price">
                                ${formatPrice(item.originalPrice)}
                               </span>`
                            : ""
                    }

                </div>


                <div class="quantity-control">

                    <button
                        type="button"
                        class="quantity-btn decrease-btn"
                        data-index="${index}"
                    >
                        −
                    </button>


                    <span class="quantity">
                        ${quantity}
                    </span>


                    <button
                        type="button"
                        class="quantity-btn increase-btn"
                        data-index="${index}"
                    >
                        +
                    </button>

                </div>


                <div class="cart-item-total">

                    ${formatPrice(itemTotal)}

                </div>


                <button
                    type="button"
                    class="remove-item-btn"
                    data-index="${index}"
                    title="Remove item"
                >
                    🗑️
                </button>

            `;


            cartItemsContainer.appendChild(cartItem);

        });


        if (checkoutBtn) {
            checkoutBtn.disabled = false;
        }


        updateCartCount();

        calculateTotals();

    }


    // ================= ESCAPE HTML =================

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            String(value);

        return div.innerHTML;

    }


    // ================= INCREASE / DECREASE =================

    if (cartItemsContainer) {

        cartItemsContainer.addEventListener(
            "click",
            (event) => {

                const increaseBtn =
                    event.target.closest(".increase-btn");

                const decreaseBtn =
                    event.target.closest(".decrease-btn");

                const removeBtn =
                    event.target.closest(".remove-item-btn");


                // Increase

                if (increaseBtn) {

                    const index =
                        Number(increaseBtn.dataset.index);

                    if (cart[index]) {

                        cart[index].quantity =
                            (Number(cart[index].quantity) || 1) + 1;

                        saveCart();

                        renderCart();

                    }

                    return;
                }


                // Decrease

                if (decreaseBtn) {

                    const index =
                        Number(decreaseBtn.dataset.index);

                    if (cart[index]) {

                        const currentQuantity =
                            Number(cart[index].quantity) || 1;


                        if (currentQuantity > 1) {

                            cart[index].quantity =
                                currentQuantity - 1;

                        } else {

                            cart.splice(index, 1);

                        }


                        saveCart();

                        renderCart();

                    }

                    return;
                }


                // Remove

                if (removeBtn) {

                    const index =
                        Number(removeBtn.dataset.index);


                    if (cart[index]) {

                        cart.splice(index, 1);

                        saveCart();

                        renderCart();

                    }

                }

            }
        );

    }


    // ================= CLEAR CART =================

    if (clearCartBtn) {

        clearCartBtn.addEventListener(
            "click",
            () => {

                if (cart.length === 0) {
                    return;
                }


                const confirmClear =
                    confirm(
                        "Are you sure you want to clear your cart?"
                    );


                if (!confirmClear) {
                    return;
                }


                cart = [];

                discount = 0;

                appliedCoupon = false;

                saveCart();

                renderCart();

            }
        );

    }


    // ================= COUPON =================

    if (applyCouponBtn) {

        applyCouponBtn.addEventListener(
            "click",
            () => {

                const code =
                    couponCode
                        ? couponCode.value.trim().toUpperCase()
                        : "";


                if (!code) {

                    showCouponMessage(
                        "Please enter a coupon code.",
                        "error"
                    );

                    return;
                }


                if (appliedCoupon) {

                    showCouponMessage(
                        "A coupon is already applied.",
                        "error"
                    );

                    return;
                }


                const totals =
                    calculateTotals();


                // Demo coupon

                if (code === "SAVE100") {

                    if (totals.subtotal < 1000) {

                        showCouponMessage(
                            "Minimum order value is ₹1,000.",
                            "error"
                        );

                        return;
                    }


                    discount = 100;

                    appliedCoupon = true;


                    showCouponMessage(
                        "Coupon applied! You saved ₹100.",
                        "success"
                    );


                    renderCart();

                }


                // Demo coupon

                else if (code === "SAVE500") {

                    if (totals.subtotal < 5000) {

                        showCouponMessage(
                            "Minimum order value is ₹5,000.",
                            "error"
                        );

                        return;
                    }


                    discount = 500;

                    appliedCoupon = true;


                    showCouponMessage(
                        "Coupon applied! You saved ₹500.",
                        "success"
                    );


                    renderCart();

                }


                else {

                    showCouponMessage(
                        "Invalid coupon code.",
                        "error"
                    );

                }

            }
        );

    }


    // ================= COUPON MESSAGE =================

    function showCouponMessage(message, type) {

        if (!couponMessage) {
            return;
        }


        couponMessage.textContent =
            message;

        couponMessage.className =
            `coupon-message ${type}`;

    }


    // ================= CHECKOUT =================

    if (checkoutBtn) {

        checkoutBtn.addEventListener(
            "click",
            () => {

                if (cart.length === 0) {

                    alert(
                        "Your cart is empty."
                    );

                    return;
                }


                // Check login

                const currentUser =
                    localStorage.getItem("currentUser");


                if (!currentUser) {

                    const login =
                        confirm(
                            "Please login before checkout. Go to login page?"
                        );


                    if (login) {

                        window.location.href =
                            "login.html";

                    }

                    return;
                }


                // Save checkout summary

                const totals =
                    calculateTotals();


                const checkoutData = {

                    items: cart,

                    subtotal: totals.subtotal,

                    delivery: totals.delivery,

                    discount: totals.discount,

                    total: totals.total,

                    createdAt:
                        new Date().toISOString()

                };


                localStorage.setItem(
                    "checkoutData",
                    JSON.stringify(checkoutData)
                );


                window.location.href =
                    "checkout.html";

            }
        );

    }


    // ================= SEARCH =================

    const searchInput =
        document.getElementById("searchInput");

    const searchBtn =
        document.getElementById("searchBtn");


    function performSearch() {

        if (!searchInput) {
            return;
        }


        const query =
            searchInput.value.trim();


        if (!query) {
            return;
        }


        window.location.href =
            `products.html?search=${encodeURIComponent(query)}`;

    }


    if (searchBtn) {

        searchBtn.addEventListener(
            "click",
            performSearch
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    performSearch();

                }

            }
        );

    }


    // ================= INITIALIZE =================

    renderCart();

});