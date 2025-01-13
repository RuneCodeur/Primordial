// gestion de base d'une unité (monstre, joueur, etc...)
class CLASSunit {
    constructor(position) {
        this.moveControl = true;
        this.position = position;
        this.direction = 0;
        this.directionPrec = 0;
        this.id = '';
        this.name = '';
        this.isLooted = false;

        this.PV = 5;    // nombre de point de vie
        this.PVmax = 5; // nombre de point de vie maximum
        this.PM = 0;    // nombre de point de mana
        this.PMmax = 0; // nombre de point de mana maximum
        this.vision = 5 // nombre de case de perception
        this.FOR = 0;   // force. degats de base
        this.ADR = 0;   // adresse. chance d'esquive (calcul selon les niveaux + adresse)
        this.INT = 0;   // intelligence. augmente les degats magique
        this.ARMO = 0;  // armure. reduit les degats reçus (en % arrondi au superieur)
        this.XP = 0;    // points d'experience qui rapporte ou obtenu (selon si joueur ou monstre ) si 100 -> LVLup. multiplicateur selon la difference de niveau.
        this.LVL = 1;   // niveau de l'unité. 

        this.assets = {
            0: '',
            1 : '',
            2 : '',
            3 : ''
        }
    }

    // retourne la position de l'unité
    GETposition(){
        return this.position;
    }

    // retourne la direction de l'unité
    GETdirection(){
        return this.direction;
    }
    
    // renvoie TRUE si le joueur peux controler son perso
    GETmoveControl(){
        return this.moveControl;
    }

    // retourne la nouvelle position (potentielle) de l'unité
    GETnewPosition(direction){
        let newPosi = this.position;
        switch (direction) {

            // vers le bas
            case 0:
                newPosi = [(this.position[0]+1), (this.position[1])];
                break;

            // vers la gauche
            case 1:
                newPosi = [(this.position[0]), (this.position[1]-1)];
                break;

            // vers le haut
            case 2:
                newPosi = [(this.position[0]-1), (this.position[1])];
                break;

            // vers la droite
            case 3: 
                newPosi = [(this.position[0]), (this.position[1]+1)];
                break;
        }
        return newPosi;
    }

    // change la direction de l'unité
    POSTdirection(direction){
        this.direction = direction;
    }

    // déplace l'unité à sa nouvelle position
    POSTdeplacement(newPosi){
        this.position = newPosi;
    }

    // modifie la direction de l'unité
    directionAffichage(){
        if(!document.getElementById('unit-'+this.id)){
            this.unitAffichage();
        }else{
            document.getElementById('unit-'+this.id+'-img').src ='./public/assets/'+this.assets[this.direction];
        }
    } 

    // modifie la position de l'unité
    moveAffichage(){
        if(document.getElementById("unit-"+this.id) == null){
            this.unitAffichage();
        }else{
            document.getElementById('unit-'+this.id).style.zIndex = this.position[0];
            document.getElementById('unit-'+this.id).style.top = this.position[0]*64 + 'px';
            document.getElementById('unit-'+this.id).style.left = this.position[1]*64 + 'px';
        }
    }

    // affiche l'unité
    unitAffichage(){
        let unit = '<div id="unit-'+this.id+'"  style="z-index:'+this.position[0]+';top:'+(this.position[0]*64) +'px; left:'+(this.position[1]*64) +'px;" ><img id="unit-'+this.id+'-img" src="./public/assets/'+this.assets[this.direction] +'"></div>';
        document.getElementById('units').insertAdjacentHTML('beforeend', unit);
    }

    unitDepop(){
        let afficheUnit = document.getElementById('unit-'+this.id);
        if(afficheUnit){
            afficheUnit.remove();
        }
    }

    dropLoot(){
        if(this.isLooted == false){
            this.isLooted = true;
            let drop = Math.round(Math.random()*3);
            if(drop == 1){
                return false;
            }else{
                return true;
            }
        }
        else{
            return false;
        }
    }

    // test si l'unité ne sort pas des limites du jeu. retourne TRUE si conflict 
    testLimit(newPosi){
        if(newPosi[0] >= window.TABhauteur || newPosi[0] < 0 || newPosi[1] >= window.TABlargeur || newPosi[1] < 0){
            return true;
        }else{
            return false;
        }
    }

    // l'unité attaque
    attack(FOR = this.FOR){
        return FOR;
    }

    // l'unité meurt
    dead(){
        document.getElementById('unit-'+this.id).remove();
    }

    // retourne si l'unité est encore vivante ou pas
    active(){
        if(this.PV <= 0){
            return false;
        }
        return true
    }

    // subit les degats
    impact(degats, direction, ARMO = this.ARMO){

        // si attaque dans le dos -> degats X2
        if(direction == this.GETdirection()){
            degats = degats*2;
        }
        let newDirection = 0;
        switch (direction) {
            case 0:
                newDirection = 2;
                break;
            case 1:
                newDirection = 3;
                break;
            case 2:
                newDirection = 0;
                break;
            case 3:
                newDirection = 1;
                break;
        }
        this.POSTdirection(newDirection);
        this.directionAffichage();

        this.PV -= Math.max((degats - ARMO), 1);
        if(this.PV < 0){
            this.PV = 0;
        }

        this.impactAffichage();
    }

    //esquive
    esquive(precisionPOUR100, ADR = this.ADR){
        let esquivePOUR100 = Math.max(Math.min(ADR*5, 80), 5); 
        
        esquivePOUR100 = Math.max((esquivePOUR100 - precisionPOUR100), 5);

        let esquiveRANDOM = Math.floor(Math.random()*100);
        
        if(esquiveRANDOM <= esquivePOUR100){
            return true;
        }
        else{
            return false;
        }
    }

    //precision
    precision(ADR = this.ADR){
        let precisionPOUR100 = Math.max(Math.min(ADR*5, 80), 5);
        return precisionPOUR100;
    }

    // effet visuel sur l'impact lors des degats
    async impactAffichage(){
        document.getElementById('unit-'+this.id+'-img').style.filter = 'grayscale(100%) brightness(0.7) sepia(1) hue-rotate(-50deg) saturate(1000%)';
        setTimeout(() => {
            if(document.getElementById('unit-'+this.id+'-img')){
                document.getElementById('unit-'+this.id+'-img').style.filter = 'none';
                if(this.PV <= 0){
                    this.dead();
                }
            }
        }, 800); 

    }

}

export default CLASSunit;
