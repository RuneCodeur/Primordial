import CLASSunit from './CLASS-unit.js';

// gestion de 1 monstre
class CLASSmonster extends CLASSunit{
    constructor(position, direction, id) {
        super(position);
        this.id = id;
        this.direction = direction;
        this.directionPrec = direction;
        this.comportementEtat = 0;
        this.IA = null;
    }

    POSTRESSOURCEmonster(RESSOURCEmonster){

        this.name = RESSOURCEmonster.name;

        this.PV = RESSOURCEmonster.PV;
        this.PVmax = RESSOURCEmonster.PV;
        this.PM = RESSOURCEmonster.PM;
        this.PMmax = RESSOURCEmonster.PM;
        this.FOR = RESSOURCEmonster.FOR;
        this.ADR = RESSOURCEmonster.ADR;
        this.INT = RESSOURCEmonster.INT;
        this.ARMO = RESSOURCEmonster.ARMO;
        this.XP = RESSOURCEmonster.XP;
        this.IA = RESSOURCEmonster.IA;
        this.vision = RESSOURCEmonster.vision;
        this.assets = {
            0 : RESSOURCEmonster.img[0],
            1 : RESSOURCEmonster.img[1],
            2 : RESSOURCEmonster.img[2],
            3 : RESSOURCEmonster.img[3]
        }
    }

    unitDepop(){
        this.comportementEtat = 0;
        super.unitDepop();
    }

    //change le comportement selon certaines logique
    changeComportement(positionPlayer, positionsMonster, tableau){
        // console.log(this.id);
        // console.log(this.GETposition())
        // console.log(positionPlayer);
        // console.log(tableau);

        switch (this.IA) {

            // si il voit le joueur, fuit. mais attaque à distance
            case 'magicien':
                this.detection(positionPlayer, tableau)
                break;
            
            // si il voit le joueur, attaque. si les PV sont inferieur aux PVmax, fuit
            case 'voleur': 
                if(this.PV < this.PVmax){
                    this.comportementEtat = 2; // -> fuit
                }
                else if(this.detection(positionPlayer, tableau) || this.comportementEtat == 1){
                    if(this.comportementEtat != 1){
                        this.aggroEffect(); // -> effet d'agro
                    }
                    this.comportementEtat = 1; // -> attaque
                }
                else{
                    this.comportementEtat = 0; // -> repos
                }
                break;
                
            // si il voit le joueur, attaque. si les PV sont inferieur à la moitié des PVmax, fuit
            case 'guerrier':
                if(this.PV < Math.ceil(this.PVmax/2)){
                    this.comportementEtat = 2; // -> fuit
                }
                else if(this.detection(positionPlayer, tableau) || this.comportementEtat == 1){
                    if(this.comportementEtat != 1){
                        this.aggroEffect(); // -> effet d'agro
                    }
                    this.comportementEtat = 1; // -> attaque
                }
                else{
                    this.comportementEtat = 0; // -> repos
                }
                break;
                
            // si il voit le joueur, attaque. ne fuit jamais
            case 'berzerk': 
                if(this.detection(positionPlayer, tableau) || this.comportementEtat == 1){
                    if(this.comportementEtat != 1){
                        this.aggroEffect(); // -> effet d'agro
                    }
                    this.comportementEtat = 1; // -> attaque
                }
                else{
                    this.comportementEtat = 0; // -> repos
                }
                break;
            
            // attaque. ne fuit jamais
            case 'boss': 
                this.comportementEtat = 1;
                break;

            // gros débile 
            default:
                this.comportementEtat = 0; // -> repos
                break;
        }
    }

    comportement(positionPlayer, positionsMonster, tableau){
        let deplacement = null;

        this.changeComportement(positionPlayer, positionsMonster, tableau);

        switch (this.comportementEtat) {

            // attaquer
            case 1:
                return this.goPlayer(positionPlayer, tableau);
                break;
            
            // fuir
            case 2:
                return this.escapePlayer(positionPlayer, tableau);
                break;

            // repos
            default:
                let IsMove = Math.floor(Math.random()*3);
                if(IsMove == 0){
                    deplacement = Math.floor(Math.random()*4)
                }
                break;
        }

        return deplacement;
    }

