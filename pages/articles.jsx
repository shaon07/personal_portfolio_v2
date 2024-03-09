import ArticleCard from '../components/ArticleCard';
import styles from '../styles/ArticlesPage.module.css';
import { useEffect, useState } from 'react';

const ArticlesPage = () => {

  const [articles, setArticles] = useState([]);

  useEffect(() => {
     fetch(
      'https://dev.to/api/articles?username=shaon07',
    ).then((res) => {
      if (res.ok) {
        return res.json();
      }
    }).then((data) => {
      setArticles(data)
    })
  
  },[])

  return (
    <>
      <h3>
        Recent Posts from{' '}
        <a
          href="https://dev.to/shaon07"
          target="_blank"
          rel="noopener"
          className={styles.underline}
        >
          dev.to
        </a>
      </h3>
      <div className={styles.container}>
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </>
  );
};


export default ArticlesPage;
