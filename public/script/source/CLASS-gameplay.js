import CLASScreation from './CLASS-creation.js';
import CLASSmap from './CLASS-map.js';
import CLASSmonster from './CLASS-monster.js';
import CLASSprop from './CLASS-prop.js';
import CLASSobject from './CLASS-object.js';
import CLASSplayer from './CLASS-player.js';

// gestion principale du gameplay
class CLASSgameplay {
    constructor(URLscore) {
        this.URLscore = URLscore;
        this.ensembleMenuAffichage = document.getElementById('ensemble-menu');
        this.menuAffichage = document.getElementById('menu');
        this.player = null;
        this.map = null;
        this.monsters = {};
        this.monsterPosition = [];
        this.props = {};
        this.propPosition = [];
        this.RESSOURCEmapTAB = {};
        this.RESSOURCEmapTiles = {};
        this.RESSOURCEmonster = {};
        this.RESSOURCEprops = {};
        this.RESSOURCEnotesMAJ = {};
        this.RESSOURCEextra = [];
        this.idTableauInit = [2, 1];
        this.idTableau = 0;
        this.waiting = false;
        this.dialogActivate = false;
        this.init();
    }

    // initialisation du jeu
    async init(){

        this.menu(1);
        await this.loader();
        this.map = new CLASSmap(this.idTableau);
        this.player = new CLASSplayer();

        this.map.LETTRESSOURCEmapTAB(this.RESSOURCEmapTAB);
        this.map.LETTRESSOURCEmapTiles(this.RESSOURCEmapTiles);
        this.map.LETTRESSOURCEprops(this.RESSOURCEprops);
        this.menu(2);
    }

    async loader(){
        let urls = [];
        let loadedImages = 0;
        let loadingCount = document.getElementById('loading-count');
        let loadingGroup = document.getElementById('loader');

        loadingCount.innerText = '0/6';

        await this.DLmapTAB();
        loadingCount.innerText = '1/6';

        await this.DLmapTiles();
        loadingCount.innerText = '2/6';

        await this.DLmonsters();
        loadingCount.innerText = '3/6';

        await this.DLprops();
        loadingCount.innerText ='4/6';

        await this.DLextra();
        loadingCount.innerText ='5/6';

        await this.DLnotesMAJ();
        loadingCount.innerText ='6/6';

        urls = [...urls, ...this.RESSOURCEextra];

        Object.keys(this.RESSOURCEmapTiles).forEach(id => {
            urls.push(this.RESSOURCEmapTiles[id].img);
        });
        Object.keys(this.RESSOURCEprops).forEach(id => {
            urls.push(this.RESSOURCEprops[id].img);
        });
        Object.keys(this.RESSOURCEmonster).forEach(id => {
            Object.keys(this.RESSOURCEmonster[id].img).forEach(idimg => {
                urls.push(this.RESSOURCEmonster[id].img[idimg]);
            });
        });

        urls.forEach((url) => {
            loadingGroup.insertAdjacentHTML('beforeend', '<img src="./public/assets/'+url+'">');
        });
        
        loadingCount.innerText ='0/'+urls.length;
        return new Promise((resolve) => {
            
            loadingGroup.querySelectorAll('img').forEach((img) => {
                img.addEventListener('load', () => {
                loadedImages++; 
                loadingCount.innerText = loadedImages + '/' + urls.length;
                
                // toutes les images sont chargées
                if (loadedImages === urls.length) {
                    resolve(true);
                }
                });
            
                img.addEventListener('error', () => {
                    //console.error(`Erreur lors du chargement de l'image : ${img.src}`);
                });
            });
            
          });
        
    }

    start(){
        this.monsters = {};
        this.monsterPosition = [];
        this.props = {};
        this.propPosition = [];
        this.idTableau = this.idTableauInit;
        this.player = null;
        this.player = new CLASSplayer();
        this.map.createMap();
        this.map.LETTtableau(this.idTableau);
        this.map.showTableau(true);
        this.initMonstersTab();
        this.initPropsTab();
        this.move();
    }
    
    // telecharge la liste complète des tuiles de la carte
    async DLmapTiles(){
        return fetch('./public/script/source/mapTiles.json')
        .then(response => response.json())
        .then(data => this.RESSOURCEmapTiles = data)
        .catch(error => console.error('Erreur :', error));
    }

    // telecharge la liste complète des tuiles de la carte
    async DLmapTAB(){
        return fetch('./public/script/source/mapTAB.json')
        .then(response => response.json())
        .then(data => this.RESSOURCEmapTAB = data)
        .catch(error => console.error('Erreur :', error));
    }
    
