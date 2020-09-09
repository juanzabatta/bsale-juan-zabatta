'use strict'

let db;
const listProduct = document.getElementById('container-cards');
const loading = document.getElementById('contain-loader');
const alertContainer = document.getElementById('alert-container');
const pagination = document.getElementById('pagination');
const menuDropDown = document.getElementById('menu-drop-down');
const menuIcon = document.getElementById('menu-icon');
const titleMain = document.getElementById('main-title');
const menuCategory = document.getElementById('menu-category');
let showMenu = false;
let numOfProducts = 0;
let productsForPage = 20;
let page = 1;
let urlApi;
let urlBaseApi;

// Get the navigation url and set the base url for the API query
if (document.domain === "bsale-juanzabatta.herokuapp.com") {
  urlBaseApi = "https://bsale-juanzabatta.herokuapp.com/";
} else {
  urlBaseApi = "http://localhost:3000/";
};

// Show loading
loading.style.display = "flex";

// Get URL parameters for search
const dataUrl = getParameterUrl();
function getParameterUrl() {
  const data = location.search.slice(8, location.search.length)
  return data.replace('+', " ").replace('%2C', ",");
};
// Get URL path
const path = window.location.pathname.slice(1, window.location.pathname.length);

// Setting the url for the api consultation
if (dataUrl === "" && path === "") {
  // Route home
  urlApi = "products/";
  // Clear list Html and set title
  titleCategory()

} else if (dataUrl === "" && path !== "") {
  // Route category
  urlApi = "products/" + path;

  // Clear list Html and set title
  titleCategory();

} else {
  // Route search
  if (path === "") {
    // Search in home
    urlApi = "search/" + dataUrl;
  } else {
    // Search in category
    urlApi = "search/" + path + '_' + dataUrl;

  };
  // Clear list Html and set title
  titleCategory();
};

// Clear list Html and set title
function titleCategory() {
  console.log(path);
  switch (path) {
    case "bebida+energetica":
      titleMain.textContent = `Bebidas Energéticas`;
      break;

    case "pisco":
      titleMain.textContent = `Piscos`;
      break;

    case "ron":
      titleMain.textContent = `Rones`;
      break;

    case "bebida":
      titleMain.textContent = `Bebidas`;
      break;

    case "snack":
      titleMain.textContent = `Snacks`;
      break;

    case "cerveza":
      titleMain.textContent = `Cervezas`;
      break;

    case "vodka":
      titleMain.textContent = `Vodkas`;
      break;

    default:
      titleMain.textContent = `Todos los productos`;
      break;

  }
}
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
        listProduct.innerHTML = "";
        paginationNum();
        renderPage(page);
      }

    } else {
      //If results are not obtained
      listProduct.innerHTML = `<p>No se encontraron resultados.</p>`;
    };

  });

// Get products of API
async function getProducts() {
  try {
    let response = await fetch(urlBaseApi + 'api/' + urlApi, { method: 'GET' });
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
          <a href="" onClick="alert('Página no disponible.')" class="card">
            <picture class="card-img">
              <img src="${imageUrl}" alt="${product.name}" title="${product.name}" />
            </picture>

            <h3 title="${product.name}">${product.name}</h3>

            <div class="card-content">
              <p class="price">${price}</p>

              <button >
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

// Show / Hidden menu in phone Views
menuIcon.addEventListener('click', () => showMenus());

function showMenus() {
  showMenu = !showMenu;

  if (showMenu) {
    menuDropDown.style.display = "flex";
    menuIcon.classList.add('change');
    menuCategory.style.display = "block";
  } else {
    menuDropDown.style.display = "none";
    menuIcon.classList.remove('change');
    menuCategory.style.display = "none";
  };
}

/* ========================================
--------------- Pagination ----------------
=========================================== */
// Return the number of pages
function numPages() {
  return Math.ceil(numOfProducts / productsForPage);
};

// Btn Prev - go to previous page
function prevPage() {
  // In phone views this button is go to first page and not go to previous page
  let prevPage = 1;

  if (window.innerWidth > 650) {
    // In normal views this button is previous page

    if (page - 1 > 0) {
      prevPage = page - 1;
      page--;
    };
  };

  renderPage(prevPage);
};

// Btn Next - go to next page
function nextPage() {
  const lastPage = numPages();
  // In phone views this button is go to last page and not go to next page
  let nextPage = lastPage;

  if (window.innerWidth > 650) {
    // In normal views this button is next page
    if (page + 1 <= lastPage) {
      nextPage = page + 1;
      page++;
    };
  }

  renderPage(nextPage);
};

// Write the necessary buttons according to the number of pages
function paginationNum() {
  const lastPage = numPages();

  // Shows the pagination if the number of pages is greater than 1
  if (lastPage > 1) {
    pagination.style.display = "flex";
  };

  if (window.innerWidth <= 650) {
    // Phone mode - write 5 buttons only
    pagination.innerHTML = `<button onclick="prevPage()">&lt;&lt;</button>`;

    if (page === 1) {
      pagination.innerHTML += `
      <button id="page-${page}" onClick="renderPage(${page})" class="btn-page">${page}</button>
      <button id="page-${page + 1}" onClick="renderPage(${page + 1})" class="btn-page">${page + 1}</button>
      <button id="page-${page + 2}" onClick="renderPage(${page + 2})" class="btn-page">${page + 2}</button>
      `;
    } else if (page === lastPage) {
      pagination.innerHTML += `
      <button id="page-${page - 2}" onClick="renderPage(${page - 2})" class="btn-page">${page - 2}</button>
      <button id="page-${page - 1}" onClick="renderPage(${page - 1})" class="btn-page">${page - 1}</button>
      <button id="page-${page}" onClick="renderPage(${page})" class="btn-page">${page}</button>
      `;
    } else {
      pagination.innerHTML += `
      <button id="page-${page - 1}" onClick="renderPage(${page - 1})" class="btn-page">${page - 1}</button>
      <button id="page-${page}" onClick="renderPage(${page})" class="btn-page">${page}</button>
      <button id="page-${page + 1}" onClick="renderPage(${page + 1})" class="btn-page">${page + 1}</button>
      `;
    }
    pagination.innerHTML += `<button onclick="nextPage()">&gt;&gt;</button>`;

  } else {
    // Normal mode - write all buttons
    pagination.innerHTML = `<button onclick="prevPage()">&lt;</button>`;

    for (let i = 1; i <= lastPage; i++) {
      pagination.innerHTML += `
      <button id="page-${i}" onClick="renderPage(${i})" class="btn-page">${i}</button>
      `;
    };
    pagination.innerHTML += `<button onclick="nextPage()">&gt;</button>`;

  };

};

// Determines which products will be written according to the page on which this
function renderPage(pageAct) {
  let productsDisplay = [];
  page = pageAct;

  for (let i = (page - 1) * productsForPage; i < page * productsForPage; i++) {
    if (db && isNaN(db[i]) && db[i] != undefined) {
      productsDisplay.push(db[i]);
    };
  };

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

  const pageActive = document.getElementById('page-' + page);
  if (pageActive) pageActive.className += " active";

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

// When the dimensions of the window change, the number of products to be displayed per page is checked
window.addEventListener('resize', () => responsive());