import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user-model";

export const registration = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const checkIfUserExists = await User.findOne({ email });
  if (checkIfUserExists) {
    return res
      .status(400)
      .json({ message: `User already exists related to ${email}` });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  res.status(200).json({
    message: "New User Registered",
    data: {
      name,
      email,
      password,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  const userToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET as string
  );
  res.status(200).json({ token: userToken });
};
