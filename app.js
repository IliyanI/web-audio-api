window.onload=function () {

    var file=document.getElementById("audio-file");
    var audio=document.getElementById("audio-tag");

    file.onchange=function () {
        var files=this.files;
        audio.src=URL.createObjectURL(files[0]);
        audio.load();
        audio.play();
        var context=new (window.AudioContext||window.webkitAudioContext);
        var src=context.createMediaElementSource(audio);
        var analyser=context.createAnalyser();

        const canvas=document.getElementById('canvas');
        canvas.width=canvas.offsetWidth;
        canvas.height=canvas.offsetHeight;
        const canvasCtx=canvas.getContext('2d');


        src.connect(analyser);
        analyser.connect(context.destination);

        analyser.fftSize=256;

        var bufferLength=analyser.frequencyBinCount;

        var dataArray=new Uint8Array(bufferLength);

        var width=canvas.width;
        var height=canvas.height;

        var barWidth=(width/bufferLength)*2;
        var barHeight;
        var x=0;

        canvasCtx.clearRect(0, 0, width, height);
        function renderFrame() {
            requestAnimationFrame(renderFrame);

            x=0;

            analyser.getByteFrequencyData(dataArray);

            canvasCtx.fillStyle='rgb(255, 255, 255)';
            canvasCtx.clearRect(0, 0, width, height);

            for (var i=0; i<bufferLength; i++) {
                barHeight=dataArray[i]*2;

                let r=barHeight;
                let g=20;
                let b=barHeight/2;

                console.log('rgb('+r+','+g+','+b+')');
                canvasCtx.fillStyle='rgb('+r+','+g+','+b+')';
                canvasCtx.fillRect(x, height-barHeight, barWidth, barHeight+5);

                x+=barWidth+1;
            }
        }

        audio.play();
        renderFrame();
    };
}