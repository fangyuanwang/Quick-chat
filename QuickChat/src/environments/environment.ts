// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyBqrxJk1F5wXSJJIUT7Bv3fR30wTU2cTxc",
    authDomain: "wangf-quick-chat.firebaseapp.com",
    databaseURL: "https://wangf-quick-chat.firebaseio.com",
    projectId: "wangf-quick-chat",
    storageBucket: "wangf-quick-chat.appspot.com",
    messagingSenderId: "679895769420"
  }
};
