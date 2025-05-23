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
      <meta property="og:image" content="https://i.ibb.co/cXNTVbQm/dddd.png" />
      <meta property="og:url" content="https://samshaon.vercel.app" />
    </Head>
  );
};

export default CustomHead;

CustomHead.defaultProps = {
  title: 'MD SHAMIRUL ISLAM',
};
