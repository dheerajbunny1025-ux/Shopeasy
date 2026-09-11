// ================= PRODUCTS.JS =================

document.addEventListener("DOMContentLoaded", () => {

    const productsGrid =
        document.getElementById("productsGrid");

    const searchInput =
        document.getElementById("searchInput");

    const searchBtn =
        document.getElementById("searchBtn");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const sortFilter =
        document.getElementById("sortFilter");

    const priceFilter =
        document.getElementById("priceFilter");

    const cartCount =
        document.getElementById("cartCount");


    // ================= PRODUCT DATA =================

    const products = [

        {
            id: 1,
            name: "Premium Smartphone",
            price: 29999,
            category: "Phones",
            image: "../images/phone1.jpg",
            rating: 4.5,
            stock: 15,
            description: "Powerful smartphone with excellent performance and camera."
        },

        {
            id: 2,
            name: "Budget Smartphone",
            price: 14999,
            category: "Phones",
            image: "../images/phone2.jpg",
            rating: 4.2,
            stock: 25,
            description: "Affordable smartphone for everyday use."
        },

        {
            id: 3,
            name: "Gaming Laptop",
            price: 74999,
            category: "Laptops",
            image: "../images/laptop1.jpg",
            rating: 4.7,
            stock: 8,
            description: "High-performance laptop for gaming and demanding applications."
        },

        {
            id: 4,
            name: "Student Laptop",
            price: 45999,
            category: "Laptops",
            image: "../images/laptop2.jpg",
            rating: 4.4,
            stock: 18,
            description: "Lightweight laptop for students and everyday work."
        },

        {
            id: 5,
            name: "Wireless Headphones",
            price: 2999,
            category: "Accessories",
            image: "../images/headphones.jpg",
            rating: 4.3,
            stock: 30,
            description: "Comfortable wireless headphones with clear sound."
        },

        {
            id: 6,
            name: "Smart Watch",
            price: 4999,
            category: "Accessories",
            image: "../images/watch.jpg",
            rating: 4.4,
            stock: 20,
            description: "Smart watch with fitness and notification features."
        },

        {
            id: 7,
            name: "Casual T-Shirt",
            price: 799,
            category: "Clothes",
            image: "../images/tshirt.jpg",
            rating: 4.1,
            stock: 50,
            description: "Comfortable casual T-shirt for everyday wear."
        },

        {
            id: 8,
            name: "Classic Jeans",
            price: 1499,
            category: "Clothes",
            image: "../images/jeans.jpg",
            rating: 4.3,
            stock: 35,
            description: "Classic jeans suitable for everyday casual wear."
        },

        {
            id: 9,
            name: "Fast Charger",
            price: 1299,
            category: "Accessories",
            image: "../images/charger.jpg",
            rating: 4.5,
            stock: 40,
            description: "Fast charging adapter for compatible devices."
        },

        {
            id: 10,
            name: "Bluetooth Speaker",
            price: 2499,
            category: "Accessories",
            image: "../images/speaker.jpg",
            rating: 4.4,
            stock: 22,
            description: "Portable Bluetooth speaker with powerful audio."
        },

        {
            id: 11,
            name: "Premium Hoodie",
            price: 1999,
            category: "Clothes",
            image: "../images/hoodie.jpg",
            rating: 4.5,
            stock: 28,
            description: "Comfortable hoodie suitable for casual wear."
        },

        {
            id: 12,
            name: "Business Laptop",
            price: 62999,
            category: "Laptops",
            image: "../images/laptop3.jpg",
            rating: 4.6,
            stock: 12,
            description: "Reliable laptop designed for productivity and business."
        }

    ];


    // ================= URL PARAMETERS =================

    const params =
        new URLSearchParams(
            window.location.search
        );

    let searchQuery =
        params.get("search") || "";

    let categoryQuery =
        params.get("category") || "";


    // ================= FORMAT PRICE =================

    function formatPrice(price) {

        return "₹" +
            Number(price || 0)
                .toLocaleString("en-IN");

    }


    // ================= ESCAPE HTML =================

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            String(value ?? "");

        return div.innerHTML;

    }


    // ================= RATING =================

    function createRating(rating) {

        const fullStars =
            Math.floor(rating);

        const halfStar =
            rating % 1 >= 0.5;

        let stars = "";

        for (
            let i = 0;
            i < fullStars;
            i++
        ) {
            stars += "★";
        }

        if (halfStar) {
            stars += "½";
        }

        while (stars.length < 5) {
            stars += "☆";
        }

        return `
            <span class="stars">
                ${stars}
            </span>

            <span class="rating-value">
                ${rating}
            </span>
        `;

    }


    // ================= CART =================

    function getCart() {

        try {

            return JSON.parse(
                localStorage.getItem("cart")
            ) || [];

        } catch (error) {

            return [];

        }

    }


    function saveCart(cart) {

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

    }


    function updateCartCount() {

        if (!cartCount) {
            return;
        }

        const cart =
            getCart();

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


    // ================= ADD TO CART =================

    function addToCart(product) {

        if (product.stock <= 0) {

            alert(
                "This product is out of stock."
            );

            return;

        }


        const cart =
            getCart();


        const existingItem =
            cart.find(
                item =>
                    String(item.id) ===
                    String(product.id)
            );


        if (existingItem) {

            const currentQuantity =
                Number(
                    existingItem.quantity
                ) || 1;


            if (
                currentQuantity >=
                product.stock
            ) {

                alert(
                    "Maximum available quantity reached."
                );

                return;

            }


            existingItem.quantity =
                currentQuantity + 1;

        } else {

            cart.push({

                id: product.id,

                name: product.name,

                price: product.price,

                category: product.category,

                image: product.image,

                rating: product.rating,

                quantity: 1

            });

        }


        saveCart(cart);

        updateCartCount();

    }


    // ================= WISHLIST =================

    function getWishlist() {

        try {

            return JSON.parse(
                localStorage.getItem("wishlist")
            ) || [];

        } catch (error) {

            return [];

        }

    }


    function toggleWishlist(product) {

        let wishlist =
            getWishlist();


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

        } else {

            wishlist.push({

                id: product.id,

                name: product.name,

                price: product.price,

                category: product.category,

                image: product.image

            });

        }


        localStorage.setItem(
            "wishlist",
            JSON.stringify(wishlist)
        );

        return !exists;

    }


    // ================= FILTER PRODUCTS =================

    function getFilteredProducts() {

        let result =
            [...products];


        const search =
            searchQuery
                .trim()
                .toLowerCase();


        const category =
            categoryQuery
                .trim()
                .toLowerCase();


        // Search

        if (search) {

            result =
                result.filter(product => {

                    return (

                        product.name
                            .toLowerCase()
                            .includes(search)

                        ||

                        product.category
                            .toLowerCase()
                            .includes(search)

                        ||

                        product.description
                            .toLowerCase()
                            .includes(search)

                    );

                });

        }


        // Category

        if (
            category &&
            category !== "all"
        ) {

            result =
                result.filter(
                    product =>
                        product.category
                            .toLowerCase() ===
                        category
                );

        }


        // Price

        const price =
            priceFilter
                ? priceFilter.value
                : "all";


        if (price !== "all") {

            result =
                result.filter(product => {

                    if (price === "under1000") {
                        return product.price < 1000;
                    }

                    if (price === "1000-5000") {
                        return (
                            product.price >= 1000 &&
                            product.price <= 5000
                        );
                    }

                    if (price === "5000-20000") {
                        return (
                            product.price > 5000 &&
                            product.price <= 20000
                        );
                    }

                    if (price === "above20000") {
                        return product.price > 20000;
                    }

                    return true;

                });

        }


        // Sort

        const sort =
            sortFilter
                ? sortFilter.value
                : "default";


        if (sort === "price-low") {

            result.sort(
                (a, b) =>
                    a.price - b.price
            );

        }


        if (sort === "price-high") {

            result.sort(
                (a, b) =>
                    b.price - a.price
            );

        }


        if (sort === "rating") {

            result.sort(
                (a, b) =>
                    b.rating - a.rating
            );

        }


        if (sort === "name") {

            result.sort(
                (a, b) =>
                    a.name.localeCompare(
                        b.name
                    )
            );

        }


        return result;

    }


    // ================= RENDER PRODUCTS =================

    function renderProducts() {

        if (!productsGrid) {
            return;
        }


        const filteredProducts =
            getFilteredProducts();


        productsGrid.innerHTML = "";


        if (filteredProducts.length === 0) {

            productsGrid.innerHTML = `

                <div class="no-products">

                    <h2>
                        No Products Found
                    </h2>

                    <p>
                        Try another search or category.
                    </p>

                    <button
                        type="button"
                        id="clearFiltersBtn"
                    >
                        Clear Filters
                    </button>

                </div>

            `;


            const clearButton =
                document.getElementById(
                    "clearFiltersBtn"
                );


            if (clearButton) {

                clearButton.addEventListener(
                    "click",
                    clearFilters
                );

            }

            return;

        }


        const wishlist =
            getWishlist();


        filteredProducts.forEach(product => {

            const isWishlisted =
                wishlist.some(
                    item =>
                        String(item.id) ===
                        String(product.id)
                );


            const card =
                document.createElement("div");

            card.className =
                "product-card";


            card.innerHTML = `

                <div class="product-image-wrapper">

                    <a
                        href="product-details.html?id=${product.id}"
                        class="product-image-link"
                    >

                        ${
                            product.image
                                ? `
                                    <img
                                        src="${escapeHTML(product.image)}"
                                        alt="${escapeHTML(product.name)}"
                                        class="product-image"
                                    >
                                  `
                                : `
                                    <div class="product-placeholder">
                                        🛍️
                                    </div>
                                  `
                        }

                    </a>


                    <button
                        type="button"
                        class="wishlist-btn ${
                            isWishlisted
                                ? "active"
                                : ""
                        }"
                        data-id="${product.id}"
                        title="Wishlist"
                    >
                        ${
                            isWishlisted
                                ? "♥"
                                : "♡"
                        }
                    </button>

                </div>


                <div class="product-info">

                    <span class="product-category">

                        ${escapeHTML(
                            product.category
                        )}

                    </span>


                    <h3 class="product-title">

                        <a
                            href="product-details.html?id=${product.id}"
                        >
                            ${escapeHTML(
                                product.name
                            )}
                        </a>

                    </h3>


                    <div class="product-rating">

                        ${createRating(
                            product.rating
                        )}

                    </div>


                    <p class="product-description">

                        ${escapeHTML(
                            product.description
                        )}

                    </p>


                    <div class="product-price">

                        ${formatPrice(
                            product.price
                        )}

                    </div>


                    <div class="stock-info">

                        ${
                            product.stock > 0
                                ? `✓ ${product.stock} in stock`
                                : "Out of Stock"
                        }

                    </div>


                    <div class="product-actions">

                        <button
                            type="button"
                            class="add-to-cart-btn"
                            data-id="${product.id}"
                            ${
                                product.stock <= 0
                                    ? "disabled"
                                    : ""
                            }
                        >

                            ${
                                product.stock > 0
                                    ? "Add to Cart"
                                    : "Out of Stock"
                            }

                        </button>


                        <button
                            type="button"
                            class="buy-now-btn"
                            data-id="${product.id}"
                            ${
                                product.stock <= 0
                                    ? "disabled"
                                    : ""
                            }
                        >
                            Buy Now
                        </button>

                    </div>

                </div>

            `;


            productsGrid.appendChild(
                card
            );

        });

    }


    // ================= PRODUCT EVENTS =================

    if (productsGrid) {

        productsGrid.addEventListener(
            "click",
            event => {

                const addButton =
                    event.target.closest(
                        ".add-to-cart-btn"
                    );


                const buyButton =
                    event.target.closest(
                        ".buy-now-btn"
                    );


                const wishlistButton =
                    event.target.closest(
                        ".wishlist-btn"
                    );


                if (
                    addButton ||
                    buyButton ||
                    wishlistButton
                ) {

                    const button =
                        addButton ||
                        buyButton ||
                        wishlistButton;


                    const productId =
                        Number(
                            button.dataset.id
                        );


                    const product =
                        products.find(
                            item =>
                                item.id ===
                                productId
                        );


                    if (!product) {
                        return;
                    }


                    // Add to cart

                    if (addButton) {

                        addToCart(
                            product
                        );


                        const originalText =
                            addButton.textContent;


                        addButton.textContent =
                            "✓ Added";


                        setTimeout(
                            () => {

                                addButton.textContent =
                                    originalText;

                            },
                            1000
                        );

                    }


                    // Buy now

                    if (buyButton) {

                        addToCart(
                            product
                        );


                        window.location.href =
                            "checkout.html";

                    }


                    // Wishlist

                    if (wishlistButton) {

                        const added =
                            toggleWishlist(
                                product
                            );


                        wishlistButton.classList.toggle(
                            "active",
                            added
                        );


                        wishlistButton.textContent =
                            added
                                ? "♥"
                                : "♡";

                    }

                }

            }
        );

    }


    // ================= SEARCH =================

    function performSearch() {

        if (!searchInput) {
            return;
        }


        searchQuery =
            searchInput.value.trim();


        const url =
            new URL(
                window.location.href
            );


        if (searchQuery) {

            url.searchParams.set(
                "search",
                searchQuery
            );

        } else {

            url.searchParams.delete(
                "search"
            );

        }


        url.searchParams.delete(
            "category"
        );


        window.history.replaceState(
            {},
            "",
            url
        );


        categoryQuery = "";

        renderProducts();

    }


    if (searchBtn) {

        searchBtn.addEventListener(
            "click",
            performSearch
        );

    }


    if (searchInput) {

        searchInput.value =
            searchQuery;


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


    // ================= CATEGORY =================

    if (categoryFilter) {

        categoryFilter.value =
            categoryQuery;


        categoryFilter.addEventListener(
            "change",
            () => {

                categoryQuery =
                    categoryFilter.value;


                renderProducts();

            }
        );

    }


    // ================= SORT =================

    if (sortFilter) {

        sortFilter.addEventListener(
            "change",
            renderProducts
        );

    }


    // ================= PRICE FILTER =================

    if (priceFilter) {

        priceFilter.addEventListener(
            "change",
            renderProducts
        );

    }


    // ================= CLEAR FILTERS =================

    function clearFilters() {

        searchQuery = "";

        categoryQuery = "";


        if (searchInput) {
            searchInput.value = "";
        }


        if (categoryFilter) {
            categoryFilter.value = "all";
        }


        if (sortFilter) {
            sortFilter.value = "default";
        }


        if (priceFilter) {
            priceFilter.value = "all";
        }


        const url =
            new URL(
                window.location.href
            );


        url.searchParams.delete(
            "search"
        );

        url.searchParams.delete(
            "category"
        );


        window.history.replaceState(
            {},
            "",
            url
        );


        renderProducts();

    }


    // ================= INITIALIZE =================

    updateCartCount();

    renderProducts();

});