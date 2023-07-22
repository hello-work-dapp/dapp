import { extractCreateServiceDetails, extractReleaseDetails } from './messageParser';

test('Extract details from input string', () => {
  const inputString = 'Solidity dev to audit TalentLayerEscrow for 3 MATIC';
  const result = extractCreateServiceDetails(inputString);
  expect(result).toEqual({
    title: 'Solidity dev to audit TalentLayerEscrow',
    rateAmount: 3,
    rateToken: 'MATIC',
    about: '',
    keywords: '',
  });
});

test('Handle missing amount and token name', () => {
  const inputString = '/create-service Audit SmartContract for 10 MATIC';
  const result = extractCreateServiceDetails(inputString);
  expect(result).toEqual({
    title: 'Audit SmartContract',
    rateAmount: 10,
    rateToken: 'MATIC',
    about: '',
    keywords: '',
  });
});

test('Handle decimal amount', () => {
  const inputString = 'Dev work for 2.5 ETH';
  const result = extractCreateServiceDetails(inputString);
  expect(result).toEqual({
    title: 'Dev work',
    rateAmount: 2.5,
    rateToken: 'ETH',
    about: '',
    keywords: '',
  });
});

test('Handle token name with lowercase letters', () => {
  const inputString = 'Audit for 100 USDC';
  const result = extractCreateServiceDetails(inputString);
  expect(result).toEqual({
    title: 'Audit',
    rateAmount: 100,
    rateToken: 'USDC',
    about: '',
    keywords: '',
  });
});

test('Extract details from release', () => {
  const inputString = '/release #338 50%';
  const result = extractReleaseDetails(inputString);
  expect(result).toEqual({
    serviceId: '338',
    percent: 50,
  });
});
