const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const morgan = require('morgan');
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(express.static('views'));
app.set('view engine', 'ejs');

// for render url uplad page views/uplad.ejs
app.get('/upload', function (req, res) {
  res.render('upload');
});
// for render index page views/index.ejs
app.get('/', function (req, res) {
  res.render('index');
});

// for render if url is valid views/success.ejs
app.get('/success', function (req, res) {
  res.render('success');
});
// for render if url is not valid
app.get('/error', function (req, res) {
  res.render('error');
});
const request = (opts = {}, cb) => {
  const requester = opts.protocol === 'https:' ? https : http;
  return requester.request(opts, cb);
};

// after upload check the url valid or not
app.post('/upload', (req, res) => {
   // to get the url from req object 
    let target= req.body.URL
    // if no url is present 
    if(!target){
      console.log('no url provided');
      res.redirect('/error');
    }else{
      let checkurl = new Promise((resolve, reject) => {
        let uri;

        try {
          //parse the target url
          uri = url.parse(target);
        } catch (err) {
          reject(new Error(`Invalid url ${target}`));
        }
        // in options object we pass the parameter which are present in the url 
        const options = {
          method: 'HEAD',
          host: uri.host,
          protocol: uri.protocol,
          port: uri.port,
          path: uri.path,
          timeout: 5 * 1000,
        };

        const req = request(options, (res) => {
          const { statusCode } = res;

          if (statusCode >= 200 && statusCode < 300) {
            resolve(target);
          } else {
            reject(new Error(`Url ${target} not found.`));
          }
        });

        req.on('error', reject);

        req.end();
      });
      const showOff = function (target) {
          // if our promise is resolved means we get what we want 
          const message = 'url is valid'
          return Promise.resolve(message);
      };
      // call our promise
      const askUrl = function () {
          checkurl
              .then(showOff)
              .then(fulfilled =>{
                // if promise fulfilled then we render success page
                console.log(fulfilled)
                res.redirect('/success')}) // fat arrow
              .catch(error => {
                // if promise not  fulfilled then we render error page
                console.log(error.message)
                res.redirect('/error');
                res.end()} ); // fat arrow
      };
      askUrl()
      // if(fulfilled()){
      //   alert('url is valid')
      //   res.redirect('/success');
      // }
      // else{
      //   console.log('url is not valid')
      //   res.redirect('/error');
      //   res.end();
      // }
    }
});


app.listen(3000, () => {
  console.log('listening on port 3000');
});
module.exports = app;


