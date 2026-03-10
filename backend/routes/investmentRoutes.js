import { Router } from "express";
import {
  validateTitleLength,
  validateDescriptionLength,
  validateIncomeCategory,
  validateAmount,
  validateDate,
} from "../utils/validations.js";
import validate from "../middlewares/validate.js";
import { addInvestment, deleteInvestment, getAllInvestments, updateInvestment } from "../controllers/investmentController.js";

const router = Router();

router
  .route("/")
  .get(getAllInvestments)
  .post(
    validate({
      title: validateTitleLength,
      amount: validateAmount,
      category: validateIncomeCategory,
      date: validateDate,
    }),
    addInvestment
  );

router.get("/all", getAllInvestments);

router.route("/:id").put(updateInvestment).delete(deleteInvestment);

export default router;
