import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useProvider, useSigner } from 'wagmi';
import { FEE_RATE_DIVIDER } from '../config';
import HelloWorkContext from '../context/helloWork';
import { validateProposal } from '../contracts/validateProposal';
import { useChainId } from '../hooks/useChainId';
import useSendMessage from '../modules/Messaging/hooks/useSendMessage';
import { IProposal } from '../types';
import useFees from '../hooks/useFees';
import { renderTokenAmount } from '../utils/conversion';

function ValidateProposalButton({ proposal }: { proposal: IProposal }) {
  const chainId = useChainId();
  const { account } = useContext(HelloWorkContext);
  const { data: signer } = useSigner({
    chainId,
  });
  const provider = useProvider({ chainId });

  const router = useRouter();
  const { address } = router.query;
  const selectedConversationPeerAddress = address as string;
  const { sendMessage } = useSendMessage(
    (selectedConversationPeerAddress as string) ? selectedConversationPeerAddress : '',
    account?.address,
  );

  const originValidatedProposalPlatformId = proposal.platform.id;
  const originServicePlatformId = proposal.service.platform.id;

  const { protocolEscrowFeeRate, originValidatedProposalFeeRate, originServiceFeeRate } = useFees(
    originServicePlatformId,
    originValidatedProposalPlatformId,
  );

  const jobRateAmount = ethers.BigNumber.from(proposal.rateAmount);
  const protocolFee = jobRateAmount.mul(protocolEscrowFeeRate).div(FEE_RATE_DIVIDER);
  const originServiceFee = jobRateAmount.mul(originServiceFeeRate).div(FEE_RATE_DIVIDER);
  const originValidatedProposalFee = jobRateAmount
    .mul(originValidatedProposalFeeRate)
    .div(FEE_RATE_DIVIDER);
  const totalAmount = jobRateAmount
    .add(originServiceFee)
    .add(originValidatedProposalFee)
    .add(protocolFee);

  const validateServiceProposal = async () => {
    if (!signer || !provider) {
      return;
    }

    try {
      await validateProposal(
        chainId,
        signer,
        provider,
        proposal.service.id,
        proposal.seller.id,
        proposal.rateToken.address,
        proposal.cid,
        totalAmount,
      );
      const newMessage = `/validate-proposal The proposal has beed accepted and the fund sent in the escrow | id:${proposal.id}`;
      sendMessage(newMessage);
    } catch (e) {
      console.error('An error occured', e);
      return;
    }
  };

  return (
    <div className='text-center border-t border-gray-700 pt-2 mt-2'>
      <button
        onClick={() => validateServiceProposal()}
        className='grow px-5 py-2 rounded-xl bg-redpraha text-white'>
        Validate proposal and pay {renderTokenAmount(proposal.rateToken, totalAmount.toString())}
      </button>
    </div>
  );
}

export default ValidateProposalButton;
