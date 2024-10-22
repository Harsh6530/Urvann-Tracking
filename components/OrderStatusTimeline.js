import Styles from './OrderStatusTimeline.module.css';

const OrderStatusTimeline = (props) => {
  const { status, isReplacement } = props;

  const statusSteps = ['', '', ''];

  if (isReplacement) {
    statusSteps[0] = 'Replacement initiated';
    statusSteps[1] = 'Picked';
    statusSteps[2] = 'Replacement Successful';
  } else {
    statusSteps[0] = 'Order placed';
    statusSteps[1] = 'Picked';
    statusSteps[2] = 'Delivered';
  }

  const currentStatusIndex =
    (status === 'Delivery Failed') ?
      statusSteps.indexOf("Delivered") :
      statusSteps.indexOf(status);

  // Handle looping status steps for 'Delivery Failed' status
  const relevantSteps =
    (status === 'Delivery Failed') ?
      statusSteps.slice(0, 2).concat('Delivery Failed') :
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
