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
    if ('sdkVersion' in expo) {
      response.sdkLong = expo.sdkVersion;
      response.sdk = Math.trunc(parseFloat(expo.sdkVersion));
    }

    // name
    if ('name' in expo) {
      response.name = expo.name;
    }

    // description
    if ('description' in expo) {
      response.description = expo.description;
    }

    // icon
    if ('icon' in expo) {
      let iconPath = expo.icon.replace(/^(?:\.\.\/)+/, '');
      iconPath = iconPath.replace('./', '');
      iconPath = iconPath.replace(/^\/+/g, '');
      response.icon = iconPath;
    }

    // splash
    if ('splash' in expo && 'image' in expo.splash) {
      let splashPath = expo.splash.image.replace(/^(?:\.\.\/)+/, '');
      splashPath = splashPath.replace('./', '');
      splashPath = splashPath.replace(/^\/+/g, '');
      response.splash = splashPath;
    }

    // primaryColor
    if ('primaryColor' in expo) {
      response.primaryColor = expo.primaryColor;
    }

    // githubUrl
    if ('githubUrl' in expo) {
      response.githubUrl = expo.githubUrl;
    }
  }

  // TODO
  // privacy
  // platforms
  // orientation

  return response;
};
