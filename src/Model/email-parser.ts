import { generatePrompt } from "../geminiGPT/prompt-generator.js";
import { getPromptResult } from "../geminiGPT/prompt.js";
import { sendEmail } from "../googleAuth/helper-functions.js";

export type mailObjectType = {
  body: string;
  id: string;
  threadId: string;
  snippet: string;
  sender: string;
  label?: string;
  reply?: string;
};

class EmailParser {
  mail: mailObjectType;
  constructor(mail: mailObjectType) {
    this.mail = mail;
  }

  generatePromptFromBody() {
    const prompt = generatePrompt(this.mail.body);
    return prompt;
  }

  async getCategoryAndReply() {
    const prompt = this.generatePromptFromBody();
    const result = await getPromptResult(prompt);
    if (result.category !== "No Category Found") {
      this.mail.label = result.category;
    }
    if (result.reply !== "No Reply Found") {
      this.mail.reply = result.reply;
    }
  }

  async sendReplyMail() {
    await sendEmail(this);
  }
}

export default EmailParser;
