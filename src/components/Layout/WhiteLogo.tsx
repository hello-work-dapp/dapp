import Image from 'next/image';
import Link from 'next/link';

function WhiteLogo({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  return (
    <h1 className={`text-1xl ${theme == 'light' ? 'text-white' : 'text-redpraha'}`}>
      <Link href='/' className='flex items-center'>
        <Image
          src={'/logo-text-white.png'}
          width={180}
          height={36}
          alt='HelloWork logo'
          className='-ml-2 sm:ml-0'
        />
      </Link>
    </h1>
  );
}

export default WhiteLogo;
