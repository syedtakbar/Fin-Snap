const router = require("express").Router();
const plaidRoutes = require("./plaid");

router.use("/plaid", plaidRoutes);

module.exports = router;