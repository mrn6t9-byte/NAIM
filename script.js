const video = document.getElementById('video');
const playBtn = document.getElementById('playBtn');
const recBtn = document.getElementById('recBtn');
const urlInput = document.getElementById('url');

let recorder, chunks = [];
let isRecording = false;

// Play Stream
playBtn.addEventListener('click', () => {
    const url = urlInput.value.trim();
    if (!url) {
        alert("Please paste a valid m3u8 URL");
        return;
    }

    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play();
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.addEventListener('loadedmetadata', () => video.play());
    } else {
        alert("Your browser does not support HLS.");
    }
});

// Record Stream
recBtn.addEventListener('click', () => {
    if (!isRecording) {
        if (!video.captureStream) {
            alert("Recording not supported in this browser");
            return;
        }

        recorder = new MediaRecorder(video.captureStream());
        chunks = [];

        recorder.ondataavailable = e => chunks.push(e.data);
        recorder.onstop = e => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ClipByNaim_recorded.webm';
            a.click();
        };

        recorder.start();
        recBtn.textContent = "⏹ STOP";
        isRecording = true;
        alert("Recording started!");
    } else {
        recorder.stop();
        recBtn.textContent = "⏺ RECORD";
        isRecording = false;
        alert("Recording stopped!");
    }
});
