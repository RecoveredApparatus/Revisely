# Revisely

Revisely is a flashcard revision application built with React Native and Expo. It allows users to create decks, manage flashcards, and review them directly from their Android Home Screen using a custom native widget.

## Features

- **Flashcard Decks**: Create and manage custom study decks.
- **Card Editor**: Add questions and answers to build out your flashcards.
- **Native Android Widget**: View your flashcards directly from your Android home screen without opening the app.
- **Dark Mode UI**: A sleek, dark-themed user interface built for deep focus.
- **Local Storage**: All data is saved directly on your device using `AsyncStorage`.

## Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Navigation**: [React Navigation](https://reactnavigation.org/) (Bottom Tabs & Stack)
- **Native Widgets**: [react-native-android-widget](https://github.com/sAleksovski/react-native-android-widget)
- **Storage**: `@react-native-async-storage/async-storage`

## Building for Android

Because this project includes custom native code (the Android Widget), it cannot be run in standard Expo Go. It must be compiled natively.

1. **Prebuild the Android folder**:
   ```bash
   npx expo prebuild -p android --clean
   ```
2. **Compile the APK**:
   - Via cloud: `eas build -p android --profile preview`
   - Via local Gradle (or CodeMagic): `cd android && ./gradlew assembleDebug` (or `assembleRelease`)

## Widget Setup

The native widget code is located in `src/widget/`. 
- `FlashcardWidget.js`: Defines the UI layout of the widget using Flexbox.
- `WidgetTaskHandler.js`: Handles background tasks to load the latest flashcard from `AsyncStorage` and send it to the widget.
