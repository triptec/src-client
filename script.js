var sp = getSpotifyApi(1);
var m = sp.require("sp://import/scripts/api/models");
var v = sp.require("sp://import/scripts/api/views");
var ui = sp.require('sp://import/scripts/dnd');
var socket;

//exports.init = init;

function init() {

	updatePageWithTrackDetails();

	sp.trackPlayer.addEventListener("playerStateChanged", function (event) {
		
		// Only update the page if the track changed
		if (event.data.curtrack == true) {
			updatePageWithTrackDetails();
		}
	});
}

function updatePageWithTrackDetails() {
	
	var header = document.getElementById("header");

	// This will be null if nothing is playing.
	var playerTrackInfo = sp.trackPlayer.getNowPlayingTrack();

	if (playerTrackInfo == null) {
		header.innerText = "Nothing playing right now:)!";
	} else {
		var track = playerTrackInfo.track;
		header.innerText = track.name + " on the album " + track.album.name + " by " + track.album.artist.name + ".";
	}
}

function searchGoogleForSpotify() {

	var req = new XMLHttpRequest();
	req.open("GET", "https://www.googleapis.com/customsearch/v1?q=spotify", true);

	req.onreadystatechange = function() {

		console.log(req.status);

   		if (req.readyState == 4) {
    		if (req.status == 200) {
       			console.log("Search complete");
     		}
   		}
  	};

	req.send();
}

function doConnect(){
    socket = io.connect('http://localhost:8000');
    socket.on("connect",onConnect)
}

function onConnect(evt){
	console.log(evt);
	return;
    
    /*
    data = new Object();
	data.action = "join";
	data.room = $("#room").val();
	websocket.send(JSON.stringify(data));
    */
}

function onClose(evt){
	console.log(evt);
}

function onMessage(evt){
	console.log(evt);
	try{
		data = JSON.parse(evt.data);
		console.log(data);
		if(data.message){
			$("#status").text("Status: "+data.message);
		}
		
		if(data.action == "play"){
			m.Track.fromURI(data.uri,tplPlayer.play);		
		}
		
	}catch(e){
		console.log(e);
	}
	
}

function onError(evt){
	console.log(evt);
}

// Custom fields, playlist with tracks of varying availability.
var tpl = new m.Playlist();
var tplPlayer = new v.Player();
var tempList = new v.List(tpl);
tpl.add(m.Track.fromURI("spotify:track:4z4t4zEn4ElVPGmDWCzRQf"));
tpl.add(m.Track.fromURI("http://open.spotify.com/track/7E8JGVhbwWgAQ1DtfatQEl"));
tpl.add(m.Track.fromURI("spotify:track:40YBc3mR3yyqyYvtesQOMj"));
tpl.add(m.Track.fromURI("spotify:local:Rolling+Stones:A+Bigger+Bang:Rain+Fall+Down:293"));
tplPlayer.track = tpl.get(0);
tplPlayer.context = tpl;







$(document).ready(function(){
	init();
	$("h2").text("Niggah plz!");
	var lib = sp.core.library.getPlaylists();
	console.log(sp,sp.core,sp.core.library,sp.desktop);
	document.body.appendChild(tplPlayer.node);
	document.body.appendChild(tempList.node);	

	$(".connect").click(function(){
		doConnect();
	});
	
	$(".playBtn").click(function(){
		data = new Object();
		data.action = "play";
		data.room = $("#room").val();
		websocket.send(JSON.stringify(data));		
	});
	
	/*	
	for(i in lib){
		$("#playlists").append("<li>"+lib[i].name+"</li>");
	}
	*/
});
