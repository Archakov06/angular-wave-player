var app = angular.module('app',[]);

app.controller('appController', ['$scope','$http','$interval', function($scope, $http, $interval){


  $scope.waveform = null; // Waveform object
  $scope.isPlaying = false;

  // Set image on poster
  $scope.thumb = 'https://www.radiorecord.ru/player/img/logos/rr.jpg';
  // Artist name (default: 'Radio Record')
  $scope.artist = 'Radio Record';
  // Song name
  $scope.song = '';


  // Get track information
  $scope.getTrack = function(){
    $http.get('https://www.radiorecord.ru/xml/record_online_v8.txt').then(function(response){
      $scope.artist = response.data.artist;
      $scope.song = response.data.title ? response.data.title : '';
      $scope.thumb = response.data.image600 ? response.data.image600 : 'https://www.radiorecord.ru/player/img/logos/rr.jpg';
    });
  }

  // Play & Pause track
  $scope.play = function(){

    // If track is playing ...
    if (!$scope.isPlaying) {

      // First, get track info
      $scope.getTrack();

      // Make audio wave
      $scope.waveform = new Waveform({
        container: document.getElementById("track-wave"),
        interpolate: false
      });

      // Set gradient color
      var ctx = $scope.waveform.context;
      var gradient = ctx.createLinearGradient(0, 0, 0, $scope.waveform.height);
      gradient.addColorStop(0.0, "#666");
      gradient.addColorStop(1.0, "#fff");
      $scope.waveform.innerColor = gradient;

      // Scoping global sound object
      $scope.soundObject = soundManager.createSound({
        id: 'record', // Set current track ID
        url: 'http://air2.radiorecord.ru:805/rr_320', // Radio stream URL
        autoLoad: false, // It makes no sense to preload an endless stream
        autoPlay: false, // Music is played back after the create object
        volume: 50, // Track volume
        useFastPolling: true, // check documentation...
        useEQData: true, // enable equalizer data
        onload: function(bSuccess) {
          if(!bSuccess) console.error('Audio not loaded!');
        },
        whileplaying: function() {
          // updating waveform data
          $scope.waveform.update({data: $scope.soundObject.eqData.right});
        }
      });

      // Play audio stream
      $scope.soundObject.play();
      $scope.isPlaying = true;

      document.querySelector('#track-wave canvas:first-child').remove();

    } else {
      soundManager.destroySound('record');
      $scope.isPlaying = false;
    }
  }

  // Update track info every 10 sec
  $interval(function(){
    $scope.getTrack();
  },10000);

}]);

app.run(['$rootScope', function($rootScope){

  // Configuration soundManager
  soundManager.setup({	// initialize player
		url: 'public/swf/',	// SWF path
		flashVersion: 9,	// Flash version
		preferFlash: true,	// Use only flash
		useHighPerformance: true // Flash is given higher priority when positioned within the viewable area of the browser
	});

}]);
