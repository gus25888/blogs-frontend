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

export default Notification