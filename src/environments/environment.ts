export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  application:
  {
    name: 'karryngo',
    angular: 'Angular 11.0.0',
    bootstrap: 'Bootstrap 5.0.0',
    fontawesome: 'Font Awesome 5.15.1',
  },
  url: 'http://localhost:5004',
  config: {
    /* SELECT ONE OF THOSE CONFIGURATIONS */

    /* LOCAL JSON (NO CRUD) */
    api: false,
    url: './assets/params/json/trips/',

    /* LOCAL REST API CRUD  */
    /* api: true,
    url: 'http://localhost:5200/', */
  },
  firebase: {
    databaseURL: 'https://karry-n-go.firebaseio.com',
    apiKey: 'AIzaSyCOX5wXZyToH9HhBfrzTbA-6RgCzAecllE',
    authDomain: 'karry-n-go.firebaseapp.com',
    projectId: 'karry-n-go',
    storageBucket: 'karry-n-go.appspot.com',
    messagingSenderId: '294710515571',
    appId: '1:294710515571:web:010a1ab080436d5ae25706',
    measurementId: 'G-XVN0CTSLT3'
  }
};
