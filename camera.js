// Bắt đầu camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        alert('Không thể truy cập camera: ' + err);
    });