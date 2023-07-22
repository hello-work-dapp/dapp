export function extractCreateGigDetails(inputString: string) {
  // Define regular expressions for amount and token name extraction
  const amountPattern = /\b\d+(\.\d+)?\b/;
  const tokenNamePattern = /\b[A-Z]+\b/;

  // Extract title
  const title = inputString.split(' for ')[0].trim();

  // Extract amount
  const amountMatch = inputString.match(amountPattern);
  const amount = amountMatch ? parseFloat(amountMatch[0]) : null;

  // Extract token name
  const tokenNameMatch = inputString.match(tokenNamePattern);
  const tokenName = tokenNameMatch ? tokenNameMatch[0] : null;

  return { title, amount, tokenName };
}
