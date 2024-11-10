// gestion de la carte
class CLASSprop {
    constructor(id, position, info) {
        this.id = id;
        this.position = position;
        this.name = '';
        this.type = 0;
        this.assets = '';
        this.propActive = true;
        this.isWall = false;
        this.info = info;
    }

    // retourne la position de la prop
    GETposition(){
        return this.position;
    }

    GETtype(){
        return this.type;
    }

    // retourne la physique du prop (si les unités peuvent marcher dessus ou non)
    GETisWall(){
        return this.isWall;
    }

    POSTRESSOURCEprops(RESSOURCEprop){
        this.name = RESSOURCEprop.name
        this.type = RESSOURCEprop.type
        this.assets = RESSOURCEprop.img
        this.isWall = RESSOURCEprop.isWall
    }

    // affichage des props
    propsAffichage(){
        let position = this.GETposition();
        let props = '<div id="prop-'+this.id+'" style="top:'+(position[0]*64) +'px; left:'+(position[1]*64) +'px;"><img id="prop-'+this.id+'-img" src="./public/assets/'+this.assets +'" ></div>';
        document.getElementById('units').insertAdjacentHTML('beforeend', props);
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
