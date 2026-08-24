import { body, param, query } from 'express-validator';

const usernameCharPattern = /^[a-zA-Z0-9_-]+$/;
const containsLetter = /[a-zA-Z]/;

export const registerValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required').bail()
    .isEmail().withMessage('Please provide a valid email'),

  body('username')
    .trim()
    .notEmpty().withMessage('Username is required').bail()
    .isLength({ min: 1, max: 30 }).withMessage('Username must be 1-30 characters').bail()
    .matches(usernameCharPattern).withMessage('Username can only contain letters, numbers, underscores, and hyphens').bail()
    .matches(containsLetter).withMessage('Username cannot be only numbers'),

  body('password')
    .notEmpty().withMessage('Password is required').bail()
    .isLength({ min: 4 }).withMessage('Password must be at least 4 characters').bail()
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter').bail()
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter').bail()
    .matches(/\d/).withMessage('Password must contain at least one number').bail()
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),

  body('confirmPassword')
    .notEmpty().withMessage('Confirm password is required').bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

export const loginValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required'),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

export const getUsersValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
    .toInt(),

  query('search')
    .optional()
    .trim(),
];

export const deleteUserValidation = [
  param('userId')
    .notEmpty().withMessage('User ID is required').bail()
    .isInt({ min: 1 }).withMessage('User ID must be a valid positive integer')
    .toInt(),
];