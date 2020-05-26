window.onload=function() {
    let file=document.getElementById("audio-file")
    let audio=document.getElementById("audio-tag")

    file.onchange=function() {
        let files=this.files;
        audio.src=URL.createObjectURL(files[0])
        audio.load();
        audio.play();
        let audioCtx=new (window.AudioContext||window.webkitAudioContext);
        let src=audioCtx.createMediaElementSource(audio);
        let analyser=audioCtx.createAnalyser();

        const canvas=document.getElementById('canvas');
        canvas.width=canvas.offsetWidth
        canvas.height=canvas.offsetHeight
        let width=canvas.offsetWidth;
        let height=canvas.offsetHeight;
        const canvasCtx=canvas.getContext('2d');
        canvasCtx.clearRect(0,0,width,height)

        src.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize=256;

        var bufferLength=analyser.frequencyBinCount;
        console.log(bufferLength);

        var dataArray=new Uint8Array(bufferLength);

        var barWidth=(width/bufferLength)*2.5;
        var barHeight;
        var x=0;

        function draw() {
            requestAnimationFrame(draw);

            x=0;

            analyser.getByteTimeDomainData(dataArray);
            canvasCtx.fillStyle='rgb(255, 255, 255)';
            canvasCtx.fillRect(0,0,width,height);

            for(let i=0;i<bufferLength;i++) {
                barHeight=(dataArray[i]-128)*2;

                canvasCtx.fillStyle='rgb('+(barHeight-1)+','+(barHeight-1)+',50)';
                canvasCtx.fillRect(x,height/2-(barHeight/2+50),barWidth,barHeight+50);
                x+=barWidth+1;
            }
        }

        audio.play();
        draw();
    }
}