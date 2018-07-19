
var c = document.getElementById('canvas');
var ctx = c.getContext('2d');
c.width = window.innerWidth;
c.height = window.innerHeight;

var mouseX = null;//3
var mouseY = null;//3
var pelotasArray = [];
var animacion=null;
var pelota= null;

let isDrawing = false;
var lastX = 0;
var lastY = 0;
var codigoColor = 0;

var z;
let bubbles = [];
var myrew=null;


let eleccion=1;
var consigna=50;
var tamaño=10;

//--------------------------------RANGES----------------------------------------

var controls=document.querySelector('.controls');
const array=[];
let cantidad= 0;
var left=0;
var id=null;
var bolaKlicada=false;
var PsocionBolaInicio= null;

const range= () => {
  return {
    crear: () => {
        array.push({cantidad});
        const html=`
            ${array.map((arr, index) => `
                <div class="range range${index}" id="${index}">
                    <div class="line" id="${index}"></div>
                    <div class="bola" id="${index}"></div>
                    <div class='letrero' id="${index}"></div>
                </div>`
            ).join('')}`;
            var botonesHtml=`<button class="boton" id='boton1'>1</button>
                             <button class="boton" id='boton2'>2</button>
                             <button class="boton" id='boton3'>3</button>
                            `
        controls.innerHTML=html+botonesHtml;
    },
    bolaDown: (e) => {
        bolaKlicada=true;
        id=e.target.id;
        range.moverBola(e);
    },
    moverBola: (e) => {
        if(!bolaKlicada) return;

        const range= ranges[id];
        const line= lines[id];
        const letrero= letreros[id];
        const bola= bolas[id];

        var pixeles=e.pageX-(controls.offsetLeft+line.offsetLeft+range.offsetLeft);
        centro=pixeles+PsocionBolaInicio;
        posicionBola= ((bola.offsetLeft-PsocionBolaInicio-1)*100/line.offsetWidth).toFixed(0);

        bola.style.left=`${centro}px`;
        letrero.innerHTML= posicionBola;
        letrero.style.left=`${pixeles+5}px`;

        if(centro+(bola.offsetWidth/2) >= line.offsetWidth+line.offsetLeft){
            bola.style.left=`${(line.offsetWidth+line.offsetLeft)-(bola.offsetWidth/2)}px`;
            letrero.style.left=`${line.offsetWidth+5}px`;
            letrero.innerHTML= 100;
        }
        if(centro <= PsocionBolaInicio){
            bola.style.left=`${PsocionBolaInicio}px`;
            letrero.style.left=`${5}px`;
            letrero.innerHTML= 0;
        }
        if(e.target.id==0){
            consigna=bola.offsetLeft-PsocionBolaInicio;
        }
        if(e.target.id==1){
            tamaño=((bola.offsetLeft-PsocionBolaInicio)/4).toFixed(0);
        }
    },
    bolaDesklicada: () => {
      if(!bolaKlicada) return;
      bolaKlicada=false;
    }
  }
}
const range1= range();
const range2= range();
range1.crear();
range2.crear();

var ranges = Array.from(document.querySelectorAll('.range'));
var letreros = Array.from(document.querySelectorAll('.letrero'));
var bolas = Array.from(document.querySelectorAll('.bola'));
var lines = Array.from(document.querySelectorAll('.line'));

ranges.map((range, id) => {
    const line= lines[id];
    const letrero= letreros[id];
    const bola= bolas[id];
    PsocionBolaInicio=bola.offsetLeft;
    bola.style.left=`${((line.offsetWidth/(100/consigna))+line.offsetLeft)-(6)}px`;
    letrero.style.left=`${line.offsetWidth/(100/consigna)}px`;
    letrero.innerHTML= consigna;
    left=left+60;
    range.addEventListener('mousedown', (e) => {
        range1.bolaDown(e);
        range2.bolaDown(e);
    });
});

document.addEventListener('mouseup', () =>  {
    range1.bolaDesklicada();
    range2.bolaDesklicada();
});
document.addEventListener('mousemove', (e) =>  {
    range1.moverBola(e);
    range2.moverBola(e);
});

var botones= Array.from(document.querySelectorAll('.boton'));
botones.forEach( boton => boton.addEventListener('click', change));
//---------------------------RESET CANVAS---------------------------------------
window.addEventListener('resize', () => {
    console.log('resize')
    let buffer = document.getElementById('buffer');
    var w = window.innerWidth;
    var h = window.innerHeight;
    buffer.width = w;
    buffer.height = h;
    buffer.getContext('2d').drawImage(canvas, 0, 0);
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d').drawImage(buffer, 0, 0);
});

