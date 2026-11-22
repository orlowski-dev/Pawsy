document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("#products-grid");

  if (!grid) return;

  const cards = [...grid.querySelectorAll(".product-card")];

  const categoryInputs = document.querySelectorAll('input[name="category"]');

  const maxPriceInput = document.querySelector("#max-price");
  const sortSelect = document.querySelector("#sort-products");
  const clearButton = document.querySelector("#clear-filters");
  const countLabel = document.querySelector("#product-count");
  const emptyMessage = document.querySelector("#empty-products");

  function updateCatalog() {
    const selectedCategory =
      document.querySelector('input[name="category"]:checked')?.value ?? "all";

    const maxPrice =
      maxPriceInput.value === "" ? Infinity : Number(maxPriceInput.value);

    let visibleCount = 0;

    cards.forEach((card) => {
      const category = card.dataset.category;
      const price = Number(card.dataset.price);

      const matchesCategory =
        selectedCategory === "all" || category === selectedCategory;

      const matchesPrice = price <= maxPrice;

      const visible = matchesCategory && matchesPrice;

      card.hidden = !visible;

      if (visible) visibleCount++;
    });

    countLabel.textContent = `${visibleCount} produktów`;
    emptyMessage.hidden = visibleCount > 0;
  }

  function sortProducts() {
    const sort = sortSelect.value;

    const sortedCards = [...cards];

    if (sort === "price-asc") {
      sortedCards.sort(
        (a, b) => Number(a.dataset.price) - Number(b.dataset.price),
      );
    }

    if (sort === "price-desc") {
      sortedCards.sort(
        (a, b) => Number(b.dataset.price) - Number(a.dataset.price),
      );
    }

    if (sort === "name") {
      sortedCards.sort((a, b) =>
        a.dataset.name.localeCompare(b.dataset.name, "pl"),
      );
    }

    if (sort === "default") {
      sortedCards.splice(0, sortedCards.length, ...cards);
    }

    sortedCards.forEach((card) => grid.appendChild(card));
  }

  categoryInputs.forEach((input) => {
    input.addEventListener("change", updateCatalog);
  });

  maxPriceInput.addEventListener("input", updateCatalog);

  sortSelect.addEventListener("change", sortProducts);

  clearButton.addEventListener("click", () => {
    const allCategory = document.querySelector(
      'input[name="category"][value="all"]',
    );

    if (allCategory) allCategory.checked = true;

    maxPriceInput.value = "";
    sortSelect.value = "default";

    sortProducts();
    updateCatalog();
  });

  updateCatalog();
});

// ULUBIONE

const storageKey = "pawsy-favorites";

function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? "[]");

    return new Set(Array.isArray(saved) ? saved : []);
  } catch {
    return new Set();
  }
}

const favorites = loadFavorites();

function updateFavoriteButton(button) {
  const productId = button.dataset.productId;
  const isFavorite = favorites.has(productId);

  const productName =
    button
      .closest(".product-card")
      ?.querySelector(".product-name")
      ?.textContent?.trim() ?? "produkt";

  button.classList.toggle("is-favorite", isFavorite);

  button.setAttribute("aria-pressed", String(isFavorite));

  button.setAttribute(
    "aria-label",
    isFavorite
      ? `Usuń ${productName} z ulubionych`
      : `Dodaj ${productName} do ulubionych`,
  );

  button.title = isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych";
}

document.querySelectorAll(".favorite-btn").forEach((button) => {
  updateFavoriteButton(button);

  button.addEventListener("click", () => {
    const productId = button.dataset.productId;

    if (!productId) return;

    if (favorites.has(productId)) {
      favorites.delete(productId);
    } else {
      favorites.add(productId);
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify([...favorites]));
    } catch (error) {
      console.warn("Nie udało się zapisać ulubionych.", error);
    }

    updateFavoriteButton(button);
  });
});