    //indique une direction pour fuir le joueur
    escapePlayer(positionPlayer, tableau){
        
        let monsterPosition = this.GETposition();

        const directions = [
            [1, 0],
            [0, -1],
            [-1, 0],
            [0, 1]
        ];

        let maxDistance = -1;
        let bestDirection = null;

        // Explorer les 4 directions et trouver la case la plus éloignée du joueur
        for (let i = 0; i < directions.length; i++) {
            const [dy, dx] = directions[i];
            const newY = monsterPosition[0] + dy;
            const newX = monsterPosition[1] + dx;

            // Si la case est valide et non bloquée par un obstacle
            if (this.coordoneesIsValid(newY, newX, tableau)) {
                const distance = Math.sqrt((newY - positionPlayer[0]) ** 2 + (newX - positionPlayer[1]) ** 2);
                if (distance > maxDistance) {
                    maxDistance = distance;
                    bestDirection = i;
                }
            }
        }

        return bestDirection;
    }



    // indique la direction pour se rapprocher du joueur
    goPlayer(positionPlayer, tableau){

        let monsterPosition = this.GETposition();
        
        const directions = [
            [1, 0],  // Bas
            [0, -1], // Gauche
            [-1, 0], // Haut
            [0, 1]   // Droite
        ];

        // BFS pour trouver le chemin le plus court
        const queue = [[monsterPosition[0], monsterPosition[1]]];  // File d'attente pour explorer
        const visited = Array.from({ length: window.TABhauteur }, () => Array(window.TABlargeur).fill(false));
        const parent = Array.from({ length: window.TABhauteur }, () => Array(window.TABlargeur).fill(null));

        visited[monsterPosition[0]][monsterPosition[1]] = true;

        while (queue.length > 0) {
            const [currentY, currentX] = queue.shift();

            // Si on atteint le joueur, on reconstruit le chemin
            if (currentY === positionPlayer[0] && currentX === positionPlayer[1]) {
                let path = [];
                let y = positionPlayer[0];
                let x = positionPlayer[1];

                while (parent[y][x]) {
                    path.push([y, x]);
                    [y, x] = parent[y][x];
                }

                path.reverse(); // Inverser pour obtenir le chemin du monstre vers le joueur

                // Retourner la prochaine case, ou la position du monstre s'il est déjà sur place
                const nextPosition = path.length > 0 ? path[0] : positionMonster;

                // Calculer la direction en fonction du déplacement
                const [nextY, nextX] = nextPosition;

                if (nextY > monsterPosition[0]) return 0; // Bas
                if (nextX < monsterPosition[1]) return 1; // Gauche
                if (nextY < monsterPosition[0]) return 2; // Haut
                if (nextX > monsterPosition[1]) return 3; // Droite
            }

            // Explorer les 4 directions
            for (const [dy, dx] of directions) {
                const newY = currentY + dy;
                const newX = currentX + dx;

                if (this.coordoneesIsValid(newY, newX, tableau) && !visited[newY][newX]) {
                    queue.push([newY, newX]);
                    visited[newY][newX] = true;
                    parent[newY][newX] = [currentY, currentX]; // Garder trace du chemin
                }
            }
        }
        return null;
    }

    // Vérification des coordonnées valides
    coordoneesIsValid(y, x, tableau) {
        return y >= 0 && y < window.TABhauteur && x >= 0 && x < window.TABlargeur && tableau[y][x] !== 1;
    }
    
    //ajoute un point d'exclamation en haut du personnage
    aggroEffect(){
        //console.log("effet d'aggro");
    }

    // detection du joueur
    detection(positionPlayer, tableau){
        for (let H = 0; H < tableau.length; H++) {
            for (let L = 0; L < tableau[H].length; L++) {
                if(positionPlayer[0] == H && positionPlayer[1] == L){
                    tableau[H][L] = 'P';
                }
            }
        }
        switch (this.GETdirection()) {
            case 0:
                return this.detectionBas(tableau);
                break;
            case 1:
                return this.detectionGauche(tableau);
                break;
            case 2:
                return this.detectionHaut(tableau);
                break;
            case 3:
                return this.detectionDroite(tableau);
                break;
        }
    }

