const express = require('express');
const router = express.Router();
const pool = require('../DB/connection');

// Read products
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

// Read products Search
router.get('/search/:search', async (req, res) => {
  const { search } = req.params;

  const products = `SELECT product.id, product.name, product.url_image, product.price, product.discount, category.name category
                    FROM product
                    LEFT JOIN category
                    ON product.category = category.id
                    WHERE
                    product.id LIKE '%${search}%' OR
                    product.name LIKE '%${search}%' OR
                    category.name LIKE '%${search}%' `;

  pool.query(products, (error, results, fields) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('Not result');
    }
  });

});

module.exports = router;
