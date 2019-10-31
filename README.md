 
 
 please follow react-native Documentation :- https://facebook.github.io/react-native/docs/getting-started

Installing dependencies:-

1. Node:- Follow the installation instructions to install Node newer version.
   Link:- https://nodejs.org/en/download/
         Assuming that you have Node 10 LTS or greater installed.

         * Run the following command in a Command Prompt or shell:- npm install -g react-native-cli

2. Android development environment set up :-
   
   a. Install Android Studio
   b. Install the Android SDK
   c. Configure the ANDROID_HOME environment variable
      Add the following lines to your  config file:-

      export ANDROID_HOME=$HOME/Android/Sdk
      export PATH=$PATH:$ANDROID_HOME/emulator
      export PATH=$PATH:$ANDROID_HOME/tools
      export PATH=$PATH:$ANDROID_HOME/tools/bin
      export PATH=$PATH:$ANDROID_HOME/platform-tools

  3. Run Exitisting Project :-
      
      STEP1:- cd GreenLitterBug
      STEP2:- npm install 
      STEP2:- npm start # you can also use: expo start
  
   4. Running your React Native application:-

      Install the Expo client app on your iOS or Android phone and connect to the same wireless network as your computer. On Android, use the Expo app to scan the QR code from your terminal to open your project. On iOS, follow on-screen instructions to get a link.