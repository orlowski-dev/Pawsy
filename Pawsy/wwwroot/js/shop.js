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

      row.appendChild(createImage(product, "cart-item-image"));

      const info = el("div", "cart-item-info");

      info.appendChild(el("h3", "cart-item-name", product.name));

      info.appendChild(
        el(
          "p",
          "cart-item-price",
          `${currency.format(product.priceGrosze / 100)} / szt.`,
        ),
      );

      const quantity = el("div", "cart-quantity");

      quantity.appendChild(actionButton("−", "decrease", product.id));

      quantity.appendChild(el("span", "", String(product.quantity)));

      quantity.appendChild(actionButton("+", "increase", product.id));

      info.appendChild(quantity);

      const actions = el("div", "cart-item-actions");

      const lineTotal = product.priceGrosze * product.quantity;

      actions.appendChild(
        el("strong", "cart-line-total", currency.format(lineTotal / 100)),
      );

      actions.appendChild(
        actionButton("Usuń", "remove-cart", product.id, "remove-item"),
      );

      row.append(info, actions);
      container.appendChild(row);
    });

    const quantity = cart.reduce((sum, p) => sum + p.quantity, 0);

    const totalGrosze = cart.reduce(
      (sum, p) => sum + p.priceGrosze * p.quantity,
      0,
    );

    const total = currency.format(totalGrosze / 100);

    document.querySelector("#cart-item-count").textContent = `${quantity} szt.`;

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

  // ========================================
  // OBSŁUGA KLIKNIĘĆ
  // ========================================

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    // Dodawanie z katalogu do koszyka
    const cartButton = target.closest(".add-to-cart");

    if (cartButton && !cartButton.disabled) {
      const card = cartButton.closest(".product-card");
      const product = getProductFromCard(card);

      if (product) {
        addToCart(product);

        cartButton.title = "Dodano do koszyka";
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
