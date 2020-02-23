const fs = require('fs');
const { remote } = require('electron');
const { dialog, shell } = remote;
const { basename } = require('path');

export const projectExists = (projectsInfo, selectedPath) => {
  let response = false;

  // get base directory
  const directory = basename(selectedPath);

  // already a linked project?
  if (directory in projectsInfo) {
    // audio signal
    shell.beep();

    // icon in project?
    let projectIcon = null;
    if ('icon' in projectsInfo[directory]) {
      projectIcon = `${selectedPath}/${projectsInfo[directory].icon}`;
    }

    dialog.showMessageBox({
      detail: null,
      icon: projectIcon,
      message: 'This project was already added!',
      title: 'This project was already added!'
    });

    // project exists!
    response = true;
  }

  return response;
};

export const isExpoProject = selectedPath => {
  // default response
  let response = { expo: false };

  // set app.json path
  const appJsonPath = `${selectedPath}/app.json`;

  // does app.json exist?
  if (fs.existsSync(appJsonPath)) {
    const appJsonRaw = fs.readFileSync(appJsonPath);
    const appJson = JSON.parse(appJsonRaw);
    const expoData = parseAppJson(appJson);

    // set package.json path
    const packageJsonPath = `${selectedPath}/package.json`;
    let packageData = {};
    // does package.json exist?
    if (fs.existsSync(packageJsonPath)) {
      const packageJsonRaw = fs.readFileSync(packageJsonPath);
      const packageJson = JSON.parse(packageJsonRaw);
      packageData = parsePackageJson(packageJson);
    }

    // extend data
    const extData = {
      ...packageData,
      installed: fs.existsSync(`${selectedPath}/node_modules/`),
      path: selectedPath
    };
    response = Object.assign(expoData, extData);
  }

  return response;
};

export const parseAppJson = appData => {
  // default response
  const response = { expo: false };

  // is expo :: http://jsben.ch/WqlIl
  if ('expo' in appData) {
    // is expo app.json
    response.expo = true;
    const expo = appData.expo;

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

    // platforms
    if ('platforms' in expo) {
      response.platforms = expo.platforms;
    }

    // orientation
    // https://docs.expo.io/versions/latest/workflow/configuration/#orientation
    response.orientation = 'orientation' in expo ? expo.orientation : 'no lock';
  }

  return response;
};

export const parsePackageJson = packageData => {
  // default response
  const response = {};

  if ('author' in packageData) {
    response.author = packageData.author;
  }

  return response;
};

export const alertNewProject = expoData => {
  const showMessageObj = {
    detail: null,
    icon: null,
    message: null,
    title: 'Expo Project Added!'
  };

  if ('icon' in expoData) {
    showMessageObj.icon = `${expoData.path}/${expoData.icon}`;
  }

  if ('name' in expoData) {
    showMessageObj.message = expoData.name;

    if ('appVersion' in expoData) {
      showMessageObj.message += ` - v${expoData.appVersion}`;
    }

    if ('sdk' in expoData) {
      showMessageObj.message += ` (Expo SDK: ${expoData.sdk})`;
    }
  }

  if ('description' in expoData) {
    showMessageObj.detail = expoData.description;
  }

  dialog.showMessageBox(showMessageObj);
};
