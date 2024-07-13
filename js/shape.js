class circle{
    constructor(center,radius,name,solid){ 
        this.center = center; this.radius = radius;this.name = name;this.solid = solid;
        this.prop = [{
            name:'circle',type:'string',value:this.name},
            {name:'radius',type:'float',value:this.radius},
            {name:'solid',type:'boolean',value:this.solid},
            {name:'center',type:'ivec2',value:this.center}];
        this.vertices = [];
        this.normals = [];    
    }
    setVertices(counterclockwise){
        if(counterclockwise == true)
               this.vertices = [[(this.center[0] + this.radius),this.center[1]],
               [this.center[0],(this.center[1] - this.radius)],
               [(this.center[0] - this.radius),this.center[1]],
               [this.center[0],(this.center[1] + this.radius)]
            ];
            else
            this.vertices = [[(this.center[0] + this.radius),this.center[1]],
            [this.center[0],(this.center[1] + this.radius)],
            [(this.center[0] - this.radius),this.center[1]],
            [this.center[0],(this.center[1] - this.radius)]            
         ];
               
    }

    setNormal(){
        for(let i=0;i<= (this.vertices.length-1);i++){
            this.normals[i] = [(this.center[0]-this.vertices[i][0]),(this.center[1]-this.vertices[i][1])]
        }
    }
}





class custom{
    constructor(vertices,closed,name,solid){
        this.name = name;
        this.center = [];
        this.closed = closed;
        this.width = 0;this.height = 0;this.solid = solid;
        this.vertices = vertices;
        this.prop = [{
            name:'custom',type:'string',value:this.name},
            {name:'width',type:'float',value:this.width},
            {name:'height',type:'float',value:this.height},
            {name:'solid',type:'boolean',value:this.solid},
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
class node{
    constructor(name,parent,orientation,scale,type,offset,transform,resultTransform){
        this.name = name; this.type = type; this.offset = offset;
        this.parent = parent; this.orientation = orientation;this.scale = scale;
        this.children = [] ; this.data = null; this.transform = transform;
        this.resultTransform = resultTransform;
        this.prop = [{
            name:'node',type:'string',value:this.name},
            {name:'parent',type:'stringdrop',value:this.parent},
            {name:'orientation',type:'integer',value:this.orientation},
            {name:'scale',type:'ivec2',value:this.scale}];
    }
}


class scene{
    constructor(shape,node,stylec){
        this.shape = shape;
        this.node = node; 
        this.stylec = stylec;
    }
}

export {circle,node,scene} 