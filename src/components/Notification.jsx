import PropTypes from 'prop-types'

const Notification = ({ notificationText, notificationType }) => {
  if (notificationText === null || !notificationType) {
    return null
  }

  return (
    <div className={`notification ${notificationType}`}>
      {notificationText}
    </div>
  )
}

Notification.propTypes = {
  notificationText: PropTypes.string,
  notificationType: PropTypes.string,
}
export default Notification