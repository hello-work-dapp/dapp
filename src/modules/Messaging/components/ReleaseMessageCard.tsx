import { CurrencyDollar } from 'heroicons-react';
import { extractReleaseDetails } from '../../../utils/messageParser';

function ReleaseMessageCard({ message }: { message: string }) {
  const releaseDetails = extractReleaseDetails(message);

  return (
    <div className='shadow rounded-xl p-3 bg-endnight text-white mt-2'>
      <div className='flex items-center'>
        <p className='mr-4 '>
          <CurrencyDollar className='w-[20px]' />
        </p>
        <div className='text-left'>
          <p className='font-bold'>Release for Gig #{releaseDetails?.serviceId}</p>
          <p className='text-gray-400'>{releaseDetails?.percent}% released</p>
        </div>
      </div>
    </div>
  );
}

export default ReleaseMessageCard;