    // telecharge la liste complète des monstres
    async DLmonsters(){
        return fetch('./public/script/source/monsters.json')
        .then(response => response.json())
        .then(data => this.RESSOURCEmonster = data)
        .catch(error => console.error('Erreur :', error));
    }
    
    // telecharge la liste complète des props
    async DLprops(){
        return fetch('./public/script/source/props.json')
        .then(response => response.json())
        .then(data => this.RESSOURCEprops = data)
        .catch(error => console.error('Erreur :', error));
    }

    // telecharge les images bonus
    async DLextra(){
        return fetch('./public/script/source/extra.json')
        .then(response => response.json())
        .then(data => this.RESSOURCEextra = data)
        .catch(error => console.error('Erreur :', error));
    }
    
    // telecharge les notes de maj
    async DLnotesMAJ(){
        return fetch('./public/script/source/notesMAJ.json')
        .then(response => response.json())
        .then(data => this.RESSOURCEnotesMAJ = data)
        .catch(error => console.error('Erreur :', error));
    }

    // fait placer tout les monstres dans le tableau
    initMonstersTab(){
        let GETmonsters = this.map.GETmonsters();
        if(GETmonsters){
            for (let i = 0; i < GETmonsters.length; i++) {
                let idMonster = this.idTableau + '' + GETmonsters[i].position[0]+ '' + GETmonsters[i].position[1]+ '' + GETmonsters[i].type;
    
                if(!this.monsters[idMonster]){
                    this.monsters[idMonster] = new CLASSmonster(GETmonsters[i].position, GETmonsters[i].direction, idMonster);
                    this.monsters[idMonster].POSTRESSOURCEmonster(this.RESSOURCEmonster[GETmonsters[i].type]);
                }
            }
        }
    }

    // fait placer tout les props dans le tableau
    initPropsTab(){
        let GETProps = this.map.GETprops();
        if(GETProps){
            for (let i = 0; i < GETProps.length; i++) {
                let idProps = this.idTableau + '' + GETProps[i].position[0]+ '' + GETProps[i].position[1]+ '' + GETProps[i].type;
    
                if(!this.props[idProps]){
                    this.props[idProps] = new CLASSprop( idProps, GETProps[i].position, GETProps[i].info);
                    this.props[idProps].POSTRESSOURCEprops(this.RESSOURCEprops[GETProps[i].type]);
                }
            }
        }
    }

    // fait depop tout les props présent dans le tableau
    depopProps(){
        for (let H = 0; H < this.propPosition.length; H++) {
            if(this.propPosition[H]){
                for (let L = 0; L < this.propPosition[H].length; L++) {
                    if(this.propPosition[H][L]){
                        let idProps = this.propPosition[H][L];
                        this.props[idProps].propDepop();
                        this.propPosition[H][L] = null;
                    }
                }
            }
        }
    }

    // fait depop tout les monstres présent dans le tableau (selon monsterPosition)
    depopMonster(){
        for (let H = 0; H < this.monsterPosition.length; H++) {
            if(this.monsterPosition[H]){
                for (let L = 0; L < this.monsterPosition[H].length; L++) {
                    if(this.monsterPosition[H][L]){
                        let idMonster = this.monsterPosition[H][L];
                        this.monsters[idMonster].unitDepop();
                        this.monsterPosition[H][L] = null;
                    }
                }
            }
        }
    }

    clearMap(){
        document.getElementById('props').innerHTML= '';
        document.getElementById('units').innerHTML= '';
        this.map.showTableau();
        this.player.unshowStats();
        this.unshowText();
    }

    //deplacement du personnage
    async move(direction = null){
        if(this.waiting == false){
            this.waiting = true

            if(direction === null){
                this.player.moveAffichage();
            }else{
                // choppe la nouvelle position du joueur
                let newPosition = this.player.GETnewPosition(direction);

                // rotation du joueur
                if(direction != this.player.GETdirection()){
                    this.player.POSTdirection(direction);
                    this.player.directionAffichage();
                }

                let testLimit = this.player.testLimit(newPosition);

                //le joueur se déplace vers un autre tableau
                if(testLimit){

                    // fait dépop les monstres
                    this.depopMonster();
                    this.depopProps();

                    // fonction qui transitionne vers le nouveau tableau, si nouveau tableau
                    let idTableau = this.map.deplaceTAB(this.player.GETdirection());
                    if( idTableau != this.idTableau){
                        this.idTableau = idTableau;
                        this.player.deplaceTAB();
                    }

                    //récupère les monstres 
                    this.initMonstersTab();

                    //récupère les props
                    this.initPropsTab();
                }
                
                // le joueur reste sur le tableau
                else{

                    // esce que la position du joueur cogne une autre unité ?
                    let touchUnite = this.touchUnite(newPosition);
                    if(touchUnite != false){
                        this.attackMonster(touchUnite);
                    }

                    // deplacement du joueur, si il n'est pas dans la limite ni si il touche un mur
                    else if(!testLimit && !this.touchWall(newPosition) && !this.touchProp(newPosition)){
                        this.player.POSTdeplacement(newPosition);
                        this.player.moveAffichage();
                    }
                }

            }

            if(this.dialogActivate == false){

                // fait bouger tout les monstres
                await this.moveAllMonsters();

                // met à jour les props de la carte
                this.majProps();

                // met à jour les stats du joueur

                this.waiting = false
            }
            this.player.updateStats();

            if(this.player.active() == false){
                this.menu(5);
            }
        }
    }

