export function generatePrompt(query: string) {
  if (query === "") {
    return "No body";
  }
  const prompt = `Categorize the mail below into 1 of 3 categories: "Interested", "Not Interested", "More Information". I also want you to give me a reply to the mail that uses general words "no specifics" which I can send directly without having to do any modifications. Mail is "${query}"`;

  return prompt;
}

const Categories = ["Not Interested", "Interested", "More Information"];

export const getCategory = (result: string) => {
  const category = Categories.find((category) => result.includes(category));
  if (!category) {
    return "No Category Found";
  }
  return category;
};

export const getReply = (result: string) => {
  if (result.includes("Reply:")) {
    const reply = result.split("Reply:")[1].trim();
    return reply;
  }
  return "No Reply Found";
};
