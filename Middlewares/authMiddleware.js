// const jwt = require("jsonwebtoken")
// const SECRET_KEY = "NOTESAPI"

// const auth = (req, res, next) => {

//     try {

//         let token = req.headers.authorization
//         if (token) {
//             token = token.split(" ")[1]
//             let user = jwt.verify(token, SECRET_KEY)
//             req.userId = user.id

//         }
//         else {
//             res.status(401).json({ meassge: "Unauthorized User" })
//         }
//         next()

//     }
//     catch (error) {
//         console.log(error)
//         res.status(401).json({ message: "Unathorized User" })

//     }

// }
// module.exports = auth

// middleware/auth.js


// Backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../Models/User.js';

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch {
    res.status(401).json({ msg: 'Token invalid' });
  }
};

export const restrictToAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin only' });
  next();
};