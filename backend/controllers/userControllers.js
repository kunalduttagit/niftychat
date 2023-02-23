const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

//Registration OR SignUp
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill all required fields");
    }

    const userExists = await User.findOne({ email }); //fiindOne is mongoDb querry

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        throw new Error("Failed to create your account! Please try again");
    }
});

//Login
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = await req.body;
    console.log(req);

    const user = await User.findOne({ email }); //if user exits

    //user is taken from the email id from userModel, then the password is destructured from the req.body in frontend
    //after that, we pass the password in matchPassword function for the user we got from req. If password from userModel mathches the password from req body
    //we return a API like json for further, controllers are for generating apis
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error(
            "Invalid username or password. If you haven't created an account already, please sign up to continue."
        );
    }
});

//search
// /api/:id ->use req.params
// /api/user?search=kunal ->use req.query
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
              $or: [
                  //serch by name OR email
                  { name: { $regex: req.query.search, $options: "i" } }, //regex helps matching string querry
                  { email: { $regex: req.query.search, $options: "i" } }, // option i -> case insensitive to upper and lower case
              ],
          }
        : {}; //else do nothing
    
    //find() always returns a true cursor (a set of query objects even empty if nothing matches), a cursor is a pointer to those objects
    //findOne() returns the first document to match the query, if no match is found, it returns NULL
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });  //all users except current logged in user | ne -> not equal

    res.send(users);
});

module.exports = { registerUser, authUser, allUsers };
