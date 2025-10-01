const express = require('express');
const router = express.Router();

router.get('/:query', (req, res) => {
  const { query } = req.params;
  res.send(`Database query: ${query}`);
});

module.exports = router;
