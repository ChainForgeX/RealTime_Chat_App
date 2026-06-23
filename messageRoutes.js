const express = require("express");
const router = express.Router();
const{getMessages} = require("../controller/messageController");
router.get("/", getMessages);

module.exports = router;