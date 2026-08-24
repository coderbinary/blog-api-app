import { body, param, query } from 'express-validator';

export const getPostsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
    .toInt(),

  query('sort')
    .optional()
    .isIn(['asc', 'desc']).withMessage('Sort must be asc or desc'),

  query('category')
    .optional()
    .trim()
    .isString().withMessage('Category must be a string'),
];

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
    .isInt().withMessage('Category ID must be a valid number')
    .toInt(),
];

export const updatePostValidation = [
  param('postId')
    .notEmpty().withMessage('Post ID is required').bail()
    .isInt().withMessage('Post ID must be a valid number')
    .toInt(),

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
    .isInt().withMessage('Category ID must be a valid number')
    .toInt(),
];

export const deletePostValidation = [
  param('postId')
    .notEmpty().withMessage('Post ID is required').bail()
    .isInt({ min: 1 }).withMessage('Post ID must be a valid positive integer')
    .toInt(),
];