import { body, param } from 'express-validator';

export const createCommentValidation = [
  param('postId')
    .notEmpty().withMessage('Post ID is required').bail()
    .isInt().withMessage('Post ID must be a valid number'),

  body('body')
    .trim()
    .notEmpty().withMessage('Comment body is required').bail()
    .isLength({ min: 1, max: 500 }).withMessage('Comment must be 1-500 characters'),
];

export const updateCommentValidation = [
  param('postId')
    .notEmpty().withMessage('Post ID is required').bail()
    .isInt().withMessage('Post ID must be a valid number'),

  param('id')
    .notEmpty().withMessage('Comment ID is required').bail()
    .isInt().withMessage('Comment ID must be a valid number'),

  body('body')
    .trim()
    .notEmpty().withMessage('Comment body is required').bail()
    .isLength({ min: 1, max: 500 }).withMessage('Comment must be 1-500 characters'),
];