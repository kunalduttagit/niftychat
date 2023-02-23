const express = require("express");
const { registerUser, authUser, allUsers } = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router(); //instance of router from express

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);
//both ways work
//router.route('/').get(allUsers); since route is same, we can chain/append it to registerUser route

module.exports = router;
