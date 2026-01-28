import { google, gmail_v1 } from "googleapis";
import oauth2Client from "./get-auth-url.js";
import { Base64 } from "js-base64";
import { htmlToText } from "html-to-text";
import EmailParser from "../Model/email-parser.js";
import { extractEmailId } from "../helper/extract-email-id.js";

type formattedMessagesType = {
  id: string;
  threadId: string;
  snippet: string;
  body: string;
  sender: string;
};

export const getMessageIds = async () => {
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults: 2,
  });
  const messageIds = res.data.messages;
  if (!messageIds) {
    return [];
  }
  return messageIds;
};

export const fetchMessages = async (
  messageIds: gmail_v1.Schema$Message[] | undefined
) => {
  if (!messageIds || messageIds.length == 0) {
    return [];
  }

  const messages = await Promise.all(
    messageIds.map(async (message) => {
      const res = await google
        .gmail({ version: "v1", auth: oauth2Client })
        .users.messages.get({
          userId: "me",
          id: message.id!,
        });
      return res.data;
    })
  );

  return messages;
};

export const getFormattedMessages = (messages: gmail_v1.Schema$Message[]) => {
  const formattedMessages = messages.map((message) => {
    if (
      !message.payload ||
      !message.payload.parts ||
      !message.id ||
      !message.threadId ||
      !message.snippet ||
      !message.payload.headers
    ) {
      return {
        id: "",
        threadId: "",
        snippet: "",
        body: "",
        sender: "",
      };
    }

    const snippet = message.snippet;
    const parts = message.payload.parts;
    const senderObject = message.payload.headers?.find(
      (header) => header.name?.toLowerCase() === "from"
    );
    let sender = senderObject?.value;

    if (sender) {
      sender = extractEmailId(sender);
    }

    let body = "";

    parts.forEach((part) => {
      if (part.mimeType === "text/plain") {
        if (part.body?.data) {
          body = Base64.decode(part.body.data);
        }
      }
      if (part.mimeType === "text/html") {
        if (part.body?.data) {
          body = Base64.decode(part.body.data);
        }
      }
    });

    if (message.payload?.body?.data) {
      body = Base64.decode(message.payload.body.data);
    }

    if (sender === undefined || sender === null) {
      sender = "No sender";
    }

    return {
      id: message.id,
      threadId: message.threadId,
      snippet: snippet,
      body: body,
      sender,
    };
  });

  return formattedMessages;
};

export const convertHtmlToText = (
  formattedMessages: formattedMessagesType[]
) => {
  const convertedMessagesToPlainText = formattedMessages.map((message) => {
    const body = message.body;
    const plainTextFromBody = htmlToText(body, { wordwrap: 130 });
    return {
      ...message,
      body: plainTextFromBody,
    };
  });
  return convertedMessagesToPlainText;
};

export const sendEmail = async (emailParser: EmailParser) => {
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const getMail = await gmail.users.messages.get({
    userId: "me",
    id: emailParser.mail.id,
    format: "metadata",
    metadataHeaders: [
      "Subject",
      "References",
      "Message-ID",
      "In-Reply-To",
      "To",
      "From",
    ],
  });

  const hearderObj = getHeaders(getMail.data);
  console.log(hearderObj);

  if (emailParser.mail.reply === undefined || hearderObj.subject === "") {
    console.log("entered here");
    return;
  }

  //write send logic here

  const encodedResponse = createEmailBody(hearderObj, emailParser.mail.reply);

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedResponse,
      threadId: emailParser.mail.threadId,
    },
  });

  console.log(res.data);
};

function getHeaders(getMail: gmail_v1.Schema$Message) {
  let hearderObj = {
    subject: "",
    to: "",
    from: "",
    references: "",
    inReplyTo: "",
  };
  console.log(getMail.payload?.headers);

  if (getMail.payload?.headers) {
    hearderObj.subject = getMail.payload.headers.find(
      (header) => header.name === "Subject"
    )?.value!;
    const to = getMail.payload.headers.find((header) => header.name === "To")
      ?.value!;
    hearderObj.to = extractEmailId(to);

    const from = getMail.payload.headers.find(
      (header) => header.name === "From"
    )?.value!;
    hearderObj.from = extractEmailId(from);

    const references = getMail.payload.headers.find(
      (header) => header.name === "References"
    )?.value!;
    hearderObj.references = references;

    const inReplyTo = getMail.payload.headers.find(
      (header) => header.name === "In-Reply-To"
    )?.value!;
    hearderObj.inReplyTo = inReplyTo;
  }
  return hearderObj;
}

type headerType = {
  subject: string;
  to: string;
  from: string;
  references: string;
  inReplyTo: string;
};

function createEmailBody(headerObj: headerType, reply: string) {
  const emailLines = [
    `Content-Type: text/plain; charset="UTF-8"`,
    `MIME-Version: 1.0`,
    `Content-Transfer-Encoding: 7bit`,
    `References: ${headerObj.references}`,
    `In-Reply-To: ${headerObj.inReplyTo}`,
    `Subject: ${headerObj.subject}`,
    `From: ${headerObj.to}`,
    `To: ${headerObj.from}`,
    ``,
    reply.replace(`"`, ""),
  ];

  const email = emailLines.join("\n");
  return Base64.encodeURI(email);
}
