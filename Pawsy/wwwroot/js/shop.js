document.addEventListener("DOMContentLoaded", () => {
  const CART_KEY = "pawsy-cart";
  const FAVORITES_KEY = "pawsy-favorites";
  const PLACEHOLDER = "/images/products/placeholder.png";

  const currency = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  });

  // ========================================
  // LOCAL STORAGE
  // ========================================

  function readStorage(key) {
    try {
      const data = JSON.parse(localStorage.getItem(key) ?? "[]");
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function validProduct(p) {
    return (
      p &&
      typeof p.id === "string" &&
      typeof p.name === "string" &&
      typeof p.image === "string" &&
      Number.isSafeInteger(p.priceGrosze) &&
      p.priceGrosze >= 0
    );
  }

  let cart = readStorage(CART_KEY).filter(
    (p) =>
      validProduct(p) && Number.isSafeInteger(p.quantity) && p.quantity > 0,
  );

  let favorites = readStorage(FAVORITES_KEY).filter(validProduct);

  function persist(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn("Nie udało się zapisać danych:", error);
    }
  }

  function saveCart() {
    persist(CART_KEY, cart);
    renderCart();
    updateHeader();
  }

  function saveFavorites() {
    persist(FAVORITES_KEY, favorites);
    updateHearts();
    renderFavorites();
    updateHeader();
  }

  // ========================================
  // ODCZYT PRODUKTU Z KARTY KATALOGU
  // ========================================

  function getProductFromCard(card) {
    if (!card) return null;

    const id = card.dataset.productId;
    const name = card.dataset.name;
    const price = Number(card.dataset.price);

    if (!id || !name || !Number.isFinite(price) || price < 0) {
      return null;
    }

    const image =
      card.querySelector(".product-image img")?.getAttribute("src") ||
      PLACEHOLDER;

    return {
      id,
      name,
      priceGrosze: Math.round(price * 100),
      image,
    };
  }

  // ========================================
  // KOSZYK - OPERACJE
  // ========================================

  function addToCart(product) {
    const existing = cart.find((p) => p.id === product.id);

    if (existing) {
      existing.quantity++;
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    saveCart();
  }

  function changeQuantity(id, difference) {
    const item = cart.find((p) => p.id === id);
    if (!item) return;

    item.quantity += difference;

    if (item.quantity <= 0) {
      cart = cart.filter((p) => p.id !== id);
    }

    saveCart();
  }

  function removeFromCart(id) {
    cart = cart.filter((p) => p.id !== id);
    saveCart();
  }

  // ========================================
  // ULUBIONE - OPERACJE
  // ========================================

  function isFavorite(id) {
    return favorites.some((p) => p.id === id);
  }

  function toggleFavorite(product) {
    if (isFavorite(product.id)) {
      favorites = favorites.filter((p) => p.id !== product.id);
    } else {
      favorites.push(product);
    }

    saveFavorites();
  }

  function updateHearts() {
    document.querySelectorAll(".favorite-btn").forEach((button) => {
      const id = button.dataset.productId;
      const selected = isFavorite(id);

      button.classList.toggle("is-favorite", selected);
      button.setAttribute("aria-pressed", String(selected));

      button.setAttribute(
        "aria-label",
        selected ? "Usuń produkt z ulubionych" : "Dodaj produkt do ulubionych",
      );

      button.title = selected ? "Usuń z ulubionych" : "Dodaj do ulubionych";
    });
  }

  // ========================================
  // LICZNIKI W NAGŁÓWKU
  // ========================================

  function setBadge(selector, value) {
    const badge = document.querySelector(selector);
    if (!badge) return;

    badge.textContent = value > 99 ? "99+" : String(value);
    badge.hidden = value === 0;
  }

  function updateHeader() {
    const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    setBadge("#cart-header-count", quantity);
    setBadge("#favorites-header-count", favorites.length);
  }

  // ========================================
  // POMOCNICZE TWORZENIE ELEMENTÓW
  // ========================================

  function el(tag, className = "", text = null) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== null) node.textContent = text;
    return node;
  }

  function actionButton(text, action, id, className = "") {
    const button = el("button", className, text);
    button.type = "button";
    button.dataset.action = action;
    button.dataset.id = id;
    return button;
  }

  function createImage(product, className) {
    const img = el("img", className);

    img.src = product.image || PLACEHOLDER;
    img.alt = product.name;
    img.loading = "lazy";

    img.onerror = () => {
      img.onerror = null;
      img.src = PLACEHOLDER;
    };

    return img;
  }

  // ========================================
  // RENDEROWANIE KOSZYKA
  // ========================================

  function renderCart() {
    const container = document.querySelector("#cart-items");
    if (!container) return;

    const empty = document.querySelector("#cart-empty");
    const content = document.querySelector("#cart-content");

    const isEmpty = cart.length === 0;

    empty.hidden = !isEmpty;
    content.hidden = isEmpty;

    container.replaceChildren();

    if (isEmpty) return;

    cart.forEach((product) => {
      const row = el("article", "cart-item");

      // Zdjęcie produktu
      const image = createImage(product, "cart-item-image");
      row.appendChild(image);

      // Informacje o produkcie
      const info = el("div", "cart-item-info");

      info.appendChild(el("h3", "cart-item-name", product.name));

      info.appendChild(
        el(
          "strong",
          "cart-item-price",
          currency.format(product.priceGrosze / 100),
        ),
      );

      info.appendChild(el("span", "cart-unit-label", "Cena za sztukę"));
      const lineTotalGrosze = product.priceGrosze * product.quantity;
      const lineTotal = el("div", "cart-item-total");

      lineTotal.appendChild(
        el(
          "span",
          "cart-item-total-label",
          `Razem za ${product.quantity} szt.`,
        ),
      );

      lineTotal.appendChild(
        el(
          "strong",
          "cart-item-total-value",
          currency.format(lineTotalGrosze / 100),
        ),
      );

      info.appendChild(lineTotal);
      // Sterowanie ilością
      const controls = el("div", "cart-item-actions");

      const quantity = el("div", "cart-quantity");

      const decrease = actionButton("−", "decrease", product.id);
      decrease.setAttribute(
        "aria-label",
        `Zmniejsz ilość produktu ${product.name}`,
      );

      const amount = el(
        "span",
        "cart-quantity-value",
        String(product.quantity),
      );

      const increase = actionButton("+", "increase", product.id);
      increase.setAttribute(
        "aria-label",
        `Zwiększ ilość produktu ${product.name}`,
      );

      quantity.append(decrease, amount, increase);

      // Usuwanie pojedynczego produktu
      const remove = actionButton("", "remove-cart", product.id, "remove-item");

      remove.setAttribute("aria-label", `Usuń ${product.name} z koszyka`);
      remove.title = "Usuń produkt";

      const svgNS = "http://www.w3.org/2000/svg";
      const icon = document.createElementNS(svgNS, "svg");

      icon.setAttribute("viewBox", "0 0 24 24");
      icon.setAttribute("width", "20");
      icon.setAttribute("height", "20");
      icon.setAttribute("fill", "none");
      icon.setAttribute("stroke", "currentColor");
      icon.setAttribute("stroke-width", "1.8");
      icon.setAttribute("stroke-linecap", "round");
      icon.setAttribute("stroke-linejoin", "round");
      icon.setAttribute("aria-hidden", "true");

      const path = document.createElementNS(svgNS, "path");
      path.setAttribute(
        "d",
        "M3 6h18M8 6V4h8v2M5 6l1 14h12l1-14M10 10v6M14 10v6",
      );

      icon.appendChild(path);
      remove.appendChild(icon);

      controls.append(quantity, remove);

      row.append(info, controls);
      container.appendChild(row);
    });

    const quantity = cart.reduce((sum, product) => sum + product.quantity, 0);

    const totalGrosze = cart.reduce(
      (sum, product) => sum + product.priceGrosze * product.quantity,
      0,
    );

    const total = currency.format(totalGrosze / 100);

    document.querySelector("#cart-item-count").textContent = `(${quantity})`;

    document.querySelector("#cart-subtotal").textContent = total;

    document.querySelector("#cart-total").textContent = total;
  }

  // ========================================
  // RENDEROWANIE ULUBIONYCH
  // ========================================

  function renderFavorites() {
    const container = document.querySelector("#favorites-items");
    if (!container) return;

    const empty = document.querySelector("#favorites-empty");
    const content = document.querySelector("#favorites-content");

    const isEmpty = favorites.length === 0;

    empty.hidden = !isEmpty;
    content.hidden = isEmpty;

    container.replaceChildren();

    if (isEmpty) return;

    favorites.forEach((product) => {
      const card = el("article", "saved-product-card");

      const imageWrapper = el("div", "saved-product-image");

      imageWrapper.appendChild(createImage(product, ""));

      const info = el("div", "saved-product-info");

      info.appendChild(el("h3", "", product.name));

      info.appendChild(
        el(
          "strong",
          "saved-product-price",
          currency.format(product.priceGrosze / 100),
        ),
      );

      const actions = el("div", "saved-product-actions");

      actions.appendChild(
        actionButton(
          "Dodaj do koszyka",
          "add-saved-to-cart",
          product.id,
          "saved-add-cart",
        ),
      );

      actions.appendChild(
        actionButton(
          "Usuń z ulubionych",
          "remove-favorite",
          product.id,
          "saved-remove",
        ),
      );

      info.appendChild(actions);
      card.append(imageWrapper, info);
      container.appendChild(card);
    });

    document.querySelector("#favorites-item-count").textContent =
      `${favorites.length} produktów`;
  }
  function clearCart() {
    if (cart.length === 0) return;

    const confirmed = confirm(
      "Czy na pewno chcesz usunąć wszystkie produkty z koszyka?",
    );

    if (!confirmed) return;

    cart = [];
    saveCart();
  }

  function clearFavorites() {
    if (favorites.length === 0) return;

    const confirmed = confirm(
      "Czy na pewno chcesz usunąć wszystkie ulubione produkty?",
    );

    if (!confirmed) return;

    favorites = [];
    saveFavorites();
  }
  // ========================================
  // OBSŁUGA KLIKNIĘĆ
  // ========================================

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) return;
    // Usuwanie wszystkich produktów z koszyka
    if (target.closest("#clear-cart")) {
      clearCart();
      return;
    }

    // Usuwanie wszystkich ulubionych produktów
    if (target.closest("#clear-favorites")) {
      clearFavorites();
      return;
    }

    // Dodawanie z katalogu do koszyka
    const cartButton = target.closest(".add-to-cart");

    if (cartButton && !cartButton.disabled) {
      const card = cartButton.closest(".product-card");
      const product = getProductFromCard(card);

      if (product) {
        addToCart(product);

        cartButton.classList.remove("is-added");

        // Ponowne uruchomienie animacji
        void cartButton.offsetWidth;

        cartButton.classList.add("is-added");
        cartButton.title = "Dodano do koszyka";

        clearTimeout(cartButton.cartAnimationTimeout);

        cartButton.cartAnimationTimeout = setTimeout(() => {
          cartButton.classList.remove("is-added");
          cartButton.title = "Dodaj do koszyka";
        }, 900);
      }

      return;
    }

    // Serduszko w katalogu
    const favoriteButton = target.closest(".favorite-btn");

    if (favoriteButton) {
      const card = favoriteButton.closest(".product-card");
      const product = getProductFromCard(card);

      if (product) toggleFavorite(product);

      return;
    }

    // Przyciski na podstronach koszyka i ulubionych
    const actionButton = target.closest("[data-action]");
    if (!actionButton) return;

    const action = actionButton.dataset.action;
    const id = actionButton.dataset.id;

    if (!id) return;

    if (action === "increase") {
      changeQuantity(id, 1);
    }

    if (action === "decrease") {
      changeQuantity(id, -1);
    }

    if (action === "remove-cart") {
      removeFromCart(id);
    }

    if (action === "remove-favorite") {
      favorites = favorites.filter((p) => p.id !== id);
      saveFavorites();
    }

    if (action === "add-saved-to-cart") {
      const product = favorites.find((p) => p.id === id);

      if (product) addToCart(product);
    }
  });

  // ========================================
  // INICJALIZACJA
  // ========================================

  updateHeader();
  updateHearts();
  renderCart();
  renderFavorites();
});
