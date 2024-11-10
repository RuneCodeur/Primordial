import CLASSunit from './CLASS-unit.js';

// gestion du personnage joueur
class CLASSplayer extends CLASSunit {
    constructor() {
        super([5, 5]);
        this.PV = 10;
        this.PVmax = 10;
        this.PM = 10;
        this.PMmax = 10;
        this.FOR = 3;
        this.ADR = 1;
        this.INT = 1;
        this.ARMO = 0;
        this.XP = 0;
        this.LVL = 1;
        this.id = 'player';
        this.equipment = {
            'tete' : null,
            'torse' : null,
            'pied' : null,
            'main' : null,
            'arme' : null,
        };
        this.lengthItems = 28;
        this.items = []
        this.assets = {
            0 : 'base-face.png',
            1 : 'base-gauche.png',
            2 : 'base-dos.png',
            3 : 'base-droite.png'
        }
    }
    
    deplaceTAB(){
        let position  = this.GETposition();
        let direction  = this.GETdirection();

        switch (direction) {
            // vers le bas
            case 0:
                this.POSTdeplacement([0, position[1]]);
                break;
                
            // vers la gauche
            case 1:
                this.POSTdeplacement([position[0], window.TABlargeur-1]);
                break;
            
            // vers le haut
            case 2:
                this.POSTdeplacement([window.TABhauteur-1, position[1]]);
                break;
                
            // vers la droite
            case 3:
                this.POSTdeplacement([position[0], 0]);
                break;
        
        }
        this.moveAffichage();
    }
    
    updateStats(){
        if(document.getElementById('stat-PV')){
            this.updatePV();
        }
        if(document.getElementById('stat-PM')){
            this.updatePM();
        }
        let stats = '';
        stats += '<div> <p>LEVEL:</p> <p>'+ this.LVL +'</p> </div>';
        stats += '<div> <p>EXP:</p> <p>'+ this.XP +'/100</p> </div>';
        stats += '<div> <p>FORCE:</p> <p>'+ this.FOR +'</p> </div>';
        stats += '<div> <p>ADRESSE:</p> <p>'+ this.ADR +'</p> </div>';
        stats += '<div> <p>INTELLIGENCE:</p> <p>'+ this.INT +'</p> </div>';
        stats += '<div> <p>ARMURE:</p> <p>'+ this.ARMO +'</p> </div>';
        
        document.getElementById('inventory-stats').innerHTML = stats;
    }

    updateEquipment(){
        let equipments = '';

        // tete
        equipments += "<button><img src='./public/assets/empty-head.png'></button>"

        // torse
        equipments += "<button><img src='./public/assets/empty-torso.png'></button>"

        // main
        equipments += "<button><img src='./public/assets/empty-hand.png'></button>"

        // pied 
        equipments += "<button><img src='./public/assets/empty-feet.png'></button>"

        //arme
        equipments += "<button><img src='./public/assets/sword-1.png'></button>"
        
        document.getElementById('equipments').innerHTML = equipments;
    }

    updateItems(){

        let content = '';

        for (let i = 0; i < this.lengthItems; i++) {
            
            content += "<button></button>";
        }
        
        document.getElementById('inventory-content').innerHTML = content;
    }

    unshowStats(){
        if(document.getElementById('stat-PV')){
            document.getElementById('stat-PV').style.display = 'none';
        }
        if(document.getElementById('stat-PM')){
            document.getElementById('stat-PM').style.display = 'none';
        }
    }

    updatePV(){
        if(document.getElementById('stat-PV').style.display == 'none'){
            document.getElementById('stat-PV').style.display = 'flex'
        }
        document.getElementById('stat-PVtex').innerText=this.PV + "/" + this.PVmax
        document.getElementById('stat-PVbar').attributes.max.value = this.PVmax
        document.getElementById('stat-PVbar').value = this.PV
    }

    updatePM(){
        if(document.getElementById('stat-PM').style.display == 'none'){
            document.getElementById('stat-PM').style.display = 'flex'
        }
        document.getElementById('stat-PMtex').innerText=this.PM + "/" + this.PMmax
        document.getElementById('stat-PMbar').attributes.max.value = this.PMmax
        document.getElementById('stat-PMbar').value = this.PM
    }

    showInventory(){
        if(document.getElementById('inventory').style.display == 'flex'){
            document.getElementById('inventory').style.display = 'none';
        }else{
            document.getElementById('inventory').style.display = 'flex';
            this.MAJinventory();
        }
    }

    MAJinventory(){
        this.updateStats();
        this.updateEquipment();
        this.updateItems();
    }
}

export default CLASSplayer;