    // déplacement de tout les monstres dans le tableau
    async moveAllMonsters(){

        Object.values(this.monsters).forEach(monster => {
            if (monster.id.startsWith(this.idTableau)) {
                if(monster.active()){
                    let direction = null;

                    let monsterPosition = monster.GETposition();
                    if(!this.monsterPosition[monsterPosition[0]]){
                        this.monsterPosition[monsterPosition[0]] = [];
                    }

                    // si le monstre est déja présent, le fait bouger
                    if(this.monsterPosition[monsterPosition[0]][monsterPosition[1]]){
                        direction = monster.comportement(this.player.GETposition(),this.monsterPosition, this.map.GETphysics(true));

                        // rotation du monstre
                        if(direction != null){

                            let newPosition = monster.GETnewPosition(direction);
                            if(direction != monster.GETdirection()){
                                monster.POSTdirection(direction);
                                monster.directionAffichage();
                            }
    
                            // esce que la position du monstre cogne une autre unité ?
                            let touchUnite = this.touchUnite(newPosition);
                            if(touchUnite != false){
                                if(touchUnite == 'player'){
                                    this.attackPlayer(monster.id);
                                }
                            }
                            // deplacement du monstre si il n'est pas dans la limite ni si il touche un mur, ni si il touche une prop qu'il ne peux pas toucher
                            else if(!monster.testLimit(newPosition) && !this.touchWall(newPosition)&& !this.touchProp(newPosition, monster.id)){
                                monster.POSTdeplacement(newPosition);
                                monster.moveAffichage();
                            }
                        }

                        this.monsterPosition[monsterPosition[0]][monsterPosition[1]] = null;
                    }else{
                        monster.moveAffichage();
                    }
                    
                    monsterPosition = monster.GETposition();
                    if(!this.monsterPosition[monsterPosition[0]]){
                        this.monsterPosition[monsterPosition[0]] = [];
                    }
                    this.monsterPosition[monsterPosition[0]][monsterPosition[1]] = monster.id;
                }
            }
          });
          return;
    }

    majProps(){
        Object.values(this.props).forEach(prop => {
            if(prop.active() && prop.id.startsWith(this.idTableau)){
                let propPosition = prop.GETposition();
                if(!this.propPosition[propPosition[0]]){
                    this.propPosition[propPosition[0]] = [];
                }

                if(this.propPosition[propPosition[0]][propPosition[1]]){
                    // le prop fait des trucs tout seul
                }else{
                    this.propPosition[propPosition[0]][propPosition[1]] = prop.id;
                    prop.propsAffichage();
                }
            }
        })
        return
    }

    // renvoie TRUE si la nouvelle position touche un mur
    touchWall(newPosition){
        let physicMap = this.map.GETphysics();

        let physic = physicMap[newPosition[0]][newPosition[1]];
        switch (physic) {

            // sol simple
            case 0: 
                return false;
                break;

            // mur simple
            default:
                return true;
                break;
        }
    }

    // renvoie TRUE si la nouvelle position touche un mur
    touchProp(newPosition, id="player"){
        for (let H = 0; H < this.propPosition.length; H++) {
            if(this.propPosition[H]){
                for (let L = 0; L < this.propPosition[H].length; L++) {
                    if(this.propPosition[H][L]){
                        let posiProp = this.props[this.propPosition[H][L]].GETposition();
                        if(posiProp[0] == newPosition[0] && posiProp[1] == newPosition[1]){
                            if(id == "player"){
                                let info = this.props[this.propPosition[H][L]].activation(this.player.GETdirection());
                                if(this.props[this.propPosition[H][L]].GETtype() == 1 && info){
                                    this.showText(info);
                                }
                            }

                            if(this.props[this.propPosition[H][L]].GETisWall()){
                                return true;
                            }else{
                                return false;
                            }
                        }
                    }
                }
            }
        }
        return false
    }
    
