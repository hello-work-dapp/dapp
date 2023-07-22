import { BriefcaseIcon } from '@heroicons/react/24/outline';
import Loading from '../../../components/Loading';
import useServiceById from '../../../hooks/useServiceById';
import { renderTokenAmountFromConfig } from '../../../utils/conversion';
import { useChainId } from '../../../hooks/useChainId';
import { createProposal } from '../../../contracts/createProposal';
import { useContext } from 'react';
import HelloWorkContext from '../../../context/helloWork';
import { useProvider, useSigner } from 'wagmi';

function GigMessageCard({ id }: { id: number }) {
  const chainId = useChainId();
  const { user } = useContext(HelloWorkContext);
  const { data: signer } = useSigner({
    chainId,
  });
  const provider = useProvider({ chainId });
  const service = useServiceById(id.toString());

  if (!service) {
    return <Loading />;
  }

  console.log(service.description);

  const generateAndValidateProposal = async () => {
    if (!signer || !user) {
      return;
    }

    console.log('Create automatically a proposal and message for this service');
    try {
      const about =
        'After chatting together on HelloWork, I accept working on your asked condition';
      const newId = await createProposal(chainId, signer, provider, user, service, about);
      const newMessage = `/create-proposal | id:${newId}`;
    } catch (e) {
      console.error('An error occured', e);
      return;
    }
  };

  return (
    <div className='shadow rounded-xl p-3 bg-endnight text-white mt-2'>
      <div className='flex items-center'>
        <p className='mr-4 '>
          <BriefcaseIcon className='w-[20px]' />
        </p>
        {service.description && (
          <div className='text-left'>
            <p className='font-bold'>{service.description.title}</p>
            {service.description.rateToken && service.description.rateAmount && (
              <p className='text-gray-400'>
                for{' '}
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
      <div className='text-center border-t border-gray-700 pt-2 mt-2'>
        <button
          onClick={() => generateAndValidateProposal()}
          className='grow px-5 py-2 rounded-xl bg-redpraha text-white'>
          Accept Gig
        </button>
      </div>
    </div>
  );
}

export default GigMessageCard;
