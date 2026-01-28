import express, { Request, Response } from "express";
import emailParserContainer from "../Model/email-container.js";

const router = express.Router();

const getCategory = async () => {
  const result = await emailParserContainer.getAllCategoryAndReply();
  return result;
};

router.get("/get-result", async (req: Request, res: Response) => {
  const result = await getCategory();
  res.status(200).send(result);
});

export default router;
