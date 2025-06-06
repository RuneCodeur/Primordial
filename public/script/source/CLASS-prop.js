// gestion de la carte
class CLASSprop {
    constructor(id, position, info = {}) {
        this.id = id;
        this.position = position;
        this.name = '';
        this.type = 0;
        this.assets = '';
        this.content = {};
        this.loot = [];
        this.propActive = true;
        this.isWall = false;
        this.info = info;
        this.after = false;
        this.width = 64;
        this.height = 64;
    }

    // retourne la position de la prop
    GETposition(){
        return this.position;
    }

    GETtype(){
        return this.type;
    }

    GETinfo(){
        return this.info;
    }

    GETcontent(){
        let content = this.content;
        this.content = {};
        return content;
    }

    GETloot(){
        return this.loot;
    }

    GETafter(){
        return this.after;
    }

    // retourne la physique du prop (si les unités peuvent marcher dessus ou non)
    GETisWall(){
        return this.isWall;
    }

    SETobject(object){
        this.content = object;
    }

    SETinfo(info){
        this.info = info;
    }
    
    SETinactive(){
        this.propActive = false;
    }
    
    POSTloot(loot){
        this.loot = loot;
    }

    POSTRESSOURCEprops(RESSOURCEprop){
        this.name = RESSOURCEprop.name
        this.type = RESSOURCEprop.type
        this.assets = RESSOURCEprop.img
        this.isWall = RESSOURCEprop.isWall
        this.width = RESSOURCEprop.width
        this.height = RESSOURCEprop.height

        if(RESSOURCEprop.after){
            this.after = RESSOURCEprop.after;
        }
        else{
            this.after = false;
        }
    }

    // affichage des props
    propsAffichage(){
        this.propDepop();
        if(this.propActive == true){
            let position = this.GETposition();
            let Zindex = 0;
            if(this.GETisWall() == true){
                Zindex = position[0];
            }
            let props = '<div id="prop-'+this.id+'" style="z-index:'+Zindex+'; top:'+(position[0]*64) +'px; left:'+(position[1]*64) +'px;"><img id="prop-'+this.id+'-img" src="./public/assets/'+this.assets +'" style="width:'+this.width+'px; height:'+this.height+'px;"></div>';
            document.getElementById('units').insertAdjacentHTML('beforeend', props);
        }
    }

    propDepop(){
        let afficheProp = document.getElementById('prop-'+this.id);
        if(afficheProp){
            afficheProp.remove();
        }
    }

    activation(playerDirection){
        switch (this.type) {

            // type panneau indicatif
            case 1:
                if(playerDirection == 2){
                    return this.info;
                }else{
                    return;
                }
                break;
        
            // type block
            case 2:
                break;

            // type loot
            case 3:
                if(this.content && this.content.name !== undefined){
                    return {
                        dialog: "Contenu : "+ this.content.name,
                        id: this.id,
                        buttons : [
                            {
                                name:"prendre",
                                type:1,
                                id: this.id
                            },
                            {
                                name:"Laisser",
                                type:0
                            }
                        ]
                    };
                }else{
                    return;
                }
                break;
            
            // type coffre
            case 4:
                if(playerDirection == 2 && this.content.name !== undefined){
                    return {
                        dialog: "Contenu : "+ this.content.name,
                        id: this.id,
                        buttons : [
                            {
                                name:"prendre",
                                type:1
                            },
                            {
                                name:"Laisser",
                                type:0
                            }
                        ]
                    };
                }else{
                    return;
                }
                break;

            //type teleportation
            case 5:
                return this.info;
                break;
                
            default:
                return;
                break;
        }
    }

    active(){
        return this.propActive;
    }
}

export default CLASSprop;
