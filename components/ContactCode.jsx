import styles from '../styles/ContactCode.module.css';

const contactItems = [
  {
    social: 'website',
    link: 'samshaon.vercel.app',
    href: 'https://samshaon.vercel.app/',
  },
  {
    social: 'email',
    link: 'alishaon078@gmail.com',
    href: 'mailto:alishaon078@gmail.com',
  },
  {
    social: 'github',
    link: 'shaon07',
    href: 'https://github.com/shaon07',
  },
  {
    social: 'linkedin',
    link: 'md-shamirul-islam',
    href: 'https://www.linkedin.com/in/shaon07/',
  },
  {
    social: 'GitHub',
    link: 'shamirul',
    href: 'https://github.com/shaon07softic',
  },
  {
    social: 'Facebook',
    link: 'shaon',
    href: 'https://www.facebook.com/alishaon.me/',
  },
];

const ContactCode = () => {
  return (
    <div className={styles.code}>
      <p className={styles.line}>
        <span className={styles.className}>.socials</span> &#123;
      </p>
      {contactItems.slice(0, 8).map((item, index) => (
        <p className={styles.line} key={index}>
          &nbsp;&nbsp;&nbsp;{item.social}:{' '}
          <a href={item.href} target="_blank" rel="noopener">
            {item.link}
          </a>
          ;
        </p>
      ))}
      {contactItems.slice(8, contactItems.length).map((item, index) => (
        <p className={styles.line} key={index}>
          &nbsp;&nbsp;{item.social}:{' '}
          <a href={item.href} target="_blank" rel="noopener">
            {item.link}
          </a>
          ;
        </p>
      ))}
      <p className={styles.line}>&#125;</p>
    </div>
  );
};

export default ContactCode;
