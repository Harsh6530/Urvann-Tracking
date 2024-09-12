import Styles from './OrderStatusTimeline.module.css';

const statusSteps = ['Order placed', 'Picked', 'Delivered'];

const OrderStatusTimeline = (props) => {
  const { status } = props;

  const currentStatusIndex =
    (status === 'Delivery Failed') ?
      statusSteps.indexOf("Delivered") :
      statusSteps.indexOf(status);

  // Handle looping status steps for 'Delivery Failed' status
  const relevantSteps =
    (status === 'Delivery Failed') ?
      statusSteps.slice(0, 2).concat('Delivery Failed').concat(statusSteps.slice(0, 3)) :
      statusSteps.slice(0, 3);

  return (
    <div className={Styles.statusTimeline}>
      {relevantSteps.map((step, index) => (
        <div
          key={step}
          className={`${Styles.statusStep} ${index <= currentStatusIndex ? Styles.completed : ''} ${step === 'Delivery Failed' ? Styles.notDelivered : ''}`}
        >
          <div className={Styles.stepCircle}></div>
          <span className={Styles.stepLabel}>{step}</span>
        </div>
      ))}
    </div>
  )
}

export default OrderStatusTimeline
