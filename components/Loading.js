import Styles from './Loading.module.css';

const Loading = () => {
  return (
    <div className={Styles.loadingContainer}>
      {/* Add any one of the spinner or pulse class */}
      {/* <div className={Styles.pulse}></div> */}
      <div className={Styles.spinner}></div>
      <p className={Styles.loadingText}>Loading...</p>
    </div>
  );
};

export default Loading;
