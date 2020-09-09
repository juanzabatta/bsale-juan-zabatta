const express = require('express');
const router = express.Router();
const pool = require('../DB/connection');

// Read All products
router.get('/products', async (req, res) => {
  const products = `SELECT product.id, product.name, product.url_image, product.price, product.discount, category.name category
                    FROM product
                    LEFT JOIN category
                    ON product.category = category.id
                    ORDER BY category.name ASC`;

  pool.query(products, (error, results, fields) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.json('Not result');
    }
  });
});

// Read products for category
router.get('/products/:cat', async (req, res) => {
  let { cat } = req.params;

  // Replace the + with a space
  cat = cat.replace("+", " ");

  const products = `SELECT product.id, product.name, product.url_image, product.price, product.discount, category.name category
                    FROM product
                    LEFT JOIN category
                    ON product.category = category.id
                    WHERE
                    category.name LIKE '${cat}' `;

  pool.query(products, (error, results, fields) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.json(data = 'Not result');
    }
  });

});

// Read products Search
router.get('/search/:sch', async (req, res) => {
  let { sch } = req.params;
  // Replace the + with a space
  sch = sch.replace(/\+/, ' ');

  let category;
  let search;
  let operator;

  // Determines if you are searching in one category or in all products
  if (sch.search("_") !== -1) {
    category = sch.slice(0, sch.search("_"));
    search = sch.slice(sch.search("_") + 1, sch.length);
    operator = 'AND';

  } else {
    search = sch;
    category = sch;
    operator = 'OR';
  }

  const products = `SELECT product.id, product.name, product.url_image, product.price, product.discount, category.name category
                    FROM product
                    LEFT JOIN category
                    ON product.category = category.id
                    WHERE
                    product.id LIKE '%${search}%' OR
                    product.name LIKE '%${search}%' ${operator}
                    category.name LIKE '%${category}%' `;

  pool.query(products, (error, results, fields) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.json(data = 'Not result');
    }
  });

});

module.exports = router;
