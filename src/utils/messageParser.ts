import { IFormValues } from '../components/Form/ServiceForm';

// Ex: /create-service Solidity dev to audit TalentLayerEscrow for 0.1 MATIC

export function extractCreateServiceDetails(inputString: string): IFormValues {
  // Define regular expressions for amount and token name extraction
  const amountPattern = /\b\d+(\.\d+)?\b/;
  const tokenNamePattern = /\b[A-Z]+\b/;

  inputString = inputString.replace('/create-service ', '');

  // Extract title
  const title = inputString.split(' for ')[0].trim();

  // Extract amount
  const amountMatch = inputString.match(amountPattern);
  const rateAmount = amountMatch ? parseFloat(amountMatch[0]) : 1;

  // Extract token name
  const tokenNameMatch = inputString.match(tokenNamePattern);
  const rateToken = tokenNameMatch ? tokenNameMatch[0] : 'MATIC';

  return { title, rateAmount, rateToken, keywords: '', about: '' };
}

export function extractID(inputString: string): string | null {
  const idPattern = /id:(\d+(?:-\d+)?)/;
  const matches = inputString.match(idPattern);
  if (matches && matches.length === 2) {
    return matches[1];
  }
  return null;
}

interface IReleaseProps {
  serviceId: string;
  percent: number;
}

// /release #338 50%
export function extractReleaseDetails(inputString: string): IReleaseProps | null {
  const regex = /#(\d+)\s(\d+%)/;
  const matches = inputString.match(regex);

  if (matches) {
    const serviceId = matches[1];
    const percent = parseInt(matches[2]);

    return {
      serviceId,
      percent,
    };
  } else {
    console.log('Pattern not found in the string.');
    return null;
  }
}
