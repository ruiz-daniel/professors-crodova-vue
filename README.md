# professors-cordova-vue

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Generate apk file using external caregiver app

1. Navigate to src-cordova folder from command line or open a command line from said folder

2. execute command "cordova build android"

3. copy contents in "[project folder]/src-cordova/www

4. paste them into [caregiver-app folder]/www. Overwrite if necessary

5. open a command line in the caregiver-app folder

6. execute command "cordova build android"

7. Follow the console's instructions
