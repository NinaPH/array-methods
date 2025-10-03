let productList = document.querySelector(".product-list");
let cartDiv = document.querySelector(".cart");
let cartBtn = document.querySelector(".cart-btn");
let filterContainer = document.querySelector(".filter-container");
let maxPriceEl = document.getElementById("max-price");
let searchInputEl = document.getElementById("search");
let categoriesEl = document.getElementById("categories");
let cartTotalEl = document.querySelector(".cart-total");

let totalPrice = 0;
let cart = [];
let products = [];
let categories = ["all"];
let selectedCategory = "all";

//mangler funktionalitet: filter ud fra søgeord + min pris

function applyFilters() {
  const searchInput = searchInputEl.value.toLowerCase();
  const maxPrice = Number(maxPriceEl.value);

  const filteredProducts = products.filter((p) => {
    const matchesPrice = p.price <= maxPrice;
    const matchesSearch = p.title.toLowerCase().includes(searchInput);
    const matchesCategory =
      selectedCategory == "all" || p.category == selectedCategory;
    return matchesPrice && matchesSearch && matchesCategory;
  });

  renderProducts(filteredProducts);
}

fetch("https://fakestoreapi.com/products")
  .then((result) => result.json())
  .then((data) => {
    products = data;
    maxPriceEl.max = Math.ceil(Math.max(...data.map((p) => p.price)));
    maxPriceEl.value = maxPriceEl.max;
    applyFilters();
  });

function updateCart(item) {
  cart = [...cart, item];
  cartBtn.textContent = `Cart (${cart.length})`;

  totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotalEl.textContent = `Total price: $${totalPrice.toFixed(2)}`;
  console.log(cart);
}

function renderProducts(data) {
  productList.innerHTML = "";
  data.forEach((item) => {
    ({ id, title, price, description, category, image } = item);

    const productContainer = document.createElement("div");
    productContainer.classList.add("product-container");
    productList.appendChild(productContainer);

    const imageEl = document.createElement("img");
    imageEl.classList.add("image");
    imageEl.src = image;
    productContainer.appendChild(imageEl);

    const titleEl = document.createElement("p");
    titleEl.classList.add("title");
    titleEl.textContent = title;
    productContainer.appendChild(titleEl);

    const priceEl = document.createElement("h3");
    priceEl.classList.add("price");
    priceEl.textContent = `$ ${price}`;
    productContainer.appendChild(priceEl);

    const addToCartBtn = document.createElement("button");
    addToCartBtn.textContent = "Add to Cart";
    productContainer.appendChild(addToCartBtn);

    const descriptionEl = document.createElement("p");
    descriptionEl.classList.add("description");
    descriptionEl.textContent = description;
    productContainer.appendChild(descriptionEl);

    if (!categories.includes(category)) {
      categories.push(category);
    }

    addToCartBtn.addEventListener("click", () => {
      updateCart(item);
    });
  });

  const currentSelection = categoriesEl.value;

  categories.sort();
  categoriesEl.innerHTML = "";
  categories.forEach((category) => {
    categoriesEl.add(new Option(category, category));
  });

  categoriesEl.value = currentSelection;
}

maxPriceEl.addEventListener("input", applyFilters);

searchInputEl.addEventListener("input", applyFilters);

categoriesEl.addEventListener("change", (e) => {
  selectedCategory = e.target.value;
  applyFilters();
});
