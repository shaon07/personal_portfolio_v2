import Head from 'next/head';

const CustomHead = ({ title }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta
        name="description"
        content="MD SHAMIRUL ISLAM JAVASCRIPT DEVELOPER"
      />
<meta
  name="keywords"
  content="shamirul shaon, shamirul, shaon, web developer portfolio, shamirul web developer, shaon developer, mern stack, shamirul shaon portfolio, vscode-portfolio"
/>

      <meta property="og:title" content="MD SHAMIRUL ISLAM Portfolio" />
      <meta
        property="og:description"
        content="A JavaScript developer building websites that you'd like to use."
      />
      <meta property="og:image" content="https://ibb.co/BKgsF4B1" />
      <meta property="og:url" content="https://vscode-portfolio.vercel.app" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
};

export default CustomHead;

CustomHead.defaultProps = {
  title: 'MD SHAMIRUL ISLAM',
};