    detectionBas(tableau){
        let positionMonster = this.GETposition();
        let Lbase = positionMonster[1];
        let deca = 0;

        // colonne principale
        for (let H = positionMonster[0]+1; H < tableau.length; H++) {
            if(tableau[H][Lbase] == 1){
                if(tableau[H+1] && tableau[H+1][Lbase-1] != undefined ){
                    tableau[H+1][Lbase-1] = '1';
                }
                if(tableau[H+1] && tableau[H+1][Lbase+1] != undefined){
                    tableau[H+1][Lbase+1] = '1';
                }
                break;
            }
            if(tableau[H][Lbase] == 'P'){
                return true;
            }
        }
        
        // regard vers la gauche
        deca = 0;
        for (let L = Lbase-1; L >= 0; L--) {
            for (let H = positionMonster[0]+1; H < tableau.length; H++) { //++ plus petit entre tableau.length et vision

                if(tableau[Math.floor(H + deca)]){
                    if( tableau[Math.floor(H + deca)][L] == 1){
                        if(tableau[Math.floor(H + deca)+1] && tableau[Math.floor(H + deca)+1][L-1] != undefined ){
                            tableau[Math.floor(H + deca)+1][L-1] = 1;
                        }
                        break;
                    }
                    else if(tableau[Math.floor(H + deca)][L] == 'P'){
                        return true;
                    }
                }
            }
            deca +=0.75;
        }

        // regard vers la droite
        deca = 0;
        for (let L = Lbase+1; L < tableau.length; L++) {
            for (let H = positionMonster[0]+1; H < tableau.length; H++) { //++ plus petit entre tableau.length et vision
                if(tableau[Math.floor(H + deca)]){
                    if( tableau[Math.floor(H + deca)][L] == 1){
                        if(tableau[Math.floor(H + deca)+1] && tableau[Math.floor(H + deca)+1][L+1] != undefined ){
                            tableau[Math.floor(H + deca)+1][L+1] = 1;
                        }
                        break;
                    }
                    else if(tableau[Math.floor(H + deca)][L] == 'P'){
                        return true;
                    }
                }
            }
            deca +=0.75;
        }

        return false;
    }

    detectionGauche(tableau){
        let positionMonster = this.GETposition();
        let Hbase = positionMonster[0];
        let deca = 0;

        // ligne principale
        for (let L = positionMonster[0]; L >= 0; L--) {

            if(tableau[Hbase][L] == 1){
                if(tableau[Hbase-1] && tableau[Hbase-1][L-1] != undefined ){
                    tableau[Hbase-1][L-1] = 1;
                }
                if(tableau[Hbase+1] && tableau[Hbase+1][L-1] != undefined){
                    tableau[Hbase+1][L-1] = 1;
                }
                break;
            }
            if(tableau[Hbase][L] == 'P'){
                return true;
            }
        }

        // regard vers le haut
        deca = 0;
        for (let H = Hbase-1; H >= 0; H--) {
            for (let L = positionMonster[1]-1; L >=0; L--) { //++ plus petit entre tableau.length et vision
                if(tableau[H] ){
                    if( tableau[H][Math.floor(L - deca)] == 1){
                        if(tableau[H-1] && tableau[H][Math.floor(L - deca)-1] != undefined ){
                            tableau[H-1][Math.floor(L - deca)-1] = 1;
                        }
                        break;
                    }
                    else if(tableau[H][Math.floor(L - deca)] == 'P'){
                        return true;
                    }
                }
            }
            deca +=0.75;
        }

        // regard vers le bas

        deca = 0;
        for (let H = Hbase+1; H < tableau.length; H++) {
            for (let L = positionMonster[1]-1; L >=0; L--) { //++ plus petit entre tableau.length et vision
                if(tableau[H] ){
                    if( tableau[H][Math.floor(L - deca)] == 1){
                        if(tableau[H+1] && tableau[H][Math.floor(L - deca)-1] != undefined ){
                            tableau[H+1][Math.floor(L - deca)-1] = 1;
                        }
                        break;
                    }
                    else if(tableau[H][Math.floor(L - deca)] == 'P'){
                        return true;
                    }
                }
            }
            deca +=0.75;
        }

        return false;
    }

