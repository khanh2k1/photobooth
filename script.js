let numberOfPhotosVal;
let delayTimeVal;
let isTimeChecked = false;
let isPhotosChecked = false;
let capturedImages = [];
let selectedLayout = null;

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const countdownElement = document.querySelector('.countdown');
const captureBtn = document.getElementById('capture');
const confirmBtn = document.getElementById('confirmBtn');
const container = document.querySelector('div.container');
const layoutSelector = document.getElementById('layout-selector');
const layoutOptionsContainer = document.getElementById('layout-options');
const buttonsNumberPhotos = document.querySelectorAll('button.optionNumberPhotos');
const buttonsTime = document.querySelectorAll('button.optionTime');

const layoutMap = {
    3: ['Layout A', 'Layout B', 'Layout H'],
    4: ['Layout C', 'Layout D', 'Layout E'],
    6: ['Layout F', 'Layout G', 'Layout I']
};

// 1. Bắt đầu chụp sau khi bấm "Xong, chụp thôi"
const confirm = () => {
    const popup = document.querySelector('.popup');
    if (popup) popup.style.display = 'none';
    container.classList.remove('hidden');

    // Lấy lại giá trị từ nút đang active
    const selectedPhotoBtn = document.querySelector('.optionNumberPhotos.active');
    const selectedTimeBtn = document.querySelector('.optionTime.active');

    numberOfPhotosVal = parseInt(selectedPhotoBtn.dataset.value);
    delayTimeVal = parseInt(selectedTimeBtn.dataset.value);
};

// 2. Nút chụp
captureBtn.addEventListener('click', () => {
    capturedImages = [];
    startCapture();
});

// 3. Bắt đầu chụp
async function startCapture() {
countdownElement.classList.remove('hidden');
    for (let i = 0; i < numberOfPhotosVal; i++) {
        await runCountdown(); // Đếm ngược mỗi lần chụp
        capture();
        updatePreviewList();
        await sleep(500); // nghỉ 0.5s giữa các lần chụp (nếu muốn)
    }
    countdownElement.classList.add('hidden');
    selectedLayout = (layoutMap[numberOfPhotosVal] && layoutMap[numberOfPhotosVal][0]) || null;
    renderLayout();
}

// 4. Đếm ngược
function runCountdown() {
    return new Promise((resolve) => {
        const countdown = document.querySelector('.countdown>span');
        let seconds = delayTimeVal;
        countdown.textContent = seconds;

        const interval = setInterval(() => {
            seconds--;
            countdown.textContent = seconds;
            if (seconds <= 0) {
                clearInterval(interval);
                resolve();
            }
        }, 1000);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 5. Chụp ảnh
function capture() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imgData = canvas.toDataURL('image/png');
    capturedImages.push(imgData);
}

// 6. Hiển thị layout sau khi chụp
function showLayouts(count) {
    layoutOptionsContainer.innerHTML = '';
    // Ẩn luôn phần chọn layout
    layoutSelector.classList.add('hidden');

    const layouts = layoutMap[count] || [];
    layouts.forEach(layout => {
        const div = document.createElement('div');
        div.className = 'layout-box';
        div.textContent = layout;
        div.addEventListener('click', () => {
            document.querySelectorAll('.layout-box').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
            selectedLayout = layout;
            console.log('Chọn layout:', selectedLayout);
            renderLayout();
        });
        layoutOptionsContainer.appendChild(div);
    });
}

// 7. Xử lý layout render
function renderLayout() {
    // Ẩn tất cả các phần khác
    document.getElementById('popup').classList.add('hidden');
    document.querySelector('.container').classList.add('hidden');
    document.querySelector('.countdown').classList.add('hidden');
    document.getElementById('layout-selector').classList.add('hidden');

    // Hiện layout kết quả
    const layoutContainer = document.getElementById('photo-layout');
    const resultSection = document.getElementById('result-layout');
    layoutContainer.innerHTML = '';
    resultSection.classList.remove('hidden');

    // Tạo grid layout theo số ảnh
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gap = '16px';

    if (capturedImages.length === 3) {
        grid.style.gridTemplateColumns = '1fr';
        grid.style.gridTemplateRows = 'repeat(3, 1fr)';
    } else if (capturedImages.length === 4) {
        grid.style.gridTemplateColumns = '1fr 1fr';
        grid.style.gridTemplateRows = '1fr 1fr';
    } else if (capturedImages.length === 6) {
        grid.style.gridTemplateColumns = '1fr 1fr 1fr';
        grid.style.gridTemplateRows = '1fr 1fr';
    } else {
        // fallback: hiển thị theo hàng ngang
        grid.style.display = 'flex';
    }

    capturedImages.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        grid.appendChild(img);
    });

    layoutContainer.appendChild(grid);

    // Hiển thị nút tải về
    document.getElementById('downloadBtn').style.display = 'block';
}

// 8. Hiển thị ảnh preview
function updatePreviewList() {
    const previewList = document.getElementById('preview-list');
    previewList.innerHTML = '';
    capturedImages.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        previewList.appendChild(img);
    });
}

// 9. Chọn số ảnh
buttonsNumberPhotos.forEach(button => {
    button.addEventListener('click', () => {
        buttonsNumberPhotos.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        isPhotosChecked = true;
        isEnableCapture();
    });
});

// 10. Chọn thời gian
buttonsTime.forEach(button => {
    button.addEventListener('click', () => {
        buttonsTime.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        isTimeChecked = true;
        isEnableCapture();
    });
});

// 11. Kích hoạt nút confirm nếu đã chọn đủ
function isEnableCapture() {
    if (isTimeChecked && isPhotosChecked) {
        confirmBtn.removeAttribute('disabled');
    }
}

// 12. Tải layout
document.getElementById('downloadBtn').addEventListener('click', () => {
    const layoutEl = document.getElementById('photo-layout');
    html2canvas(layoutEl).then(canvas => {
        const link = document.createElement('a');
        link.download = 'photobooth-layout.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});

confirmBtn.addEventListener('click', confirm);
