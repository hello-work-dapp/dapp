import { extractCreateGigDetails } from './messageParser';

test('Extract details from input string', () => {
  const inputString = 'Solidity dev to audit TalentLayerEscrow for 1 MATIC';
  const result = extractCreateGigDetails(inputString);
  expect(result).toEqual({
    title: 'Solidity dev to audit TalentLayerEscrow',
    amount: 1,
    tokenName: 'MATIC',
  });
});

test('Handle missing amount and token name', () => {
  const inputString = 'Audit SmartContract';
  const result = extractCreateGigDetails(inputString);
  expect(result).toEqual({
    title: 'Audit SmartContract',
    amount: null,
    tokenName: null,
  });
});

test('Handle decimal amount', () => {
  const inputString = 'Dev work for 2.5 ETH';
  const result = extractCreateGigDetails(inputString);
  expect(result).toEqual({
    title: 'Dev work',
    amount: 2.5,
    tokenName: 'ETH',
  });
});

test('Handle token name with lowercase letters', () => {
  const inputString = 'Audit for 100 USDC';
  const result = extractCreateGigDetails(inputString);
  expect(result).toEqual({
    title: 'Audit',
    amount: 100,
    tokenName: 'USDC',
  });
});
