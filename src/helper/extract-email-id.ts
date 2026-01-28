export const extractEmailId = (email: string) => {
  if (!email) {
    return "";
  }
  const regex = `(?<=<)(.*)(?=>)`;
  const reg = new RegExp(regex, "g");
  email = email.match(reg)?.join() || email;
  return email;
};
