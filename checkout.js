// ================= CHECKOUT.JS =================

document.addEventListener("DOMContentLoaded", () => {

    const addressList = document.getElementById("addressList");
    const addAddressBtn = document.getElementById("addAddressBtn");
    const newAddressForm = document.getElementById("newAddressForm");

    const saveAddressBtn = document.getElementById("saveAddressBtn");
    const cancelAddressBtn = document.getElementById("cancelAddressBtn");

    const checkoutItems = document.getElementById("checkoutItems");

    const itemsTotal = document.getElementById("itemsTotal");
    const deliveryCharge = document.getElementById("deliveryCharge");
    const orderTotal = document.getElementById("orderTotal");

    const continuePaymentBtn =
        document.getElementById("continuePaymentBtn");

    const couponCode =
        document.getElementById("couponCode");

    const applyCouponBtn =
        document.getElementById("applyCouponBtn");

    const couponMessage =
        document.getElementById("couponMessage");

    const cartCount =
        document.getElementById("cartCount");


    // ================= CART =================

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    // ================= CHECKOUT DATA =================

    let checkoutData =
        JSON.parse(
            localStorage.getItem("checkoutData")
        ) || null;


    // ================= DISCOUNT =================

    let discount =
        checkoutData?.discount || 0;


    let appliedCoupon =
        discount > 0;


    // ================= FORMAT PRICE =================

    function formatPrice(price) {

        return "₹" +
            Number(price).toLocaleString("en-IN");

    }


    // ================= UPDATE CART COUNT =================

    function updateCartCount() {

        const count =
            cart.reduce(
                (total, item) =>
                    total + (Number(item.quantity) || 1),
                0
            );


        if (cartCount) {
            cartCount.textContent = count;
        }

    }


    // ================= LOAD CHECKOUT ITEMS =================

    function loadCheckoutItems() {

        if (!checkoutItems) {
            return;
        }


        checkoutItems.innerHTML = "";


        if (cart.length === 0) {

            checkoutItems.innerHTML = `
                <div class="empty-checkout">
                    <p>Your cart is empty.</p>
                    <a href="products.html">
                        Continue Shopping
                    </a>
                </div>
            `;

            if (continuePaymentBtn) {
                continuePaymentBtn.disabled = true;
            }

            return;
        }


        cart.forEach(item => {

            const quantity =
                Number(item.quantity) || 1;

            const price =
                Number(item.price) || 0;

            const total =
                price * quantity;


            const element =
                document.createElement("div");

            element.className =
                "checkout-item";


            element.innerHTML = `

                <div class="checkout-item-image">

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


                <div class="checkout-item-info">

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

                    <p>
                        Quantity: ${quantity}
                    </p>

                </div>


                <strong>
                    ${formatPrice(total)}
                </strong>

            `;


            checkoutItems.appendChild(element);

        });

    }


    // ================= ESCAPE HTML =================

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            String(value);

        return div.innerHTML;

    }


    // ================= CALCULATE TOTALS =================

    function calculateTotals() {

        const subtotal =
            cart.reduce(
                (total, item) => {

                    const price =
                        Number(item.price) || 0;

                    const quantity =
                        Number(item.quantity) || 1;

                    return total + price * quantity;

                },
                0
            );


        const selectedDelivery =
            document.querySelector(
                'input[name="delivery"]:checked'
            );


        let delivery = 0;


        if (selectedDelivery) {

            if (
                selectedDelivery.value ===
                "express"
            ) {

                delivery = 99;

            } else {

                delivery =
                    subtotal >= 1000
                        ? 0
                        : 99;

            }

        } else {

            delivery =
                subtotal >= 1000
                    ? 0
                    : 99;

        }


        discount =
            Math.min(
                Number(discount) || 0,
                subtotal
            );


        const total =
            subtotal +
            delivery -
            discount;


        if (itemsTotal) {

            itemsTotal.textContent =
                formatPrice(subtotal);

        }


        if (deliveryCharge) {

            deliveryCharge.textContent =
                delivery === 0
                    ? "FREE"
                    : formatPrice(delivery);

        }


        if (orderTotal) {

            orderTotal.textContent =
                formatPrice(total);

        }


        return {
            subtotal,
            delivery,
            discount,
            total
        };

    }


    // ================= DELIVERY EVENTS =================

    document
        .querySelectorAll(
            'input[name="delivery"]'
        )
        .forEach(option => {

            option.addEventListener(
                "change",
                calculateTotals
            );

        });


    // ================= ADD ADDRESS =================

    if (addAddressBtn) {

        addAddressBtn.addEventListener(
            "click",
            () => {

                newAddressForm.style.display =
                    "block";

                newAddressForm.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }
        );

    }


    // ================= CANCEL ADDRESS =================

    if (cancelAddressBtn) {

        cancelAddressBtn.addEventListener(
            "click",
            () => {

                newAddressForm.style.display =
                    "none";

                clearAddressForm();

            }
        );

    }


    // ================= SAVE ADDRESS =================

    if (saveAddressBtn) {

        saveAddressBtn.addEventListener(
            "click",
            () => {

                const addressName =
                    document
                        .getElementById("addressName")
                        ?.value.trim();

                const fullName =
                    document
                        .getElementById("fullName")
                        ?.value.trim();

                const addressLine =
                    document
                        .getElementById("addressLine")
                        ?.value.trim();

                const city =
                    document
                        .getElementById("city")
                        ?.value.trim();

                const state =
                    document
                        .getElementById("state")
                        ?.value.trim();

                const pincode =
                    document
                        .getElementById("pincode")
                        ?.value.trim();

                const phone =
                    document
                        .getElementById("phone")
                        ?.value.trim();


                if (
                    !addressName ||
                    !fullName ||
                    !addressLine ||
                    !city ||
                    !state ||
                    !pincode ||
                    !phone
                ) {

                    alert(
                        "Please fill in all address fields."
                    );

                    return;

                }


                if (!/^\d{6}$/.test(pincode)) {

                    alert(
                        "Please enter a valid 6-digit PIN code."
                    );

                    return;

                }


                if (
                    !/^\d{10}$/.test(
                        phone.replace(/\D/g, "")
                    )
                ) {

                    alert(
                        "Please enter a valid 10-digit phone number."
                    );

                    return;

                }


                const addressId =
                    "address-" + Date.now();


                const addressElement =
                    document.createElement("label");

                addressElement.className =
                    "address-option";


                addressElement.innerHTML = `

                    <input
                        type="radio"
                        name="address"
                        value="${addressId}"
                        checked
                    >

                    <div class="address-content">

                        <div class="address-title">

                            <strong>
                                ${escapeHTML(addressName)}
                            </strong>

                            <span>
                                New
                            </span>

                        </div>

                        <p>
                            ${escapeHTML(fullName)}
                        </p>

                        <p>
                            ${escapeHTML(addressLine)}
                        </p>

                        <p>
                            ${escapeHTML(city)},
                            ${escapeHTML(state)}
                            - ${escapeHTML(pincode)}
                        </p>

                        <p>
                            Phone: ${escapeHTML(phone)}
                        </p>

                    </div>

                `;


                if (addressList) {

                    addressList.appendChild(
                        addressElement
                    );

                }


                // Save address

                const addresses =
                    JSON.parse(
                        localStorage.getItem("addresses")
                    ) || [];


                addresses.push({

                    id: addressId,

                    name: addressName,

                    fullName,

                    address: addressLine,

                    city,

                    state,

                    pincode,

                    phone

                });


                localStorage.setItem(
                    "addresses",
                    JSON.stringify(addresses)
                );


                newAddressForm.style.display =
                    "none";


                clearAddressForm();

            }
        );

    }


    // ================= CLEAR ADDRESS FORM =================

    function clearAddressForm() {

        const fields = [
            "addressName",
            "fullName",
            "addressLine",
            "city",
            "state",
            "pincode",
            "phone"
        ];


        fields.forEach(id => {

            const field =
                document.getElementById(id);

            if (field) {
                field.value = "";
            }

        });

    }


    // ================= LOAD SAVED ADDRESSES =================

    function loadSavedAddresses() {

        if (!addressList) {
            return;
        }


        const addresses =
            JSON.parse(
                localStorage.getItem("addresses")
            ) || [];


        addresses.forEach(address => {

            const exists =
                addressList.querySelector(
                    `input[value="${address.id}"]`
                );


            if (exists) {
                return;
            }


            const element =
                document.createElement("label");

            element.className =
                "address-option";


            element.innerHTML = `

                <input
                    type="radio"
                    name="address"
                    value="${escapeHTML(address.id)}"
                >

                <div class="address-content">

                    <div class="address-title">

                        <strong>
                            ${escapeHTML(address.name)}
                        </strong>

                    </div>

                    <p>
                        ${escapeHTML(address.fullName)}
                    </p>

                    <p>
                        ${escapeHTML(address.address)}
                    </p>

                    <p>
                        ${escapeHTML(address.city)},
                        ${escapeHTML(address.state)}
                        - ${escapeHTML(address.pincode)}
                    </p>

                    <p>
                        Phone: ${escapeHTML(address.phone)}
                    </p>

                </div>

            `;


            addressList.appendChild(element);

        });

    }


    // ================= APPLY COUPON =================

    if (applyCouponBtn) {

        applyCouponBtn.addEventListener(
            "click",
            () => {

                const code =
                    couponCode
                        ? couponCode.value
                            .trim()
                            .toUpperCase()
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
                        "A coupon has already been applied.",
                        "error"
                    );

                    return;

                }


                const totals =
                    calculateTotals();


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


                    calculateTotals();

                }


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


                    calculateTotals();

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

    function showCouponMessage(
        message,
        type
    ) {

        if (!couponMessage) {
            return;
        }


        couponMessage.textContent =
            message;

        couponMessage.className =
            `coupon-message ${type}`;

    }


    // ================= CONTINUE TO PAYMENT =================

    if (continuePaymentBtn) {

        continuePaymentBtn.addEventListener(
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
                    localStorage.getItem(
                        "currentUser"
                    );


                if (!currentUser) {

                    alert(
                        "Please login before continuing."
                    );

                    window.location.href =
                        "login.html";

                    return;

                }


                // Check address

                const selectedAddress =
                    document.querySelector(
                        'input[name="address"]:checked'
                    );


                if (!selectedAddress) {

                    alert(
                        "Please select a delivery address."
                    );

                    return;

                }


                const totals =
                    calculateTotals();


                const checkoutInfo = {

                    items: cart,

                    address:
                        selectedAddress.value,

                    subtotal:
                        totals.subtotal,

                    delivery:
                        totals.delivery,

                    discount:
                        totals.discount,

                    total:
                        totals.total,

                    createdAt:
                        new Date().toISOString()

                };


                localStorage.setItem(
                    "checkoutData",
                    JSON.stringify(
                        checkoutInfo
                    )
                );


                window.location.href =
                    "payment.html";

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
            event => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    performSearch();

                }

            }
        );

    }


    // ================= INITIALIZE =================

    loadSavedAddresses();

    loadCheckoutItems();

    updateCartCount();

    calculateTotals();

});