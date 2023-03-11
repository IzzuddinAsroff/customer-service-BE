const express = require("express")
const router = express.Router();

const customerRoutes = require('./customer.js')

router.use(customerRoutes)


module.exports = router;