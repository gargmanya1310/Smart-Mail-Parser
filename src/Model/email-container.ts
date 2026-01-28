import EmailParser from "./email-parser.js";

class EmailParserContainer {
  emailParserList: EmailParser[];

  constructor() {
    this.emailParserList = [];
  }

  addEmailParser(emailParser: EmailParser[]) {
    this.emailParserList = emailParser;
  }

  generatePromptReply() {
    const emailsCategoryAndReplyPromise = this.emailParserList.map(
      (emailParser) => {
        return emailParser.getCategoryAndReply();
      }
    );

    return Promise.all(emailsCategoryAndReplyPromise);
  }

  async getAllCategoryAndReply() {
    await emailParserContainer.generatePromptReply();
    return this.emailParserList.map((emailParser) => {
      if (
        emailParser.mail.label === undefined ||
        emailParser.mail.reply === undefined
      ) {
        return {
          id: emailParser.mail.id,
          category: "No Category Found",
          reply: "No Reply Found",
        };
      }
      return {
        id: emailParser.mail.id,
        category: emailParser.mail.label,
        reply: emailParser.mail.reply,
      };
    });
  }
}

const emailParserContainer = new EmailParserContainer();
export default emailParserContainer;
