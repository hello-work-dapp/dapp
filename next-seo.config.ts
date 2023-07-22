const title = 'HelloWork';
const description = 'Making work as simple as a chat';
const url = 'https://www.yourdomain.com';

export default {
  title,
  description,
  canonical: url,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    site_name: 'HelloWork',
    title,
    description,
  },
};
