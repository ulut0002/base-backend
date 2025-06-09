export function generateVerificationCode(
  length: number = parseInt(process.env.VERIFICATION_CODE_LENGTH || "5", 10),
  digits: string = "0123456789"
): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  return code;
}
