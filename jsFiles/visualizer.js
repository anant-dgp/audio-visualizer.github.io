var animationID;
var canvas;
var ctx;

function main(){
    
    let isActive = document.getElementById('togglt-btn').classList.contains('active');    

    if(isActive){
        startVisualizer();
    }else{
        stopAnimation(animationID);
        ctx.clearRect(0,0,canvas.width,canvas.height);
    }
    
    function startVisualizer(){

        canvas = document.getElementById('myCanvas');
        ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight*0.85;
        
        class Bar{

            constructor(x, y, width, height, color, index){
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
                this.color = color;
                this.index = index;

            }
            update(micInput){
                const sound = micInput*600;
                if(sound>this.height){
                    this.height=sound;
                }else{
                    this.height -= this.height * 0.09;
                }
                //this.height = micInput*600;
                
            }
            draw(context,volume){
                ctx.strokeStyle = this.color;
                context.lineWidth = this.width;
                context.save();

                
                context.rotate(this.index*4.4);
                context.beginPath();
                context.bezierCurveTo(this.x, this.y/2, this.height/2 *-0.5 -150, this.y+this.height, this.x,this.y);
                context.stroke();
                if(this.index%3==0){
                    context.beginPath();
                    context.arc(this.x, this.y + 10 + this.height/2 + this.height*0.1, this.height * 0.09, 0, Math.PI*2);
                    context.stroke();
                    context.beginPath();
                    context.moveTo(this.x, this.y);
                    context.lineTo(this.x, this.y + 5 + this.height/2);
                    context.stroke();
                }            
                context.restore();
            }

        }

        const fftSize = 256;
        const microphone = new Microphone(fftSize);
        let bars = [];
        let barWidth = canvas.width/(fftSize/2);
        function createBars(){
            for(let i=1;i<(fftSize/2);i++){
                let color = 'hsl('+ i +', 100%, 50%)';
                bars.push(new Bar(0, i * 0.9, 1, 50, color, i));
            }
        }
        createBars();
        let angle=0;
        function animate(){
            if(microphone.initialized){
                ctx.clearRect(0,0,canvas.width,canvas.height);
                const samples = microphone.getSamples();
                const volume = microphone.getVolume();
                angle -= 0.002;
                ctx.save();
                ctx.translate(canvas.width/2, canvas.height/2);
                ctx.rotate(angle);
                bars.forEach(function(bar,i){
                    bar.update(samples[i]);
                    bar.draw(ctx,volume);
                });

                ctx.restore();
            }
            animationID = requestAnimationFrame(animate);        
        }
        animate();
    }

    this.window.addEventListener('resize', function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight*0.85;
    });

    function stopAnimation(){
        cancelAnimationFrame(animationID);
    };

    this.window.addEventListener('load',function(){
        canvas
    });
};
