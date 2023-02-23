const socket = io();

const  start = document.getElementById('st');
const a = document.getElementsByClassName('g1')[0].getElementsByTagName('p')[1];
const b = document.getElementsByClassName('g1')[0].getElementsByTagName('p')[0];
const c = document.getElementsByClassName('g2')[1];
const d = document.getElementsByClassName('wrap2')[0];
const e = document.getElementsByClassName('wrap3')[0];
const f = document.getElementsByClassName('wrap')[0];
const g = document.getElementById('join');
const h = document.getElementsByClassName('hidden')[0];
const result = document.getElementsByClassName('result')[0];
const g3 = document.getElementsByClassName('g3')[0];
const g3p = g3.getElementsByTagName('p')[0];
 const score = document.getElementById("start"); 

let t = 0;
let pp = 1 ;
start.addEventListener('click', function (){
  if(pp != 4){
    alert('please wait for other players to join.')
  }else{
    
  start.classList.toggle("gayab");
  socket.emit('show-cards');
  }
});

function addname(n){
const no = document.createElement("div");
const li = document.createElement("div");
const textnode = document.createTextNode(n);
  no.setAttribute("class","name")
  li.setAttribute("class","line")
  node.appendChild(textnode);
document.getElementsByClassName("player-section")[0].appendChild(no);
document.getElementsByClassName("player-section")[0].appendChild(li);
}


function findDissimilarIndex(arr) {
  for (let i = 0; i < arr.length; i++) {
    let count = 0;
    for (let j = 0; j < arr.length; j++) {
      if (arr[j] === arr[i]) {
        count++;
      }
    }
    if (count === 4) {
      for (let j = 0; j < arr.length; j++) {
        if (arr[j] !== arr[i]) {
          return j;
        }
      }
    }
  }
  return -1;
}

function allSame(arr) {
  // check if the array has at least one element
  if (arr.length > 0) {
    // iterate over the elements in the array
    for (let i = 1; i < arr.length; i++) {
      // if any element is not the same as the first element, return false
      if (arr[i] !== arr[0]) {
        return false;
      }
    }
  }
  // all elements are the same, return true
  return true;
}


  
g.addEventListener('click',function(e){
  const pn = document.querySelector('input[type="text"]').value;
  e.preventDefault();
  d.classList.toggle("gayab");
  f.classList.toggle("gayab");


  socket.emit('player-joined', pn);
  
  socket.on('update-list',(players,a) =>{
    for(const n in players ){
      let no = document.createElement("div");
      let li = document.createElement("div");
      let textnode = document.createTextNode(players[n]);
      no.setAttribute("class","name")
      li.setAttribute("class","line")
      no.appendChild(textnode);
document.getElementsByClassName("player-section")[0].appendChild(no);
document.getElementsByClassName("player-section")[0].appendChild(li);
  ts = a ;
     
    }
  
  })

  
      socket.on('player-list-update',(pn,players)=>{
        pp++ ;
      let nn = document.createElement("div");
      let ll = document.createElement("div");
      let textnode = document.createTextNode(pn);
      nn.setAttribute("class","name")
      ll.setAttribute("class","line")
      nn.appendChild(textnode);
document.getElementsByClassName("player-section")[0].appendChild(nn);
document.getElementsByClassName("player-section")[0].appendChild(ll);
      });
});

socket.on('fulled', pn=>{
  alert(`${pn} sorry ! room of 4 player already occupied .`);
  socket.emit('forceDisconnect');
});

socket.on('change-struct', (pn,players)=>{

  h.classList.toggle('gayab')
   let nn = document.createElement("div");
   nn.setAttribute("class","centering")
   let textnode = document.createTextNode(`${pn} please do wait for ${players[0]} to start the game.`);
   nn.appendChild(textnode);
   document.getElementsByClassName("g2")[0].appendChild(nn);
});

