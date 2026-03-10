import Income from "../models/investmentModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

import {
  validateTitleLength,
  validateDescriptionLength,
  validateIncomeCategory,
  validateAmount,
  validateDate,
  validatePaginationParams,
} from "../utils/validations.js";
import Investment from "../models/investmentModel.js";

// Controller function to add new investment
export const addInvestment = asyncHandler(async (req, res) => {
  const { title, amount, category, description, date } = req.body;

  const newInvestment = new Income({
    user: req.user._id,
    title,
    amount,
    category,
    date,
  });

  await newInvestment.save();

  return res
    .status(201)
    .json({ message: "Investment added successfully", investment: newInvestment });
});

// Controller function to update an investment
export const updateInvestment = asyncHandler(async (req, res) => {
  const investment = await Income.findById(req.params.id);

  if (!investment) {
    return res.status(404).json({ error: "Investment not found!" });
  }

  const { title, amount, category, date } = req.body;

  if (!title && !amount && !category && !date) {
    return res
      .status(400)
      .json({ error: "At least one field is required for update!" });
  }
  if (
    title === investment.title &&
    amount === investment.amount &&
    category === investment.category &&
    date === investment.date
  ) {
    return res.status(400).json({ error: "No changes detected!" });
  }

  if (title) {
    const error = validateTitleLength(title);
    if (error) {
      return res.status(400).json({ error: error });
    }
    investment.title = title;
  }
  if (amount) {
    const error = validateAmount(amount);
    if (error) {
      return res.status(400).json({ error: error });
    }
    investment.amount = amount;
  }
//   if (description) {
//     const error = validateDescriptionLength(description);
//     if (error) {
//       return res.status(400).json({ error: error });
//     }
//     investment.description = description;
//   }
  if (date) {
    const error = validateDate(date);
    if (error) {
      return res.status(400).json({ error: error });
    }
    investment.date = date;
  }
  if (category) {
    const error = validateIncomeCategory(category);
    if (error) {
      return res.status(400).json({ error: error });
    }
    investment.category = category;
  }

  const updatedInvestment = await investment.save();

  return res
    .status(200)
    .json({ message: "Investment updated successfully!", investment: updatedInvestment });
});

// Controller function to delete an investment
export const deleteInvestment = asyncHandler(async (req, res) => {
  const investment = await Income.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!investment) {
    return res.status(404).json({ error: "Investment not found!" });
  }

  return res.status(200).json({ message: "Investment deleted successfully!" });
});

// Controller function to get all investments
export const getInvestments = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const paginationError = validatePaginationParams(page, pageSize);
  if (paginationError) {
    return res.status(400).json({ error: paginationError });
  }

  const skip = (page - 1) * pageSize;
  const limit = pageSize;

  const investments = await Investment.find({ user: req.user._id })
    .skip(skip)
    .limit(limit);
  if (!investments || investments.length === 0) {
    return res.status(404).json({ message: "No investments found!" });
  }

  const totalCount = await Investment.countDocuments({ user: req.user._id });
  const totalPages = Math.ceil(totalCount / pageSize);

  const totalExpenses = await Investment.find({ user: req.user._id });

  const totalInvestment = totalExpenses.reduce(
    (acc, investment) => acc + investment.amount,
    0
  );

  return res.status(200).json({
    message: "All investments retrieved successfully!",
    investments,
    totalInvestment,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      pageSize,
    },
  });
});

// Controller function to get all investments
export const getAllInvestments = asyncHandler(async (req, res) => {
  const investments = await Investment.find({ user: req.user._id });

  if (!investments || investments.length === 0) {
    return res.status(404).json({ message: "No investments found!" });
  }

  const totalInvestment = investments.reduce((acc, investment) => acc + investment.amount, 0);

  return res.status(200).json({
    message: "All investments retrieved successfully!",
    investments,
    totalInvestment,
  });
});
