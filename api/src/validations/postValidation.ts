import { body, param } from 'express-validator';

export const createPostValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required').bail()
    .isLength({ min: 3, max: 150 }).withMessage('Title must be 3-150 characters'),

  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 300 }).withMessage('Description must be under 300 characters'),

  body('coverImageUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL().withMessage('Cover image must be a valid URL'),

  body('content')
    .trim()
    .notEmpty().withMessage('Content is required').bail()
    .isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),

  body('published')
    .optional()
    .isBoolean().withMessage('Published must be true or false'),

  body('categoryId')
    .notEmpty().withMessage('Category is required').bail()
    .isInt().withMessage('Category ID must be a valid number'),
];

export const updatePostValidation = [
  param('postId')
    .notEmpty().withMessage('Post ID is required').bail()
    .isInt().withMessage('Post ID must be a valid number'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 }).withMessage('Title must be 3-150 characters'),

  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 300 }).withMessage('Description must be under 300 characters'),

  body('coverImageUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL().withMessage('Cover image must be a valid URL'),

  body('content')
    .optional()
    .trim()
    .isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),

  body('published')
    .optional()
    .isBoolean().withMessage('Published must be true or false'),

  body('categoryId')
    .optional()
    .isInt().withMessage('Category ID must be a valid number'),
];