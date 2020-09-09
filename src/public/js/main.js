'use strict'

let db;
const listProduct = document.getElementById('container-cards');
const loading = document.getElementById('contain-loader');
const alertContainer = document.getElementById('alert-container');
const pagination = document.getElementById('pagination');
let numOfProducts = 0;
let productsForPage = 20;
let page = 1;
let urlApi;

loading.style.display = "flex";

// Get url Parameters
const dataUrl = getParameterUrl();
function getParameterUrl() {
  const data = location.search.slice(8, location.search.length)
  return data.replace('+', " ").replace('%2C', ",");
};

// Setting the url for the api consultation
if (dataUrl === "") {
  urlApi = "products";
} else {
  urlApi = "search/" + dataUrl;
};

// Consult the api and write down the products
getProducts()
  .then(db => {
    //If results are obtained
    if (db && db !== "Not result") {
      numOfProducts = db.length;
      responsive();

      if (numOfProducts <= productsForPage) {
        // Clear list Html
        listProduct.innerHTML = "";

        // Whrite products
        db.forEach(product => {
          writeProducts(product);
        });

      } else {
        paginationNum();
        renderPage(page);
      }

    }
    //If results are not obtained
    if (db && db === "Not result") {
      listProduct.innerHTML = `<p>No se encontraron resultados.</p>`;
    }
  });

// Get products of API
async function getProducts() {
  try {
    let response = await fetch('http://localhost:3000/api/' + urlApi, { method: 'GET' });
    let data = await response.json();
    db = await data;
    loading.style.display = "none";
    return db;

  } catch (error) {
    setTimeout(() => {
      showAlert("Error", "Parece que ha ocurrido un error al intentar cargar los datos.");
    }, 500);
  }
};

// write products in Html with a template
function writeProducts(product) {
  // Formating price
  const price = formatPrice(product.price, product.discount);

  // Check image_url
  let imageUrl;
  if (product.url_image) {
    imageUrl = product.url_image;
  } else {
    imageUrl = "./img/image-not-fount.webp";
  };

  listProduct.innerHTML += `
          <a href="#" class="card">
            <picture class="card-img">
              <img src="${imageUrl}" alt="${product.name}" title="${product.name}" />
            </picture>

            <h3 title="${product.name}">${product.name}</h3>

            <div class="card-content">
              <p class="price">${price}</p>

              <button>
                <img src="./img/cart-icon.webp" alt="Agregar al carrito" title="Agregar" />
              </button>
            </div>
          </a>
          `;
}

// Formating price and apply discount
function formatPrice(price, discount) {
  const disc = 1 - (discount / 100);
  const priceWhithDiscount = (price * disc);
  const priceWithFormat = "$ " + new Intl.NumberFormat(["Cl", "id"], { maximumFractionDigits: 2 }).format(priceWhithDiscount);
  return priceWithFormat;
};

// Show Alert
function showAlert(title, message) {
  alertContainer.innerHTML = `
    <div id="alert">
      <button onclick="location.reload()" title="Cerrar">X</button>

      <img src="./img/error.webp" />
      <p id="title-alert">${ title}</p>
      <p id="message-alert">${ message}</p>
    </div>
    `;
  alertContainer.style.display = "flex";
};

/* ========================================
--------------- Pagination ----------------
=========================================== */
// Return the number of pages
function numPages() {
  return Math.ceil(numOfProducts / productsForPage);
};

// Btn Prev - go to previous page
function prevPage() {
  let prevPage = 1;

  if (page - 1 > 0) {
    prevPage = page - 1;
    page--;
  };
  renderPage(prevPage);
};

// Btn Next - go to next page
function nextPage() {
  let nextPage = numPages();

  if (page + 1 <= nextPage) {
    nextPage = page + 1;
    page++;
  };
  renderPage(nextPage);
};

// Write the necessary buttons according to the number of pages
function paginationNum() {
  const numPage = numPages();
  if (numPage > 1) {
    pagination.style.display = "flex";
  }

  pagination.innerHTML = `<button onclick="prevPage()">&lt;</button>`;

  if (window.innerWidth <= 650) {
    if (page === 1) {
      pagination.innerHTML += `
      <button id="page-${page}" onClick="renderPage(${page})" class="btn-page">${page}</button>
      <button id="page-${page + 1}" onClick="renderPage(${page + 1})" class="btn-page">${page + 1}</button>
      <button id="page-${page + 2}" onClick="renderPage(${page + 2})" class="btn-page">${page + 2}</button>
      `;
    } else {
      pagination.innerHTML += `
      <button id="page-${page - 1}" onClick="renderPage(${page - 1})" class="btn-page">${page - 1}</button>
      <button id="page-${page}" onClick="renderPage(${page})" class="btn-page">${page}</button>
      <button id="page-${page + 1}" onClick="renderPage(${page + 1})" class="btn-page">${page + 1}</button>
      `;
    }

  } else {
    for (let i = 1; i <= numPage; i++) {
      pagination.innerHTML += `
      <button id="page-${i}" onClick="renderPage(${i})" class="btn-page">${i}</button>
      `;
    };
  }


  pagination.innerHTML += `<button onclick="nextPage()">&gt;</button>`;
};

// Determines which products will be written according to the page on which this
function renderPage(pageAct) {
  let productsDisplay = [];
  page = pageAct;

  for (let i = (page - 1) * productsForPage; i < page * productsForPage; i++) {
    if (isNaN(db[i]) && db[i] != undefined) {
      productsDisplay.push(db[i]);
    };
  };

  // Clear list Html
  listProduct.innerHTML = "";

  // Whrite products
  productsDisplay.forEach(product => {
    writeProducts(product);
  });

  // Write the necessary buttons according to the number of pages
  paginationNum();

  // Controls the active class for the paging buttons
  pageActive();

  // Scroll Up when the button is pressed
  window.scroll({ top: 0 });
};

// Controls the active class for the paging buttons
function pageActive() {
  const btnsPagination = document.querySelector(".active");

  if (btnsPagination !== undefined && btnsPagination !== null) {
    btnsPagination.classList.remove("active");
  }

  document.getElementById('page-' + page).className += " active";
};

// Determines the number of products per page, according to the width of the screen
function responsive() {
  let factor = 10;

  if (listProduct.clientWidth <= 790 && listProduct.clientWidth > 779) {
    factor = 20;
  } else if (listProduct.clientWidth <= 1059 && listProduct.clientWidth > 1039) {
    factor = 30;
  }

  productsForPage = Math.floor((listProduct.clientWidth) / (250 + factor)) * 5;

  // When one is in a small window on a high page number and goes to a large window whose previous page number does not exist, an error occurs, that solves it
  if (page > numPages()) {
    page = 1;
  };

  renderPage(page);
};
