import CLASSunit from './CLASS-unit.js';

// gestion du personnage joueur
class CLASSplayer extends CLASSunit {
    constructor(PosiPlayerInit) {
        super(PosiPlayerInit);
        this.PV = 10;
        this.PVmax = 10;
        this.PM = 10;
        this.PMmax = 10;
        this.FOR = 2;
        this.ADR = 1;
        this.INT = 1;
        this.ARMO = 0;
        this.XP = 0;
        this.LVL = 1;
        this.id = 'player';
        this.equipment = {
            'casque' : null,
            'armure' : null,
            'gant' : null,
            'botte' : null,
            'arme' : null,
        };
        this.lengthItems = 28;
        this.items = [];
        this.assets = {
            0 : 'base-face.png',
            1 : 'base-gauche.png',
            2 : 'base-dos.png',
            3 : 'base-droite.png'
        };
    }

    GETstats(){
        let stats = {
            'PV' : this.PV,
            'PVmax' : this.PVmax,
            'PM' : this.PM,
            'PMmax' : this.PMmax,
            'LVL' : this.LVL,
            'XP' : this.XP,
            'FOR' : this.FOR,
            'ADR' : this.ADR,
            'INT' : this.INT,
            'ARMO' : this.ARMO
        }

        Object.values(this.equipment).forEach(item => {
            if(item && item.bonus){
                Object.keys(item.bonus).forEach(name => {
                    stats[name] = Math.max(stats[name] + item.bonus[name], 1);
                });
            }
        })

        return stats;
    }

    attack(){
        let stats = this.GETstats();
        return super.attack(stats.FOR);
    }

    impact(degats, direction){

        let stats = this.GETstats();
        return super.impact(degats, direction, stats.ARMO);
    }
    
    precision(){
        let stats = this.GETstats();
        return super.precision(stats.ADR);
    }

    
    esquive(precisionPOUR100){
        let stats = this.GETstats();
        return super.esquive(precisionPOUR100, stats.ADR);
    }

    asPlaceInInventory(){
        return this.lengthItems - this.items.length;
    }

    insertItemInInventory(object){
        if(this.asPlaceInInventory() > 0 ){
            this.items.push(object);
        }
    }
    
