const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
mongoose.set("strictQuery", false); //to silence warning

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        pic: {
            type: String,
            default:
                "https://media.istockphoto.com/id/1316420668/vector/user-icon-human-person-symbol-social-profile-icon-avatar-login-sign-web-user-symbol.jpg?s=612x612&w=0&k=20&c=AhqW2ssX8EeI2IYFm6-ASQ7rfeBWfrFFV4E87SaFhJE=",
        },
    },
    {
        timestamps: true,
    }
);

//user auth during login to match password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}
//password is stored as hash encrypted by bcrypt, so compare the hashed password with password entered

//Encrypt Password
userSchema.pre("save", async function (next) {
    //as this is between sending and responding, this function acts as Middleware, so we use next() as the middleware vairable
    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);    //convert schemas to models to use them

module.exports = User;
