const { Expo } = require('expo-server-sdk');

const expo = new Expo();
const notify = async(token = 'ExponentPushToken[AuYUeiNmx-zLTsIr1ERVRT]', body = 'Some message from custom notification', data = {}, title = 'Smart Shop!') => {
  try {
    if (!Expo.isExpoPushToken(token)) {
      return `Not a valid token`;
    }
    const message = {
      to: token,
      sound: 'default',
      title,
      body,
      data,
    };
    return await expo.sendPushNotificationsAsync([message]);
  } catch (error) {
    console.log("error:", error)
    throw Error(error);
  }
}

notify()

module.exports = { notify };
