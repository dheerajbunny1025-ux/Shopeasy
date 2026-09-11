// ================= PAYMENTS.JS =================

document.addEventListener("DOMContentLoaded", () => {

    const paymentForm =
        document.getElementById("paymentForm");

    const paymentMethods =
        document.querySelectorAll(
            'input[name="paymentMethod"]'
        );

    const cardSection =
        document.getElementById("cardPayment");

    const upiSection =
        document.getElementById("upiPayment");

    const codSection =
        document.getElementById("codPayment");

    const paymentAmount =
        document.getElementById("paymentAmount");

    const payButton =
        document.getElementById("payButton");

    const orderSummary =
        document.getElementById("orderSummary");


    // ================= CHECKOUT DATA =================

    let checkoutData = null;

    try {

        checkoutData =
            JSON.parse(
                localStorage.getItem("checkoutData")
            );

    } catch (error) {

        checkoutData = null;

    }


    // ================= CART =================

    let cart = [];

    try {

        cart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];

    } catch (error) {

        cart = [];

    }


    // ================= FORMAT PRICE =================

    function formatPrice(price) {

        return "₹" +
            Number(price || 0)
                .toLocaleString("en-IN");

    }


    // ================= DISPLAY TOTAL =================

    const total =
        Number(
            checkoutData?.total
        ) ||
        cart.reduce(
            (sum, item) =>
                sum +
                (Number(item.price) || 0) *
                (Number(item.quantity) || 1),
            0
        );


    if (paymentAmount) {

        paymentAmount.textContent =
            formatPrice(total);

    }


    if (orderSummary) {

        orderSummary.textContent =
            `Total Payable: ${formatPrice(total)}`;

    }


    // ================= PAYMENT METHOD =================

    function updatePaymentMethod() {

        const selected =
            document.querySelector(
                'input[name="paymentMethod"]:checked'
            );


        const method =
            selected
                ? selected.value
                : "card";


        if (cardSection) {

            cardSection.style.display =
                method === "card"
                    ? "block"
                    : "none";

        }


        if (upiSection) {

            upiSection.style.display =
                method === "upi"
                    ? "block"
                    : "none";

        }


        if (codSection) {

            codSection.style.display =
                method === "cod"
                    ? "block"
                    : "none";

        }


        if (payButton) {

            if (method === "cod") {

                payButton.textContent =
                    "Place Order";

            } else {

                payButton.textContent =
                    `Pay ${formatPrice(total)}`;

            }

        }

    }


    paymentMethods.forEach(method => {

        method.addEventListener(
            "change",
            updatePaymentMethod
        );

    });


    // ================= CARD NUMBER =================

    const cardNumber =
        document.getElementById("cardNumber");


    if (cardNumber) {

        cardNumber.addEventListener(
            "input",
            () => {

                let value =
                    cardNumber.value
                        .replace(/\D/g, "")
                        .slice(0, 16);


                value =
                    value.replace(
                        /(.{4})/g,
                        "$1 "
                    )
                    .trim();


                cardNumber.value =
                    value;

            }
        );

    }


    // ================= EXPIRY DATE =================

    const expiryDate =
        document.getElementById("expiryDate");


    if (expiryDate) {

        expiryDate.addEventListener(
            "input",
            () => {

                let value =
                    expiryDate.value
                        .replace(/\D/g, "")
                        .slice(0, 4);


                if (value.length >= 3) {

                    value =
                        value.slice(0, 2) +
                        "/" +
                        value.slice(2);

                }


                expiryDate.value =
                    value;

            }
        );

    }


    // ================= CVV =================

    const cvv =
        document.getElementById("cvv");


    if (cvv) {

        cvv.addEventListener(
            "input",
            () => {

                cvv.value =
                    cvv.value
                        .replace(/\D/g, "")
                        .slice(0, 3);

            }
        );

    }


    // ================= UPI ID =================

    const upiId =
        document.getElementById("upiId");


    // ================= VALIDATE CARD =================

    function validateCard() {

        const number =
            cardNumber
                ? cardNumber.value.replace(/\s/g, "")
                : "";

        const expiry =
            expiryDate
                ? expiryDate.value.trim()
                : "";

        const cvvValue =
            cvv
                ? cvv.value.trim()
                : "";


        if (!/^\d{16}$/.test(number)) {

            alert(
                "Please enter a valid 16-digit card number."
            );

            return false;

        }


        if (!/^\d{2}\/\d{2}$/.test(expiry)) {

            alert(
                "Please enter a valid expiry date (MM/YY)."
            );

            return false;

        }


        if (!/^\d{3}$/.test(cvvValue)) {

            alert(
                "Please enter a valid 3-digit CVV."
            );

            return false;

        }


        return true;

    }


    // ================= VALIDATE UPI =================

    function validateUPI() {

        const value =
            upiId
                ? upiId.value.trim()
                : "";


        if (!value) {

            alert(
                "Please enter your UPI ID."
            );

            return false;

        }


        if (!/^[\w.-]+@[\w.-]+$/.test(value)) {

            alert(
                "Please enter a valid UPI ID."
            );

            return false;

        }


        return true;

    }


    // ================= GENERATE ORDER ID =================

    function generateOrderId() {

        const random =
            Math.floor(
                100000 +
                Math.random() * 900000
            );


        return "SE-" +
            new Date()
                .getFullYear() +
            "-" +
            random;

    }


    // ================= PLACE ORDER =================

    function placeOrder(paymentMethod) {

        const currentUser =
            JSON.parse(
                localStorage.getItem(
                    "currentUser"
                )
            );


        const order = {

            orderId:
                generateOrderId(),

            userId:
                currentUser?.id || null,

            customerName:
                currentUser?.name || "Guest",

            items:
                checkoutData?.items ||
                cart,

            subtotal:
                Number(
                    checkoutData?.subtotal
                ) || total,

            delivery:
                Number(
                    checkoutData?.delivery
                ) || 0,

            discount:
                Number(
                    checkoutData?.discount
                ) || 0,

            total:
                total,

            paymentMethod:
                paymentMethod,

            paymentStatus:
                paymentMethod === "cod"
                    ? "Pending"
                    : "Paid",

            status:
                "Confirmed",

            createdAt:
                new Date().toISOString(),

            expectedDelivery:
                new Date(
                    Date.now() +
                    5 * 24 * 60 * 60 * 1000
                ).toISOString()

        };


        // Get previous orders

        let orders = [];

        try {

            orders =
                JSON.parse(
                    localStorage.getItem(
                        "orders"
                    )
                ) || [];

        } catch (error) {

            orders = [];

        }


        orders.push(order);


        localStorage.setItem(
            "orders",
            JSON.stringify(orders)
        );


        // Save latest order

        localStorage.setItem(
            "latestOrder",
            JSON.stringify(order)
        );


        // Clear cart

        localStorage.removeItem("cart");

        localStorage.removeItem(
            "checkoutData"
        );


        return order;

    }


    // ================= PAYMENT SUBMIT =================

    if (paymentForm) {

        paymentForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const selected =
                    document.querySelector(
                        'input[name="paymentMethod"]:checked'
                    );


                if (!selected) {

                    alert(
                        "Please select a payment method."
                    );

                    return;

                }


                const method =
                    selected.value;


                // CARD

                if (method === "card") {

                    if (!validateCard()) {
                        return;
                    }

                }


                // UPI

                if (method === "upi") {

                    if (!validateUPI()) {
                        return;
                    }

                }


                // Prevent empty orders

                if (
                    !checkoutData &&
                    cart.length === 0
                ) {

                    alert(
                        "No items available for payment."
                    );

                    window.location.href =
                        "products.html";

                    return;

                }


                // Disable button

                if (payButton) {

                    payButton.disabled =
                        true;

                    payButton.textContent =
                        "Processing...";

                }


                // Demo payment processing

                setTimeout(
                    () => {

                        const order =
                            placeOrder(method);


                        alert(
                            method === "cod"
                                ? "Order placed successfully!"
                                : "Payment successful! Order placed successfully!"
                        );


                        window.location.href =
                            `orders.html?orderId=${encodeURIComponent(
                                order.orderId
                            )}`;

                    },
                    1200
                );

            }
        );

    }


    // ================= BACK TO CHECKOUT =================

    const backButton =
        document.getElementById(
            "backToCheckout"
        );


    if (backButton) {

        backButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "checkout.html";

            }
        );

    }


    // ================= CART COUNT =================

    const cartCount =
        document.getElementById("cartCount");


    if (cartCount) {

        cartCount.textContent =
            cart.reduce(
                (total, item) =>
                    total +
                    (Number(item.quantity) || 1),
                0
            );

    }


    // ================= INITIALIZE =================

    updatePaymentMethod();

});