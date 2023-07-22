import { BriefcaseIcon } from '@heroicons/react/24/outline';
import { useContext } from 'react';
import Loading from '../../../components/Loading';
import HelloWorkContext from '../../../context/helloWork';
import useProposalById from '../../../hooks/useProposalById';

function ProposalValidatedMessageCard({ id }: { id: string }) {
  const proposal = useProposalById(id.toString());

  if (!proposal) {
    return <Loading />;
  }

  return (
    <div className='shadow rounded-xl p-3 bg-endnight text-white mt-2'>
      <div className='flex items-center'>
        <p className='mr-4 '>
          <BriefcaseIcon className='w-[20px]' />
        </p>
        <div className='text-left'>
          <p className='font-bold'>Proposal Validated</p>
          <p className='text-gray-400'>The job can start now :)</p>
        </div>
      </div>
    </div>
  );
}

export default ProposalValidatedMessageCard;
