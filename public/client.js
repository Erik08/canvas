
function initcanvas() {
    const socket = io();
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    let raf;
    let running = true;
    
    const ball = {
      x: 0,
      y: 0,
      radius: 25,
      color: "black",
      draw() {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.stroke();
      },
    };
    
//    ballCopy=ball;
const ballCopy = Array(1).fill(Object.assign({}, ball));

    function clear() {
      ctx.fillStyle = "red";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
 
    function reDrawCanvas(users){
        clear();
       // ball.color = "black";
        console.log(users);
         users.forEach(user => {
             ballCopy[0].x=user.position.x_axis;
             ballCopy[0].y=user.position.y_axis;
             ballCopy[0].color = (user.colliding==0?'black':'red') ;
        // //     // ballItem.x= xGuest.x;
        // //     // ballItem.y=Ypos+=150;
        //     areColliding(ballCopy[0]);  
             ballCopy[0].draw();
        // //     //console.log(user.position.x_axis);
        //  //console.log(user.position.x_axis);
        // //    //user.position.draw();
          }); 
       // console.log(users);

        //ball.draw();   
    
    }
        // function areColliding(ballItem){                           
        //     viewRadius=ball.radius*2;//adding left and right
        //     if(ballItem.x>=ball.x-viewRadius&&ballItem.x<=ball.x+viewRadius&&ballItem.y>=ball.y-viewRadius&&ballItem.y<=ball.y+viewRadius){
        //     console.log("collision");
        //     ball.color="red";
        //     ballItem.color="red";
        //     }
           
        // }           
    document.addEventListener("keydown", (e) => {
      if (running) {        
        //console.log(socket.id);
        
        switch (e.key) {
            case "ArrowLeft":
                if (ball.x>=1){
                ball.x--;
                socket.emit('user:moved',{x_axis:ball.x,y_axis:ball.y});
                }
                 break;
            case "ArrowRight":
                if (ball.x<canvas.width){
                ball.x++;
                socket.emit('user:moved',{x_axis:ball.x,y_axis:ball.y});
                }
                break;
            case "ArrowUp":
                if (ball.y>=1){
                ball.y--;
                socket.emit('user:moved',{x_axis:ball.x,y_axis:ball.y});
                }
                break;
            case "ArrowDown":
                if (ball.y<canvas.height){
                ball.y++;
                socket.emit('user:moved',{x_axis:ball.x,y_axis:ball.y});
                }
                break;
        }

//        raf = window.requestAnimationFrame(reDrawCanvas);
      }
    });
    
    canvas.addEventListener("mouseout", (e) => {//stop if moouse is out of the canvas
      window.cancelAnimationFrame(raf);
      running = false;
      
    });
    canvas.addEventListener("mouseover", (e) => {//restart if moouse is back over the canvas
        running = true;
        console.log(running);    
      });


      socket.on('newUser:server', function (users){
       //console.log(data);
       reDrawCanvas(users);
      // sessionStorage.setItem('myID', socket.id);
       //console.log(socket.id);
    });

    socket.on('server:inform', function (users){
      //console.log(data);
      reDrawCanvas(users);
      
      //var data = sessionStorage.getItem('key');
      
   });

    //const exist=(sessionStorage.getItem('myID')?true:false);
   // console.log('existe:',exist,'ID:',sessionStorage.getItem('myID'));
   //socket.emit('newUser:client',{x_axis:ball.x,y_axis:ball.y},exist,sessionStorage.getItem('myID'));
   socket.emit('newUser:client',{x_axis:ball.x,y_axis:ball.y});
  //  if(!exist){

  //  }
    
  //   else{
  //   console.log('client already exists');
  // }
    //
    //ball.draw();
    
    }
    

