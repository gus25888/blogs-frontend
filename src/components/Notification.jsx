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

Notification.PropTypes = {
  notificationText: PropTypes.string.isRequired,
  notificationType: PropTypes.string.isRequired,
}
export default Notification