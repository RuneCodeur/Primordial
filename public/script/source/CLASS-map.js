// gestion de la carte
class CLASSmap {
    constructor(idTableauInit) {
        this.idTableau = idTableauInit;
        this.typeMap = 0;
        this.mapAffichage = document.getElementById('map');
        this.allMap = {};
        this.RESSOURCEmapTiles = {};
        this.RESSOURCEprops = {}
        this.RESSOURCEmapTAB = {};
        this.RESSOURCEMapWay = {};
        this.idMap = 0;
        this.showTableau();
    }

    // retourne la liste des monstres du tableau actuel
    GETmonsters(){
        return this.allMap[this.idMap][this.idTableau[0]][this.idTableau[1]].tab.monsters;
    }

    // retourne la liste des props du tableau actuel
    GETprops(){
        let MapTab = JSON.parse(JSON.stringify(this.allMap[this.idMap][this.idTableau[0]][this.idTableau[1]].tab.props));
        this.allMap[this.idMap][this.idTableau[0]][this.idTableau[1]].tab.props = [];
        
        return MapTab;
    }

    // retourne la physique des cellules du tableau
    GETphysics(limit = false){
        let tilesTAB = this.allMap[this.idMap][this.idTableau[0]][this.idTableau[1]].tab.tiles;
        let tilesTypeTAB = [];
        for (let H = 0; H < tilesTAB.length; H++) {
            tilesTypeTAB[H] = [];
            for (let L = 0; L < tilesTAB[H].length; L++) {

                if(limit == true && (H == 0 || H == window.TABhauteur-1 || L == 0 || L == window.TABlargeur-1)){
                    tilesTypeTAB[H][L] = 1
                }else{
                    tilesTypeTAB[H][L] = this.RESSOURCEmapTiles[this.allMap[this.idMap][this.idTableau[0]][this.idTableau[1]].tab.tiles[H][L]].type;
                }
            }
        }
        return tilesTypeTAB;
    }

    LETtableau(idTableau){
        this.idTableau = idTableau;
    }

    LETTRESSOURCEmapTAB(RESSOURCEmapTAB){
        if(RESSOURCEmapTAB.typeMap){
            this.typeMap = RESSOURCEmapTAB.typeMap;
        }

        if(this.typeMap === "random"){
            this.LETRESSOURCEMapWay(RESSOURCEmapTAB);
        }

        this.RESSOURCEmapTAB = RESSOURCEmapTAB;
    }
    
    // organise une liste pour trouver les tableaux selon leurs delimitation (attribut "way")
    LETRESSOURCEMapWay(RESSOURCEmapTAB){
        let RESSOURCEMapWay = {}

        Object.keys(RESSOURCEmapTAB).forEach(type => {
            RESSOURCEMapWay[type] = {
                0 : {},
                1 : {},
                2 : {},
                3 : {}
            };

            for (let i = 0; i < RESSOURCEmapTAB[type].tab.length; i++) {
                Object.keys(RESSOURCEmapTAB[type].tab[i].way).forEach(orientation => {
                    if(!RESSOURCEMapWay[type][orientation][RESSOURCEmapTAB[type].tab[i].way[orientation]]){
                        RESSOURCEMapWay[type][orientation][RESSOURCEmapTAB[type].tab[i].way[orientation]] = [];
                    }
                    RESSOURCEMapWay[type][orientation][RESSOURCEmapTAB[type].tab[i].way[orientation]].push(i)
                })
            }
        });
        this.RESSOURCEMapWay = RESSOURCEMapWay;
    }

    LETTRESSOURCEprops(RESSOURCEprops){
        this.RESSOURCEprops = RESSOURCEprops;
    }
    
    LETTRESSOURCEmapTiles(RESSOURCEmapTiles){
        this.RESSOURCEmapTiles = RESSOURCEmapTiles;
    }
    
