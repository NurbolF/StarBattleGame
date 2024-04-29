kaboom({
    width:960,
    height:600,
});
// alert(`${width()}x${height()}`)
let coinCount = 0;
let counter = 0;
let fuel = 15;
let maxFuel = 30;
const SPEED = rand(300,1000);
loadSprite('logo', "./img/logo.jpeg");
loadSprite('spaceship', "./img/spaceship.png");
loadSprite('asteroid', "./img/asteroid.png");
loadSprite('coin', "./img/coin.png");
loadSprite('fuel', "./img/fuel.png");
loadSprite('space_bg', "./img/space_bg.png");
loadSprite('sun', "./img/sun.png");
loadSprite('planet', "./img/planet.png");
loadSprite('gray_planet', "./img/gray_planet.png")
scene('game', () => {
// background
add([
    sprite("space_bg"),
    pos(0,0),
    scale(2)
])
//sun
add([
    sprite("sun"),
    pos(0,0),
    scale(0.5)
])

//planet
const spawnPlanet = () =>{
    add([
        sprite('planet'),
        area(),
        pos(width(), rand(0,690)),
        scale(0.5),
        move(LEFT, SPEED),
        offscreen({destroy:true}),
    ])
    wait(rand(20,60), spawnPlanet)
}
spawnPlanet();

//Время
let counterLabel;

// Функция для обновления счетчика и его отображения
function updateCounter() {
  // Если текстовая метка уже существует, обновляем её текст
  if (counterLabel) {
    counterLabel.text = `Time:${counter.toString()}`;
  } else { // Иначе создаем новую текстовую метку
    counterLabel = add([
      text(`Time:${counter.toString()}`),
      pos(800, 10),
      {
        value: counter,
      },
    ]);
  }
  
  // Увеличение счетчика на 1
  counter++;
}

// Вызов функции updateCounter каждую секунду
loop(1, () => {
  updateCounter();
});

    const createPlayer = () =>{
        const player = add([
            sprite("spaceship"),
            pos(100, height()/2), 
            area(),
            scale(0.5),
            body(),
            'player',
        ])
        return player;
    }
    const player = createPlayer();
    onKeyDown("up", () =>{
    player.move(0,-500);
   });
   onKeyDown("down", () =>{
    player.move(0,500);
   });
   onKeyDown("left", () =>{
    player.move(-500,0)
   })
   onKeyDown("right", () =>{
    player.move(+500,0)
   })   

const spawnSecondPlanet = () =>{
   add([
    sprite('gray_planet'),
    pos(width(), rand(0,300)),
    move(LEFT, SPEED),
    offscreen({destroy: true}),
   ])
   wait(rand(10,60), spawnSecondPlanet);
}
spawnSecondPlanet();

//спавн астероидов
    const spawnAsteroid = () => {
        add([
            sprite('asteroid'),
            area(),
            scale(0.2),
            pos(width(), rand(10,710)),
            anchor('botleft'),
            move(LEFT, SPEED),
            offscreen({destroy: true}),
            "asteroid"
        ])
        wait(rand(1,5), spawnAsteroid);
    }
    spawnAsteroid();

//взаимодействие с астероидом
    player.onCollide("asteroid", () =>{
        go('lose');
    })

//спавн монет
    const spawnCoin = () => {
        add([
            sprite('coin'),
            area(),
            pos(width(), rand(10,710)),
            scale(0.2),
            anchor('botleft'),
            move(LEFT, SPEED),
            offscreen({destroy:true}),
            'coin'
        ])
        wait(rand(2,6), spawnCoin);
    }
    spawnCoin();

//счетчик монет
    const dynamicScoreText = add([
        text(`Your score: ${coinCount}`),
        pos(10,10),
    ])

//взаимодействие монет с игроком
    player.onCollide("coin", (coin) =>{
        coinCount++;
        destroy(coin);
        dynamicScoreText.text = `Your score: ${coinCount}`;
    })

//спавн топлива
const spawnFuel = () => {
    add([
        sprite('fuel'),
        area(),
        pos(rand(10,600), 0),
        scale(0.5),
        anchor('botleft'),
        move(DOWN, 380),
        offscreen({destroy:true}),
        'fuel'
    ])
    wait(rand(2,6), spawnFuel);
}
spawnFuel();
// взаимодействие игрока с топливом 
player.onCollide("fuel", (fuelItem) => {
    destroy(fuelItem);
    fuel += 15; 
    fuel = Math.min(fuel, maxFuel);  
});

//fuel graphic element
let fuelBar = add([
    rect(150, 10),
    pos(800, 560),
    { value: fuel },
]);
let fuelLabel;
const fuelUpdate = () =>{
    if(fuelLabel){
        fuelLabel.text = fuel.toString();
    }
    else{
        fuelLabel = add([
            text(fuel),
            pos(800, 560),
            {vlue:fuel}
        ])
    }
}
loop(1, () => {
    fuelUpdate();
    if (fuel > 0) {
        fuel--;
        fuelBar.width = fuel * 10;
        fuelBar.color = rgb(fuel * 0.06, 1, 0);
    }
    else{
        go('lose');
    }
});

})

scene('lose', () => {
    add([
        sprite("space_bg"),
        pos(0,0),
        scale(2)
    ])
    let restartBtn = add([
        rect(240,80, {radius:8}),
        pos(width()/2, height()/2),
        color(144,144,144),
        area(),
        anchor('center'),
        'restartBtn'
    ])
    restartBtn.add([
        text('Restart'),
        anchor('center'),
    ])
    restartBtn.onHover( () =>{
        restartBtn.color = rgb("#f19e0d");
        setCursor('pointer')
    })
    restartBtn.onHoverEnd(() =>{
        restartBtn.color = rgb(144,144,144);
        setCursor('default')
    })
    add([
        text(`GAME OVER \n Score:${coinCount} \n Time:${counter}`),
        pos(510, 150),
        scale(2),
        anchor("center")
    ])
    
    onClick('restartBtn',()=>{
        go('startGame');
    });
    coinCount = 0;
    counter = 0;
    fuel = 15;
})
scene('startGame', () =>{
    add([
        sprite('space_bg'),
        scale(2)
    ])
    add([
        sprite('logo'),
        pos(400, 50),
        scale(0.1),
    ])
    let btn = add([
        rect(240,80, {radius:8}),
        pos(width()/2, height()/2),
        color(144,144,144),
        area(),
        anchor("center"),
        'btn',
    ])
    btn.add([
        text('Start game'),
        anchor('center'),
    ])
    btn.onHover(() =>{
        btn.color = rgb("#f19e0d"),
        setCursor('pointer')
    })
    btn.onHoverEnd(() => {
        btn.color = rgb(144,144,144),
        setCursor('default')
    })
    onClick('btn', () =>{
        go('game')
    })
})
go('startGame');
