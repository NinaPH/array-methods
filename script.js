let productList = document.querySelector(".product-list");
let cart = [];
let cartDiv = document.querySelector(".cart");
let cartBtn = document.querySelector(".cart-btn");

let filterContainer = document.querySelector(".filter-container");
let maxPriceEl = document.getElementById("max-price");

let products = [];

//mangler funktionalitet: filter ud fra søgeord + min pris

updateCartBtn();

fetch("https://fakestoreapi.com/products")
  .then((result) => result.json())
  .then((data) => {
    products = data;
    maxPriceEl.max = Math.max(...data.map((p) => p.price));
    renderProducts(products);
  });

function updateCartBtn() {
  cartBtn.textContent = `Cart (${cart.length})`;
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

    addToCartBtn.addEventListener("click", () => {
      cart.push(item);
      console.log(cart);
      updateCartBtn();
    });
  });
}

maxPriceEl.addEventListener("input", () => {
  const filteredProducts = products.filter(
    (product) => product.price <= maxPriceEl.value
  );
  renderProducts(filteredProducts);
});