socket.on('distribute-cards',(disCards,cards)=>{
  item = cards
  let dd = disCards ;
    let q = 0 ;
  
    for(let r of disCards){
      q = q + r ;
    } 
   q = Number.parseInt(q,10);
    if(q == 3){
      dd.splice(2, 1, 2);
    }
   console.log(q);
  let hatao = document.getElementsByClassName('centering')[0];

  a.classList.toggle("gayab");
  b.classList.toggle("gayab");
  console.log(dd);
  for(let CN in dd){
    for(t = 0 ; t < dd[CN] ; t++){
   let k = cards[CN]   ;
  let div = document.createElement("div");
  let div2 = document.createElement("div");
  let textnode = document.createTextNode(k);
  div.setAttribute("class","inside");
  div2.setAttribute("class","card-box");
  div2.setAttribute("id",k);
  div.appendChild(textnode);
  div2.appendChild(div);
  c.appendChild(div2);
   
    }
  }
  c.classList.toggle("gayab");
  hatao.classList.toggle("gayab");
 
});


 c.addEventListener('click', function(event) {
   
    const clickedElement = event.target ;
    const idnode = clickedElement.parentNode ;
    const gg = idnode.parentNode ;
    const p = idnode.id ;
   
   
     if (clickedElement.matches('.inside')) {
       console.log('Button clicked!');
       socket.emit('pass-card', p,ts);
       gg.removeChild(idnode);
      
        if(!score.matches('.gayab')){
      score.classList.toggle('gayab');
    }
       console.log(p);
      }
   });

  


socket.on('add-card', (p,cards,v,ply)=>{
   play = ply ;
  let pu = cards ;
  let div = document.createElement("div");
  let div2 = document.createElement("div");
  let textnode = document.createTextNode(p);
  div.setAttribute("class","inside");
  div2.setAttribute("class","card-box");
  div2.setAttribute("id",p);
  div.appendChild(textnode);
  div2.appendChild(div);
  c.appendChild(div2);

  let arry = document.getElementsByClassName('card-box');
  let arr = Array.from(arry);
   we = [];
  for(let a in arr){
    we[a] = arr[a].id;
  }
  let dissimilar_index = findDissimilarIndex(we);
  if(dissimilar_index != -1){

  console.log(we[dissimilar_index])
    
       
     score.classList.toggle('gayab');
    console.log('nhi hua na toggle chutiya')
    
   
    let winner = ply[v];
    let div1 = document.createElement("div");
    let div2 = document.createElement("div");
    let textnode = document.createTextNode(winner);
    div1.setAttribute("class","name");
    div2.setAttribute("class","line");
    div1.appendChild(textnode);
    result.appendChild(div1);
    result.appendChild(div2);

   


 // catch score four event
     g3.addEventListener('click', function(ev){
       let ele = ev.target ;
        if (ele.matches('#start')){
          do{
            alert(` pass the card, ${we[dissimilar_index]} first !`)
          }while(false)
             socket.emit('left-player', v);
            socket.emit('update-cards-number',v);
           setTimeout(()=>{
           d.classList.toggle('gayab');
           e.classList.toggle('gayab');
          }, 1500);
          
        }
       
     });
   
    
  } if(allSame(we)) {

    let winner = ply[v];
    let div1 = document.createElement("div");
    let div2 = document.createElement("div");
    let textnode = document.createTextNode(winner);
    div1.setAttribute("class","name");
    div2.setAttribute("class","line");
    div1.appendChild(textnode);
    result.appendChild(div1);
    result.appendChild(div2);

    score.classList.toggle('gayab');

 // catch score four event
     g3.addEventListener('click', function(ev){
       let ele = ev.target ;
        if (ele.matches('#start')){
          if(we.length != 4){
            alert(` pass the card, ${we[dissimilar_index]} first !`)
          }else{
             socket.emit('left-player', v);
            socket.emit('update-cards-number',v);
           setTimeout(()=>{
           d.classList.toggle('gayab');
           e.classList.toggle('gayab');
          }, 1500);
          }
        }
       
     });

    
   
  }
 if(!allSame(we) && dissimilar_index == -1 ){
    if(!score.matches('.gayab')){
      score.classList.toggle('gayab');
    }
   
  }


  
});

socket.on('show-info',(ts,v,players,c)=>{

  g3p.innerHTML = `${players[ts]} passed the card to ${players[v]}`;

});

socket.on('update-result',(w,play)=>{
   
    let div1 = document.createElement("div");
    let div2 = document.createElement("div");
    let textnode = document.createTextNode(w);
    div1.setAttribute("class","name");
    div2.setAttribute("class","line");
    div1.appendChild(textnode);
    result.appendChild(div1);
    result.appendChild(div2);
});
