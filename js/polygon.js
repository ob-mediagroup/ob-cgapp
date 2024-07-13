 export class polygon{
    constructor(center,radius,name,sides,solid){ 
        this.center = center; this.radius = radius;this.name = name;this.solid = solid; this.sides = sides;
        this.prop = [{
            name:'polygon',type:'string',value:this.name},
            {name:'radius',type:'float',value:this.radius},
            {name:'sides',type:'integer',value:this.sides},
            {name:'solid',type:'boolean',value:this.solid},
            {name:'center',type:'ivec2',value:this.center}];
        this.vertices = [];
        this.normals = [];    
    }
    setVertex(counterclockwise){
        const theta = (2*Math.PI)/this.sides;
        let mole = [];
        if(counterclockwise == true)
               {
                
                for(let i=0;i <= (this.sides-1);i++){
                     // this.vertices[i] = [(this.radius*Math.cos((-Math.PI/4) + (theta*i))),(this.radius*Math.sin((-Math.PI/4) + (theta*i)))];
                     mole.push([this.radius*Math.cos(-1*(Math.PI/4) +(theta*i)) + this.center[0], this.radius*Math.sin(-1*(Math.PI/4) +(theta*i)) + this.center[1]]);
                }
               }
               
            else {
                for(let i=0;i<= (this.sides-1);i++){
                    
                   // mole.push([(this.radius*Math.cos((-1*(Math.PI/4)) - (theta*i))) + this.center[0],(this.radius*Math.sin((-1*(Math.PI/4)) - (theta*i))) + this.center[1]]);
                   mole.push([this.radius*Math.cos(-1*(Math.PI/4) -(theta*i)) + this.center[0], this.radius*Math.sin(-1*(Math.PI/4) -(theta*i)) + this.center[1]]);
              }
            }
       return mole;         
    }

    setNormal(){
        for(let i=0;i<= (this.vertices.length-1);i++){
            //this.normals[i] = [(this.center[0]-this.vertices[i][0]),(this.center[1]-this.vertices[i][1])];
            this.normals.push([(this.center[0]-this.vertices[i][0]),(this.center[1]-this.vertices[i][1])]); 
        }
    }
}