    // choix à faire dans une boite de dialogue
    dialogChoice(type){
        switch (type) {

            // magasin
            case 1:
                break;
        
            // ferme la boite de dialogue
            default:
                this.unshowText();
                break;
        }
    }

    // affiche le texte dans la boite de dialogue
    showText(text){
        this.dialogActivate = true;
        let letterPosition = 0;
        let dialogText = document.getElementById('dialog-text');
        let dialogChoices = document.getElementById('dialog-choices');
        document.getElementById('ensemble-dialog').style.display = 'flex';
        
        const interval = setInterval(() => {
            dialogText.innerHTML += text.dialog[letterPosition ++];

            // bouton de choix, lors de la fin d'un dialogue
            if (letterPosition >= text.dialog.length) {
                for (let i = 0; i < text.buttons.length; i++) {
                    dialogChoices.innerHTML += '<button onclick="dialogChoice('+text.buttons[i].type+')">'+text.buttons[i].name+'</button>'
                }
                clearInterval(interval);
            }
        }, 25);
    }

    // masque la boite de dialogue
    unshowText(){
        this.dialogActivate = false;
        this.waiting = false;
        
        document.getElementById('dialog-text').innerHTML = '';
        document.getElementById('dialog-choices').innerHTML = '';
        document.getElementById('ensemble-dialog').style.display = 'none';
    }


    // renvoie TRUE si la nouvelle position touche une unité
    touchUnite(newPosition){
        let playerPosition = this.player.GETposition();
        if(this.monsterPosition[newPosition[0]] && this.monsterPosition[newPosition[0]][newPosition[1]] && this.monsters[this.monsterPosition[newPosition[0]][newPosition[1]]].active()){
            return this.monsterPosition[newPosition[0]][newPosition[1]];
        }
        else if(playerPosition[0] == newPosition[0] && playerPosition[1] == newPosition[1]){
            return 'player';
        }
        return false;
    }

    attackMonster(idMonster){
        let degats = this.player.attack();
        this.monsters[idMonster].impact(degats, this.player.GETdirection());
    }

    attackPlayer(idMonster){
        let degats = this.monsters[idMonster].attack();
        this.player.impact(degats, this.monsters[idMonster].GETdirection());
    }

    showMenu(show){

        if (show == true){
            this.ensembleMenuAffichage.style.display='flex';
            setTimeout(() => { 
                this.ensembleMenuAffichage.style.opacity='1';
            }, 200);

        }else if(show == false){
            this.ensembleMenuAffichage.style.opacity='0';
            setTimeout(() => { 
                this.ensembleMenuAffichage.style.display='none';
            }, 500);
            
        }
    }

    menu(etat){
        switch (etat) {

            // loader 
            case 1:
                this.menuAffichage.innerHTML = "<p id='text-loading'>Chargement <b id='loading-count'></b></p>";
                this.showMenu(true);
                break;

            // menu principal
            case 2:
                this.menuAffichage.innerHTML = "<h1><img src='./public/assets/gamelogo.png'></h1><button onclick='menu(3)'>Nouvelle partie</button> <button onclick='menu(7)'>Notes de mise à jour</button>";
                this.clearMap();
                this.showMenu(true);
                break;

            // nouvelle partie
            case 3:
                /*
                    creation du personnage
                    nom du personnage
                    commencer mon aventure
                */
               this.start();
                this.showMenu(false);
                break;

            // pause
            case 4:
                /*
                    continuer
                    nouvelle partie
                    option
                */
                break;

            // game over
            case 5:
                this.menuAffichage.innerHTML = "<h1>GAME OVER</h1><button onclick='menu(2)'>Recommencer</button>";
                
                this.showMenu(true);
                break;

            // option
            case 6:
                /*
                    réglage de la musique
                    retour
                */
                break;

            // notes de maj
            case 7:
                let notes = "<ul id='notes'>";
                Object.keys(this.RESSOURCEnotesMAJ).forEach(MAJ => {

                    notes += "<li class='maj'>"+MAJ+"</li>";

                    this.RESSOURCEnotesMAJ[MAJ].forEach(note => {
                        notes += "<li>"+note+"</li>";
                    });
                });

                notes += "</ul>";
                this.menuAffichage.innerHTML = "<h1 id='notes-title'>NOTES DE MISE À JOUR</h1>"+notes+"<button onclick='menu(2)'>RETOUR</button>";
                
                this.showMenu(true);
                break;
                
            // relance la partie mis en pause
            default:
                break;
        }
    }
}

export default CLASSgameplay;
