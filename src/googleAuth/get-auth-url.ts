import { google } from "googleapis";
import "dotenv/config";
import {
  convertHtmlToText,
  fetchMessages,
  getFormattedMessages,
  getMessageIds,
} from "./helper-functions.js";

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);
export const getMailFromGmail = async () => {
  //gets only message ids and thread id
  const messageIds = await getMessageIds();

  //fetches the messages from the message ids
  const messages = await fetchMessages(messageIds);

  //formats the messages
  const formattedMessages = getFormattedMessages(messages);

  const convertedMessagesToPlainText = convertHtmlToText(formattedMessages);

  return convertedMessagesToPlainText;
};

export const getAuthURL = () => {
  // generate a url that asks permissions for Blogger and Google Calendar scopes
  const scopes = ["https://mail.google.com/"];

  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",

    // If you only need one scope you can pass it as a string
    scope: scopes,
  });
  return url;
};

export const getAccessToken = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
};

export default oauth2Client;
