// variabili condivise: i valori letti qui possono essere sempre utilizzati
let data;
let genders = [];
let selectedID;

// dimensione e distanza dei cerchi
let raggioCerchio = 10;
let distanzaMinima = raggioCerchio * 2 + 6; //diametro e spazio tra i cerchi

// raggio di ciascuna circonferenza
let raggioCirconferenzaEsterna;
let raggioCirconferenza;
let raggioCirconferenzaInterna;

// centro del grafico
let centerX;
let centerY;

let posizioneCerchi = [];

// associa a ogni categoria del csv un colore, in questo caso a male e female
let colorScale = {
  'Male': '#FFFEEF',
  'Female': '#FFE9B3'
};

 //async e await per attendere il caricamento degli asset, al posto di preload
async function setup() {

  createCanvas(windowWidth, windowHeight);

  data = await loadTable("assets/sleep_health.csv", ",", "header"); //header usa prima riga come nomi delle colonne

  centerX = width / 2;
  centerY = height / 2;

//grandezza delle circonferenze
  raggioCirconferenzaEsterna = height * 0.45;
  raggioCirconferenza = height * 0.35;
  raggioCirconferenzaInterna = height * 0.20;

  for(let i = 0; i < data.getRowCount(); i++) {

 
    let gender = data.getString(i, "Gender");

    if (!genders.includes(gender)) {
      genders.push(gender);
    }
     }
  
//varibili per fasce
  let contatoreApnea = 0;
  let contatoreInsonnia = 0;
  let contatoreNone = 0;

  for (let i = 0; i < data.getRowCount(); i++) {

    let disorder = data.getString(i, "Sleep Disorder");

    let raggioMin;
    let raggioMax;
    let indice;

   //ciclo per posizionarli nelle tre fasce
    if (disorder == "Sleep Apnea") {

      raggioMin = 20;
      raggioMax = raggioCirconferenzaInterna - 20;

//aggiunge ogni volta un cerchio
      indice = contatoreApnea++;

    } else if (disorder == "Insomnia") {

      raggioMin = raggioCirconferenzaInterna + 20;
      raggioMax = raggioCirconferenza - 20;

      indice = contatoreInsonnia++;

    } else {

      raggioMin = raggioCirconferenza + 20;
      raggioMax = raggioCirconferenzaEsterna - 20;

      indice = contatoreNone++;
    }

    // distanza tra i cerchi
    let distanza = distanzaMinima;
    
    let raggio = raggioMin;
    let punti = floor(TWO_PI * raggio / distanza);
    let giro = 0;

    // ciclo per passare al giro successivo quando il precedente è pieno
    while (indice >= punti) {

      indice -= punti; 
      giro++;
      raggio = raggioMin + giro * distanza;
      punti = floor(TWO_PI * raggio / distanza);

    }

    // calcola l'angolo che poi verrà colorato
    let angle = indice * TWO_PI / punti;

    // calcola la sua posizione
    let xPos = centerX + cos(angle) * raggio;
    let yPos = centerY + sin(angle) * raggio;

    posizioneCerchi.push({
      x: xPos,
      y: yPos
    });
}
}

function draw() {

  background('#000035');

  selectedID = undefined;

  centerX = width / 2;
  centerY = height / 2;

  raggioCirconferenzaEsterna = height * 0.46;
  raggioCirconferenza = height * 0.35;
  raggioCirconferenzaInterna = height * 0.20;

  let total = data.getRowCount();

  //coloro e disegno fasce

  noStroke();

  // fascia esterna
  fill('#1E2460')
  ellipse(centerX, centerY, raggioCirconferenzaEsterna * 2);

  // fascia intermedia
  ellipse(centerX, centerY, raggioCirconferenza * 2);
  fill('#03396C');
  ellipse(centerX, centerY, raggioCirconferenza * 2);

  // fascia interna

  ellipse(centerX, centerY, raggioCirconferenzaInterna * 2);
  fill('#005B96')
  ellipse(centerX, centerY, raggioCirconferenzaInterna * 2);

  //disegna  circonferenze

  noFill();
  
  ellipse(centerX, centerY,raggioCirconferenzaEsterna * 2);
  ellipse(centerX, centerY, raggioCirconferenza * 2);
  ellipse(centerX, centerY, raggioCirconferenzaInterna * 2);
  
  let label = "";

//disegno i vari cerchi

  for (let rowNumber = 0; rowNumber < total; rowNumber++) {

    let currentStress = data.getNum(rowNumber, "Stress Level");
    let gender = data.getString(rowNumber, "Gender");
    let sleepDisorder = data.getString(rowNumber, "Sleep Disorder");
    let sleepDuration = data.getNum(rowNumber, "Sleep Duration");

  
    let xPos = posizioneCerchi[rowNumber].x;
    let yPos = posizioneCerchi[rowNumber].y;

    // l'angolo identifica Sleep Duration 
    let angleFill = map(sleepDuration, 5.8, 8.5, 0, TWO_PI);

    angleFill = constrain(angleFill, 0, TWO_PI);

    // disegno la parte colorata del cerchio
    fill(colorScale[gender]);
    noStroke();

    arc(xPos, yPos, raggioCerchio * 2, raggioCerchio * 2, -HALF_PI, -HALF_PI + angleFill, PIE);

    // disegno contorno dei cerchi
    noFill();

    stroke(colorScale[gender]);

    ellipse(xPos, yPos, raggioCerchio * 2, raggioCerchio * 2);

    noStroke();


  //per il mouseover

    if (dist(mouseX, mouseY, xPos, yPos) < raggioCerchio) {

      label = "Sleep Duration: " + sleepDuration +
        "\nGender: " + gender +
        "\nStress Level: " + currentStress +
        "\nSleep Disorder: " + sleepDisorder;

      selectedID = data.getString(rowNumber, "Person ID");

    }

  }

  if (label != "") {

    fill('#E00486');
    noStroke();

    text(label, mouseX + 8, mouseY + 16);

  }

}

function mousePressed() {

 let myURL = "detail.html?sleep_health=" + selectedID;

    window.location.href = myURL;

  }






