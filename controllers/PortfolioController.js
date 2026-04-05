import PortfolioModel from "../models/portfolio.js";

export const getPortfolio = async (req, res) => {
  try {
    const portfolio = await PortfolioModel.findOne({ user: req.userId });
    res.json(portfolio);
  } catch {
    res.status(500).json({ message: "Failed to get portfolio" });
  }
};

export const create = async (req, res) => {
  try {
    const portfolio = await PortfolioModel.create({ ...req.body, user: req.userId });
    res.json(portfolio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create portfolio" });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await PortfolioModel.findOneAndUpdate(
      { user: req.userId },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update portfolio" });
  }
};