    deplaceTAB(){
        let position  = this.GETposition();
        let direction  = this.GETdirection();
        this.unitDepop();

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

    updateJauges(){
        if(document.getElementById('stat-PV')){
            this.updatePV();
        }
        if(document.getElementById('stat-PM')){
            this.updatePM();
        }
    }
    
    updateStats(){
        this.updateJauges();

        let stats = this.GETstats();
        let statsAffichage = '';
        statsAffichage += '<div> <p>LEVEL:</p> <p>'+ stats.LVL +'</p> </div>';
        statsAffichage += '<div> <p>EXP:</p> <p>'+ stats.XP +'/100</p> </div>';
        statsAffichage += '<div> <p>FORCE:</p> <p>'+ stats.FOR +'</p> </div>';
        statsAffichage += '<div> <p>ADRESSE:</p> <p>'+ stats.ADR +'</p> </div>';
        statsAffichage += '<div> <p>INTELLIGENCE:</p> <p>'+ stats.INT +'</p> </div>';
        statsAffichage += '<div> <p>ARMURE:</p> <p>'+ stats.ARMO +'</p> </div>';
        
        document.getElementById('inventory-stats').innerHTML = statsAffichage;
    }

    updateEquipment(){
        let equipments = '';
        let casque = "empty-head.png";
        let casqueUnequip = '';
        let armure = "empty-torso.png";
        let armureUnequip = '';
        let gant = "empty-hand.png";
        let gantUnequip = '';
        let botte = "empty-feet.png";
        let botteUnequip = '';
        let arme = "empty-weapon.png";
        let armeUnequip = '';

        if( this.equipment.casque){
            casque = this.equipment.casque.img;
            casqueUnequip = '<span></span>';
        }
        if( this.equipment.armure){
            armure = this.equipment.armure.img;
            armureUnequip = '<span></span>';
        }
        if( this.equipment.gant){
            gant = this.equipment.gant.img;
            gantUnequip = '<span></span>';
        }
        if( this.equipment.botte){
            botte = this.equipment.botte.img;
            botteUnequip = '<span></span>';
        }
        if( this.equipment.arme){
            arme = this.equipment.arme.img;
            armeUnequip = '<span></span>';
        }

        // tete
        equipments += "<button onclick='actionItemInventory(4, \"casque\")'>"+ casqueUnequip +"<img src='./public/assets/"+casque+"'></button>"

        // torse
        equipments += "<button onclick='actionItemInventory(4, \"armure\")'>"+ armureUnequip +"<img src='./public/assets/"+armure+"'></button>"

        // main
        equipments += "<button onclick='actionItemInventory(4, \"gant\")'>"+ gantUnequip +"<img src='./public/assets/"+gant+"'></button>"

        // pied 
        equipments += "<button onclick='actionItemInventory(4, \"botte\")'>"+ botteUnequip +"<img src='./public/assets/"+botte+"'></button>"

        //arme
        equipments += "<button onclick='actionItemInventory(4, \"arme\")'>"+ armeUnequip +"<img src='./public/assets/"+arme+"'></button>"
        
        document.getElementById('equipments').innerHTML = equipments;
    }

    updateItems(){
        let content = '';

        for (let i = 0; i < this.lengthItems; i++) {
            if(this.items[i]){
                content += "<button onclick='actionItemInventory(1, "+i+")'> <img src='./public/assets/"+this.items[i].img+"'></button>";
            }
            else{
                content += "<button></button>";
            }
        }
        
        document.getElementById('inventory-content').innerHTML = content;
    }

    showItemInventory(idItem){
        let itemAffichage = '';
        itemAffichage += '<p class="titre">'+this.items[idItem].name+'</p>';
        itemAffichage += '<p class="description">'+this.items[idItem].description+'</p>';
        itemAffichage += '<img src="./public/assets/'+this.items[idItem].img+'">';
        
        itemAffichage += '<div class="stats">';
        Object.keys(this.items[idItem].bonus).forEach(id => {
            if(this.items[idItem].bonus[id] != 0){
                let nameStat = '';
                switch (id) {
                    case 'FOR':
                        nameStat = 'FORCE';
                        break;
                    case 'ADR':
                        nameStat = 'ADRESSE';
                        break;
                    case 'INT':
                        nameStat = 'INTELLIGENCE';
                        break;
                    case 'ARMO':
                        nameStat = 'ARMURE';
                        break;
                    default:
                        nameStat = id;
                        break;
                }
                let valueStat = '<b>0</b>';
                if(this.items[idItem].bonus[id] > 0){
                    valueStat = '<b class="bonus">+'+this.items[idItem].bonus[id]+'</b>';
                }
                else if(this.items[idItem].bonus[id] < 0){
                    valueStat = '<b class="malus">'+this.items[idItem].bonus[id]+'</b>';
                }
                itemAffichage+= '<p>'+nameStat+' : '+ valueStat +'</p>';
            }
        })

        itemAffichage += '</div>';
        if(this.items[idItem].type == 'consomable'){
            itemAffichage += '<div class="Buttons"> <button onclick="actionItemInventory(5, '+idItem+')"> UTILISER</button>';
        }else{
            itemAffichage += '<div class="Buttons"> <button onclick="actionItemInventory(3, '+idItem+')"> EQUIPER</button>';
        }
        itemAffichage += '<button onclick="actionItemInventory(6, '+idItem+')">LACHER</button>';
        itemAffichage += '<button onclick="actionItemInventory(2)">FERMER</button>';
        itemAffichage += '</div>';

        document.getElementById("itemInventory").innerHTML = itemAffichage;
        document.getElementById("itemInventory").style.display = 'flex';
    }

    unshowItemInventory(){
        document.getElementById("itemInventory").style.display = 'none';
        document.getElementById("itemInventory").innerHTML = '';
    }

    equipItemInventory(idItem){
        let itemInventory = this.items[idItem];
        let equipment = this.equipment[itemInventory.type];
        
        if(equipment !== undefined){
            this.equipment[itemInventory.type] = itemInventory;
            this.items.splice(idItem, 1);
            if(equipment != null ){
                this.items.push(equipment);
            }
        }
        this.unshowItemInventory();
        this.MAJinventory();
    }
    
    unequipItemInventory(idItem){
        if(this.asPlaceInInventory() > 0 && this.equipment[idItem]){
            this.items.push(this.equipment[idItem]);
            this.equipment[idItem] = null;
        }
        this.MAJinventory();
    }

    useItemInventory(idItem){
        Object.keys(this.items[idItem].bonus).forEach(id => {
            if(id == 'PV'){
                this.PV = Math.max(Math.min(this.PVmax, this.PV +this.items[idItem].bonus[id]), 0);
            }
            if(id == 'PM'){
                this.PM = Math.max(Math.min(this.PMmax, this.PM +this.items[idItem].bonus[id]), 0);
            }
        })

        this.items.splice(idItem, 1);
        this.unshowItemInventory();
        this.MAJinventory();
    }

    dropItemInventory(idItem){
        this.items.splice(idItem, 1);
        this.MAJinventory();
    }

    getItemInventory(idItem){
        return this.items[idItem];
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

    showInventory(force = false){
        if(document.getElementById('inventory').style.display == 'flex' || force){
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
