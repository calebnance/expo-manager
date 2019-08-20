export const appJsonData = rawData => {
  // console.log('rawData');
  // console.log(rawData);
  const response = { expo: false };

  if ('expo' in rawData) {
    // is expo app.json
    response.expo = true;
    const expo = rawData.expo;

    // app version
    if ('version' in expo) {
      response.appVersion = expo.version;
    }

    // android
    if ('android' in expo) {
      // version
      if ('versionCode' in expo.android) {
        response.androidVersion = expo.android.versionCode;
      }
    }

    // apple (ios)
    if ('ios' in expo) {
      response.appVersion = expo.version;
      // version
      if ('buildNumber' in expo.ios) {
        response.iosBuildNumber = expo.ios.buildNumber;
      }
    }

    // web :: TODO

    // sdk version
    if (expo.sdkVersion !== undefined) {
      response.sdkLong = expo.sdkVersion;
      response.sdk = Math.trunc(parseFloat(expo.sdkVersion));
    }

    // name
    if (expo.name !== undefined) {
      response.name = expo.name;
    }

    // description
    if (expo.description !== undefined) {
      response.description = expo.description;
    }

    // icon
    if (expo.icon !== undefined) {
      let iconPath = expo.icon.replace(/^(?:\.\.\/)+/, '');
      iconPath = iconPath.replace('./', '');
      iconPath = iconPath.replace(/^\/+/g, '');
      response.icon = iconPath;
    }

    // primaryColor
    if (expo.primaryColor !== undefined) {
      response.primaryColor = expo.primaryColor;
    }
  }

  // TODO
  // privacy
  // platforms
  // orientation

  return response;
};