    // affichage du tableau actuel
    showTableau(showTile = false){
        if(this.idTableau != 0){
            let tableau = "";
            for (let H = 0; H < TABhauteur; H++) {
                tableau += "<div class='lign'>"
                for (let L = 0; L < TABlargeur; L++) {
                    let tile ='';
                    if(showTile){
                        tile = "<img src='./public/assets/" + this.RESSOURCEmapTiles[this.allMap[this.idMap][this.idTableau[0]][this.idTableau[1]].tab.tiles[H][L]].img + "'>";
                    }
                    tableau += "<div class='cell'>"+tile+"</div>"
                }
                tableau += "</div>"
            }
            this.mapAffichage.innerHTML = tableau;
        }
    }

    async createMap(){
        if(this.typeMap === "fixe"){
            return this.createMapFixe();
        }

        else if (this.typeMap === "random"){
            return this.createMapRandom();
        }
    }

    async chargeMap(idMap){
        if(this.RESSOURCEmapTAB.map[idMap]){
            this.idMap = idMap;
            await this.createMapFixe();
        }
        return;
    }

    // generation de la carte (mode fixe)
    async createMapFixe(){
        this.allMap = {};
        for (let idMap = 0; idMap < this.RESSOURCEmapTAB.map.length; idMap++) {
            if(!this.allMap[idMap]){
                this.allMap[idMap] = []
            }
            for (let H = 0; H <  this.RESSOURCEmapTAB.map[idMap].length; H++) {
                for (let L = 0; L < this.RESSOURCEmapTAB.map[idMap][0].length; L++) {
                    if(!this.allMap[idMap][H]){
                        this.allMap[idMap][H] = []
                    }
                    this.allMap[idMap][H][L] = {};
                    this.allMap[idMap][H][L].name = '';
                    this.allMap[idMap][H][L].tab = this.RESSOURCEmapTAB.map[idMap][H][L];
                }
            }
        }

        // for (let H = 0; H < MAPhauteur; H++) {
        //     for (let L = 0; L < MAPlargeur; L++) {
        //         if(!this.allMap[H]){
        //             this.allMap[H] = []
        //         }
        //         this.allMap[H][L] = {};
        //         this.allMap[H][L].name = '';
        //         this.allMap[H][L].tab = this.RESSOURCEmapTAB.map[this.idMap][H][L];
        //     }
        // }
        
        // for (let H = 0; H < MAPhauteur; H++) {
        //     for (let L = 0; L < MAPlargeur; L++) {
        //         if(!this.allMap[H]){
        //             this.allMap[H] = []
        //         }
        //         this.allMap[H][L] = {};
        //         // type de la carte
        //         let type = 'base';
        //         this.allMap[H][L].name = this.RESSOURCEmapTAB[type].name;

        //         // carte
        //         let possibleWay = this.GETwayFromTAB([H,L]);
        //         let idTab = this.GETrandomTABfromWay(possibleWay, type);
        //         this.allMap[H][L].tab = this.RESSOURCEmapTAB.base.tab[idTab];
        //     }
        // }
        return ;
    }

    // generation de la carte (mode random)
    async createMapRandom(){
        //reorganisation des tableau selon leurs attribut "way"
        for (let H = 0; H < MAPhauteur; H++) {
            for (let L = 0; L < MAPlargeur; L++) {
                if(!this.allMap[this.idMap][H]){
                    this.allMap[this.idMap][H] = []
                }
                this.allMap[this.idMap][H][L] = {};
                // type de la carte
                let type = 'base';
                this.allMap[this.idMap][H][L].name = this.RESSOURCEmapTAB[type].name;

                // carte
                let possibleWay = this.GETwayFromTAB([H,L]);
                let idTab = this.GETrandomTABfromWay(possibleWay, type);
                this.allMap[this.idMap][H][L].tab = this.RESSOURCEmapTAB.base.tab[idTab];
            }
        }
        return ;
    }

