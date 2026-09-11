// ================= AI MODE JAVASCRIPT =================

document.addEventListener("DOMContentLoaded", () => {

    const chatMessages = document.getElementById("chatMessages");
    const chatInput = document.getElementById("chatInput");
    const sendMessageBtn = document.getElementById("sendMessageBtn");
    const clearChatBtn = document.getElementById("clearChatBtn");

    const quickQuestions = document.querySelectorAll(
        ".quick-question, .request-card"
    );

    const recommendationToggle =
        document.getElementById("recommendationToggle");

    const budgetToggle =
        document.getElementById("budgetToggle");

    const comparisonToggle =
        document.getElementById("comparisonToggle");


    // ================= SAMPLE PRODUCTS =================

    const products = [
        {
            name: "Premium Smartphone",
            category: "phone",
            price: 29999,
            icon: "📱"
        },
        {
            name: "Budget Smartphone",
            category: "phone",
            price: 14999,
            icon: "📱"
        },
        {
            name: "Gaming Laptop",
            category: "laptop",
            price: 74999,
            icon: "💻"
        },
        {
            name: "Student Laptop",
            category: "laptop",
            price: 45999,
            icon: "💻"
        },
        {
            name: "Wireless Headphones",
            category: "accessory",
            price: 2999,
            icon: "🎧"
        },
        {
            name: "Smart Watch",
            category: "accessory",
            price: 4999,
            icon: "⌚"
        },
        {
            name: "Casual T-Shirt",
            category: "clothes",
            price: 799,
            icon: "👕"
        },
        {
            name: "Classic Jeans",
            category: "clothes",
            price: 1499,
            icon: "👖"
        }
    ];


    // ================= FORMAT PRICE =================

    function formatPrice(price) {
        return "₹" + price.toLocaleString("en-IN");
    }


    // ================= ADD AI MESSAGE =================

    function addAIMessage(message) {

        const messageElement = document.createElement("div");

        messageElement.className =
            "chat-message ai-message";

        messageElement.innerHTML = `
            <div class="message-avatar">
                🤖
            </div>

            <div class="message-content">

                <div class="message-name">
                    ShopEase AI
                </div>

                <p>
                    ${message}
                </p>

            </div>
        `;

        chatMessages.appendChild(messageElement);

        scrollToBottom();
    }


    // ================= ADD USER MESSAGE =================

    function addUserMessage(message) {

        const messageElement = document.createElement("div");

        messageElement.className =
            "chat-message user-message";

        messageElement.innerHTML = `
            <div class="message-content">

                <div class="message-name">
                    You
                </div>

                <p>
                    ${escapeHTML(message)}
                </p>

            </div>

            <div class="message-avatar">
                👤
            </div>
        `;

        chatMessages.appendChild(messageElement);

        scrollToBottom();
    }


    // ================= ESCAPE HTML =================

    function escapeHTML(text) {

        const div = document.createElement("div");

        div.textContent = text;

        return div.innerHTML;
    }


    // ================= SCROLL CHAT =================

    function scrollToBottom() {

        chatMessages.scrollTop =
            chatMessages.scrollHeight;
    }


    // ================= TYPING INDICATOR =================

    function showTyping() {

        const typingElement =
            document.createElement("div");

        typingElement.id = "typingIndicator";

        typingElement.className =
            "chat-message ai-message";

        typingElement.innerHTML = `
            <div class="message-avatar">
                🤖
            </div>

            <div class="message-content">

                <div class="message-name">
                    ShopEase AI
                </div>

                <p class="typing">
                    <span></span>
                    <span></span>
                    <span></span>
                </p>

            </div>
        `;

        chatMessages.appendChild(typingElement);

        scrollToBottom();
    }


    // ================= REMOVE TYPING =================

    function removeTyping() {

        const typing =
            document.getElementById("typingIndicator");

        if (typing) {
            typing.remove();
        }
    }


    // ================= FIND PRODUCTS =================

    function findProducts(category, budget = null) {

        let results =
            products.filter(product =>
                product.category === category
            );

        if (budget) {

            results =
                results.filter(product =>
                    product.price <= budget
                );

        }

        return results;
    }


    // ================= PRODUCT RESPONSE =================

    function createProductResponse(productList) {

        if (productList.length === 0) {

            return `
                I couldn't find a suitable product in that budget.
                Try increasing your budget or checking another category.
            `;
        }

        let response =
            "Here are some products you can consider:<br><br>";

        productList.slice(0, 4).forEach(product => {

            response += `
                <div class="ai-product-suggestion">

                    <strong>
                        ${product.icon} ${product.name}
                    </strong>

                    <br>

                    <span>
                        ${formatPrice(product.price)}
                    </span>

                </div>
            `;

        });

        response += `
            <br>
            You can visit the Products page to see more options.
        `;

        return response;
    }


    // ================= GENERATE AI RESPONSE =================

    function generateResponse(message) {

        const text =
            message.toLowerCase().trim();


        // PHONE

        if (
            text.includes("phone") ||
            text.includes("smartphone") ||
            text.includes("mobile")
        ) {

            let budget = extractBudget(text);

            if (budgetToggle.checked && budget) {

                return createProductResponse(
                    findProducts("phone", budget)
                );

            }

            if (!recommendationToggle.checked) {

                return `
                    Product recommendations are currently disabled.
                    You can enable Shopping Recommendations in AI Preferences.
                `;

            }

            return `
                📱 For smartphones, I recommend checking the
                Premium Smartphone and Budget Smartphone options.

                <br><br>

                If you tell me your budget and what matters most
                to you, such as camera, gaming, battery or performance,
                I can narrow the options down.
            `;
        }


        // LAPTOP

        if (
            text.includes("laptop") ||
            text.includes("computer") ||
            text.includes("notebook")
        ) {

            let budget = extractBudget(text);

            if (budgetToggle.checked && budget) {

                return createProductResponse(
                    findProducts("laptop", budget)
                );

            }

            return `
                💻 We have laptops suitable for students,
                programming, office work and gaming.

                <br><br>

                For students, the Student Laptop is a good
                starting option. For gaming, consider the
                Gaming Laptop.

                <br><br>

                Tell me your budget if you want more specific suggestions.
            `;
        }


        // ACCESSORIES

        if (
            text.includes("accessor") ||
            text.includes("headphone") ||
            text.includes("earphone") ||
            text.includes("watch")
        ) {

            return createProductResponse(
                findProducts("accessory")
            );
        }


        // CLOTHES

        if (
            text.includes("cloth") ||
            text.includes("shirt") ||
            text.includes("jeans") ||
            text.includes("fashion") ||
            text.includes("dress")
        ) {

            return createProductResponse(
                findProducts("clothes")
            );
        }


        // COMPARE

        if (
            text.includes("compare") ||
            text.includes("comparison") ||
            text.includes("difference")
        ) {

            if (!comparisonToggle.checked) {

                return `
                    Product comparison is currently disabled.
                    You can enable Product Comparisons in AI Preferences.
                `;
            }

            return `
                ⚖️ I can help you compare products.

                <br><br>

                Tell me the two products you want to compare,
                for example:

                <br><br>

                <strong>
                    "Compare Premium Smartphone and Budget Smartphone"
                </strong>
            `;
        }


        // BUDGET

        if (
            text.includes("budget") ||
            text.includes("under") ||
            text.includes("below") ||
            text.includes("cheap")
        ) {

            const budget =
                extractBudget(text);

            if (budget) {

                const results =
                    products.filter(product =>
                        product.price <= budget
                    );

                if (results.length > 0) {

                    return createProductResponse(results);

                }

                return `
                    I couldn't find products under
                    ${formatPrice(budget)} in the current catalog.
                `;
            }

            return `
                💰 Sure! Tell me your budget.

                <br><br>

                For example:

                <br>

                "Show me phones under ₹20,000"

                <br>

                or

                <br>

                "I need a laptop under 50,000"
            `;
        }


        // CAMERA

        if (
            text.includes("camera") ||
            text.includes("photography")
        ) {

            return `
                📸 If camera quality is your priority,
                I recommend looking at smartphones with
                strong camera specifications.

                <br><br>

                You can tell me your budget and I can
                narrow down the choices.
            `;
        }


        // GAMING

        if (
            text.includes("gaming") ||
            text.includes("game")
        ) {

            return `
                🎮 For gaming, focus on a powerful processor,
                dedicated graphics, sufficient RAM and good
                cooling.

                <br><br>

                Our Gaming Laptop is one option to consider.
            `;
        }


        // STUDENT

        if (
            text.includes("student") ||
            text.includes("college") ||
            text.includes("study")
        ) {

            return `
                🎓 For students, look for a laptop with good
                battery life, enough RAM, fast storage and a
                comfortable keyboard.

                <br><br>

                The Student Laptop in our catalog is a good
                starting point.
            `;
        }


        // GREETING

        if (
            text.includes("hello") ||
            text.includes("hi") ||
            text.includes("hey")
        ) {

            return `
                Hello! 👋

                <br><br>

                I'm ShopEase AI. I can help you with phones,
                laptops, accessories, clothes, budgets and
                product comparisons.

                <br><br>

                What would you like to shop for?
            `;
        }


        // THANK YOU

        if (
            text.includes("thank") ||
            text.includes("thanks")
        ) {

            return `
                You're welcome! 😊

                Let me know if you need help finding anything else.
            `;
        }


        // DEFAULT RESPONSE

        return `
            🤖 I can help you find products on ShopEase.

            <br><br>

            Try asking something like:

            <br><br>

            • "Suggest a good phone"

            <br>

            • "Laptop for students"

            <br>

            • "Show accessories"

            <br>

            • "Show phones under ₹20,000"

            <br>

            • "Compare two products"
        `;
    }


    // ================= EXTRACT BUDGET =================

    function extractBudget(text) {

        const patterns = [
            /₹\s?([\d,]+)/,
            /rs\.?\s?([\d,]+)/i,
            /inr\s?([\d,]+)/i,
            /under\s?([\d,]+)/i,
            /below\s?([\d,]+)/i,
            /([\d,]+)\s?(?:rupees|rs)/i
        ];

        for (const pattern of patterns) {

            const match =
                text.match(pattern);

            if (match) {

                const amount =
                    parseInt(
                        match[1].replace(/,/g, ""),
                        10
                    );

                if (!isNaN(amount)) {
                    return amount;
                }
            }
        }

        return null;
    }


    // ================= SEND MESSAGE =================

    function sendMessage(message = null) {

        const userMessage =
            message || chatInput.value.trim();

        if (!userMessage) {
            return;
        }

        addUserMessage(userMessage);

        chatInput.value = "";

        showTyping();

        setTimeout(() => {

            removeTyping();

            const response =
                generateResponse(userMessage);

            addAIMessage(response);

        }, 700);
    }


    // ================= SEND BUTTON =================

    if (sendMessageBtn) {

        sendMessageBtn.addEventListener(
            "click",
            () => sendMessage()
        );

    }


    // ================= ENTER KEY =================

    if (chatInput) {

        chatInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    sendMessage();
                }

            }
        );

    }


    // ================= QUICK QUESTIONS =================

    quickQuestions.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const question =
                    button.dataset.question;

                if (question) {
                    sendMessage(question);
                }

            }
        );

    });


    // ================= CLEAR CHAT =================

    if (clearChatBtn) {

        clearChatBtn.addEventListener(
            "click",
            () => {

                chatMessages.innerHTML = `
                    <div class="chat-message ai-message">

                        <div class="message-avatar">
                            🤖
                        </div>

                        <div class="message-content">

                            <div class="message-name">
                                ShopEase AI
                            </div>

                            <p>
                                Chat cleared! 👋
                                How can I help you today?
                            </p>

                        </div>

                    </div>
                `;

            }
        );

    }


    // ================= SEARCH =================

    const searchInput =
        document.getElementById("searchInput");

    const searchBtn =
        document.getElementById("searchBtn");

    if (searchBtn) {

        searchBtn.addEventListener(
            "click",
            () => {

                const query =
                    searchInput.value.trim();

                if (query) {

                    window.location.href =
                        `products.html?search=${encodeURIComponent(query)}`;

                }

            }
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    searchBtn.click();

                }

            }
        );

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
                        total + (item.quantity || 1),
                    0
                );

            cartCount.textContent = count;

        } catch (error) {

            cartCount.textContent = "0";

        }
    }


    // ================= SAVE AI SETTINGS =================

    function saveAISettings() {

        const settings = {

            recommendations:
                recommendationToggle
                    ? recommendationToggle.checked
                    : true,

            budget:
                budgetToggle
                    ? budgetToggle.checked
                    : true,

            comparison:
                comparisonToggle
                    ? comparisonToggle.checked
                    : true

        };

        localStorage.setItem(
            "aiSettings",
            JSON.stringify(settings)
        );
    }


    // ================= LOAD AI SETTINGS =================

    function loadAISettings() {

        try {

            const savedSettings =
                JSON.parse(
                    localStorage.getItem("aiSettings")
                );

            if (!savedSettings) {
                return;
            }

            if (recommendationToggle) {

                recommendationToggle.checked =
                    savedSettings.recommendations;

            }

            if (budgetToggle) {

                budgetToggle.checked =
                    savedSettings.budget;

            }

            if (comparisonToggle) {

                comparisonToggle.checked =
                    savedSettings.comparison;

            }

        } catch (error) {

            console.log(
                "Could not load AI settings."
            );

        }
    }


    // ================= SETTINGS EVENTS =================

    [
        recommendationToggle,
        budgetToggle,
        comparisonToggle
    ].forEach(toggle => {

        if (toggle) {

            toggle.addEventListener(
                "change",
                saveAISettings
            );

        }

    });


    // ================= INITIALIZE =================

    loadAISettings();

    updateCartCount();

});