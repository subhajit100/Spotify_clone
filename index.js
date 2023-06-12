// INITIALIZE VARIABLES

let songIndex = 0;
let totalSongsCount = 7;
let audioElement = new Audio('songs/1.mp3');
let masterPlay = document.getElementById('masterPlay');
let masterSongName = document.getElementById('masterSongName');
let masterSongImage = document.getElementById('masterSongImage');
let previous = document.getElementById('previous');
let next = document.getElementById('next');
let myProgressBar = document.getElementById('myProgressBar');
myProgressBar.value = 0;
let myMusicBarGif = document.getElementById('music_bar_gif');
let songItems = Array.from(document.getElementsByClassName('songItem'));
let songNames = Array.from(document.getElementsByClassName('songName'));
let songDurations = Array.from(document.getElementsByClassName('songDuration'));
let songItemsPlay = Array.from(document.getElementsByClassName('songItemPlay'));

// SONG LIST

// all songs list with {name of song, path where song is stored, background image of song, duration in seconds}
let songs = [
    {songName: 'Aal Izz Well', songPath: 'songs/1.mp3',coverPath: 'images/covers/1.jpg', duration: 276},
    {songName: 'Kar Har Maidan Fateh', songPath: 'songs/2.mp3',coverPath: 'images/covers/2.jpg', duration: 311},
    {songName: 'Dangal', songPath: 'songs/3.mp3',coverPath: 'images/covers/3.jpg', duration: 299},
    {songName: 'Chak Lein De', songPath: 'songs/4.mp3',coverPath: 'images/covers/4.jpg', duration: 265},
    {songName: 'Kandhon Se Milte Hain Kandhe', songPath: 'songs/5.mp3',coverPath: 'images/covers/5.jpg', duration: 341},
    {songName: 'Lakshya Ko Har Haal Me Paana Hai', songPath: 'songs/6.mp3',coverPath: 'images/covers/6.jpg', duration: 376},
    {songName: 'Brothers Anthem', songPath: 'songs/7.mp3',coverPath: 'images/covers/7.jpg', duration: 353}
];


// FUNCTION DECLARATIONS

// convert given time in seconds to minutes and seconds
const getTimeFromSeconds = (duration) => {
    let mins = Math.floor(duration/60);
    let seconds = duration - mins*60;
    let time = "";
    time += (mins>9)? mins : "0" + mins;
    time += ":";
    time += (seconds>9)? seconds : "0" + seconds;
    return time;
}

// update the name of song and cover image below progress bar
const updateCurrentSongName = (tempSongIndex = songIndex) => {
    masterSongName.innerText = songs[tempSongIndex].songName;
    masterSongImage.src = songs[tempSongIndex].coverPath;
}

// change the icon from play to pause
const makeIconSetToPause = (element)=> {
    element.classList.remove('fa-circle-play');
    element.classList.add('fa-circle-pause');
}

// change the icon from pause to play
const makeIconSetToPlay = (element)=> {
    element.classList.remove('fa-circle-pause');
    element.classList.add('fa-circle-play');
}

// set opacity based on given opacity of music bar
const setOpcityOfMusicBar = (opacity) => {
    myMusicBarGif.style.opacity = opacity;
}

// play the selected song and change all related parameters like icons and music bars
const playTheSong = (tempSongIndex = songIndex) => {
    audioElement.play();

    // updating the master play icon
    makeIconSetToPause(masterPlay);

    // updating the icon to the right of each song
    makeIconSetToPause(document.getElementById(tempSongIndex));

    // show the gif as running the song
    setOpcityOfMusicBar(1);
}

// pause the selected song and change all related parameters like icons and music bars
const pauseTheSong = (tempSongIndex = songIndex) => {
    audioElement.pause();

    // updating the master play icon
    makeIconSetToPlay(masterPlay);

    // updating the icon to the right of each song
    makeIconSetToPlay(document.getElementById(tempSongIndex));

    // show the gif as song stopped
    setOpcityOfMusicBar(0);
}


// POPULATING ELEMENTS ON THE PAGE

// filling the song image for every song
songItems.forEach((element, index) => {
    element.querySelector('img').src = songs[index].coverPath;
});

// filling the song name for every song
songNames.forEach((element, index) => {
    element.innerText= songs[index].songName;
});