    detectionHaut(tableau){
        
        let positionMonster = this.GETposition();
        let Lbase = positionMonster[1];
        let deca = 0;

        // colonne principale
        for (let H = positionMonster[0]-1; H >= 0; H--) {
            if(tableau[H][Lbase] == 1){
                if(tableau[H-1] && tableau[H-1][Lbase-1] != undefined ){
                    tableau[H-1][Lbase-1] = 1;
                }
                if(tableau[H-1] && tableau[H-1][Lbase+1] != undefined){
                    tableau[H-1][Lbase+1] = 1;
                }
                break;
            }
            
            if(tableau[H][Lbase] == 'P'){
                return true;
            }
        }
        
        // regard vers la gauche
        deca = 0;
        for (let L = Lbase-1; L >= 0; L--) {
            for (let H = positionMonster[0]-1; H >=0; H--) { //++ plus petit entre tableau.length et vision

                if(tableau[Math.floor(H - deca)]){
                    if( tableau[Math.floor(H - deca)][L] == 1){
                        if(tableau[Math.floor(H - deca)-1] && tableau[Math.floor(H - deca)-1][L-1] != undefined ){
                            tableau[Math.floor(H - deca)-1][L-1] = 1;
                        }
                        break;
                    }
                    else if(tableau[Math.floor(H - deca)][L] == 'P'){
                        return true;
                    }
                }
            }
            deca +=0.75;
        }

        // regard vers la droite
        deca = 0;
        for (let L = Lbase+1; L < tableau.length; L++) {
            for (let H = positionMonster[0]-1; H >=0; H--) { //++ plus petit entre tableau.length et vision
                if(tableau[Math.floor(H - deca)]){
                    if( tableau[Math.floor(H - deca)][L] == 1){
                        if(tableau[Math.floor(H - deca)-1] && tableau[Math.floor(H - deca)-1][L+1] != undefined ){
                            tableau[Math.floor(H - deca)-1][L+1] = 1;
                        }
                        break;
                    }
                    else if(tableau[Math.floor(H - deca)][L] == 'P'){
                        return true;
                    }
                }
            }
            deca +=0.75;
        }

        return false;
    }

    detectionDroite(tableau){
        let positionMonster = this.GETposition();
        let Hbase = positionMonster[0];
        let deca = 0;

        // ligne principale
        for (let L = positionMonster[0]; L < tableau[Hbase].length; L++) {
            if(tableau[Hbase][L] == 1){
                if(tableau[Hbase-1] && tableau[Hbase-1][L+1] != undefined ){
                    tableau[Hbase-1][L+1] = 1;
                }
                if(tableau[Hbase+1] && tableau[Hbase+1][L+1] != undefined){
                    tableau[Hbase+1][L+1] = 1;
                }
                break;
            }
            if(tableau[Hbase][L] == 'P'){
                return true;
            }
        }

        // regard vers le haut
        deca = 0;
        for (let H = Hbase-1; H >= 0; H--) {
            for (let L = positionMonster[1]+1; L < tableau[H].length; L++) { //++ plus petit entre tableau.length et vision
                if(tableau[H]){
                    if( tableau[H][Math.floor(L + deca)] == 1){
                        if(tableau[H-1] && tableau[H][Math.floor(L + deca)+1] != undefined ){
                            tableau[H-1][Math.floor(L + deca)+1] = 1;
                        }
                        break;
                    }
                    else if(tableau[H][Math.floor(L + deca)] == 'P'){
                        return true;
                    }
                    
                }
            }
            deca +=0.75;
        }

        // regard vers le bas
        deca = 0;
        for (let H = Hbase+1; H < tableau.length; H++) {
            for (let L = positionMonster[1]+1; L < tableau[H].length; L++) { //++ plus petit entre tableau.length et vision
                if(tableau[H] ){
                    if( tableau[H][Math.floor(L + deca)] == 1){
                        if(tableau[H+1] && tableau[H][Math.floor(L + deca)+1] != undefined ){
                            tableau[H+1][Math.floor(L + deca)+1] = 1;
                        }
                        break;
                    }
                    else if(tableau[H][Math.floor(L + deca)] == 'P'){
                        return true;
                    }
                }
            }
            deca +=0.75;
        }
        return false;
    }

}

export default CLASSmonster;
