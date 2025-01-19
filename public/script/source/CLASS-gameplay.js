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
        this.idMoveMaintenu = [];
        this.monsters = {};
        this.monsterPosition = [];
        this.equipments = [];
        this.consomables = [];
        this.props = {};
        this.propPosition = [];
        this.RESSOURCEmapTAB = {};
        this.RESSOURCEmapTiles = {};
        this.RESSOURCEmonster = {};
        this.RESSOURCEprops = {};
        this.RESSOURCEnotesMAJ = {};
        this.RESSOURCEequipments = {};
        this.RESSOURCEextra = [];
        this.idTableauInit = [8, 2];
        this.PosiPlayerInit = [3, 4];
        this.timeShowText = 40;
        this.idTableau = 0;
        this.waiting = false;
        this.dialogActivate = false;
        this.inventoryActivate = false;
        this.isMoveMaintenu = false;
        this.init();
    }

    // initialisation du jeu
    async init(){

        this.menu(1);
        await this.loader();
        this.map = new CLASSmap(this.idTableau);
        this.player = new CLASSplayer(this.PosiPlayerInit);

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

        loadingCount.innerText = '0/7';

        await this.DLmapTAB();
        loadingCount.innerText = '1/7';

        await this.DLmapTiles();
        loadingCount.innerText = '2/7';

        await this.DLmonsters();
        loadingCount.innerText = '3/7';

        await this.DLprops();
        loadingCount.innerText ='4/7';

        await this.DLequipments();
        loadingCount.innerText ='5/7';

        await this.DLextra();
        loadingCount.innerText ='6/7';

        await this.DLnotesMAJ();
        loadingCount.innerText ='7/7';
        this.AfficheMAJ();

        urls = [...urls, ...this.RESSOURCEextra];
        
        Object.keys(this.RESSOURCEequipments).forEach(id => {
            this.RESSOURCEequipments[id].forEach(equipement => {
                urls.push(equipement.img)
            });
        });

        Object.keys(this.RESSOURCEmapTiles).forEach(id => {
            urls.push(this.RESSOURCEmapTiles[id].img);
        });
        Object.keys(this.RESSOURCEprops).forEach(id => {
            urls.push(this.RESSOURCEprops[id].img);
        });
        Object.keys(this.RESSOURCEmonster).forEach(id => {
            for (let i = 0; i < this.RESSOURCEmonster[id].length; i++) {
                Object.keys(this.RESSOURCEmonster[id][i].img).forEach(idimg => {
                    urls.push(this.RESSOURCEmonster[id][i].img[idimg]);
                });
            }
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
        this.map = null;
        this.player = new CLASSplayer(this.PosiPlayerInit);
        this.initEquipments();
        this.map = new CLASSmap(this.idTableau);
        this.map.LETTRESSOURCEmapTAB(JSON.parse(JSON.stringify(this.RESSOURCEmapTAB)));
        this.map.LETTRESSOURCEmapTiles(JSON.parse(JSON.stringify(this.RESSOURCEmapTiles)));
        this.map.LETTRESSOURCEprops(JSON.parse(JSON.stringify(this.RESSOURCEprops)));
        this.map.createMap();
        this.map.LETtableau(this.idTableau);
        this.map.showTableau(true);
        this.initMonstersTab();
        this.initPropsTab();
        this.showInventory(true);
        this.move();
    }
    
    // telecharge la liste complète des tuiles de la carte
    async DLmapTiles(){
        return fetch('./public/script/source/mapTiles.json')
        .then(response => response.json())
        .then(data => this.RESSOURCEmapTiles = data)
        .catch(error => console.error('Erreur :', error));
    }

    // telecharge la carte
    async DLmapTAB(){
        return fetch('./public/script/source/quest-1.json')
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

    async DLequipments(){
        return fetch('./public/script/source/equipments.json')
        .then(response => response.json())
        .then(data => this.RESSOURCEequipments = data)
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

    // affichage du numero de version du jeu dans le footer
    AfficheMAJ(){
        let lastMAJ = Object.keys(this.RESSOURCEnotesMAJ)[0];
        document.getElementById('footer').innerHTML = "Version " + lastMAJ;
    }

    initEquipments(){
        this.equipments = [];

        this.RESSOURCEequipments.casques.forEach(equipment => {
            equipment.type="casque";
            this.equipments.push(equipment);
        });
        this.RESSOURCEequipments.armures.forEach(equipment => {
            equipment.type="armure";
            this.equipments.push(equipment);
        });
        this.RESSOURCEequipments.gants.forEach(equipment => {
            equipment.type="gant";
            this.equipments.push(equipment);
        });
        this.RESSOURCEequipments.bottes.forEach(equipment => {
            equipment.type="botte";
            this.equipments.push(equipment);
        });
        this.RESSOURCEequipments.armes.forEach(equipment => {
            equipment.type="arme";
            this.equipments.push(equipment);
        });

        this.consomables = [];
        this.RESSOURCEequipments.consomables.forEach(equipment => {
            equipment.type="consomable";
            this.consomables.push(equipment);
        });

        this.equipments = this.equipments.sort((a, b) => 0.5 - Math.random());
    }

    // fait placer tout les monstres dans le tableau
    initMonstersTab(){
        let GETmonsters = this.map.GETmonsters();
        if(GETmonsters){
            for (let i = 0; i < GETmonsters.length; i++) {
                let idMonster = this.idTableau[0] + '' + this.idTableau[1] + '' + GETmonsters[i].position[0] + '' + GETmonsters[i].position[1] + '' + GETmonsters[i].direction;
    
                if(!this.monsters[idMonster]){
                    this.monsters[idMonster] = new CLASSmonster(GETmonsters[i].position, GETmonsters[i].direction, idMonster);
                    let InfoMonster = this.GETmonster(GETmonsters[i]);
                    this.monsters[idMonster].POSTRESSOURCEmonster(InfoMonster);
                    if(GETmonsters[i].info){
                        this.monsters[idMonster].POSTinfo(GETmonsters[i].info);
                    }
                    if(GETmonsters[i].move){
                        this.monsters[idMonster].POSTmove(GETmonsters[i].move);
                    }
                }
            }
        }
    }

    GETmonster(InfoMonster){
        let RandLVL = Math.floor(Math.random()*InfoMonster.lvl.length);
        let lvl = InfoMonster.lvl[RandLVL];
        let RandMonster = Math.floor(Math.random()*this.RESSOURCEmonster[lvl].length);
        return this.RESSOURCEmonster[lvl][RandMonster]
    }

    // fait placer tout les props dans le tableau
    initPropsTab(){
        let GETProps = this.map.GETprops();
        if(GETProps){
            for (let i = 0; i < GETProps.length; i++) {
                let idProps = this.idTableau [0] + '' + this.idTableau[1] + '' + GETProps[i].position[0]+ '' + GETProps[i].position[1]+ '' + GETProps[i].type;

                if(!this.props[idProps]){
                    this.props[idProps] = new CLASSprop( idProps, GETProps[i].position, GETProps[i].info );
                    this.props[idProps].POSTRESSOURCEprops(this.RESSOURCEprops[GETProps[i].type]);

                    // si type coffre ou loot -> lui assigne un objet
                    if(this.props[idProps].GETtype() == 4 || this.props[idProps].GETtype() == 3){
                        this.props[idProps].SETobject(this.dropObject());
                    }
                }
            }
        }
    }

    dropObject(){
        let randomTypeObject = Math.floor(Math.random()*3);

        //type consomable
        if(randomTypeObject == 1){
            let randomConso = Math.floor(Math.random()*this.consomables.length);
            return this.consomables[randomConso];
        }
        
        //type equipement
        else{
            let equipement = this.equipments[0];
            this.equipments.shift();
            return equipement;
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
        document.getElementById('units').innerHTML= '';
        this.map.showTableau();
        this.player.unshowStats();
        this.unshowText();
    }

    // deplacement maintenu du personnage
    async moveMaintenu(direction, isDesactive = false){
        if (isDesactive == false){
            //clearInterval(this.idMoveMaintenu);
            this.idMoveMaintenu.forEach(id => {
                clearInterval(id);
            });
            this.idMoveMaintenu = [];
            this.isMoveMaintenu = false;
        }
        else if( this.idMoveMaintenu.length == 0){
            this.isMoveMaintenu = true;
            this.move(direction);
            setTimeout(() => {
                if(this.isMoveMaintenu){
                    this.idMoveMaintenu.push(setInterval(() => {
                        if(this.isMoveMaintenu){
                            this.move(direction);
                        }
                    }, 200));
                }
            }, 300);
        }
    }

    // deplacement du personnage
    async move(direction = null){
        if(this.waiting == false && this.inventoryActivate == false && this.dialogActivate == false){
            this.waiting = true;

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
                    this.transitionTableau(direction);
                    await this.awaitTransition(500);
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
                        if(this.monsters[touchUnite].isAgressif == true){
                            this.attackMonster(touchUnite);
                            this.dropLoot(touchUnite);
                        }
                        else{
                            this.speakMonster(touchUnite, direction);
                        }
                    }

                    // deplacement du joueur, si il n'est pas dans la limite ni si il touche un mur
                    else if(!testLimit && !this.touchWall(newPosition) && !this.touchProp(newPosition)){
                        this.player.POSTdeplacement(newPosition);
                        this.player.moveAffichage();
                    }
                }
            }

            // fait bouger tout les monstres
            await this.moveAllMonsters();

            // met à jour les props de la carte
            this.majProps();

            await this.awaitTransition(300);
            this.waiting = false

            this.player.updateJauges();

            if(this.player.active() == false){
                this.menu(5);
            }

            //++ optimisation : mis à jour de la physique du tableau ICI
            this.playerIsOnLoot();
        }
    }

    // fait parler le monstre
    speakMonster(idMonster, direction){
        this.monsters[idMonster].speaking(direction);
        this.showText(this.monsters[idMonster].GETSpeak());
    }

    dropLoot(idMonster){
        if(this.monsters[idMonster] && this.monsters[idMonster].active() === false){
            if(this.monsters[idMonster].dropLoot()){
                let item = this.dropObject();
                let position = this.monsters[idMonster].GETposition();
                this.dropItem(item, position);
            }
        }
    }

    playerIsOnLoot(){
        let posiPlayer = this.player.GETposition();
        if( this.propPosition[posiPlayer[0]] && this.propPosition[posiPlayer[0]][posiPlayer[1]]){
            
            let idProp = this.propPosition[posiPlayer[0]][posiPlayer[1]];

            if(this.props[idProp].GETtype() == 3){
                
                let info = this.props[idProp].activation(this.player.GETdirection());
                this.showText(info);
            }
        }
        return false;
    }

    showInventory(force = false){
        if(this.inventoryActivate == true || force){
            this.inventoryActivate = false;
        }
        else{
            this.inventoryActivate = true;
        }
        this.player.showInventory(force);
    }

    async transitionTableau(direction){
        let transitionAffichage = document.getElementById('transition');
        switch (direction) {
            
            // vers le bas
            case 0:
                
                transitionAffichage.style.left="0";
                transitionAffichage.style.top="100%";
                transitionAffichage.style.display="flex";
                await this.awaitTransition(100);
                transitionAffichage.style.top="0";
                await this.awaitTransition(500);
                transitionAffichage.style.top="-200%";
                await this.awaitTransition(100);
                transitionAffichage.style.display="none";
                break;

            // vers la gauche
            case 1:
                transitionAffichage.style.left="-100%";
                transitionAffichage.style.top="0";
                transitionAffichage.style.display="flex";
                await this.awaitTransition(100);
                transitionAffichage.style.left="0";
                await this.awaitTransition(500);
                transitionAffichage.style.left="100%";
                await this.awaitTransition(100);
                transitionAffichage.style.display="none";
                break;

            // vers le haut
            case 2:
                transitionAffichage.style.left="0";
                transitionAffichage.style.top="-200%";
                transitionAffichage.style.display="flex";
                await this.awaitTransition(100);
                transitionAffichage.style.top="0";
                await this.awaitTransition(500);
                transitionAffichage.style.top="100%";
                await this.awaitTransition(100);
                transitionAffichage.style.display="none";
                break;

            // vers la droite
            case 3:
                
                transitionAffichage.style.left="200%";
                transitionAffichage.style.top="0";
                transitionAffichage.style.display="flex";
                await this.awaitTransition(100);
                transitionAffichage.style.left="0";
                await this.awaitTransition(500);
                transitionAffichage.style.left="-200%";
                await this.awaitTransition(100);
                transitionAffichage.style.display="none";
                break;
           
        }
    }

    awaitTransition(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // déplacement de tout les monstres dans le tableau
    async moveAllMonsters(){

        Object.values(this.monsters).forEach(monster => {
            if (monster.id.startsWith(this.idTableau[0] + '' + this.idTableau[1])) {
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
                                if(touchUnite == 'player' && monster.isAgressif == true){
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
            if(prop.active() && prop.id.startsWith(this.idTableau[0]+''+this.idTableau[1])){
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
        return;
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

    // renvoie TRUE si la nouvelle position touche un prop
    touchProp(newPosition, id="player"){
        for (let H = 0; H < this.propPosition.length; H++) {
            if(this.propPosition[H]){
                for (let L = 0; L < this.propPosition[H].length; L++) {
                    if(this.propPosition[H][L]){
                        let posiProp = this.props[this.propPosition[H][L]].GETposition();
                        if(posiProp[0] == newPosition[0] && posiProp[1] == newPosition[1]){
                            if(id == "player"){
                                let info = this.props[this.propPosition[H][L]].activation(this.player.GETdirection());
                                
                                // prop de type panneau informatif
                                if(this.props[this.propPosition[H][L]].GETtype() == 1 && info){
                                    this.showText(info);
                                }
                                
                                // prop de type coffre
                                else if (this.props[this.propPosition[H][L]].GETtype() == 4 && info){
                                    this.showText(info);
                                }
                            }

                            // les mobs ne doivent pas se positionner sur un loot (sinon les loots peuvent s'ecraser)
                            if ( id != 'player' && this.props[this.propPosition[H][L]].GETtype() == 3){
                                return true;
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
        return false;
    }

    actionItemInventory(action, idItem = null){
        switch (action) {
            case 1:
                this.player.showItemInventory(idItem);
                break;
        
            case 2:
                this.player.unshowItemInventory();
                break;
                
            case 3:
                this.player.equipItemInventory(idItem);
                break;
            
            case 4:
                this.player.unequipItemInventory(idItem);
                break;
                
            case 5:
                this.player.useItemInventory(idItem);
                break;

            case 6:
                let item = this.player.getItemInventory(idItem);
                let position = this.player.GETposition();
                this.dropItem(item, position, idItem);
                this.player.unshowItemInventory();
                break;
        }

        if(this.player.active() == false){
            this.menu(5);
        }
    }
    
    dropItem(item, position, idItem = false){
        if( !this.propPosition[position[0]] || !(this.propPosition[position[0]] && this.propPosition[position[0]][position[1]])){
            let idProp = this.idTableau [0] + '' + this.idTableau[1] + '' + position[0]+ '' + position[1]+ 'L';
            if(!this.propPosition[position[0]]){
                this.propPosition[position[0]] = [];
            }
            this.propPosition[position[0]][position[1]] = idProp;
            this.props[idProp] = new CLASSprop(idProp, position);
            this.props[idProp].POSTRESSOURCEprops(this.RESSOURCEprops[2]);
            this.props[idProp].SETobject(item);
            this.props[idProp].propsAffichage();
            if(idItem !== false){
                this.player.dropItemInventory(idItem);
            }
        }
    }

    // choix à faire dans une boite de dialogue
    dialogChoice(type, idProp){
        switch (type) {

            // prendre l'objet du prop
            case 1:
                if(this.player.asPlaceInInventory() > 0){
                    let object = this.props[idProp].GETcontent();
                    this.player.insertItemInInventory(object);
                    this.PropChangeEtat(idProp);
                }

                this.unshowText();
                break;
        
            // ferme la boite de dialogue
            default:
                this.unshowText();
                break;
        }
    }

    PropChangeEtat(idProp){
        if(this.props[idProp]){
            let idAfter = this.props[idProp].GETafter();
            if(idAfter != false){
                let nextProp = this.RESSOURCEprops[idAfter];
                this.props[idProp].POSTRESSOURCEprops(nextProp);
                this.props[idProp].propsAffichage();
            }

            if(this.props[idProp].GETtype() == 3){
                let posiProp = this.props[idProp].GETposition();
                this.props[idProp].propDepop();

                if(this.propPosition[posiProp[0]] && this.propPosition[posiProp[0]][posiProp[1]]){
                    this.propPosition[posiProp[0]][posiProp[1]] = null;
                }
                delete this.props[idProp];
            }
        }
    }

    // affiche le texte dans la boite de dialogue
    showText(text){

        if(text){
            this.dialogActivate = true;
            let letterPosition = 0;
            let dialogText = document.getElementById('dialog-text');
            let dialogChoices = document.getElementById('dialog-choices');
            document.getElementById('ensemble-dialog').style.display = 'flex';
            
            const interval = setInterval(() => {
                dialogText.innerHTML += text.dialog[letterPosition ++].replace(/\n/g, "<br>");
    
                // bouton de choix, lors de la fin d'un dialogue
                if (letterPosition >= text.dialog.length) {
                    for (let i = 0; i < text.buttons.length; i++) {
                        let idProp = 0;
                        if(text.buttons[i].idProp){
                            idProp = text.buttons[i].idProp;
                        }
                        dialogChoices.innerHTML += '<button onclick="dialogChoice('+text.buttons[i].type+',\''+idProp+'\')">'+text.buttons[i].name+'</button>'
                    }
                    clearInterval(interval);
                }
            }, this.timeShowText);
        }
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
        let precisionPOUR100 = this.player.precision();
        let esquive = this.monsters[idMonster].esquive(precisionPOUR100);
        let esquiveDirection = false;
        if(esquive){
            esquiveDirection = this.tryEsquive(idMonster);
        }
        
        if(esquiveDirection == false){
            this.monsters[idMonster].impact(degats, this.player.GETdirection());
        }
        else{
            let oldPosition = this.monsters[idMonster].GETposition();
            let newPosition = this.monsters[idMonster].GETnewPosition(esquiveDirection);
            this.monsters[idMonster].POSTdeplacement(newPosition);
            this.monsters[idMonster].moveAffichage();

            this.monsterPosition[oldPosition[0]][oldPosition[1]] = null;
            if(!this.monsterPosition[newPosition[0]]){
                this.monsterPosition[newPosition[0]] = [];
            }
            this.monsterPosition[newPosition[0]][newPosition[1]] = idMonster;
        }
    }

    attackPlayer(idMonster){
        let degats = this.monsters[idMonster].attack();
        let precisionPOUR100 = this.monsters[idMonster].precision();
        let esquive = this.player.esquive(precisionPOUR100);
        let esquiveDirection = false;
        if(esquive){
            esquiveDirection = this.tryEsquive();
        }
        
        if(esquiveDirection === false){
            this.player.impact(degats, this.monsters[idMonster].GETdirection());
        }
        else{
            let newPosition = this.player.GETnewPosition(esquiveDirection);
            this.player.POSTdeplacement(newPosition);
            this.player.moveAffichage();
        }
    }

    tryEsquive(idMonster = null){
        let limit = false;
        let position = [0, 0];
        let directionPossible = [];
        let esquiveDirection = false;

        if(idMonster){
            position = this.monsters[idMonster].GETposition();
            limit = true;
        }
        else{
            position = this.player.GETposition();
        }

        let NewPosi0 = [position[0]+1, position[1]];
        let NewPosi1 = [position[0], position[1]-1];
        let NewPosi2 = [position[0]-1, position[1]];
        let NewPosi3 = [position[0], position[1]+1];

        if(this.touchProp(NewPosi0, idMonster) == false && this.touchWall(NewPosi0) == false && this.touchUnite(NewPosi0) == false){
            directionPossible.push(0);
        }
        if(this.touchProp(NewPosi1, idMonster) == false && this.touchWall(NewPosi1) == false && this.touchUnite(NewPosi1) == false){
            directionPossible.push(1);
        }
        if(this.touchProp(NewPosi2, idMonster) == false && this.touchWall(NewPosi2) == false && this.touchUnite(NewPosi2) == false){
            directionPossible.push(2);
        }
        if(this.touchProp(NewPosi3, idMonster) == false && this.touchWall(NewPosi3) == false && this.touchUnite(NewPosi3) == false){
            directionPossible.push(3);
        }

        if(directionPossible.length > 0){
            esquiveDirection = directionPossible[Math.floor(Math.random() * directionPossible.length)];
        }

        return esquiveDirection;
    }

    showMenu(show){

        if (show == true){
            this.ensembleMenuAffichage.style.display='flex';
            setTimeout(() => { 
                this.ensembleMenuAffichage.style.opacity='1';
            }, 200);
        }

        else if(show == false){
            this.ensembleMenuAffichage.style.opacity='0';
            setTimeout(() => { 
                this.ensembleMenuAffichage.style.display='none';
            }, 500);
            
        }
    }

    menu(etat){
        this.moveMaintenu(0);
        switch (etat) {

            // loader 
            case 1:
                this.menuAffichage.innerHTML = "<p id='text-loading'>Chargement <b id='loading-count'></b></p>";
                this.showMenu(true);
                break;

            // menu principal
            case 2:
                this.menuAffichage.innerHTML = "<h1><img src='./public/assets/gamelogo.png'></h1><button class='button' onclick='menu(3)'>Nouvelle partie</button> <button class='button' onclick='menu(7)'>Notes de mise à jour</button>";
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
                this.menuAffichage.innerHTML = "<h1>GAME OVER</h1><button class='button' onclick='menu(2)'>Recommencer</button>";
                
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
                this.menuAffichage.innerHTML = "<h1 id='notes-title'>NOTES DE MISE À JOUR</h1>"+notes+"<button class='button' onclick='menu(2)'>Retour</button>";
                
                this.showMenu(true);
                break;
                
            // relance la partie mis en pause
            default:
                break;
        }
    }
}

export default CLASSgameplay;
