import { NextFunction, Request, Response } from "express";
import * as yup from "yup";

// Middleware to validate request data
export const validate =
  (schema: yup.ObjectSchema<any>, part: "body" | "query" | "params") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate only the specified part of the request
      await schema.validate(req[part], { abortEarly: false });
      return next();
    } catch (err: unknown) {
      // Handle Yup validation errors, and return errors
      if (err instanceof yup.ValidationError) {
        return res.status(400).json({
          error: "Validation error",
          details: err.inner.map((e) => ({
            field: e.path,
            message: e.message,
          })),
        });
      }

      // Handle other types of errors than yup validation
      if (err instanceof Error) {
        return res.status(500).json({
          error: "Server error",
          message: err.message,
        });
      }

      // Fallback for unknown errors - internal server error
      return res.status(500).json({
        error: "An unexpected error occurred",
      });
    }
  };

// Yup Regiration Schema
const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
export const registrationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .matches(emailRegex, "Invalid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// Yup Login Schema
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .matches(emailRegex, "Invalid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});
