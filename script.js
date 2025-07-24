let numberOfPhotosVal = 3;
let delayTimeVal = 10;
let isTimeChecked = false;
let isPhotosChecked = false;

const photos = document.getElementById('photos');
const delayTime = document.getElementById('delayTime');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const confirmBtn = document.getElementById('confirmBtn');
const ctx = canvas.getContext('2d');
const buttonsNumberPhotos = document.querySelectorAll('button.optionNumberPhotos');
const buttonsTime = document.querySelectorAll('button.optionTime');
const container = document.querySelector('div.container');
const captureBtn = document.getElementById('capture');
const numberOfPhotos = document.getElementById('numberOfPhotos');
const countdownElement = document.querySelector('.countdown');

const confirm = () => {
    const popup = document.querySelector('.popup');
    if (popup) {
        popup.style.display = 'none';
        container.classList.remove('hidden');
    }
}

captureBtn.addEventListener('click', () => {
    console.log('Capture button clicked');
    startCapture();
});

function startCapture() {
    console.log('Start Capture');
    countdownElement.classList.remove('hidden');
    for(let i = 0; i < numberOfPhotosVal; i++) {
        // Bắt đầu đếm ngược
        countdown();
    }
}

function countdown() {
    const countdown = document.querySelector('.countdown>span');
    let seconds = delayTimeVal;
    countdown.textContent = seconds;

    const interval = setInterval(() => {
        seconds--;
        countdown.textContent = seconds;
        if (seconds <= 0) {
            clearInterval(interval);
            // Chụp hình
            captureBtn.addEventListener('click', () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            });
            countdownElement.classList.add('hidden');
        }
    }, 1000);
}

buttonsNumberPhotos.forEach(button => {
    button.addEventListener('click', (e) => {
        buttonsNumberPhotos.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        isPhotosChecked = true;
        isEnableCapture();
    });
})

buttonsTime.forEach(button => {
    button.addEventListener('click', () => {
        buttonsTime.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        isTimeChecked = true;
        isEnableCapture();
    });
})

function getNumberOfPhotos(number) {
    numberOfPhotosVal = number ? parseInt(number) : 1;
}

function getDelayTime(time) {
    delayTimeVal = time ? parseInt(time) : 10;
}

function isEnableCapture() {
    if (isTimeChecked && isPhotosChecked) {
        confirmBtn.removeAttribute('disabled');
    }
}