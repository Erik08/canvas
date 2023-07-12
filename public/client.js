function initcanvas() {//cargado en body.onload
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
const ballCopy = Array(1).fill(Object.assign({}, ball));//copia temporal de ball, ball es instancia del cliente

    function clear() {
     // ctx.fillStyle = "red";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
 
    function reDrawCanvas(users){//volver a pintar canva en caso de evento
        clear();
       // ball.color = "black";
        console.log(users);
         users.forEach(user => {
             ballCopy[0].x=user.position.x_axis;
             ballCopy[0].y=user.position.y_axis;
             ballCopy[0].color = (user.colliding==0?'black':'red') ;
             ballCopy[0].draw();
          }); 
    }
      
    document.addEventListener("keydown", (e) => {
      if (running) {   
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

      socket.on('newUser:server', function (users){//servidor informa un nuevo usuario
       //console.log(data);
       reDrawCanvas(users);

    });

    socket.on('server:inform', function (users){//servidor informa que alguien se movió
  
      reDrawCanvas(users);
           
   });
     socket.emit('newUser:client',{x_axis:ball.x,y_axis:ball.y});//al terminar de inicializar cliente se informa servidor para 
                                                              //crear socket
    }
    

