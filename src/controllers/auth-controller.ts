import bcrypt from "bcryptjs";
import { Request, Response } from "express";
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
