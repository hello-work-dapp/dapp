import { ArrowUpRightIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import useServiceById from '../../../hooks/useServiceById';

function GigMessageCard({ id }: { id: string }) {
  const service = useServiceById(id);

  return (
    <div className='shadow rounded-xl p-3  bg-endnight text-white mt-2'>
      <div className='flex items-center'>
        <p className='mr-4 '>
          <BriefcaseIcon className='w-[20px]' />
        </p>
        <div className='text-left'>
          <p className='font-bold'>Solidity dev to audit TalentLayerEscrow</p>
          <p className='text-gray-400'>for 1 MATIC</p>
        </div>
      </div>
      <div className='text-center border-t border-gray-700 pt-2 mt-2'>
        <button className='grow px-5 py-2 rounded-xl bg-redpraha text-white'>Accept Gig</button>
      </div>
    </div>
  );
}

export default GigMessageCard;
