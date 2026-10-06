# Welcome to your Expo app 👋

## Open on your phone (no laptop needed)

Scan with the iPhone Camera app. It opens the latest published version in [Expo Go](https://expo.dev/go):

<img src="https://qr.expo.dev/eas-update?projectId=81fd32f9-76b8-47c0-a8cd-853e7768b3cf&runtimeVersion=exposdk%3A57.0.0&channel=preview" alt="QR code for the latest preview in Expo Go" width="220" />

Or open this link on the phone: `exp://u.expo.dev/81fd32f9-76b8-47c0-a8cd-853e7768b3cf?runtime-version=exposdk%3A57.0.0&channel-name=preview`

This QR code never changes. To ship new code to it, run:

```bash
npm run publish
```

This bundles the JavaScript and uploads it to EAS Update (`preview` channel). Expo Go picks it up the next time the app is opened with a connection; otherwise it runs the copy it already downloaded. Two limits:

- Only libraries bundled in Expo Go work. The `runtimeVersion` policy in `app.json` is `sdkVersion` (`exposdk:57.0.0`), the runtime Expo Go accepts.
- After upgrading the Expo SDK, the QR code's `runtimeVersion` changes to match (e.g. `exposdk%3A58.0.0`).

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