//-------------------------------PELOTAS----------------------------------------
const pelotas= () => {
  return {
    createPelotas: (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
          for(i = 0; i < consigna; i++){
              pelotasArray.push({
                  x: mouseX,
                  y: mouseY,
                  size: parseInt(Math.random() * tamaño),
                  color: 'rgb(' + coloresRandom() + ')',
                  velocidadX: velocidadRandom(),
                  velocidadY: velocidadRandom()
              });
          }
          function coloresRandom(){
            var colores = [
              '255, 122, 206',
              '0, 157, 255',
              '0, 240, 168',
              '255, 0, 102'
            ];
            var index = parseInt(Math.random() * 4);
            return colores[index];
          }
          function velocidadRandom(){
            return velocidad = Math.random() < 0.5 ? Math.abs(Math.random()) : -Math.abs(Math.random());
          }
    },
    iniciarPelotas: () => {
        pelotasArray.map( pelota => {
            pelota.x += pelota.velocidadX;
            pelota.y += pelota.velocidadY;
            pelota.size = Math.max(0, (pelota.size - .05));
            //pelota.size === 0 ? pelotasArray.splice(i, 1) : null;
        });
    },
    dibujarPelotas: () => {
        ctx.clearRect(0, 0, c.width, c.height);
        pelotasArray.map( pelota => {
            ctx.beginPath();
            ctx.arc(pelota.x, pelota.y, pelota.size, 0, Math.PI * 2);
            ctx.fillStyle = pelota.color;
            ctx.closePath();
            ctx.fill();
        })
    }
  }
}

function mouseUpFunction(e){
  pelota.createPelotas(e);
}
function intervalPelotas(){
    pelota.iniciarPelotas();
    pelota.dibujarPelotas();
    animacion= window.requestAnimationFrame(intervalPelotas);
}

//--------------------------------ROTULO----------------------------------------
const rotulo= () => {
    return {
        resetCanvas: () => {
            ctx.clearRect(0, 0, c.width, c.height);
            ctx.strokeStyle = '#BADA55';
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.lineWidth = 100;
        },
        draw: (e) => {
            if (!isDrawing) return;
                ctx.lineWidth= tamaño*4;
                ctx.strokeStyle = `hsl(${codigoColor}, 100%, 50%)`;
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.stroke();
                [lastX, lastY] = [e.offsetX, e.offsetY];
                codigoColor++;
                if (codigoColor >= 360) {
                    codigoColor = 0;
                }
            }
        }
}

//--------------------------------BUBBLE----------------------------------------
const bubble= (x, y, r) => {
    return{
        show: () => {
            ctx.beginPath();
            ctx.lineWidth=tamaño;
            ctx.strokeStyle = `hsl(${consigna}, 100%, 50%)`;
            ctx.arc(x,y,r, 0, 2 * Math.PI);
            ctx.stroke();
        },
        move: () => {
            let randomx=(Math.random()< 0.5 ? -1 : 1)*3;
            let randomy=(Math.random()< 0.5 ? -1 : 1)*3;
            x = x + randomx;
            y = y + randomy;
            ctx.beginPath();
            ctx.lineWidth=tamaño;
            ctx.strokeStyle = `hsl(${consigna}, 100%, 50%)`;
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
}
function createBuble (e) {
    mouseX=e.clientX;
    mouseY=e.clientY;
    z=Math.random()*40;
    let b = bubble(mouseX, mouseY, z);
    bubbles.push(b);
    bubbles.forEach(buble => buble.show());
}
function interval(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bubbles.forEach(buble => buble.move())
    myrew= window.requestAnimationFrame(interval);
}

//------------------------------------------------------------------------------
function change(e){
    if(botones.indexOf(e.target) == eleccion) return;
    eleccion=botones.indexOf(e.target);

    if(eleccion==2){
        bubbles=[];
        c.addEventListener('click', createBuble);
        interval();
    }
    if(eleccion!=2){
        c.removeEventListener('click', createBuble);
        window.cancelAnimationFrame(myrew)
    }

    if(eleccion==1){
        let dibujo = rotulo();
        dibujo.resetCanvas();

        window.addEventListener('resize', () => dibujo.resetCanvas());
        c.addEventListener('mousedown', (e) => {
            isDrawing = true;
            [lastX, lastY] = [e.offsetX, e.offsetY];
        });
        c.addEventListener('mousemove', (e) => dibujo.draw(e));
        c.addEventListener('mouseup', () => isDrawing = false);
        c.addEventListener('mouseout', () => isDrawing = false);
    }

    if(eleccion==0){
        pelota= pelotas();
        window.addEventListener('mouseup', mouseUpFunction);
        intervalPelotas();
    }
    if(eleccion!=0){
        window.removeEventListener('mouseup', mouseUpFunction);
        window.cancelAnimationFrame(animacion);
    }
}
