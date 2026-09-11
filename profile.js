// ================= PROFILE.JS =================

document.addEventListener("DOMContentLoaded", () => {

    const profileForm =
        document.getElementById("profileForm");

    const profileName =
        document.getElementById("profileName");

    const profileEmail =
        document.getElementById("profileEmail");

    const profilePhone =
        document.getElementById("profilePhone");

    const profileAvatar =
        document.getElementById("profileAvatar");

    const logoutBtn =
        document.getElementById("logoutBtn");

    const cartCount =
        document.getElementById("cartCount");

    const orderCount =
        document.getElementById("orderCount");


    // ================= GET USER =================

    function getCurrentUser() {

        try {
            return JSON.parse(
                localStorage.getItem("currentUser")
            );
        } catch (error) {
            return null;
        }

    }


    // ================= SAVE USER =================

    function saveCurrentUser(user) {

        localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );

    }


    // ================= LOAD PROFILE =================

    function loadProfile() {

        const user =
            getCurrentUser();


        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        if (profileName) {

            profileName.value =
                user.name || "";

        }


        if (profileEmail) {

            profileEmail.value =
                user.email || "";

        }


        if (profilePhone) {

            profilePhone.value =
                user.phone || "";

        }


        if (profileAvatar) {

            if (user.name) {

                profileAvatar.textContent =
                    user.name
                        .charAt(0)
                        .toUpperCase();

            } else {

                profileAvatar.textContent =
                    "U";

            }

        }


        loadOrderCount();

    }


    // ================= UPDATE PROFILE =================

    if (profileForm) {

        profileForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const user =
                    getCurrentUser();


                if (!user) {

                    window.location.href =
                        "login.html";

                    return;

                }


                const name =
                    profileName
                        ? profileName.value.trim()
                        : "";


                const phone =
                    profilePhone
                        ? profilePhone.value.trim()
                        : "";


                if (!name) {

                    alert(
                        "Please enter your name."
                    );

                    return;

                }


                if (
                    phone &&
                    !/^\d{10}$/.test(
                        phone.replace(/\D/g, "")
                    )
                ) {

                    alert(
                        "Please enter a valid 10-digit phone number."
                    );

                    return;

                }


                user.name =
                    name;

                user.phone =
                    phone;


                saveCurrentUser(
                    user
                );


                // Also update registered user

                try {

                    const users =
                        JSON.parse(
                            localStorage.getItem(
                                "users"
                            )
                        ) || [];


                    const index =
                        users.findIndex(
                            item =>
                                item.email ===
                                user.email
                        );


                    if (index !== -1) {

                        users[index] = {
                            ...users[index],
                            name: user.name,
                            phone: user.phone
                        };


                        localStorage.setItem(
                            "users",
                            JSON.stringify(users)
                        );

                    }

                } catch (error) {
                    // Ignore storage errors
                }


                if (profileAvatar) {

                    profileAvatar.textContent =
                        name
                            .charAt(0)
                            .toUpperCase();

                }


                alert(
                    "Profile updated successfully!"
                );

            }
        );

    }


    // ================= LOGOUT =================

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            () => {

                const confirmLogout =
                    confirm(
                        "Are you sure you want to logout?"
                    );


                if (!confirmLogout) {
                    return;
                }


                localStorage.removeItem(
                    "currentUser"
                );


                window.location.href =
                    "login.html";

            }
        );

    }


    // ================= CART COUNT =================

    function updateCartCount() {

        if (!cartCount) {
            return;
        }


        let cart = [];


        try {

            cart =
                JSON.parse(
                    localStorage.getItem(
                        "cart"
                    )
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


    // ================= ORDER COUNT =================

    function loadOrderCount() {

        if (!orderCount) {
            return;
        }


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


        const user =
            getCurrentUser();


        if (user) {

            orders =
                orders.filter(order => {

                    if (!order.userId) {
                        return true;
                    }

                    return String(order.userId) ===
                        String(user.id);

                });

        }


        orderCount.textContent =
            orders.length;

    }


    // ================= DELETE ACCOUNT =================

    const deleteAccountBtn =
        document.getElementById(
            "deleteAccountBtn"
        );


    if (deleteAccountBtn) {

        deleteAccountBtn.addEventListener(
            "click",
            () => {

                const user =
                    getCurrentUser();


                if (!user) {
                    return;
                }


                const confirmation =
                    confirm(
                        "Are you sure you want to delete your account? This action cannot be undone."
                    );


                if (!confirmation) {
                    return;
                }


                try {

                    let users =
                        JSON.parse(
                            localStorage.getItem(
                                "users"
                            )
                        ) || [];


                    users =
                        users.filter(
                            item =>
                                item.email !==
                                user.email
                        );


                    localStorage.setItem(
                        "users",
                        JSON.stringify(users)
                    );

                } catch (error) {
                    // Ignore storage errors
                }


                localStorage.removeItem(
                    "currentUser"
                );


                localStorage.removeItem(
                    "cart"
                );


                localStorage.removeItem(
                    "checkoutData"
                );


                alert(
                    "Your account has been deleted."
                );


                window.location.href =
                    "index.html";

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
            (event) => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    performSearch();

                }

            }
        );

    }


    // ================= INITIALIZE =================

    loadProfile();

    updateCartCount();

});