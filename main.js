// ================= MAIN.JS =================

document.addEventListener("DOMContentLoaded", () => {

    // ================= CART =================

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem("cart")) || [];
        } catch (error) {
            return [];
        }
    }


    function updateCartCount() {

        const cartCount =
            document.getElementById("cartCount");

        if (!cartCount) return;

        const cart = getCart();

        const count = cart.reduce(
            (total, item) =>
                total + (Number(item.quantity) || 1),
            0
        );

        cartCount.textContent = count;
    }


    // ================= AUTH =================

    function getCurrentUser() {

        try {
            return JSON.parse(
                localStorage.getItem("currentUser")
            );
        } catch (error) {
            return null;
        }
    }


    function updateUserUI() {

        const user = getCurrentUser();

        const userName =
            document.getElementById("userName");

        const loginLinks =
            document.querySelectorAll(
                'a[href="login.html"]'
            );


        if (user && userName) {
            userName.textContent =
                user.name || "User";
        }


        if (user) {

            loginLinks.forEach(link => {

                link.textContent = "Logout";

                link.href = "#";

                link.addEventListener(
                    "click",
                    (event) => {

                        event.preventDefault();

                        localStorage.removeItem(
                            "currentUser"
                        );

                        window.location.href =
                            "login.html";

                    }
                );

            });

        }

    }


    // ================= SEARCH =================

    const searchInput =
        document.getElementById("searchInput");

    const searchBtn =
        document.getElementById("searchBtn");


    function performSearch() {

        if (!searchInput) return;

        const query =
            searchInput.value.trim();

        if (!query) return;

        window.location.href =
            `pages/products.html?search=${encodeURIComponent(query)}`;

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


    // ================= MOBILE MENU =================

    const menuBtn =
        document.getElementById("menuBtn");

    const navbar =
        document.querySelector(".navbar");


    if (menuBtn && navbar) {

        menuBtn.addEventListener(
            "click",
            () => {

                navbar.classList.toggle(
                    "active"
                );

            }
        );

    }


    // ================= BACK TO TOP =================

    const backToTop =
        document.getElementById("backToTop");


    if (backToTop) {

        window.addEventListener(
            "scroll",
            () => {

                if (window.scrollY > 400) {

                    backToTop.classList.add(
                        "show"
                    );

                } else {

                    backToTop.classList.remove(
                        "show"
                    );

                }

            }
        );


        backToTop.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    // ================= NEWSLETTER =================

    const newsletterForm =
        document.getElementById("newsletterForm");


    if (newsletterForm) {

        newsletterForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();

                const emailInput =
                    newsletterForm.querySelector(
                        'input[type="email"]'
                    );

                if (!emailInput) return;

                const email =
                    emailInput.value.trim();


                if (!email) {

                    alert(
                        "Please enter your email address."
                    );

                    return;

                }


                alert(
                    "Thank you for subscribing!"
                );

                emailInput.value = "";

            }
        );

    }


    // ================= PRODUCT CATEGORY LINKS =================

    document
        .querySelectorAll("[data-category]")
        .forEach(element => {

            element.addEventListener(
                "click",
                () => {

                    const category =
                        element.dataset.category;

                    if (!category) return;

                    window.location.href =
                        `pages/products.html?category=${encodeURIComponent(category)}`;

                }
            );

        });


    // ================= ADD TO CART =================

    document
        .querySelectorAll(".add-to-cart")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const product = {

                        id:
                            button.dataset.id ||
                            Date.now(),

                        name:
                            button.dataset.name ||
                            "Product",

                        price:
                            Number(
                                button.dataset.price
                            ) || 0,

                        image:
                            button.dataset.image || "",

                        category:
                            button.dataset.category ||
                            "Product",

                        quantity: 1

                    };


                    const cart =
                        getCart();


                    const existingItem =
                        cart.find(
                            item =>
                                String(item.id) ===
                                String(product.id)
                        );


                    if (existingItem) {

                        existingItem.quantity =
                            (Number(
                                existingItem.quantity
                            ) || 1) + 1;

                    } else {

                        cart.push(product);

                    }


                    localStorage.setItem(
                        "cart",
                        JSON.stringify(cart)
                    );


                    updateCartCount();


                    button.textContent =
                        "✓ Added";


                    setTimeout(() => {

                        button.textContent =
                            "Add to Cart";

                    }, 1200);

                }
            );

        });


    // ================= WISHLIST =================

    document
        .querySelectorAll(".wishlist-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const product = {

                        id:
                            button.dataset.id,

                        name:
                            button.dataset.name,

                        price:
                            Number(
                                button.dataset.price
                            ) || 0,

                        image:
                            button.dataset.image || ""

                    };


                    let wishlist =
                        JSON.parse(
                            localStorage.getItem(
                                "wishlist"
                            )
                        ) || [];


                    const exists =
                        wishlist.some(
                            item =>
                                String(item.id) ===
                                String(product.id)
                        );


                    if (exists) {

                        wishlist =
                            wishlist.filter(
                                item =>
                                    String(item.id) !==
                                    String(product.id)
                            );

                        button.classList.remove(
                            "active"
                        );

                    } else {

                        wishlist.push(product);

                        button.classList.add(
                            "active"
                        );

                    }


                    localStorage.setItem(
                        "wishlist",
                        JSON.stringify(wishlist)
                    );

                }
            );

        });


    // ================= YEAR =================

    document
        .querySelectorAll("#currentYear")
        .forEach(element => {

            element.textContent =
                new Date().getFullYear();

        });


    // ================= INITIALIZE =================

    updateCartCount();

    updateUserUI();

});