const user = require("../models/userSchema");
const wishlist = require("../models/wishlistSchema");



//------------------user register section------------------

const userRegister = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  const identifyUser = await user.findOne({ email: email });

  if (identifyUser) {
    return res.json({
      status: "failure",

      message: "User Already Exist",
    });
  }

  const newUser = new user({
    name: name,
    email: email,
    password: password,
  });

  await newUser.save();
  return res.json({
    status: "success",

    message: "User Registered Successfully",
  });
};

//----------------------------user login section-------------------------

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  const identifyUser = await user.findOne({ email: email });
  if (!identifyUser) {
    return res.json({
      status: "failure",

      message: "User not found",
    });
  } else if (password !== identifyUser.password) {
    return res.json({
      status: "failure",

      message: "Wrong Password",
    });
  } else {
    return res.status(200).json({
      status: "success",
      message: "User logged in successfully",
    });
  }
};

//---------------------------add to wishlist-------------------------

const addToWishlis = async(req,res)=>{
         const {userId,productId}  = req.body;
        //  console.log(req.body);
         let Wishlist = await wishlist.findOne({ user: userId });
        // console.log(Wishlist);
        if (!Wishlist) {
          Wishlist = new wishlist({ user: userId, products: [] });
        }
         // Check if the product is already in the wishlist
         if (!Wishlist.products.includes(productId)) {
           // Add the product to the wishlist
           Wishlist.products.push(productId);
           await Wishlist.save();
           return res.status(200).json({ message: 'Product added to wishlist successfully' });
         } else {
           return res.status(400).json({ message: 'Product is already in the wishlist' });
         }
}
module.exports = { userRegister,userLogin ,addToWishlis};
