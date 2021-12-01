// Client and client Secret ID that has been taken from the Spotify Website //
const clientId = 'd3a7cdfe83114049924dfca0bfbbf295';
const clientSecret = '69e1b0829c0f4ffab92c2f36b16efd52';


// OPTIONS TO PAUSE THE VIDEO //
var video = document.getElementById("myVideo");
var btn = document.getElementById("myBtn");

function myFunction() {
  if (video.paused) {
    video.play();
    btn.innerHTML = "Pause";
  } else {
    video.pause();
    btn.innerHTML = "Play";
  }
}

// Deffining names for the const and The token //


const SpotifiySongAPI = 


(function() {

    return {
        getToken() {
            return token();
        },
        getGenres(token) {
            return genres(token);
        },
        getPlaylistByGenre(token, genreId) {
            return playlist(token, genreId);
        },
        getTracks(token, tracksEndPoint) {
            return tracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return track(token, trackEndPoint);
        }
    }
  })();
  
    

// Fetching the Results that will return json from the official website //

  
  const genres = async (token) => {

      const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
          method: 'GET',
          headers: { 'Authorization' : 'Bearer ' + token}
      });

      const data = await result.json();
      return data.categories.items;
  }

  // Fetching the Genres that will return json from the official website //


  const playlist = async (token, TheGenres) => {

     
      
      const result = await fetch(`https://api.spotify.com/v1/browse/categories/${TheGenres}/playlists?`, 
      {
          method: 'GET',
          headers: { 'Authorization' : 'Bearer ' + token}
      });

      const data = await result.json();
      return data.playlists.items;
  }

    // Fetching the Tracks that will return json from the official website //


  const tracks = async (token, LastTracksPlayed) => {

      const result = await fetch(`${LastTracksPlayed}`, {
          method: 'GET',
          headers: { 
              'Authorization' : 
              'Bearer ' + token}
      });

      const data = await result.json();
      return data.items;
  }

      // Fetching the a Track that will return json from the official website //


  const track = async (token, LastTrackPlayed) => {

      const result = await fetch(`${LastTrackPlayed}`, {
          method: 'GET',
          headers: { 'Authorization' : 'Bearer ' + token}
      });

      const data = await result.json();
      return data;
  }

        // Fetching the a Token to be able to have a fully working API  //


  const token = async () => {

    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type' : 
            'application/x-www-form-urlencoded', 
            'Authorization' : 
            'Basic '
             + btoa( clientId + ':' + clientSecret)
        },


        body: 'grant_type=client_credentials'
    });



    const data = await result.json();
    return data.access_token;
}



const SptofiyController = (function() {


  const TrackDetails = {
      Genre: '#select_genre',
      selectPlaylist: '#select_playlist',
      buttonSubmit: '#btn_submit',
      divSongDetail: '#song-detail',
      hfToken: '#hidden_token',
      divSonglist: '.song-list'
  }


  return {

     
      fields() {
          return {
              genre: document.querySelector(TrackDetails.Genre),
              playlist: document.querySelector(TrackDetails.selectPlaylist),
              tracks: document.querySelector(TrackDetails.divSonglist),
              submit: document.querySelector(TrackDetails.buttonSubmit),
              songDetail: document.querySelector(TrackDetails.divSongDetail)
          }
      },

     
      createGenre(text, value) {
          const html = `<option value="${value}">${text}</option>`;
          document.querySelector(TrackDetails.Genre).insertAdjacentHTML('beforeend', html);
      }, 

      createPlaylist(text, value) {
          const html = `<option value="${value}">${text}</option>`;
          document.querySelector(TrackDetails.selectPlaylist).insertAdjacentHTML('beforeend', html);
      },

      
      createTrack(id, name) {
          const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>`;
          document.querySelector(TrackDetails.divSonglist).insertAdjacentHTML('beforeend', html);
      },

      
      createTrackDetail(img, title, artist) {

          const detailDiv = document.querySelector(TrackDetails.divSongDetail);
          
          detailDiv.innerHTML = '';

          const html = 
          `
          <div class="row">
              <img src="${img}" alt="">        
          </div>
          <div class="row">
              <label for="Genre" ">${title}:</label>
          </div>
          <div class="row">
              <label for="artist" ">By ${artist}:</label>
          </div> 
          `;

          detailDiv.insertAdjacentHTML('beforeend', html)
      },

      resetTrackDetail() {
          this.fields().songDetail.innerHTML = '';
      },

      resetTracks() {
          this.fields().tracks.innerHTML = '';
          this.resetTrackDetail();
      },

      resetPlaylist() {
          this.fields().playlist.innerHTML = '';
          this.resetTracks();
      },
      
      storeToken(value) {
          document.querySelector(TrackDetails.hfToken).value = value;
      },

      getStoredToken() {
          return {
              token: document.querySelector(TrackDetails.hfToken).value
          }
      }
  }

})();

const APPController = (function(UICtrl, APICtrl) {

  
  const DOMInputs = UICtrl.fields();


  const loadGenres = async () => {
    
      const token = await APICtrl.getToken();           
    
      UICtrl.storeToken(token);
     
      const genres = await APICtrl.getGenres(token);
  
      genres.forEach(element => UICtrl.createGenre(element.name, element.id));
  }


  DOMInputs.genre.addEventListener('change', async () => {

      UICtrl.resetPlaylist();

      const token = UICtrl.getStoredToken().token;        

      const genreSelect = UICtrl.fields().genre;       
    
      const genreId = genreSelect.options[genreSelect.selectedIndex].value;             

      const playlist = await APICtrl.getPlaylistByGenre(token, genreId);       
   
      playlist.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href));

    
  });
   


  DOMInputs.submit.addEventListener('click', async (e) => {
 
      e.preventDefault();

      UICtrl.resetTracks();
  
      const token = UICtrl.getStoredToken().token;        

      const playlistSelect = UICtrl.fields().playlist;
      
      const tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value;
      
      const tracks = await APICtrl.getTracks(token, tracksEndPoint);
    
      tracks.forEach(el => UICtrl.createTrack(el.track.href, el.track.name))
      
  });

  
  DOMInputs.tracks.addEventListener('click', async (e) => {
    
      e.preventDefault();
      UICtrl.resetTrackDetail();

      const token = UICtrl.getStoredToken().token;

      const trackEndpoint = e.target.id;
   
      const track = await APICtrl.getTrack(token, trackEndpoint);
     
      UICtrl.createTrackDetail(track.album.images[2].url, track.name, track.artists[0].name);
  });    


  
  return {
      init() {
          console.log();
          loadGenres();
      }
  }

})(SptofiyController, SpotifiySongAPI);


APPController.init();



