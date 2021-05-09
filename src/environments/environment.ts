export const environment = {
  production: false,
  // apiUrl: 'http://localhost:8080/api',
  // application:
  // {
  //   name: 'karryngo',
  //   angular: 'Angular 11.0.0',
  //   bootstrap: 'Bootstrap 5.0.0',
  //   fontawesome: 'Font Awesome 5.15.1',
  // },
  // url: 'http://localhost:5004',
  config: {
    /* SELECT ONE OF THOSE CONFIGURATIONS */

    /* LOCAL JSON (NO CRUD) */
    api: false,
    // url: './assets/params/json/trips/',

    /* LOCAL REST API CRUD  */
    /* api: true,
    url: 'http://localhost:5200/', */
  },
  firebase: {
    apiKey: 'AIzaSyCIi9bNVRxjBxEF5FgUsJwivy1bGH34EzY',
    authDomain: 'momo-coin-23837.firebaseapp.com',
    projectId: 'momo-coin-23837',
    storageBucket: 'momo-coin-23837.appspot.com',
    messagingSenderId: '155737173284',
    appId: '1:155737173284:web:07f41f5db9527097d017b1',
    measurementId: 'G-KPM5Z0YSG1'
  }
};
