window.onload=function () {

    let file=document.getElementById("audio-file");
    let audio=document.getElementById("audio-tag");

    file.onchange=function () {
        let files=this.files;
        audio.src=URL.createObjectURL(files[0]);
        audio.load();
        audio.play();
        let context=new (window.AudioContext||window.webkitAudioContext);
        let src=context.createMediaElementSource(audio);
        let analyser=context.createAnalyser();

        const canvas=document.getElementById('canvas');
        canvas.width=canvas.offsetWidth;
        canvas.height=canvas.offsetHeight;
        const canvasCtx=canvas.getContext('2d');


        src.connect(analyser);
        analyser.connect(context.destination);

        analyser.fftSize=256;

        var bufferLength=analyser.frequencyBinCount;

        var dataArray=new Uint8Array(bufferLength);

        let width=canvas.offsetWidth;
        let height=canvas.offsetHeight;

        var barWidth=(width/bufferLength);
        var barHeight;
        var x=0;

        canvasCtx.clearRect(0, 0, width, height);
        function renderFrame() {
            requestAnimationFrame(renderFrame);

            x=0;

            analyser.getByteTimeDomainData(dataArray);

            canvasCtx.fillStyle='rgb(255, 255, 255)';
            canvasCtx.clearRect(0, 0, width, height);

            for (let i=bufferLength; i>0; i--) {
                barHeight=(dataArray[i]-128)*(i/bufferLength)*5;

                let r=(barHeight-1)*3;
                let g=20;
                let b=(barHeight-1);

                canvasCtx.fillStyle='rgb('+r+','+g+','+b+')';
                canvasCtx.fillRect(x, height/2-(barHeight/2+5), barWidth, barHeight+5);

                x+=barWidth+1;
            }
        }

        audio.play();
        renderFrame();
    };
}