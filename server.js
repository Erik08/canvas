const path = require('path');
const express = require('express');
const app=express();
const users=[];
const viewRadius=50;

//configuraciones
app.set('port', process.env.PORT || 3000);

//archivos estaticos
app.use(express.static(path.join(__dirname,'public')));

//Iniciar servidor
const server = app.listen(app.get('port'),()=>{
    console.log('server on port', app.get('port'));
   });

const SocketIO = require('socket.io');
const io = SocketIO(server);



//websocket
io.on('connection',(socket)=>{
    //console.log('nueva conexión',socket.id);

    
socket.on('newUser:client',(data)=>{//nueva conexión de cliente
       
        console.log("user: "+socket.id+" joined");
        users.push({'id':socket.id,colliding:0,'position':data});
        //[socket.id] ={'position':data};
        //users[socket.id].=data;
        areColliding(users);
        
        io.sockets.emit('newUser:server',users);//broadcast a todos los clientes incluyéndome
        //console.log(users);
    });

    function areColliding(users){
        //console.log(users);
        resetPosition(users);
        for (let i = 0; i < users.length; i++) {
            //const element = array[index];
            for (let j = i+1; j <= users.length-1; j++) {
                //const element = array[index];
                    //if (users[i].position.x_axis==) {
                        ;//adding left and right
            if(users[i].position.x_axis>=users[j].position.x_axis-viewRadius&&users[i].position.x_axis<=users[j].position.x_axis+viewRadius
                &&users[i].position.y_axis>=users[j].position.y_axis-viewRadius&&users[i].position.y_axis<=users[j].position.y_axis+viewRadius){
                users[i].colliding=1;
                users[j].colliding=1;
               // console.log("collision");                    
                }
            }   
        }
    }

    function resetPosition(users){

       // console.log(users);
        users.forEach((val)=>{
            val.colliding=0;
           //console.log('reset:',val);
        });

    }
    socket.on('user:moved',(data)=>{//cliente se mueve
        //console.log(data);
        //users.push({'id':socket.id,'position':data});
        //users[socket.id].position.x_axis=[data.x_axis]
        //users[socket.id].position.x_axis
        console.log("ahora socket.id:",socket.id);
        users.map(function (val){
         //  console.log(users);
            if(socket.id==val.id){
              //  console.log('iguanas');
               val.position.x_axis=data.x_axis;
               val.position.y_axis=data.y_axis;
            }
            areColliding(users);
            //console.log(users);
            //console.log("despues:"+val.position.x_axis);
           // console.log('socket.id:'+socket.id+' val.id: '+val.id);
        });
        io.sockets.emit('server:inform',users);
        
        //console.log();
    });

    // socket.on('user:typing',(data)=>{
    //     socket.broadcast.emit('user:typing',data);
    // })


});






//console.log('hello-world88');

