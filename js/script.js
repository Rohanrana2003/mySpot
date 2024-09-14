let currentSong = new Audio();

async function getSongs(){
    let a = await fetch('http://localhost:5500/songs');
    let response = await a.text();

    let div = document.createElement('div');
    div.innerHTML = response;

    let as = div.getElementsByTagName('a');
    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith('.mp3')){
            songs.push(element.href.split('/songs/')[1]);
        }
    }
    return songs;
}

const playMusic = (track, pause=false) =>{

    currentSong.src = '/songs/' + track;

    if(!pause){
        currentSong.play();
        play.src = 'img/pause.svg';
    }

    document.querySelector('.songinfo').innerText = decodeURI(track);
    document.querySelector('.songtime').innerText = '00:00 / 00:00';

}

function convertSeconds(seconds) {
    if(isNaN(seconds) || seconds<0){
        return "00:00";
    }

    let minutes = Math.floor(seconds / 60); // Calculate minutes
    let remainingSeconds = Math.floor(seconds % 60);    // Calculate remaining seconds

    // Pad minutes and seconds with a leading zero if they are less than 10
    let formattedMinutes = minutes.toString().padStart(2, '0');
    let formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function main(){

    //Get the list of all the songs
    let songs = await getSongs();

    //Setting Initial running song
    playMusic(songs[0], true)

    let songUL =  document.querySelector('.songList').getElementsByTagName('ul')[0];

    for(const song of songs){
        songUL.innerHTML += `<li>
                                <img class="invert" src="img/music.svg" alt="">
                                <div class="info">
                                    <div>${song.replaceAll("%20"," ")}</div>
                                </div>
                                <img class="invert x" src="img/playsong.svg" alt="">
                            </li>`;
    }

    //Attach an event listener to each song in library
    Array.from(document.querySelector('.songList').getElementsByTagName('li')).forEach(e=>{
        e.addEventListener('click', ()=>{
            playMusic(e.querySelector('.info>div').innerText);
        })
    })

    //Attach event listener on play
    play.addEventListener('click', ()=>{

        if(currentSong.paused){
            currentSong.play();
            play.src = 'img/pause.svg';
        }
        else{
            currentSong.pause();
            play.src = 'img/playsong.svg';

        }
    })
    
    //Event Listener for song time update event
    currentSong.addEventListener('timeupdate', ()=>{
        document.querySelector('.songtime').innerHTML = `${convertSeconds(currentSong.currentTime)} / ${convertSeconds(currentSong.duration)}`

        document.querySelector('.circle').style.left = (currentSong.currentTime/currentSong.duration)*100 + '%';
    })

    //Add Event Listener on seek bar
    document.querySelector('.seekbar').addEventListener('click', (e)=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width)*100;
        document.querySelector('.circle').style.left = percent + '%';

        currentSong.currentTime = ((currentSong.duration)*percent)/100;;
    })

    //Add an event listener on hamburger
    document.querySelector('.hamburger').addEventListener('click', ()=>{
        document.querySelector('.left').style.left = '0';
    })

    //Add an event listener for close button
    document.querySelector('.close').addEventListener('click', ()=>{
        document.querySelector('.left').style.left = '-150%';
    })

    //Attach event listener on prev
    prev.addEventListener('click', ()=>{

        let index = songs.indexOf(currentSong.src.split('songs/')[1]);
        if(index-1 >= 0 ){
            playMusic(songs[index-1]);
        }
    })

    //Attach event listener on next
    next.addEventListener('click', ()=>{

        let index = songs.indexOf(currentSong.src.split('songs/')[1]);
        if(index+1 < songs.length ){
            playMusic(songs[index+1]);
        }
    })

    //Add an event to volume 
    document.querySelector('.range').getElementsByTagName('input')[0].addEventListener('change', (e)=>{
        currentSong.volume = e.target.value/100;
    })

}



main();