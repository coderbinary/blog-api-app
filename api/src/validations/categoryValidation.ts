import { body, param } from 'express-validator';

export const createCategoryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required').bail()
    .isLength({ min: 2, max: 50 }).withMessage('Category name must be 2-50 characters'),
];

export const updateCategoryValidation = [
  param('id')
    .notEmpty().withMessage('Category ID is required').bail()
    .isInt({ min: 1 }).withMessage('Category ID must be a valid positive integer')
    .toInt(),

  body('name')
    .trim()
    .notEmpty().withMessage('Category name cannot be empty').bail()
    .isLength({ min: 2, max: 50 }).withMessage('Category name must be 2-50 characters'),
];

export const deleteCategoryValidation = [
  param('id')
    .notEmpty().withMessage('Category ID is required').bail()
    .isInt({ min: 1 }).withMessage('Category ID must be a valid positive integer')
    .toInt(),
];