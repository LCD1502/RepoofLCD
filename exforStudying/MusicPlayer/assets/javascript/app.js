/* 
1. render songs
2. scroll top  
3. play / pause / seek 
4. cd rotate
5. next / prev 
6. random 
7. next / repeat when ended 
8. active song
9. scroll active song into view
10. play song when click 
*/




const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');

const btnRepeat = $('.btn-repeat');
const btnPrev = $('.btn-prev');
const btnNext = $('.btn-next');
const btnRandom = $('.btn-random');
const playList = $('.playlist');



const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    currentActiveSong: 0,
    songs: [
        {
            name: "Nevada",
            singer: "Vicetone",
            path: "./assets/music/song1.mp3",
            image: "./assets/img/song1.jpg"
        },
        {
            name: "K-391 - Summertime [Sunshine]",
            singer: "K-391",
            path: "./assets/music/song2.mp3",
            image: "./assets/img/song2.jpg"
        },
        {
            name: "TheFatRat",
            singer: "feat. Laura Brehm",
            path: "./assets/music/song3.mp3",
            image: "./assets/img/song3.jpg"
        },
        {
            name: "Reality",
            singer: "Lost Frequencies feat. Janieck Devy",
            path: "./assets/music/song4.mp3",
            image: "./assets/img/song4.jpg"
        },
        {
            name: "Ngày Khác Lạ",
            singer: "Đen - ft. Giang Pham, Triple D",
            path: "./assets/music/song5.mp3",
            image: "./assets/img/song5.jpg"
        },
        {
            name: "Lemon Tree",
            singer: "DJ DESA REMIX",
            path: "./assets/music/song6.mp3",
            image: "./assets/img/song6.jpg"
        },
        {
            name: "Sugar",
            singer: "Maroon 5",
            path: "./assets/music/song7.mp3",
            image: "./assets/img/song7.jpg"
        },
        {
            name: "My Love",
            singer: "Westlife",
            path: "./assets/music/song8.mp3",
            image: "./assets/img/song8.jpg"
        },
        {
            name: "Attention",
            singer: "Charlie Puth",
            path: "./assets/music/song9.mp3",
            image: "./assets/img/song9.jpg"
        },
        {
            name: "Monsters",
            singer: "Katie Sky",
            path: "./assets/music/song10.mp3",
            image: "./assets/img/song10.jpg"
        },
    ],

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },

    render: function() {
        // put out array of songs to render
       const htmls =  this.songs.map(function(song, index) {
            return `<div class="song ${index === 0 ? 'active' : ''}" data-index="${index}">
                        <div class="thumb" style="background-image: url('${song.image}')">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>
                    `     
       })
       //render song
       $('.playlist').innerHTML = htmls.join('');
    },

    handleEvent: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // handle spinning and stop spinning disc
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000,
            iteration:  infinity //Math.ceil(audio.duration / 10)
        })
        cdThumbAnimate.pause();


        // handle scroll
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newcdWidth = cdWidth - scrollTop;
            cd.style.width = newcdWidth > 0 ? newcdWidth +'px' : 0;
            cd.style.opacity = newcdWidth / cdWidth;
        };

        //play audio 
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        }
        // onplay 
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add("playing")
            cdThumbAnimate.play();
        }
        //on pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove("playing")
            cdThumbAnimate.pause();
        }

        //update progress of songs
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercents = audio.currentTime / audio.duration * 100;
                progress.value = Math.floor(progressPercents);
            }
        }


        progress.onmousedown = function() {
            audio.pause();
        }
        progress.oninput = function(e) {
            const seekTime = e.target.value / 100 * audio.duration;
            audio.currentTime = Math.floor(seekTime);
        }
        progress.onmouseup = function() {
            audio.play();
        }
        

        // next song 
        btnNext.onclick = function(e) {
            if(_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.nextSong();
            }
            audio.play();
            _this.activeSong();
            _this.scrollToActiveSong();
        }

         // prev song 
         btnPrev.onclick = function(e) {
            if(_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.prevSong();
            }
            audio.play();
            _this.activeSong();
            _this.scrollToActiveSong();
        }

        // random song
        btnRandom.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            btnRandom.classList.toggle("active", _this.isRandom);
        }

        //repeat song
        btnRepeat.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat;
            btnRepeat.classList.toggle("active", _this.isRepeat);
        }

        //ended song
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            }
            else {
                btnNext.click();
            }
        }

        // play song when click
        // const listOfSongs = $$('.song');
        // listOfSongs.forEach(function(song, index) {
        //     song.onclick = function(e) {
        //         _this.currentIndex = song.getAttribute('data-index');
        //         _this.loadCurrentSong();
        //         _this.activeSong();
        //         audio.play();
        //     }
        // })


        // play song when click
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode && !e.target.closest('.option')) {
                _this.currentIndex = Number(songNode.dataset.index);
                _this.loadCurrentSong();
                _this.activeSong();
                audio.play();
            }
        }
        
    },

    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    activeSong: function() {
        const currentSong = $('.song.active');
        currentSong.classList.remove('active');

        const newCurrentIndex = this.currentIndex < this.songs.length ? this.currentIndex + 1 : 0;
        const newCurrentSong = $(`.song:nth-child(${newCurrentIndex})`)
        newCurrentSong.classList.add('active');



        // const oldActiveSong = $(`.song[data-index = "${this.currentActiveSong}"]`);
        // oldActiveSong.classList.remove('active');
        
        // const newActiveSong = $(`.song[data-index = "${this.currentIndex}"]`);
        // newActiveSong.classList.add('active');
        // this.currentActiveSong = this.currentIndex;
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: this.currentIndex === 0 ? 'end' : 'nearest'
            })
        }, 50);
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },

    start: function() {
        this.defineProperties();
        this.render();
        this.loadCurrentSong();
        this.handleEvent();
    }

}

app.start();










