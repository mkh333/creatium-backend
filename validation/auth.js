import { body } from "express-validator";

export const signInValidator = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];

export const signUpValidator = [
  body('firstname').isLength({ min: 3 }).withMessage('Firstname must be at least 3 characters long'),
  body('lastname').isLength({ min: 3 }).withMessage('Lastname must be at least 3 characters long'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Passwords do not match');
    return true;
  }),
];

export const portfolioValidation = [
  body('firstname').isLength({ min: 3 }).withMessage('Firstname must be at least 3 characters long'),
  body('lastname').isLength({ min: 3 }).withMessage('Lastname must be at least 3 characters long'),
  body('profession').isLength({ min: 3 }).withMessage('Profession must be at least 3 characters long'),
  body('about').isLength({ min: 10 }).withMessage('About must be at least 10 characters long'),
  body('skills').isArray({ min: 1 }).withMessage('Skills must be a non-empty array'),
  body('projects').optional().isArray().withMessage('Projects must be an array'),
  body('education').optional().isArray().withMessage('Education must be an array'),
  body('experience').optional().isArray().withMessage('Experience must be an array'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('linkedin').optional().isURL().withMessage('LinkedIn must be a valid URL'),
  body('github').optional().isURL().withMessage('GitHub must be a valid URL'),
  body('avatar').optional().custom((value) => {
    if (!value || value.startsWith('data:image/') || value.startsWith('http')) return true;
    throw new Error('Avatar must be a valid URL or base64 image');
  }),
];
