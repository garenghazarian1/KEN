import styles from './InstagramFeed.module.css';

const InstagramFeed = () => {
  return (
    <div className={styles.container}>
      <iframe src="https://cdn.lightwidget.com/widgets/0df751793acd50a8a639c5a6d27cadeb.html" 
      scrolling="yes" 
      allowtransparency="true" 
      className={styles.iframe} 
      ></iframe>
    </div>
  );
};

export default InstagramFeed;