var inp
var button
var title
var db
var gs
var pc
var greet
var resetbutton
var car1,car2
var playerdata
var limit = 5
var cars = [];
var replace
var c1,c2
var track


function preload(){
    c1 = loadImage('car1.png')
    c2 = loadImage('car2.png')
    track = loadImage('track.jpg')
}

function setup(){
    createCanvas(window.innerWidth,window.innerHeight);
    inp = createInput()
    inp.position(window.innerWidth/2-85,200)

    inp.attribute('placeholder','enter your name')
    inp.style('backgroundColor','lightblue')
    inp.style('textAlign','center')
    inp.style('height','25px')
    inp.style('fontSize','20px')
    inp.style('borderRadius','20px')

    button = createButton('PLAY')
    button.position(window.innerWidth/2,250)

    button.mousePressed(enterplayer)

    button.style('backgroundColor','pink')
    button.style('width','70px')
    button.style('height','70px')
    button.style('borderRadius','50px')

    title = createElement('H1')
    title.html('car raceing game')
    title.position(window.innerWidth/2-50,50)

    db = firebase.database()
    db.ref('gameState').on('value',function(data){
        gs=data.val()
    })
    db.ref('playerCount').on('value',function(data){
       pc = data.val()
    })

    resetbutton = createButton('reset')
    resetbutton.position(50,50)

    resetbutton.mousePressed(reset)

    car1 = createSprite(570,200,30,30)
    car2 = createSprite(770,200,30,30)
    car1.addImage('car1',c1)
    car1.scale = 0.05 
    car2.addImage('car2',c2)
    car2.scale = 0.05
   cars = [car1,car2]
    
}

function draw(){
    background("white");
    

    if(limit === 5 && gs === 1){
      db.ref('players').on('value',function(data){
          playerdata = data.val()
      })
      limit =40000
    }
    if(gs === 1){
       var index = 0
       coins()
       image(track,0,-displayHeight,displayWidth,-displayHeight*5)
       for(var i in playerdata){
         cars[index].y = playerdata[i].y
        if(index === replace-1){
            fill('yellow')
            ellipse(cars[replace-1].x,cars[replace-1].y,60,60)
            camera.position.y = cars[index].y
        }
         index = index+1
       }
       if(keyDown('up')){
        cars[replace -1].y-=5
        db.ref('players/player'+replace).update({
            y:cars[replace -1].y
        })
       }
        drawSprites();
        text(mouseX,mouseX,mouseY)
    }
    if(pc==2){
     gs = 1
     db.ref('/').update({
         gameState:gs
     })
    
    }
    
}

function enterplayer(){
    pc = pc+1
    replace = pc
    db.ref('/').update({
        playerCount:pc
    })
    inp.hide()
    button.hide()

   greet = createElement('H2')
   greet.html('welcome '+inp.value()+ '  waiting for another players to join')
   greet.position(window.innerWidth/2-50,200)

   db.ref('players/player'+pc).set({
       y:-835
   })
}

function reset(){
    db.ref('/').update({
        playerCount:0,
        gameState:0
    })
    db.ref('players').remove()
    
}
function coins(){
    if(frameCount%100===0){
     var coin = createSprite(random(100,900),-60,50,50)
     coin.velocity=3
    }
}