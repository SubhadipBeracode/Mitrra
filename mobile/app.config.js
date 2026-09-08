export default {
  expo: {
    name: "Mitrra",
    slug: "Mitrra",
    version: "1.0.0",
    orientation: "portrait",

    icon: "./assets/image/app_icon.png",

    scheme: "mobile",

    userInterfaceStyle: "automatic",

    ios: {
      icon: "./assets/image/app_icon.png",
      bundleIdentifier: "com.yourname.aidailydigest",
    },

    android: {
      package: "com.subhadip123.Mitrra",

      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",

      adaptiveIcon: {
        backgroundColor: "#121212",
        foregroundImage: "./assets/image/app_icon.png",
      },

      predictiveBackGestureEnabled: false,

      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS",
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK",
      ],
    },

    web: {
      output: "static",
      favicon: "./assets/image/app_icon.png",
    },

    plugins: [
      "expo-router",

      [
        "expo-splash-screen",
        {
          backgroundColor: "#121212",
          image: "./assets/image/splash.png",
          imageWidth: 200,
        },
      ],

      "expo-secure-store",
      "expo-status-bar",
      "expo-audio",
      "expo-asset",
    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },

    extra: {
      router: {},

      eas: {
        projectId: "2395d995-a3d1-4f91-b80d-0e93ddb79ad7",
      },
    },
  },
};