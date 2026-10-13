
/* =========================
   LUXECART — SHARED PRODUCTS
========================= */

const products = [
    {
        id: "watch",
        name: "The Minimalist Watch",
        category: "Accessories",
        price: 129,
        oldPrice: 159,
        rating: 4.8,
        reviews: 124,
        badge: "Bestseller",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85",
        description: "A timeless everyday watch with a clean dial and an elegant, versatile design."
    },
    {
        id: "headphones",
        name: "Wireless Headphones",
        category: "Technology",
        price: 89,
        oldPrice: 109,
        rating: 4.7,
        reviews: 98,
        badge: "Editor's Pick",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85",
        description: "Enjoy your favorite music with comfortable, stylish headphones designed for everyday listening."
    },
    {
        id: "bag",
        name: "Everyday Leather Bag",
        category: "Fashion",
        price: 159,
        oldPrice: 189,
        rating: 4.9,
        reviews: 76,
        badge: "New Arrival",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=85",
        description: "An elegant everyday bag that pairs practical storage with a sophisticated silhouette."
    },
    {
        id: "skincare",
        name: "Daily Skincare Set",
        category: "Beauty",
        price: 64,
        oldPrice: 79,
        rating: 4.8,
        reviews: 112,
        badge: "Customer Love",
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=85",
        description: "A thoughtfully selected skincare set for a simple, refreshing daily routine."
    }
];

console.log("LuxeCart products loaded:", products.length);


/* =========================
   MOBILE NAVIGATION
========================= */

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("active");

        menuToggle.setAttribute("aria-expanded", isOpen);
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );

        menuToggle.textContent = isOpen ? "✕" : "☰";
    });
}


/* =========================
   NEWSLETTER FORM
========================= */

const newsletterForm = document.getElementById("newsletterForm");
const newsletterMessage = document.getElementById("newsletterMessage");

if (newsletterForm && newsletterMessage) {
    newsletterForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const emailInput = document.getElementById("newsletterEmail");
        const email = emailInput.value.trim();

        if (!email) {
            newsletterMessage.textContent = "Please enter your email address.";
            return;
        }

        newsletterMessage.textContent =
            "Thank you for joining LuxeCart! Your email has been noted for this demo.";

        newsletterForm.reset();
    });
}


/* =========================
   CART AND WISHLIST
========================= */