// filling the song duration for every song
songDurations.forEach( async (element, index) => {
    let audioDuration = songs[index].duration
    element.innerText= getTimeFromSeconds(Math.floor(audioDuration));
});

// making all buttons sign to play when one of the songs is playing
const makeAllButtonsPlay = ()=> {
    songItemsPlay.forEach((element)=> {
        makeIconSetToPlay(element);
    });
}


// HANDLING EVENTS

// when the audio time changes, then update the progress bar accordingly
audioElement.addEventListener('timeupdate', ()=> {
    // update seekbar 
    let progress = parseInt((audioElement.currentTime/audioElement.duration) * 100);
    myProgressBar.value = progress;
});

audioElement.addEventListener('ended', ()=> {
    // set the current Time to 0 for the start
    audioElement.currentTime = 0;
    // As we are done completing present song, make the icon to play sign
    makeIconSetToPlay(document.getElementById(songIndex));

    // go to next song and play it
    songIndex = (songIndex+1) % totalSongsCount;
    audioElement.src = `songs/${songIndex+1}.mp3`;
    audioElement.play();
    // as we are playing the present song, make the icon to pause.
    makeIconSetToPause(document.getElementById(songIndex));

    updateCurrentSongName();
});

// when the progress bar is moved by the user, change the song timing accordingly
myProgressBar.addEventListener('change', ()=> { 
    audioElement.currentTime = myProgressBar.value * audioElement.duration/100;
});

// adding click event to each of the play button on the side of each song
songItemsPlay.forEach((element)=> {
    element.addEventListener('click', (event)=> {
        makeAllButtonsPlay();
        let clickedSongIndex = parseInt(event.target.id);

        // when the user clicked the same button which was playing, so do opposite of present state now
        if(clickedSongIndex == songIndex){
            if(audioElement.paused || audioElement.currentTime<=0){
                // play the song and changes all icons related to that
                playTheSong(clickedSongIndex);
            }
            else{
                // pause the song and change all icons related to that
                pauseTheSong(clickedSongIndex);
            }
        }
        // when user selected song different from present running song, then just start that new selected song from fresh
        else{
            // change the present play button icon.
            makeIconSetToPause(event.target);

            // stop the previous running song and play this clicked song.
            audioElement.src = `songs/${clickedSongIndex+1}.mp3`;
            audioElement.currentTime = 0;
            audioElement.play();

            updateCurrentSongName(clickedSongIndex);

            makeIconSetToPause(masterPlay);

            // show the gif as running the song
            setOpcityOfMusicBar(1);
        }

        songIndex = clickedSongIndex;
    });
});

// give life to next button at bottom
next.addEventListener('click', ()=> {
    // update the icons of previous running songs
    makeIconSetToPlay(document.getElementById(songIndex));

    // update songIndex
    if(songIndex >= 6){
        songIndex = 0;
    }
    else{
        songIndex+=1;
    }

    // stop the previous running song and play this clicked song.
    audioElement.src = `songs/${songIndex+1}.mp3`;
    audioElement.currentTime = 0;
    audioElement.play();

    updateCurrentSongName();

    makeIconSetToPause(document.getElementById(songIndex));

    makeIconSetToPause(masterPlay);

    // show the gif as running the song
    setOpcityOfMusicBar(1);
});

// // give life to previous button at bottom
previous.addEventListener('click', ()=> {
    // update the icons of previous running songs
    makeIconSetToPlay(document.getElementById(songIndex));

    // update songIndex
    if(songIndex <= 0){
        songIndex = 6;
    }
    else{
        songIndex-=1;
    }

    // stop the previous running song and play this clicked song.
    audioElement.src = `songs/${songIndex+1}.mp3`;
    audioElement.currentTime = 0;
    audioElement.play();

    updateCurrentSongName();

    makeIconSetToPause(document.getElementById(songIndex));

    makeIconSetToPause(masterPlay);

    // show the gif as running the song
    setOpcityOfMusicBar(1);
});

// give life to master play button at bottom
masterPlay.addEventListener('click', ()=> {
    if(audioElement.paused || audioElement.currentTime<=0){
        // play the song and changes all icons related to that
        playTheSong();
    }
    else{
        // pause the song and change all icons related to that
        pauseTheSong();
    }
});
