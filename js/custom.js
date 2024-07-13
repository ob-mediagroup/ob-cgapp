export class custom{
    constructor(vertices,closed,name,solid){
        this.name = name;
        this.center = [];
        this.closed = closed;
        this.width = 0;this.height = 0;this.solid = solid;
        this.vertices = vertices;
        this.vertexObjects = [];
        this.prop = [{
            name:'custom',type:'string',value:this.name},
            {name:'width',type:'float',value:this.width},
            {name:'height',type:'float',value:this.height},
            {name:'solid',type:'boolean',value:this.solid},
            {name:'vertexlist',type:'divenum',value:''},
            {name:'vertex-attributes',type:'output',value:''},
            {name:'center',type:'ivec2',value:this.center}];
    }

    setParameters(){
        let max=[0,0],min=[0,0];
        for(let i=0;i<= (this.vertices-1);i++){
            if(i == (this.vertices-1)) break;
            max[0] = Math.max(this.vertices[i][0],this.vertices[i+1][0]);
            max[1] = Math.max(this.vertices[i][1],this.vertices[i+1][1]);
            min[0] = Math.min(this.vertices[i][0],this.vertices[i+1][0]);
            min[1] = Math.min(this.vertices[i][1],this.vertices[i+1][1]);
        }
        this.center = [(max[0]+min[0])/2,(max[1]+min[1])/2] ;
        this.width = max[0] - min[0]; this.height = max[1] - min[1];
    }

    
}