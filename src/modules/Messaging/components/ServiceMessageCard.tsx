import { BriefcaseIcon } from '@heroicons/react/24/outline';
import Loading from '../../../components/Loading';
import useServiceById from '../../../hooks/useServiceById';
import { renderTokenAmountFromConfig } from '../../../utils/conversion';
import { useChainId } from '../../../hooks/useChainId';
import { createProposal } from '../../../contracts/createProposal';
import { useContext } from 'react';
import HelloWorkContext from '../../../context/helloWork';
import { useProvider, useSigner } from 'wagmi';
import { ServiceStatusEnum } from '../../../types';
import useSendMessage from '../hooks/useSendMessage';
import { useRouter } from 'next/router';

function ServiceMessageCard({ id }: { id: string }) {
  const chainId = useChainId();
  const { user, account } = useContext(HelloWorkContext);
  const { data: signer } = useSigner({
    chainId,
  });
  const provider = useProvider({ chainId });
  const service = useServiceById(id.toString());
  const router = useRouter();
  const { address } = router.query;
  const selectedConversationPeerAddress = address as string;
  const { sendMessage } = useSendMessage(
    (selectedConversationPeerAddress as string) ? selectedConversationPeerAddress : '',
    account?.address,
  );

  if (!service || !user) {
    return <Loading />;
  }

  const generateProposal = async () => {
    if (!signer) {
      return;
    }

    try {
      const about = `After chatting together on HelloWork, I accept working on the ${service.id} and the asked condition`;
      const newId = await createProposal(chainId, signer, provider, user, service, about);
      const newMessage = `/create-proposal Let's go I accept this gig | id:${newId}`;
      sendMessage(newMessage);
    } catch (e) {
      console.error('An error occured', e);
      return;
    }
  };

  console.log('service object', service);

  return (
    <div className='shadow rounded-xl p-3 bg-endnight text-white mt-2'>
      <div className='flex items-center'>
        <p className='mr-4 '>
          <BriefcaseIcon className='w-[20px]' />
        </p>
        {service.description && (
          <div className='text-left'>
            <p className='font-bold'>Service created #{service.id}</p>
            {service.description.rateToken && service.description.rateAmount && (
              <p className='text-gray-400'>
                {service.description.title} for{' '}
                {renderTokenAmountFromConfig(
                  chainId,
                  service.description.rateToken,
                  service.description.rateAmount,
                )}
              </p>
            )}
          </div>
        )}
      </div>
      {service.status == ServiceStatusEnum.Opened && service.buyer.id !== user.id && (
        <div className='text-center border-t border-gray-700 pt-2 mt-2'>
          <button
            onClick={() => generateProposal()}
            className='grow px-5 py-2 rounded-xl bg-redpraha text-white'>
            Accept Gig
          </button>
        </div>
      )}
    </div>
  );
}

export default ServiceMessageCard;
