export class stylec{
    constructor(name,fillstyle,strokestyle,linewidth,linejoin,texture){
        this.name = name;
        this.fillstyle = fillstyle;
        this.strokestyle = strokestyle; this.linewidth = linewidth;
        this.linejoin = linejoin; this.texture = texture;
        this.prop = [{
            name:'style',type:'string',value:this.name},
            {name:'fillstyle',type:'hexadecimal',value:this.fillstyle},
            {name:'strokestyle',type:'hexadecimal',value:this.strokestyle},
            {name:'linewidth',type:'float',value:this.linewidth}
            ];
    }
}