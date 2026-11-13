let backgroundColor = '#000035';


//variabile in cui salvo i dati del CSV
let data;

//variaile in cui slavo l'id del ciclo di sonno selezionato
let selectedPersonId;

async function setup(){
    //carico i dati
    data = await loadTable("assets/sleep_health.csv", ",", "header");
    
    // legge i parametri passati dell'URL 
    let params = getURLParams();

    //salvo l'id del ciclo del sonno slezionato
    selectedPersonId = params.sleep_health;

    //creo il canvas 
    createCanvas(windowWidth, windowHeight);
}

function draw(){

    background(backgroundColor);

//data-tabella, findrow-cerca la riga, selected...id selezionato, sleep_healthid colonna
let personRow = data.findRow(selectedPersonId, "Person ID");

//se la trovi
    if (personRow) {
        let duration = float(personRow.get("Sleep Duration")); //float arrotonda per eccesso
        let stress = float(personRow.get("Stress Level"));
        let quality = float(personRow.get("Quality of Sleep"));

        let diametro = 25;
        let padding = 30;

        let posX = 40; //posizione orizzontale e verticale iniziale(sotto), le coordinate del punto
        let posY = 50;

            //1^ riga: cerchi che rappresentano la durata del sonno
            
            //testo
                fill("#E00486");
                noStroke();
                textSize(20);
                text("Sleep duration", posX, posY);

                posY +=40; //per non sovrapporre

            for (let i = 0; i < duration; i++) {
                fill("#95BDFF");
                stroke("#95BDFF");
                circle(posX, posY, diametro);

                posX += diametro + padding; //per spostare il cerchio successivo verso dx
            } 

            //2^ riga: cerchi che rappresentano la qualità del sonno, scala di 10 perché è conteggaito su 10 nel dataset

            //assegno i valori di spostamento
            posX = 40; //porta il disegno all'inizio della riga
            posY += diametro + padding; //sposta la direzione verticale
            
            fill("#E00486");
                noStroke();
                textSize(20);
                text("Quality of sleep", posX, posY );

                posY += 40; //per non sovrapporre, spazio sotto al titolo quindi tra titolo e riga

            for(let i = 0; i < 10; i++){
                if(i < quality){
                    fill("#AC87C5");
                }else {
                noFill();
            }

            stroke("#AC87C5");
            circle(posX, posY, diametro);

            posX += diametro + padding;}

            //3^ riga: cerchi per stress level
            posX = 40;
            posY += diametro + padding;

            fill("#E00486");
                noStroke();
                textSize(20);
                text("Stress level", posX, posY);

                posY +=40; 

            for(let i = 0; i < 10; i++){
                if(i < stress){
                    fill("#8DDFCB");
                }else{
                    noFill();
                }

                stroke("#8DDFCB");
                circle(posX, posY, diametro);
                posX += diametro + padding;
            }
    }
}











