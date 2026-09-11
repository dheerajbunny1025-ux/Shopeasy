// ================= AUTH.JS =================

document.addEventListener("DOMContentLoaded", () => {

    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");
    const logoutBtn = document.getElementById("logoutBtn");


    // ================= GET USERS =================

    function getUsers() {

        try {
            return JSON.parse(
                localStorage.getItem("users")
            ) || [];
        } catch (error) {
            return [];
        }

    }


    // ================= SAVE USERS =================

    function saveUsers(users) {

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

    }


    // ================= SIGNUP =================

    if (signupForm) {

        signupForm.addEventListener("submit", (event) => {

            event.preventDefault();

            const name =
                document.getElementById("name")?.value.trim();

            const email =
                document.getElementById("email")?.value.trim().toLowerCase();

            const password =
                document.getElementById("password")?.value;

            const confirmPassword =
                document.getElementById("confirmPassword")?.value;


            if (!name || !email || !password || !confirmPassword) {

                alert("Please fill in all fields.");

                return;
            }


            if (password.length < 6) {

                alert("Password must contain at least 6 characters.");

                return;
            }


            if (password !== confirmPassword) {

                alert("Passwords do not match.");

                return;
            }


            const users = getUsers();


            const existingUser =
                users.find(user => user.email === email);


            if (existingUser) {

                alert("An account with this email already exists.");

                return;
            }


            const newUser = {

                id: Date.now(),

                name: name,

                email: email,

                password: password,

                phone: "",

                address: "",

                createdAt: new Date().toISOString()

            };


            users.push(newUser);

            saveUsers(users);


            // Automatically log in after signup

            localStorage.setItem(
                "currentUser",
                JSON.stringify({
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email
                })
            );


            alert("Account created successfully!");


            window.location.href =
                "profile.html";

        });

    }


    // ================= LOGIN =================

    if (loginForm) {

        loginForm.addEventListener("submit", (event) => {

            event.preventDefault();

            const email =
                document.getElementById("email")?.value.trim().toLowerCase();

            const password =
                document.getElementById("password")?.value;


            if (!email || !password) {

                alert("Please enter your email and password.");

                return;
            }


            const users = getUsers();


            const user =
                users.find(
                    account =>
                        account.email === email &&
                        account.password === password
                );


            if (!user) {

                alert("Invalid email or password.");

                return;
            }


            localStorage.setItem(
                "currentUser",
                JSON.stringify({
                    id: user.id,
                    name: user.name,
                    email: user.email
                })
            );


            alert("Login successful!");


            window.location.href =
                "../index.html";

        });

    }


    // ================= LOGOUT =================

    if (logoutBtn) {

        logoutBtn.addEventListener("click", () => {

            localStorage.removeItem("currentUser");

            alert("You have been logged out.");

            window.location.href =
                "login.html";

        });

    }


    // ================= CHECK LOGIN =================

    function getCurrentUser() {

        try {

            return JSON.parse(
                localStorage.getItem("currentUser")
            );

        } catch (error) {

            return null;

        }

    }


    // ================= PROTECT PROFILE =================

    if (
        window.location.pathname.includes("profile.html") &&
        !getCurrentUser()
    ) {

        window.location.href =
            "login.html";

    }


    // ================= UPDATE NAVIGATION =================

    function updateAuthLinks() {

        const currentUser =
            getCurrentUser();

        const loginLinks =
            document.querySelectorAll(
                'a[href="login.html"]'
            );

        const profileLinks =
            document.querySelectorAll(
                'a[href="profile.html"]'
            );


        if (currentUser) {

            loginLinks.forEach(link => {

                if (link.textContent.trim() === "Login") {

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

                }

            });

            profileLinks.forEach(link => {

                link.style.display = "";

            });

        }

    }


    // ================= CART COUNT =================

    function updateCartCount() {

        const cartCount =
            document.getElementById("cartCount");

        if (!cartCount) {
            return;
        }


        try {

            const cart =
                JSON.parse(
                    localStorage.getItem("cart")
                ) || [];


            const count =
                cart.reduce(
                    (total, item) =>
                        total + (Number(item.quantity) || 1),
                    0
                );


            cartCount.textContent = count;

        } catch (error) {

            cartCount.textContent = "0";

        }

    }


    // ================= INITIALIZE =================

    updateAuthLinks();

    updateCartCount();

});