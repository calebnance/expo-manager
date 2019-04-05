export const appJsonData = rawData => {
  // console.log('rawData');
  // console.log(rawData);
  const response = { expo: false };

  if (rawData.expo !== undefined) {
    // is expo app.json
    response.expo = true;
    const expo = rawData.expo;

    // app version
    if (expo.version !== undefined) {
      response.appVersion = expo.version;
    }

    // android
    if (expo.android !== undefined) {
      // version
      if (expo.android.versionCode !== undefined) {
        response.androidVersion = expo.android.versionCode;
      }
    }

    // apple (ios)
    if (expo.ios !== undefined) {
      response.appVersion = expo.version;
      // version
      if (expo.ios.buildNumber !== undefined) {
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