let cart = JSON.parse(localStorage.getItem("luxecart-cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("luxecart-wishlist")) || [];

function saveCart() {
    localStorage.setItem("luxecart-cart", JSON.stringify(cart));
}

function saveWishlist() {
    localStorage.setItem("luxecart-wishlist", JSON.stringify(wishlist));
}

function updateCartCount() {
    const cartCount = document.getElementById("cartCount");

    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function updateWishlistButtons() {
    document.querySelectorAll("[data-wishlist]").forEach((button) => {
        const productId = button.dataset.wishlist;
        const isSaved = wishlist.includes(productId);

        button.textContent = isSaved ? "♥" : "♡";
        button.classList.toggle("active", isSaved);
        button.setAttribute("aria-pressed", String(isSaved));
    });
}

function addToCart(productId) {
    const product = products.find((item) => item.id === productId);

    if (!product) return;

    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    alert(`${product.name} added to your cart!`);
}

function toggleWishlist(productId) {
    const isSaved = wishlist.includes(productId);

    if (isSaved) {
        wishlist = wishlist.filter((id) => id !== productId);
    } else {
        wishlist.push(productId);
    }

    saveWishlist();
    updateWishlistButtons();
}

document.querySelectorAll("[data-add-cart]").forEach((button) => {
    button.addEventListener("click", () => {
        addToCart(button.dataset.addCart);
    });
});

document.querySelectorAll("[data-wishlist]").forEach((button) => {
    button.addEventListener("click", () => {
        toggleWishlist(button.dataset.wishlist);
    });
});

updateCartCount();
updateWishlistButtons();


/* =========================
   SHOP PAGE: RENDER PRODUCTS
========================= */

const shopProductGrid = document.getElementById("shopProductGrid");

if (shopProductGrid) {
    const productSearch = document.getElementById("productSearch");
    const productSort = document.getElementById("productSort");
    const productResultsCount = document.getElementById("productResultsCount");
    const shopEmptyMessage = document.getElementById("shopEmptyMessage");

    function renderShopProducts() {
        const searchTerm = productSearch.value.trim().toLowerCase();

        const selectedCategory =
            document.querySelector('input[name="categoryFilter"]:checked')?.value || "all";

        let filteredProducts = products.filter((product) => {
            const matchesSearch =
                product.name.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm);

            const matchesCategory =
                selectedCategory === "all" || product.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        switch (productSort.value) {
            case "price-low":
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case "rating":
                filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case "name":
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        shopProductGrid.innerHTML = filteredProducts.map((product) => {
            const isSaved = wishlist.includes(product.id);

            return `
        <article class="product-card" data-product-id="${product.id}">
          <div class="product-image">
            <a href="product.html?id=${product.id}">
              <img
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
              >
            </a>

            <span class="product-badge">${product.badge}</span>

            <button
              class="wishlist-btn ${isSaved ? "active" : ""}"
              type="button"
              data-wishlist="${product.id}"
              aria-label="Toggle ${product.name} wishlist"
              aria-pressed="${isSaved}"
            >${isSaved ? "♥" : "♡"}</button>
          </div>

          <div class="product-info">
            <span class="product-category">${product.category}</span>
            <h3><a href="product.html?id=${product.id}">${product.name}</a></h3>

            <div class="product-rating">
              <span>★★★★★</span>
              <small>${product.rating} (${product.reviews})</small>
            </div>

            <div class="product-price">
              <strong>$${product.price.toFixed(2)}</strong>
              <del>$${product.oldPrice.toFixed(2)}</del>
            </div>

            <button
              class="add-cart-btn"
              type="button"
              data-add-cart="${product.id}"
            >Add to cart +</button>
          </div>
        </article>
      `;
        }).join("");

        productResultsCount.textContent =
            `${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"} found`;

        shopEmptyMessage.hidden = filteredProducts.length !== 0;
    }

    productSearch.addEventListener("input", renderShopProducts);
    productSort.addEventListener("change", renderShopProducts);

    document.querySelectorAll('input[name="categoryFilter"]').forEach((radio) => {
        radio.addEventListener("change", renderShopProducts);
    });

    // Handle buttons on product cards created by JavaScript.
    shopProductGrid.addEventListener("click", (event) => {
        const cartButton = event.target.closest("[data-add-cart]");
        const wishlistButton = event.target.closest("[data-wishlist]");

        if (cartButton) {
            addToCart(cartButton.dataset.addCart);
        }

        if (wishlistButton) {
            toggleWishlist(wishlistButton.dataset.wishlist);
        }
    });

    renderShopProducts();
}


/* =========================
   PRODUCT DETAILS PAGE
========================= */

const productDetail = document.getElementById("productDetail");

if (productDetail) {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    const product = products.find((item) => item.id === productId);

    if (!product) {
        productDetail.innerHTML = `
      <div class="shop-empty-message">
        <h2>Product not found</h2>
        <p>Sorry, we couldn't find that product.</p>
        <a href="products.html" class="btn btn-primary">Back to shop</a>
      </div>
    `;
    } else {
        const isSaved = wishlist.includes(product.id);

        productDetail.innerHTML = `
      <div class="product-detail-layout">
        <div class="product-detail-image">
          <img src="${product.image}" alt="${product.name}">
        </div>

        <div class="product-detail-info">
          <a href="products.html" class="product-back-link">← Back to shop</a>

          <div class="product-detail-category">${product.category}</div>

          <h1>${product.name}</h1>

          <div class="product-detail-rating">
            <span>★★★★★</span>
            <small>${product.rating} · ${product.reviews} reviews</small>
          </div>

          <div class="product-detail-price">
            <strong>$${product.price.toFixed(2)}</strong>
            <del>$${product.oldPrice.toFixed(2)}</del>
          </div>

          <p class="product-detail-description">${product.description}</p>

          <hr class="product-detail-divider">

          <div class="product-detail-perks">
            <span>✓ Carefully selected quality</span>
            <span>✓ Complimentary shipping on orders over $100</span>
            <span>✓ Easy-to-browse online shopping demo</span>
          </div>

          <div class="product-detail-actions">
            <button class="product-detail-add" id="detailAddToCart" type="button">
              Add to cart — $${product.price.toFixed(2)}
            </button>

            <button
              class="product-detail-wishlist ${isSaved ? "active" : ""}"
              id="detailWishlist"
              type="button"
              aria-label="Toggle wishlist"
              aria-pressed="${isSaved}"
            >${isSaved ? "♥" : "♡"}</button>
          </div>

          <p class="product-detail-note">
            A considered choice for your everyday collection.
          </p>
        </div>
      </div>
    `;

        document.getElementById("detailAddToCart").addEventListener("click", () => {
            addToCart(product.id);
        });

        document.getElementById("detailWishlist").addEventListener("click", () => {
            toggleWishlist(product.id);

            const button = document.getElementById("detailWishlist");
            const saved = wishlist.includes(product.id);

            button.textContent = saved ? "♥" : "♡";
            button.classList.toggle("active", saved);
            button.setAttribute("aria-pressed", String(saved));
        });
    }
}


/* =========================
   SHOPPING CART PAGE
========================= */

const cartItemsContainer = document.getElementById("cartItems");
const cartSummaryContainer = document.getElementById("cartSummary");

if (cartItemsContainer && cartSummaryContainer) {
    function renderCartPage() {
        const validCart = cart.filter((item) =>
            products.some((product) => product.id === item.id)
        );

        cart = validCart;
        saveCart();
        updateCartCount();

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
        <div class="cart-empty">
          <h2>Your bag is waiting.</h2>
          <p>You haven't added any products yet. Discover something you'll love.</p>
          <a href="products.html">Explore the collection →</a>
        </div>
      `;

            cartSummaryContainer.innerHTML = `
        <h2>Order summary</h2>
        <p class="cart-summary-line"><span>Subtotal</span><span>$0.00</span></p>
        <p class="cart-summary-line"><span>Shipping</span><span>$0.00</span></p>
        <p class="cart-summary-line total"><span>Total</span><span>$0.00</span></p>
      `;

            return;
        }

        let subtotal = 0;

        cartItemsContainer.innerHTML = cart.map((item) => {
            const product = products.find((entry) => entry.id === item.id);
            const itemTotal = product.price * item.quantity;

            subtotal += itemTotal;

            return `
        <article class="cart-item">
          <img
            class="cart-item-image"
            src="${product.image}"
            alt="${product.name}"
          >

          <div class="cart-item-info">
            <h3>${product.name}</h3>
            <p class="cart-item-category">${product.category}</p>
            <p class="cart-item-price">$${product.price.toFixed(2)}</p>

            <div class="cart-item-quantity">
              <button type="button" data-cart-action="decrease" data-id="${product.id}" aria-label="Decrease quantity">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-cart-action="increase" data-id="${product.id}" aria-label="Increase quantity">+</button>
            </div>

            <button
              type="button"
              class="cart-item-remove"
              data-cart-action="remove"
              data-id="${product.id}"
            >Remove</button>
          </div>

          <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
        </article>
      `;
        }).join("");

        const shipping = subtotal >= 100 ? 0 : 8.95;
        const total = subtotal + shipping;

        cartSummaryContainer.innerHTML = `
      <h2>Order summary</h2>

      <p class="cart-summary-line">
        <span>Subtotal</span>
        <span>$${subtotal.toFixed(2)}</span>
      </p>

      <p class="cart-summary-line">
        <span>Shipping</span>
        <span>${shipping === 0 ? "Free" : "$" + shipping.toFixed(2)}</span>
      </p>

      <p class="cart-summary-line total">
        <span>Total</span>
        <span>$${total.toFixed(2)}</span>
      </p>

      <div class="cart-shipping-note">
        ${shipping === 0
                ? "You've unlocked complimentary shipping!"
                : `Spend $${(100 - subtotal).toFixed(2)} more to unlock complimentary shipping.`}
      </div>

      <a href="checkout.html" class="cart-checkout-btn">Proceed to checkout →</a>
      <a href="products.html" class="cart-continue-link">Continue shopping</a>
    `;
    }

    cartItemsContainer.addEventListener("click", (event) => {
        const button = event.target.closest("[data-cart-action]");
        if (!button) return;

        const productId = button.dataset.id;
        const action = button.dataset.cartAction;
        const item = cart.find((entry) => entry.id === productId);

        if (!item) return;

        if (action === "increase") {
            item.quantity += 1;
        } else if (action === "decrease") {
            item.quantity -= 1;

            if (item.quantity <= 0) {
                cart = cart.filter((entry) => entry.id !== productId);
            }
        } else if (action === "remove") {
            cart = cart.filter((entry) => entry.id !== productId);
        }

        saveCart();
        renderCartPage();
    });

    renderCartPage();
}


/* =========================
   CHECKOUT PAGE
========================= */

const checkoutOrderSummary = document.getElementById("checkoutOrderSummary");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutMessage = document.getElementById("checkoutMessage");

if (checkoutOrderSummary && checkoutForm) {
    function renderCheckoutSummary() {
        const validCart = cart.filter((item) =>
            products.some((product) => product.id === item.id)
        );

        cart = validCart;
        saveCart();
        updateCartCount();

        if (cart.length === 0) {
            checkoutOrderSummary.innerHTML = `
        <h2>Your order</h2>
        <div class="checkout-empty">
          Your shopping bag is empty.<br>
          Add some products before checking out.
          <br>
          <a href="products.html">Explore the collection →</a>
        </div>
      `;

            checkoutForm.hidden = true;
            return;
        }

        checkoutForm.hidden = false;

        let subtotal = 0;

        const itemsHTML = cart.map((item) => {
            const product = products.find((entry) => entry.id === item.id);
            const itemTotal = product.price * item.quantity;

            subtotal += itemTotal;

            return `
        <div class="checkout-summary-item">
          <img src="${product.image}" alt="${product.name}">

          <div>
            <h3>${product.name}</h3>
            <p>Quantity: ${item.quantity}</p>
          </div>

          <strong>$${itemTotal.toFixed(2)}</strong>
        </div>
      `;
        }).join("");

        const shipping = subtotal >= 100 ? 0 : 8.95;
        const total = subtotal + shipping;

        checkoutOrderSummary.innerHTML = `
      <h2>Your order</h2>

      ${itemsHTML}

      <div class="checkout-summary-totals">
        <p class="checkout-summary-line">
          <span>Subtotal</span>
          <span>$${subtotal.toFixed(2)}</span>
        </p>

        <p class="checkout-summary-line">
          <span>Shipping</span>
          <span>${shipping === 0 ? "Free" : "$" + shipping.toFixed(2)}</span>
        </p>

        <p class="checkout-summary-line total">
          <span>Total</span>
          <span>$${total.toFixed(2)}</span>
        </p>
      </div>
    `;
    }

    checkoutForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (cart.length === 0) {
            checkoutMessage.textContent =
                "Your bag is empty. Please add a product before checking out.";
            return;
        }

        if (!checkoutForm.reportValidity()) return;

        const formData = new FormData(checkoutForm);

        const order = {
            orderNumber: "LX-" + Date.now().toString().slice(-8),
            customer: {
                email: formData.get("email"),
                firstName: formData.get("firstName"),
                lastName: formData.get("lastName"),
                address: formData.get("address"),
                city: formData.get("city"),
                postalCode: formData.get("postalCode"),
                country: formData.get("country")
            },
            items: cart.map((item) => ({ ...item })),
            paymentMethod: formData.get("payment"),
            createdAt: new Date().toISOString()
        };

        localStorage.setItem("luxecart-last-order", JSON.stringify(order));

        cart = [];
        saveCart();
        updateCartCount();

        checkoutForm.hidden = true;
        checkoutOrderSummary.innerHTML = `
      <h2>Order received!</h2>
      <div class="checkout-empty">
        Your demo order has been recorded in this browser.
        <br><br>
        Order reference: <strong>${order.orderNumber}</strong>
        <br><br>
        No payment has been collected.
        <br>
        <a href="products.html">Continue shopping →</a>
      </div>
    `;

        checkoutMessage.textContent =
            `Thank you, ${order.customer.firstName}! Your demo order has been placed.`;
    });

    renderCheckoutSummary();
}


/* =========================
   LOGIN PAGE DEMO
========================= */

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

if (loginForm && loginMessage) {
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();

        loginMessage.textContent =
            `Demo sign-in submitted for ${email}. A real account system is not connected yet.`;
    });
}


/* =========================
   SIGNUP PAGE DEMO
========================= */

const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("signupMessage");

if (signupForm && signupMessage) {
    signupForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword =
            document.getElementById("signupConfirmPassword").value;

        if (password !== confirmPassword) {
            signupMessage.textContent = "Your passwords do not match.";
            signupMessage.style.color = "#b42318";
            return;
        }

        signupMessage.style.color = "#276749";
        signupMessage.textContent =
            `Thanks, ${name}! Your demo signup form was submitted for ${email}. A real account has not been created.`;

        signupForm.reset();
    });
}


/* =========================
   CUSTOMER ACCOUNT FUNCTIONALITY
========================= */

const accountProfileForm = document.getElementById("accountProfileForm");
const accountWishlistItems = document.getElementById("accountWishlistItems");
const accountWishlistCount = document.getElementById("accountWishlistCount");

if (accountProfileForm && accountWishlistItems && accountWishlistCount) {
    const accountName = document.getElementById("accountName");
    const accountEmail = document.getElementById("accountEmail");
    const accountAvatar = document.getElementById("accountAvatar");
    const accountStatus = document.getElementById("accountStatus");
    const accountSigninLink = document.getElementById("accountSigninLink");
    const accountLogout = document.getElementById("accountLogout");

    function renderAccountProfile() {
        const profile = JSON.parse(
            localStorage.getItem("luxecart-profile") || "null"
        );

        if (profile) {
            accountName.textContent = profile.name;
            accountEmail.textContent = profile.email;
            accountAvatar.textContent = profile.name.charAt(0).toUpperCase();

            document.getElementById("accountFullName").value = profile.name;
            document.getElementById("accountProfileEmail").value = profile.email;

            accountSigninLink.hidden = true;
            accountLogout.hidden = false;
        } else {
            accountName.textContent = "Guest Shopper";
            accountEmail.textContent = "Sign in to personalize your account.";
            accountAvatar.textContent = "G";

            document.getElementById("accountFullName").value = "";
            document.getElementById("accountProfileEmail").value = "";

            accountSigninLink.hidden = false;
            accountLogout.hidden = true;
        }
    }

    function renderAccountWishlist() {
        wishlist = JSON.parse(
            localStorage.getItem("luxecart-wishlist") || "[]"
        );

        const savedProducts = products.filter((product) =>
            wishlist.includes(product.id)
        );

        accountWishlistCount.textContent =
            `${savedProducts.length} ${savedProducts.length === 1 ? "item" : "items"}`;

        if (savedProducts.length === 0) {
            accountWishlistItems.innerHTML = `
        <p class="account-empty-message">
          Your wishlist is waiting for something special.
          <a href="products.html">Explore the collection →</a>
        </p>
      `;
            return;
        }

        accountWishlistItems.innerHTML = savedProducts.map((product) => `
      <article class="account-wishlist-item">
        <img
          class="account-wishlist-image"
          src="${product.image}"
          alt="${product.name}"
        >

        <div class="account-wishlist-info">
          <h3>${product.name}</h3>
          <p>${product.category}</p>
          <span class="account-wishlist-price">
            $${product.price.toFixed(2)}
          </span>
        </div>

        <div class="account-wishlist-actions">
          <a href="product.html?id=${product.id}">View product</a>
          <button
            class="account-wishlist-remove"
            type="button"
            data-remove-wishlist="${product.id}"
          >Remove</button>
          <button
            class="account-wishlist-remove"
            type="button"
            data-account-add-cart="${product.id}"
          >Add to cart +</button>
        </div>
      </article>
    `).join("");
    }

    accountProfileForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("accountFullName").value.trim();
        const email = document.getElementById("accountProfileEmail").value.trim();

        if (!name || !email) return;

        localStorage.setItem(
            "luxecart-profile",
            JSON.stringify({ name, email })
        );

        renderAccountProfile();

        accountStatus.textContent = "Your profile has been saved in this browser.";
        accountStatus.style.color = "#276749";
    });

    accountWishlistItems.addEventListener("click", (event) => {
        const removeButton = event.target.closest("[data-remove-wishlist]");
        const addButton = event.target.closest("[data-account-add-cart]");

        if (removeButton) {
            const productId = removeButton.dataset.removeWishlist;

            wishlist = wishlist.filter((id) => id !== productId);
            saveWishlist();
            renderAccountWishlist();
            updateWishlistButtons();
        }

        if (addButton) {
            addToCart(addButton.dataset.accountAddCart);
        }
    });

    accountLogout.addEventListener("click", () => {
        localStorage.removeItem("luxecart-profile");
        renderAccountProfile();
        accountStatus.textContent = "You have signed out of this demo profile.";
        accountStatus.style.color = "#276749";
    });

    renderAccountProfile();
    renderAccountWishlist();
}


/* =========================
   CONTACT FORM DEMO
========================= */

const contactForm = document.getElementById("contactForm");
const contactMessage = document.getElementById("contactMessage");

if (contactForm && contactMessage) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("contactName").value.trim();

        contactMessage.textContent =
            `Thank you, ${name}! Your message form was submitted successfully in this demo. No message was sent to a real support team.`;

        contactForm.reset();
    });
}
