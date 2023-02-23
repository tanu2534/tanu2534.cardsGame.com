const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path')

//object of cards
 cards = ['star','moon','dream','galaxy'];
const players = {};
const ids = {};
let disCards = [];
let currentPlayers = players.length;
let currentCards = Number.parseInt(cards.length,10);
let leftplayer = [-1,-1,-1,-1] ;

class staticdata {
  static playerid = 0 ;
  static winnerid = 0 ;
  static increase(){
    this.playerid++ ;
  }
  static increasewi(){
    this.winnerid++ ;
  }
  static pid(){
    return this.playerid;
  }
}
// cards distribution code
async function playercard() {
    let pc = [];
    let cn = 0;
    let x = 0 ;
    let y = [0,0,0,0] ;
    
    // creating two dimensional array
    for (let i = 0; i < 4 ; i++) {
        for(let j = 0; j < 4 ; j++) {
            pc[i] = [];
        }
    }
    
    // inserting elements to array
    for (let i = 0; i< 4 ; i++) {
        
        for(let j = 0; j < 4 ; j++) {
           if(i==3 && j==3){
             x = 4-x ;
             pc[i][j] = x;
             break;
           }
          
          
           if(y[j] > x){   
          cn = Math.floor((Math.random() * (3-y[j])) + 1);
           }else{
            cn = Math.floor((Math.random() * (3-x)) + 1);
           }
            pc[i][j] = cn ;
            x += pc[i][j] ; 
            y[j] +=  pc[i][j] ;
        }
            
          x = 0 ;
         
    }
  if(pc[2][0] + pc[2][1] + pc[2][2] + pc[2][3] != 4){
    pc[2][2] = 4 - (pc[2][0] + pc[2][1] + pc[2][2] + pc[2][3]) ;
  }
    return pc;
}

playercard().then(
  function(value) {
                  console.log(value) ;
                  disCards = value ;},
  function(error) { console.log(error)}
)

 app.use('/static',express.static('static'))
 
app.get('/', function(req, res) {
   res.sendFile('index.html',{root:__dirname});
});

//Whenever someone connects this gets executed
io.on('connection', (socket) => {
        console.log('A user connected');

        //Whenever someone disconnects this piece of code executed
        socket.on('player-joined', pn =>{
           if(staticdata.pid() < 4){
           console.log(pn);
           players[staticdata.pid()] = pn ;
           console.log(players[staticdata.pid()]);
             
           ids[staticdata.pid()] = socket.id ;
           console.log(ids[staticdata.pid()]);
             
           socket.broadcast.emit('player-list-update',pn,players);
           socket.emit('update-list', players,staticdata.pid());
           staticdata.increase();
           }
          else{
            socket.emit('fulled', pn);
          }
          if(staticdata.pid() != 1){
            socket.emit('change-struct',pn,players);
          }
        });

           socket.on('forceDisconnect', function(){
           socket.disconnect();
          });
  
        
        socket.on('show-cards', ()=>{
          io.to(ids[0]).emit('distribute-cards', disCards[0],cards);
          io.to(ids[1]).emit('distribute-cards', disCards[1],cards);
          io.to(ids[2]).emit('distribute-cards', disCards[2],cards);
          io.to(ids[3]).emit('distribute-cards', disCards[3],cards);
        });

        socket.on('pass-card',(p,ts)=>{
          let v = (ts + 1)%currentCards;
          while(leftplayer[v] == 0){
           v = (v + 1)%currentCards;
            
          }
          
        
          
          console.log(`pass-card called to ${v}`)
          
         socket.to(ids[v]).emit('add-card', p, cards, v, players);
        io.emit('show-info',ts,v,players,currentCards);
        });

        socket.on('update-cards-number',(ts)=>{
         
          console.log(`currentCards updated to ${currentCards}`)
          let w = players[ts];
          for(let p in players){
            if(p != ts){
            
              io.to(ids[p]).emit('update-result',w,players);
             
            }
          }
          
        });

        socket.on('left-player', v=>{
          leftplayer[v] = 0;
          console.log(leftplayer);
        });

    });
   
http.listen(3000, function() {
   console.log('Server is listening on port 3000');
});

