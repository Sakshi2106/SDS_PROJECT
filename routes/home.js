var express = require('express');
var router = express.Router();
var request = require('request')

var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
const { isRegExp } = require('util');

var client_id = '945d014c29324d778ea8420a4c38c1e6'; // Your client id
var client_secret = '176cd38523fa43cab549712eff2d83a2'; // Your secret
var redirect_uri = 'http://localhost:8888/callback';
var access_token = 'token';
var refresh_token = '';
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

router.get('', (req, res) => {
  res.render('home.hbs', {style: 'home.css'})
})


router.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private  user-read-email user-top-read playlist-read-private user-read-recently-played playlist-read-collaborative';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }) );
    
    var code = req.query.code ;
    var state = req.query.state ;
    
});

router.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code ;
  var state = req.query.state ;
  var storedState = req.cookies ? req.cookies[stateKey] : null;
  
  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      })
      );
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        access_token = body.access_token,
        refresh_token = body.refresh_token;
        console.log(access_token)
        var options = {
          url: 'https://api.spotify.com/v1/me/player/recently-played?type=track&limit=10',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, (err, data) => {
          
          if (err) throw error;
          
            var firstAlbumImage = data.body.items[0].track.album.images[0].url
            var secondAlbumImage = data.body.items[1].track.album.images[1].url;
            var thirdAlbumImage = data.body.items[2].track.album.images[0].url;
            var fourthAlbumImage = data.body.items[3].track.album.images[0].url;
            var fifthAlbumImage = data.body.items[4].track.album.images[0].url;
            var sixthAlbumImage = data.body.items[5].track.album.images[0].url;
            var seventhAlbumImage = data.body.items[6].track.album.images[0].url;
            var eigthAlbumImage = data.body.items[7].track.album.images[0].url;
            var ninthAlbumImage = data.body.items[8].track.album.images[0].url;
            var firstAlbumName = data.body.items[0].track.name;
            var secondAlbumName = data.body.items[1].track.name;
            var thirdAlbumName = data.body.items[2].track.name;
            var fourthAlbumName = data.body.items[3].track.name;
            var fifthAlbumName = data.body.items[4].track.name;
            var sixthAlbumName = data.body.items[5].track.name;
            var seventhAlbumName = data.body.items[6].track.name;
            var eigthAlbumName = data.body.items[7].track.name;
            var ninthAlbumName = data.body.items[8].track.name;
            var firstID = data.body.items[0].track.id;
            var secondID = data.body.items[1].track.id;
            var thirdID = data.body.items[2].track.id;
            var fourthID = data.body.items[3].track.id;
            var fifthID = data.body.items[4].track.id;



            res.render('index', {
                    title: 'Musify',
                    style:'index.css',
                    script: 'index.js',
                    firstAlbumImage: firstAlbumImage,
                    secondAlbumImage: secondAlbumImage,
                    thirdAlbumImage: thirdAlbumImage,
                    fourthAlbumImage: fourthAlbumImage,
                    fifthAlbumImage: fifthAlbumImage,
                    sixthAlbumImage: sixthAlbumImage,
                    seventhAlbumImage: seventhAlbumImage,
                    eigthAlbumImage: eigthAlbumImage,
                    ninthAlbumImage: ninthAlbumImage,
                    firstAlbumName: firstAlbumName,
                    secondAlbumName: secondAlbumName,
                    thirdAlbumName: thirdAlbumName,
                    fourthAlbumName: fourthAlbumName,
                    fifthAlbumName: fifthAlbumName,
                    sixthAlbumName: sixthAlbumName,
                    seventhAlbumName: seventhAlbumName,
                    eigthAlbumName: eigthAlbumName,
                    ninthAlbumName: ninthAlbumName,
                    access_token: access_token,
                    firstID: firstID,
                    secondID: secondID,
                    thirdID: thirdID,
                    fourthID: fourthID,
                    fifthID: fifthID
            });

        });
      }
    });
    }
        // we can also pass the token to the browser to make requests from ther
});



router.get('/playlist', (req, res) => {
  console.log(access_token)
  var options = {
    url: 'https://api.spotify.com/v1/me/playlists',
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  };
  
  request.get(options, (err, data) => {
    if (err) throw err;
   
    res.send(data.body.items)
  });
});

router.get('/playlistdata', (req, res) => {
  console.log(access_token)
  res.render('playlist', {script: 'playlist.js', access_token: access_token, style: 'playlist.css'})
});


router.get('/profile', (req, res) => {
  console.log(access_token)
  var options = {
    url: 'https://api.spotify.com/v1/me',
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  };
  
  request.get(options, (err, data) => {
    if (err) throw err;
    
    name = data.body.display_name;
    email = data.body.email;
    followers = data.body.followers.total;
    country = data.body.country
    userID = data.body.id
    res.render('profile', {
      style:'profile.css',
      name : name,
      email : email,
      followers : followers,
      country : country,
      userID : userID
    })
    
  })
  

});




  

module.exports= router