const express = require('express');
const router = express.Router();
const { checkAvailability } = require('../controllers/bookingController');

router.post('/check-availability', checkAvailability);

module.exports = router;