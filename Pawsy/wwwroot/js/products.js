document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // FILTROWANIE I SORTOWANIE PRODUKTÓW
  // ==========================================

  const grid = document.querySelector("#products-grid");

  if (!grid) return;

  const cards = [...grid.querySelectorAll(".product-card")];

  const subcategoryInputs = [
    ...document.querySelectorAll('input[name="subcategory"]'),
  ];

  const allSubcategories = document.querySelector("#all-subcategories");
  const maxPriceInput = document.querySelector("#max-price");
  const sortSelect = document.querySelector("#sort-products");
  const clearButton = document.querySelector("#clear-filters");
  const countLabel = document.querySelector("#product-count");
  const emptyMessage = document.querySelector("#empty-products");

  // ==========================================
  // FILTROWANIE
  // ==========================================

  function updateCatalog() {
    const selectedSubcategories = subcategoryInputs
      .filter((input) => input.checked)
      .map((input) => input.value);

    const showAll = selectedSubcategories.length === 0;

    if (allSubcategories) {
      allSubcategories.checked = showAll;
    }

    const maxPrice =
      !maxPriceInput || maxPriceInput.value === ""
        ? Infinity
        : Number(maxPriceInput.value);

    let visibleCount = 0;

    cards.forEach((card) => {
      const subcategory = card.dataset.subcategory;
      const price = Number(card.dataset.price);

      const matchesSubcategory =
        showAll || selectedSubcategories.includes(subcategory);

      const matchesPrice = price <= maxPrice;

      const visible = matchesSubcategory && matchesPrice;

      card.hidden = !visible;

      if (visible) visibleCount++;
    });

    if (countLabel) {
      countLabel.textContent = `${visibleCount} produktów`;
    }

    if (emptyMessage) {
      emptyMessage.hidden = visibleCount > 0;
    }
  }

  // ==========================================
  // SORTOWANIE
  // ==========================================

  function sortProducts() {
    const sort = sortSelect?.value ?? "default";

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

    sortedCards.forEach((card) => grid.appendChild(card));
  }

  // ==========================================
  // OBSŁUGA PODKATEGORII
  // ==========================================

  subcategoryInputs.forEach((input) => {
    input.addEventListener("change", updateCatalog);
  });

  if (allSubcategories) {
    allSubcategories.addEventListener("change", () => {
      if (allSubcategories.checked) {
        subcategoryInputs.forEach((input) => {
          input.checked = false;
        });
      } else {
        // Jeśli nie wybrano podkategorii,
        // wszystkie pozostają aktywne.
        if (!subcategoryInputs.some((input) => input.checked)) {
          allSubcategories.checked = true;
        }
      }

      updateCatalog();
    });
  }

  // Filtrowanie po cenie
  maxPriceInput?.addEventListener("input", updateCatalog);

  // Sortowanie
  sortSelect?.addEventListener("change", sortProducts);

  // ==========================================
  // RESET FILTRÓW
  // ==========================================

  clearButton?.addEventListener("click", () => {
    subcategoryInputs.forEach((input) => {
      input.checked = false;
    });

    if (allSubcategories) {
      allSubcategories.checked = true;
    }

    if (maxPriceInput) {
      maxPriceInput.value = "";
    }

    if (sortSelect) {
      sortSelect.value = "default";
    }

    sortProducts();
    updateCatalog();
  });

  // ==========================================
  // INICJALIZACJA
  // ==========================================

  updateCatalog();
});
