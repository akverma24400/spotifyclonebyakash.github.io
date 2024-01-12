console.log('hello world')

let currentSong = new Audio();
let songs;
let currFolder

function secondsToMinutesAndSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`${folder}/`)
    let responce = await a.text()
    /* console.log(responce) */

    let div = document.createElement("div")
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a")

    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML +
            `<li>
        
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Akash Verma</div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div>       
        </li>`;
    }

    //Attach a event listner to each Song.
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })

    })
    return songs
}
const playMusic = (track, pause = false) => {
    /* let audio = new Audio("/songs/" + track) */
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


}

async function displayAlbums() {
    let a = await fetch(`songs/`)
    let responce = await a.text()
    /* console.log(responce) */

    let div = document.createElement("div")
    div.innerHTML = responce;
    let anchors = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".cardcontainer")

    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];


        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Geting the metadata of the folder
            let a = await fetch(`songs/${folder}/info.json`)
            let responce = await a.json();
            console.log(responce)
            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="card">
                <div  class="play">

                    <button class="custom-button">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                stroke="#141B34" stroke-width="1.5" stroke-linejoin="round" />
                        </svg>
                    </button>

                </div>
                <img src="/songs/${folder}/cover.jpeg" alt="">
                <h2>${responce.title}</h2>
                <p>${responce.description}</p>
            </div>`
        }
    }
    //Load the playlist whenever Card is Clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        /* console.log(e) */
        e.addEventListener("click", async item => {
            console.log(item.target, item.currentTarget.dataset)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
    })
}

async function main() {

    await getSongs("songs/ncs")
    playMusic(songs[0], true)
    /* console.log(songs) */

    //display all the Albums on the pageee.
    displayAlbums()


    //Attach an eventlistner to play,next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    //listen for time update Event

    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);

        // Check if currentSong.duration is a valid number and is not NaN or Infinity
        if (!isNaN(currentSong.duration) && isFinite(currentSong.duration)) {
            const currentTimeFormatted = secondsToMinutesAndSeconds(currentSong.currentTime);
            const durationFormatted = secondsToMinutesAndSeconds(currentSong.duration);

            document.querySelector(".songtime").innerHTML = `${currentTimeFormatted} / ${durationFormatted}`;
            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        }
    });

    //add an event Listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //Add an event Listner for Hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    //Add an event Listner for Close Button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-125%"
    })

    //Add an Event Listener to previous button
    previous.addEventListener("click", () => {
        console.log("previous Clicked")
        console.log(currentSong)
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])

        }
    })

    //Add an Event Listener to next button
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("next Clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])

        }

    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e)
        currentSong.volume = parseInt(e.target.value) / 100
    })

    //add an event listner to mute the track
    document.querySelector(".volume>img").addEventListener("click", e => {
        console.log(e.target)
        if (e.target.src.includes("volume.svg")) {
            e.target.src= e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
        else {
            e.target.src= e.target.src.replace("mute.svg","volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10
        }
    })




}
main()
