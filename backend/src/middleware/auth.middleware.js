import { requireAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import { ENV } from "../config/env.js";

export const protectedRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;
      if (!clerkId)
        return res
          .status(400)
          .json({ message: "unauthorized access, invalid" });

      const user = await User.findOne({ clerkId });

      if (!user) return res.status(401).json({ message: "user not found" });

      req.user = user; //attach the user to the request
      next(); // call the next method
    } catch (error) {
      console.error("error in protectRoute middleware", error);
      res
        .status(500)
        .json({ message: "Internal error in protectRoute middleware" });
    }
  },
];

export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "user not found" });
  }
  if (!req.user.email != ENV.ADMIN_EMAIL) {
    return res
      .status(404)
      .json({ message: "Forbidden - admin only can access" });
  }
  next();
};
