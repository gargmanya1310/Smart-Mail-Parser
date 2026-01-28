import model from "./intitialise-model.js";
import { getCategory, getReply } from "./prompt-generator.js";

export const getPromptResult = async (prompt: string) => {
  if (prompt === "No body") {
    return { category: "No Category Found", reply: "No Reply Found" };
  }

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const category = getCategory(text);
    const reply = getReply(text);
    return { category, reply };
  } catch (e) {
    console.log(e);
  }

  return { category: "No Category Found", reply: "No Reply Found" };
};