    // retourne le tableau selectionné (aleatoire)
    GETrandomTABfromWay(way, biome){
        let PosibleTAB = [
            [], 
            [], 
            [], 
            []
        ];

        for (let direction = 0; direction < way.length; direction++) {
            if(way[direction] != null){
                for (let i = 0; i < this.RESSOURCEMapWay[biome][direction][way[direction]].length; i++) {
                    PosibleTAB[direction].push(this.RESSOURCEMapWay[biome][direction][way[direction]][i]);
                }
            }else{
                Object.keys(this.RESSOURCEMapWay[biome][direction]).forEach(type => {
                    if(type != 0){
                        for (let i = 0; i < this.RESSOURCEMapWay[biome][direction][type].length; i++) {
                            PosibleTAB[direction].push(this.RESSOURCEMapWay[biome][direction][type][i]);
                        }
                    }

                })
            }
        }

        PosibleTAB = PosibleTAB.filter(arr =>  arr.length > 0 );

        let ListTAB = PosibleTAB[0].filter(idTAB =>
            PosibleTAB.every(TABs => TABs.includes(idTAB))
        );
        
        let TAB = ListTAB[Math.floor(Math.random()*ListTAB.length)];
        return TAB;
    }
    
    // recupère les routes déja associé à ce tableau
    GETwayFromTAB(idTAB){
        let way = [
            null, // route vers le bas
            null, // route vers la gauche
            null, // route vers le haut
            null, // route vers la droite
        ]

        //route vers la gauche
        if(idTAB[1] == 0){
            way[1] = 0;
        }else if(this.allMap[this.idMap][idTAB[0]] && this.allMap[this.idMap][idTAB[0]][idTAB[1]-1]){
            way[1] = this.allMap[this.idMap][idTAB[0]][idTAB[1]-1].tab.way[3];
        }

        //route vers le haut
        if(idTAB[0] == 0){
            way[2] = 0;
        }else if(this.allMap[this.idMap][idTAB[0]-1] && this.allMap[this.idMap][idTAB[0]-1][idTAB[1]]){
            way[2] = this.allMap[this.idMap][idTAB[0]-1][idTAB[1]].tab.way[0];
        }

        //route vers le bas
        if(idTAB[0] == window.MAPhauteur-1){
            way[0] = 0;
        }else if(this.allMap[this.idMap][idTAB[0]+1] && this.allMap[this.idMap][idTAB[0]+1][idTAB[1]]){
            way[0] = this.allMap[this.idMap][idTAB[0]+1][idTAB[1]].tab.way[2];
        }
        //route vers la droite
        if(idTAB[1] == window.MAPlargeur-1){
            way[3] = 0;
        }else if(this.allMap[this.idMap][idTAB[0]] && this.allMap[this.idMap][idTAB[0]][idTAB[1]+1]){
            way[3] = this.allMap[this.idMap][idTAB[0]][idTAB[1]+1].tab.way[1];
        }

        return way;
    }
    
    deplaceTAB(direction){
        switch (direction) {

            // bas
            case 0:
                if(this.allMap[this.idMap][this.idTableau[0]+1] && this.allMap[this.idMap][this.idTableau[0]+1][this.idTableau[1]] ){
                    this.idTableau = [this.idTableau[0]+1, this.idTableau[1]];
                }
                break;

            // gauche
            case 1:
                if(this.allMap[this.idMap][this.idTableau[0]] && this.allMap[this.idMap][this.idTableau[0]][this.idTableau[1]-1] ){
                    this.idTableau = [this.idTableau[0], this.idTableau[1]-1];
                }
                break;

            //haut
            case 2:
                if(this.allMap[this.idMap][this.idTableau[0]-1] && this.allMap[this.idMap][this.idTableau[0]-1][this.idTableau[1]] ){
                    this.idTableau = [this.idTableau[0]-1, this.idTableau[1]];
                }
                break;

            //droite
            case 3:
                if(this.allMap[this.idMap][this.idTableau[0]] && this.allMap[this.idMap][this.idTableau[0]][this.idTableau[1]+1] ){
                    this.idTableau = [this.idTableau[0], this.idTableau[1]+1];
                }
                break;
        }

        this.showTableau(true);
        return this.idTableau;
    }

    teleport(idMap, idTableau){
        this.idMap = idMap;
        this.idTableau = idTableau;
        this.showTableau(true);
    }
}

export default CLASSmap;
