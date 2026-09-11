// ================= PRODUCT-DETAILS.JS =================

document.addEventListener("DOMContentLoaded", () => {

    const productName =
        document.getElementById("productName");

    const productImage =
        document.getElementById("productImage");

    const productPrice =
        document.getElementById("productPrice");

    const productDescription =
        document.getElementById("productDescription");

    const productCategory =
        document.getElementById("productCategory");

    const productRating =
        document.getElementById("productRating");

    const productStock =
        document.getElementById("productStock");

    const quantityInput =
        document.getElementById("quantity");

    const increaseBtn =
        document.getElementById("increaseBtn");

    const decreaseBtn =
        document.getElementById("decreaseBtn");

    const addToCartBtn =
        document.getElementById("addToCartBtn");

    const buyNowBtn =
        document.getElementById("buyNowBtn");

    const wishlistBtn =
        document.getElementById("wishlistBtn");

    const cartCount =
        document.getElementById("cartCount");


    // ================= PRODUCTS =================

    const products = [

        {
            id: 1,
            name: "Premium Smartphone",
            price: 29999,
            category: "Phones",
            image: "../images/phone1.jpg",
            rating: 4.5,
            stock: 15,
            description:
                "A powerful smartphone with a high-quality display, excellent performance, long battery life and an advanced camera system."
        },

        {
            id: 2,
            name: "Budget Smartphone",
            price: 14999,
            category: "Phones",
            image: "../images/phone2.jpg",
            rating: 4.2,
            stock: 25,
            description:
                "An affordable smartphone designed for everyday use with reliable performance and long-lasting battery life."
        },

        {
            id: 3,
            name: "Gaming Laptop",
            price: 74999,
            category: "Laptops",
            image: "../images/laptop1.jpg",
            rating: 4.7,
            stock: 8,
            description:
                "A powerful gaming laptop with high-performance hardware suitable for gaming, programming and demanding applications."
        },

        {
            id: 4,
            name: "Student Laptop",
            price: 45999,
            category: "Laptops",
            image: "../images/laptop2.jpg",
            rating: 4.4,
            stock: 18,
            description:
                "A lightweight and efficient laptop designed for students, office work, browsing and everyday tasks."
        },

        {
            id: 5,
            name: "Wireless Headphones",
            price: 2999,
            category: "Accessories",
            image: "../images/headphones.jpg",
            rating: 4.3,
            stock: 30,
            description:
                "Comfortable wireless headphones with clear sound, convenient controls and a long-lasting battery."
        },

        {
            id: 6,
            name: "Smart Watch",
            price: 4999,
            category: "Accessories",
            image: "../images/watch.jpg",
            rating: 4.4,
            stock: 20,
            description:
                "A smart watch with useful fitness, notification and everyday activity features."
        },

        {
            id: 7,
            name: "Casual T-Shirt",
            price: 799,
            category: "Clothes",
            image: "../images/tshirt.jpg",
            rating: 4.1,
            stock: 50,
            description:
                "A comfortable casual T-shirt suitable for everyday wear."
        },

        {
            id: 8,
            name: "Classic Jeans",
            price: 1499,
            category: "Clothes",
            image: "../images/jeans.jpg",
            rating: 4.3,
            stock: 35,
            description:
                "Comfortable classic jeans designed for everyday casual wear."
        }

    ];


    // ================= GET PRODUCT ID =================

    const params =
        new URLSearchParams(
            window.location.search
        );

    const productId =
        Number(
            params.get("id")
        );


    // ================= FIND PRODUCT =================

    let product =
        products.find(
            item =>
                item.id === productId
        );


    // Support product stored from products page

    if (!product) {

        try {

            const selectedProduct =
                JSON.parse(
                    localStorage.getItem(
                        "selectedProduct"
                    )
                );

            if (selectedProduct) {
                product = selectedProduct;
            }

        } catch (error) {

            product = null;

        }

    }


    // ================= PRODUCT NOT FOUND =================

    if (!product) {

        if (productContainer) {

            productContainer.innerHTML = `

                <div class="product-not-found">

                    <h2>
                        Product Not Found
                    </h2>

                    <p>
                        Sorry, we couldn't find this product.
                    </p>

                    <a href="products.html">
                        Back to Products
                    </a>

                </div>

            `;

        }

        return;
    }


    // ================= DISPLAY PRODUCT =================

    if (productName) {

        productName.textContent =
            product.name;

    }


    if (productImage) {

        productImage.src =
            product.image || "";

        productImage.alt =
            product.name;

        productImage.onerror = () => {

            productImage.style.display =
                "none";

        };

    }


    if (productPrice) {

        productPrice.textContent =
            formatPrice(
                product.price
            );

    }


    if (productDescription) {

        productDescription.textContent =
            product.description || "";

    }


    if (productCategory) {

        productCategory.textContent =
            product.category || "Product";

    }


    if (productRating) {

        productRating.innerHTML =
            createRating(
                product.rating || 0
            );

    }


    if (productStock) {

        productStock.textContent =
            product.stock > 0
                ? `${product.stock} available`
                : "Out of Stock";

        productStock.classList.toggle(
            "out-of-stock",
            product.stock <= 0
        );

    }


    // ================= PRICE FORMAT =================

    function formatPrice(price) {

        return "₹" +
            Number(price || 0)
                .toLocaleString("en-IN");

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

            <span class="rating-number">
                ${rating}/5
            </span>
        `;

    }


    // ================= QUANTITY =================

    function getQuantity() {

        if (!quantityInput) {
            return 1;
        }

        let quantity =
            Number(
                quantityInput.value
            ) || 1;

        quantity =
            Math.max(
                1,
                Math.min(
                    quantity,
                    product.stock || 1
                )
            );

        return quantity;

    }


    if (quantityInput) {

        quantityInput.min = 1;

        quantityInput.max =
            product.stock || 1;

        quantityInput.value = 1;


        quantityInput.addEventListener(
            "input",
            () => {

                quantityInput.value =
                    getQuantity();

            }
        );

    }


    if (increaseBtn) {

        increaseBtn.addEventListener(
            "click",
            () => {

                if (!quantityInput) {
                    return;
                }

                const quantity =
                    getQuantity();

                if (
                    quantity <
                    product.stock
                ) {

                    quantityInput.value =
                        quantity + 1;

                }

            }
        );

    }


    if (decreaseBtn) {

        decreaseBtn.addEventListener(
            "click",
            () => {

                if (!quantityInput) {
                    return;
                }

                const quantity =
                    getQuantity();

                if (quantity > 1) {

                    quantityInput.value =
                        quantity - 1;

                }

            }
        );

    }


    // ================= GET CART =================

    function getCart() {

        try {

            return JSON.parse(
                localStorage.getItem("cart")
            ) || [];

        } catch (error) {

            return [];

        }

    }


    // ================= SAVE CART =================

    function saveCart(cart) {

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

    }


    // ================= UPDATE CART COUNT =================

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

    function addToCart() {

        if (!product.stock) {

            alert(
                "This product is currently out of stock."
            );

            return false;

        }


        const quantity =
            getQuantity();

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
                (
                    Number(
                        existingItem.quantity
                    ) || 0
                ) + quantity;


            if (
                existingItem.quantity >
                product.stock
            ) {

                existingItem.quantity =
                    product.stock;

            }

        } else {

            cart.push({

                id: product.id,

                name: product.name,

                price: product.price,

                category: product.category,

                image: product.image,

                rating: product.rating,

                quantity: quantity

            });

        }


        saveCart(cart);

        updateCartCount();

        return true;

    }


    // ================= ADD TO CART BUTTON =================

    if (addToCartBtn) {

        addToCartBtn.addEventListener(
            "click",
            () => {

                if (addToCart()) {

                    const originalText =
                        addToCartBtn.textContent;

                    addToCartBtn.textContent =
                        "✓ Added to Cart";

                    addToCartBtn.classList.add(
                        "added"
                    );


                    setTimeout(
                        () => {

                            addToCartBtn.textContent =
                                originalText;

                            addToCartBtn.classList.remove(
                                "added"
                            );

                        },
                        1500
                    );

                }

            }
        );

    }


    // ================= BUY NOW =================

    if (buyNowBtn) {

        buyNowBtn.addEventListener(
            "click",
            () => {

                if (!addToCart()) {
                    return;
                }

                window.location.href =
                    "checkout.html";

            }
        );

    }


    // ================= WISHLIST =================

    function getWishlist() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "wishlist"
                )
            ) || [];

        } catch (error) {

            return [];

        }

    }


    function saveWishlist(wishlist) {

        localStorage.setItem(
            "wishlist",
            JSON.stringify(wishlist)
        );

    }


    function updateWishlistButton() {

        if (!wishlistBtn) {
            return;
        }

        const wishlist =
            getWishlist();

        const exists =
            wishlist.some(
                item =>
                    String(item.id) ===
                    String(product.id)
            );


        wishlistBtn.classList.toggle(
            "active",
            exists
        );


        wishlistBtn.textContent =
            exists
                ? "♥ Remove from Wishlist"
                : "♡ Add to Wishlist";

    }


    if (wishlistBtn) {

        wishlistBtn.addEventListener(
            "click",
            () => {

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

                        image: product.image,

                        category: product.category

                    });

                }


                saveWishlist(wishlist);

                updateWishlistButton();

            }
        );

    }


    // ================= SEARCH =================

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    const searchBtn =
        document.getElementById(
            "searchBtn"
        );


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

    updateWishlistButton();

});