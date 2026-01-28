import express, { Request, Response } from "express";
import {
  getAccessToken,
  getAuthURL,
  getMailFromGmail,
} from "./get-auth-url.js";
import emailParser from "../Model/email-parser.js";
import emailParserContainer from "../Model/email-container.js";

const router = express.Router();

router.get("/google", (req: Request, res: Response) => {
  const url = getAuthURL();

  res.status(200).send({ url });
});

router.get("/google/callback", (req: Request, res: Response) => {
  const code = req.query.code as string;
  getAccessToken(code);
  res.status(200).send(`Access Token added`);
});

router.get("/google/get-mails", async (req: Request, res: Response) => {
  const mails = await getMailFromGmail();
  const filterMails = mails.filter((mail) => mail.body !== "");
  const parsedMails = filterMails.map((mail) => new emailParser(mail));

  emailParserContainer.addEmailParser(parsedMails);

  res.status(200).send({
    parsedMails,
  });
});

//testing route
router.get("/google/send-reply", async (req: Request, res: Response) => {
  await emailParserContainer.emailParserList[0].sendReplyMail();
  res.status(200).send("Reply Sent");
});

export default router;
