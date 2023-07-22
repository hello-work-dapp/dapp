import { Provider } from '@wagmi/core';
import { ethers, Signer } from 'ethers';
import { getConfig } from '../config';
import { IService, IUser } from '../types';
import { postToIPFS } from '../utils/ipfs';
import { getProposalSignature } from '../utils/signature';
import { createMultiStepsTransactionToast, showErrorTransactionToast } from '../utils/toast';
import { parseRateAmount } from '../utils/web3';
import ServiceRegistry from './ABI/TalentLayerService.json';

export const createProposal = async (
  chainId: number,
  signer: Signer,
  provider: Provider,
  user: IUser,
  service: IService,
  about: string,
): Promise<number | undefined> => {
  const config = getConfig(chainId);

  if (provider && signer && service.description?.rateAmount && service.description?.rateToken) {
    try {
      const parsedRateAmount = await parseRateAmount(
        service.description.rateAmount.toString(),
        service.description.rateToken,
        config.tokens[service.description.rateToken].decimals,
      );
      const now = Math.floor(Date.now() / 1000);
      const convertExpirationDate = now + 60 * 60 * 24 * 15;
      const convertExpirationDateString = convertExpirationDate.toString();

      const parsedRateAmountString = parsedRateAmount.toString();

      const cid = await postToIPFS(
        JSON.stringify({
          about: about,
          video_url: '',
        }),
      );

      // Get platform signature
      const signature = await getProposalSignature({
        profileId: Number(user.id),
        cid,
        serviceId: Number(service.id),
      });

      const contract = new ethers.Contract(
        config.contracts.serviceRegistry,
        ServiceRegistry.abi,
        signer,
      );
      const tx = await contract.createProposal(
        user.id,
        service.id,
        service.description.rateToken,
        parsedRateAmountString,
        process.env.NEXT_PUBLIC_PLATFORM_ID,
        cid,
        convertExpirationDateString,
        signature,
      );

      const newId = await createMultiStepsTransactionToast(
        chainId,
        {
          pending: 'Creating your proposal...',
          success: 'Congrats! Your proposal has been added',
          error: 'An error occurred while creating your proposal',
        },
        provider,
        tx,
        'proposalRequest',
        cid,
      );
      return newId;
    } catch (error) {
      showErrorTransactionToast(error);
    }
  }
};
