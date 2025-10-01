const express = require('express');
const router = express.Router();

router.get('/:action', (req, res) => {
  const { action } = req.params;
  res.send(`AI action: ${action}`);
});

module.exports = router;
