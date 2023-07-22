import { BriefcaseIcon } from '@heroicons/react/24/outline';
import Loading from '../../../components/Loading';
import ValidateProposalButton from '../../../components/ValidateProposalButton';
import useProposalById from '../../../hooks/useProposalById';
import { ProposalStatusEnum } from '../../../types';
import { useContext } from 'react';
import HelloWorkContext from '../../../context/helloWork';

function ProposalMessageCard({ id }: { id: string }) {
  const proposal = useProposalById(id.toString());
  const { user } = useContext(HelloWorkContext);

  if (!proposal || !user) {
    return <Loading />;
  }

  return (
    <div className='shadow rounded-xl p-3 bg-endnight text-white mt-2'>
      <div className='flex items-center'>
        <p className='mr-4 '>
          <BriefcaseIcon className='w-[20px]' />
        </p>
        {proposal.service.description && (
          <div className='text-left'>
            <p className='font-bold'>Proposal created #{proposal.id}</p>
            <p className='text-gray-400'>{proposal.service.description.title}</p>
          </div>
        )}
      </div>
      {proposal.status == ProposalStatusEnum.Pending && proposal.service.buyer.id == user.id && (
        <ValidateProposalButton proposal={proposal} />
      )}
    </div>
  );
}

export default ProposalMessageCard;
