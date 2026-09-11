// ================= ORDERS.JS =================

document.addEventListener("DOMContentLoaded", () => {

    const ordersContainer =
        document.getElementById("ordersContainer");

    const emptyOrders =
        document.getElementById("emptyOrders");

    const orderCount =
        document.getElementById("orderCount");

    const cartCount =
        document.getElementById("cartCount");


    // ================= LOAD ORDERS =================

    function getOrders() {

        try {

            return JSON.parse(
                localStorage.getItem("orders")
            ) || [];

        } catch (error) {

            return [];

        }

    }


    // ================= CURRENT USER =================

    function getCurrentUser() {

        try {

            return JSON.parse(
                localStorage.getItem("currentUser")
            );

        } catch (error) {

            return null;

        }

    }


    // ================= FORMAT PRICE =================

    function formatPrice(price) {

        return "₹" +
            Number(price || 0)
                .toLocaleString("en-IN");

    }


    // ================= FORMAT DATE =================

    function formatDate(date) {

        const orderDate =
            new Date(date);

        if (isNaN(orderDate.getTime())) {
            return "Date unavailable";
        }

        return orderDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    }


    // ================= ESCAPE HTML =================

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            String(value ?? "");

        return div.innerHTML;

    }


    // ================= UPDATE CART COUNT =================

    function updateCartCount() {

        if (!cartCount) return;

        let cart = [];

        try {

            cart =
                JSON.parse(
                    localStorage.getItem("cart")
                ) || [];

        } catch (error) {

            cart = [];

        }


        const count =
            cart.reduce(
                (total, item) =>
                    total +
                    (Number(item.quantity) || 1),
                0
            );


        cartCount.textContent =
            count;

    }


    // ================= ORDER STATUS =================

    function getStatusClass(status) {

        return String(status || "Processing")
            .toLowerCase()
            .replace(/\s+/g, "-");

    }


    // ================= STATUS STEPS =================

    function getStatusSteps(status) {

        const statuses = [
            "Processing",
            "Confirmed",
            "Shipped",
            "Delivered"
        ];

        let currentIndex =
            statuses.indexOf(status);

        if (currentIndex === -1) {
            currentIndex = 0;
        }


        return statuses
            .map((step, index) => {

                const completed =
                    index <= currentIndex
                        ? "completed"
                        : "";

                return `
                    <div class="status-step ${completed}">

                        <div class="status-dot">
                            ${index <= currentIndex ? "✓" : ""}
                        </div>

                        <span>
                            ${step}
                        </span>

                    </div>
                `;

            })
            .join("");

    }


    // ================= RENDER ORDERS =================

    function renderOrders() {

        if (!ordersContainer) {
            return;
        }


        let orders =
            getOrders();


        // Newest orders first

        orders.sort(
            (a, b) =>
                new Date(b.createdAt || 0) -
                new Date(a.createdAt || 0)
        );


        // Filter orders for current user

        const currentUser =
            getCurrentUser();


        if (currentUser) {

            orders =
                orders.filter(order => {

                    if (!order.userId) {
                        return true;
                    }

                    return String(order.userId) ===
                        String(currentUser.id);

                });

        }


        if (orderCount) {

            orderCount.textContent =
                orders.length;

        }


        if (orders.length === 0) {

            ordersContainer.innerHTML = "";


            if (emptyOrders) {

                emptyOrders.style.display =
                    "block";

            }

            return;

        }


        if (emptyOrders) {

            emptyOrders.style.display =
                "none";

        }


        ordersContainer.innerHTML = "";


        orders.forEach(order => {

            const orderElement =
                document.createElement("div");

            orderElement.className =
                "order-card";


            const orderId =
                order.orderId ||
                order.id ||
                "ORDER-" +
                Date.now();


            const status =
                order.status ||
                "Processing";


            const items =
                Array.isArray(order.items)
                    ? order.items
                    : [];


            const total =
                Number(order.total) ||
                items.reduce(
                    (sum, item) =>
                        sum +
                        (
                            Number(item.price) || 0
                        ) *
                        (
                            Number(item.quantity) || 1
                        ),
                    0
                );


            const itemCount =
                items.reduce(
                    (sum, item) =>
                        sum +
                        (
                            Number(item.quantity) || 1
                        ),
                    0
                );


            let itemsHTML = "";


            if (items.length > 0) {

                itemsHTML =
                    items
                        .map(item => {

                            const quantity =
                                Number(item.quantity) || 1;

                            const price =
                                Number(item.price) || 0;


                            return `
                                <div class="ordered-item">

                                    <div class="ordered-item-image">

                                        ${
                                            item.image
                                                ? `
                                                    <img
                                                        src="${escapeHTML(item.image)}"
                                                        alt="${escapeHTML(item.name || "Product")}"
                                                    >
                                                  `
                                                : `
                                                    <span>
                                                        ${item.icon || "🛍️"}
                                                    </span>
                                                  `
                                        }

                                    </div>


                                    <div class="ordered-item-info">

                                        <h4>
                                            ${escapeHTML(
                                                item.name ||
                                                "Product"
                                            )}
                                        </h4>

                                        <p>
                                            Qty:
                                            ${quantity}
                                        </p>

                                    </div>


                                    <strong>
                                        ${formatPrice(
                                            price * quantity
                                        )}
                                    </strong>

                                </div>
                            `;

                        })
                        .join("");

            } else {

                itemsHTML = `
                    <p class="no-items">
                        Product information unavailable.
                    </p>
                `;

            }


            orderElement.innerHTML = `

                <!-- Order Header -->

                <div class="order-header">

                    <div>

                        <span class="order-label">
                            Order ID
                        </span>

                        <h3>
                            ${escapeHTML(orderId)}
                        </h3>

                    </div>


                    <div class="order-date">

                        <span>
                            Ordered on
                        </span>

                        <strong>
                            ${formatDate(
                                order.createdAt
                            )}
                        </strong>

                    </div>


                    <div class="order-status ${getStatusClass(status)}">

                        ${escapeHTML(status)}

                    </div>

                </div>


                <!-- Status Tracker -->

                <div class="order-tracker">

                    ${getStatusSteps(status)}

                </div>


                <!-- Products -->

                <div class="ordered-items">

                    <h3>
                        Items
                        (${itemCount})
                    </h3>

                    ${itemsHTML}

                </div>


                <!-- Order Summary -->

                <div class="order-summary">

                    <div class="summary-row">

                        <span>
                            Subtotal
                        </span>

                        <span>
                            ${formatPrice(
                                order.subtotal ||
                                total
                            )}
                        </span>

                    </div>


                    <div class="summary-row">

                        <span>
                            Delivery
                        </span>

                        <span>

                            ${
                                Number(order.delivery) === 0
                                    ? "FREE"
                                    : formatPrice(
                                        order.delivery || 0
                                    )
                            }

                        </span>

                    </div>


                    ${
                        Number(order.discount) > 0
                            ? `
                                <div class="summary-row discount-row">

                                    <span>
                                        Discount
                                    </span>

                                    <span>
                                        -${formatPrice(
                                            order.discount
                                        )}
                                    </span>

                                </div>
                              `
                            : ""
                    }


                    <div class="summary-row total-row">

                        <strong>
                            Total
                        </strong>

                        <strong>
                            ${formatPrice(total)}
                        </strong>

                    </div>

                </div>


                <!-- Actions -->

                <div class="order-actions">

                    <button
                        type="button"
                        class="view-order-btn"
                        data-order-id="${escapeHTML(orderId)}"
                    >
                        View Details
                    </button>


                    ${
                        status !== "Delivered"
                            ? `
                                <button
                                    type="button"
                                    class="track-order-btn"
                                    data-order-id="${escapeHTML(orderId)}"
                                >
                                    Track Order
                                </button>
                              `
                            : `
                                <button
                                    type="button"
                                    class="buy-again-btn"
                                    data-order-id="${escapeHTML(orderId)}"
                                >
                                    Buy Again
                                </button>
                              `
                    }

                </div>

            `;


            ordersContainer.appendChild(
                orderElement
            );

        });

    }


    // ================= VIEW ORDER =================

    if (ordersContainer) {

        ordersContainer.addEventListener(
            "click",
            event => {

                const viewButton =
                    event.target.closest(
                        ".view-order-btn"
                    );


                const trackButton =
                    event.target.closest(
                        ".track-order-btn"
                    );


                const buyAgainButton =
                    event.target.closest(
                        ".buy-again-btn"
                    );


                if (
                    viewButton ||
                    trackButton ||
                    buyAgainButton
                ) {

                    const button =
                        viewButton ||
                        trackButton ||
                        buyAgainButton;


                    const orderId =
                        button.dataset.orderId;


                    const orders =
                        getOrders();


                    const order =
                        orders.find(
                            item =>
                                String(
                                    item.orderId ||
                                    item.id
                                ) ===
                                String(orderId)
                        );


                    if (!order) {
                        return;
                    }


                    // Buy again

                    if (buyAgainButton) {

                        addOrderItemsToCart(
                            order.items || []
                        );

                        alert(
                            "Items have been added to your cart."
                        );

                        updateCartCount();

                        return;

                    }


                    // Track order

                    if (trackButton) {

                        showOrderMessage(
                            order
                        );

                        return;

                    }


                    // View details

                    showOrderMessage(
                        order
                    );

                }

            }
        );

    }


    // ================= ADD ORDER ITEMS TO CART =================

    function addOrderItemsToCart(items) {

        let cart = [];

        try {

            cart =
                JSON.parse(
                    localStorage.getItem("cart")
                ) || [];

        } catch (error) {

            cart = [];

        }


        items.forEach(item => {

            const existing =
                cart.find(
                    cartItem =>
                        String(cartItem.id) ===
                        String(item.id)
                );


            if (existing) {

                existing.quantity =
                    (
                        Number(existing.quantity) || 1
                    ) +
                    (
                        Number(item.quantity) || 1
                    );

            } else {

                cart.push({
                    ...item,
                    quantity:
                        Number(item.quantity) || 1
                });

            }

        });


        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

    }


    // ================= ORDER DETAILS =================

    function showOrderMessage(order) {

        const orderId =
            order.orderId ||
            order.id ||
            "Order";


        const status =
            order.status ||
            "Processing";


        const deliveryDate =
            order.expectedDelivery ||
            order.deliveryDate;


        let message =
            `Order: ${orderId}\n\n` +
            `Status: ${status}`;


        if (deliveryDate) {

            message +=
                `\nExpected delivery: ${
                    formatDate(deliveryDate)
                }`;

        }


        alert(message);

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

    updateCartCount();

    renderOrders();

});