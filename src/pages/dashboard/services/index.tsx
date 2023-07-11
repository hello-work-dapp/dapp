import { useRouter } from 'next/router';
import SearchServiceButton from '../../../components/Form/SearchServiceButton';
import Loading from '../../../components/Loading';
import ServiceItem from '../../../components/ServiceItem';
import useServices from '../../../hooks/useServices';
import { IService, ServiceStatusEnum } from '../../../types';

function Services() {
  const PAGE_SIZE = 30;
  const router = useRouter();
  const query = router.query;
  const searchQuery = query.search as string;
  const { hasMoreData, services, loading, loadMore } = useServices(
    ServiceStatusEnum.Opened,
    undefined,
    undefined,
    searchQuery?.toLocaleLowerCase(),
    PAGE_SIZE,
  );

  return (
    <div className='max-w-7xl mx-auto text-gray-200 sm:px-4 lg:px-0'>
      <div className=' -mx-6 -mt-6 '>
        <p className='flex py-2 px-6 items-center text-2xl font-medium tracking-wider mb-8 border-b w-full border-gray-700 md:px-8 '>
          All <span className='text-gray-100 ml-1'> Jobs </span>
        </p>
      </div>
      {searchQuery && services.length > 0 && (
        <p className='text-xl font-medium tracking-wider mb-8'>
          Search results for <span className='text-gray-100'>{searchQuery}</span>
        </p>
      )}
      {searchQuery && services.length === 0 && (
        <p className='text-xl font-medium tracking-wider mb-8'>
          No search results for <span className='text-gray-100'>{searchQuery}</span>
        </p>
      )}

      <div className='flex justify-center items-center gap-10 flex-col pb-5'>
        <SearchServiceButton value={searchQuery} />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
        {services.map((service: IService, i: number) => {
          return <ServiceItem service={service} key={i} />;
        })}
      </div>

      {services.length > 0 && hasMoreData && !loading && (
        <div className='flex justify-center items-center gap-10 flex-col pb-5'>
          <button
            type='submit'
            className={`px-5 py-2 mt-5 content-center border border-zinc-600 rounded-full text-zinc-600 
              hover:text-white hover:bg-midnight
            `}
            disabled={!hasMoreData}
            onClick={() => loadMore()}>
            Load More
          </button>
        </div>
      )}
      {loading && (
        <div className='flex justify-center items-center gap-10 flex-col pb-5 mt-5'>
          <Loading />
        </div>
      )}
      {!hasMoreData && !loading && (
        <div className='flex justify-center items-center gap-10 flex-col pb-5 mt-5'>
          <p>No more Services...</p>
        </div>
      )}
    </div>
  );
}

export default Services;