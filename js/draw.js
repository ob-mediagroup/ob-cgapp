import  { circle} from "./shape.js" 
import { polygon } from "./polygon.js";
import { custom } from "./custom.js";
import { matrixMul,getIndex,getAllChildrenNode,lineParametricToImplicit,pointOnLine,matrixMulPoint,pointFromLinePosition } from "./matrix.js";





class mpolygon extends polygon{
    constructor(center,radius,name,sides,solid){
     super(center,radius,name,sides,solid);
    }
}


class mcircle extends circle{
    constructor(center,radius,name,solid){
     super(center,radius,name,solid);
    }
}


let drawCircle = (context,stylec,center,radius,name,solid,counterclockwise)=>{
   
    
    
    let bcircle = new mcircle(center,radius,name,solid);
    
   
    context.save();
    context.fillStyle = stylec.fillStyle;
    context.strokeStyle = stylec.strokeStyle;
    context.lineWidth = stylec.lineWidth;
    context.lineJoin = stylec.lineJoin;
   // let theta = (Math.PI*2)/bcircle.vertices.length;
    if((solid == true) && (counterclockwise==true)){
        
        bcircle.setVertices(true); bcircle.setNormal();
        let theta = (Math.PI*2)/bcircle.vertices.length;
        
        for(let i=0;i<= bcircle.vertices.length-1;i++){
            context.beginPath();
            context.arc(center[0],center[1],radius,0+(theta*i),(theta*i + theta));
            context.stroke();context.restore();
        }
    } 
    else if((solid == true) && (counterclockwise==false)){
        bcircle.setVertices(false); bcircle.setNormal();
        let theta = (Math.PI*2)/bcircle.vertices.length;
        for(let i=0;i<= bcircle.vertices.length-1;i++){
            context.beginPath();
            context.arc(center[0],center[1],radius,0+(theta*i),(theta*i + theta),false);
            context.stroke();context.restore();
        }
    }
    else if((solid == false) && (counterclockwise==false)){
        bcircle.setVertices(false); bcircle.setNormal();
        let theta = (Math.PI*2)/bcircle.vertices.length;
        for(let i=0;i<= bcircle.vertices.length-1;i++){
            context.beginPath();
            context.arc(center[0],center[1],radius,0+(theta*i),(theta*i + theta),false);
            context.stroke(); context.beginPath();
            context.arc(center[0],center[1],radius,0,(2*Math.PI),false); context.fill();
            context.restore();
        }
    }
    else{bcircle.setVertices(false); bcircle.setNormal();
        let theta = (Math.PI*2)/bcircle.vertices.length;
        for(let i=0;i<= bcircle.vertices.length-1;i++){
            
            context.beginPath();
            context.arc(center[0],center[1],radius,0+(theta*i),(theta*i + theta));
            context.stroke(); context.beginPath();
            context.arc(center[0],center[1],radius,0,(2*Math.PI)); context.fill();
            context.restore();
        }
    }

}

let drawPolygon = (context,stylec,center,radius,name,sides,counterclockwise,solid)=>{
      
      
      let bpoly = new mpolygon(center,radius,name,sides,solid);
      context.save();
      context.fillStyle = stylec.fillStyle;
      context.strokeStyle = stylec.strokeStyle;
      context.lineWidth = stylec.lineWidth;
      context.lineJoin = stylec.lineJoin;
      if((solid==true) && (counterclockwise==true)){
         bpoly.vertices =  bpoly.setVertex(true);
         bpoly.setNormal();
         context.beginPath();
         context.moveTo((bpoly.vertices[0])[0],(bpoly.vertices[0])[1]); 
         for(let i=0;i<= (bpoly.vertices.length-1);i++){
           
           if(i==(bpoly.vertices.length-1)){context.lineTo((bpoly.vertices[0])[0],(bpoly.vertices[0])[1]);}
           else{context.lineTo((bpoly.vertices[i+1])[0],(bpoly.vertices[i+1])[1]);}
           
           
         }
         context.stroke(); context.restore();
      }
      else if((solid==true)&&(counterclockwise==false)){
        bpoly.vertices = bpoly.setVertex(false); bpoly.setNormal();context.beginPath();
        context.moveTo((bpoly.vertices[0])[0],(bpoly.vertices[0])[1]); 
        for(let i=0;i<= (bpoly.vertices.length-1);i++){
            
            if(i==(bpoly.vertices.length-1)){context.lineTo((bpoly.vertices[0])[0],(bpoly.vertices[0])[1]);}
            else{context.lineTo((bpoly.vertices[i+1])[0],(bpoly.vertices[i+1])[1]);}
            
          }
          context.stroke(); context.restore();
      }
      else if((solid==false)&&(counterclockwise==true)){
        bpoly.vertices = bpoly.setVertex(true); bpoly.setNormal();context.beginPath();
        context.moveTo((bpoly.vertices[0])[0],(bpoly.vertices[0])[1]);
        for(let i=0;i<= (bpoly.vertices.length-1);i++){
            
            if(i==(bpoly.vertices.length-1)){context.lineTo((bpoly.vertices[0])[0],(bpoly.vertices[0])[1]);}
            else{context.lineTo((bpoly.vertices[i+1])[0],(bpoly.vertices[i+1])[1]);}
            
          }
          context.stroke();context.fill(); context.restore();
      }else{
        bpoly.vertices = bpoly.setVertex(false); bpoly.setNormal();context.beginPath();
        context.moveTo((bpoly.vertices[0])[0],(bpoly.vertices[0])[1]);
        for(let i=0;i<= (bpoly.vertices.length-1);i++){
            
            if(i==(bpoly.vertices.length-1)){context.lineTo((bpoly.vertices[0])[0],(bpoly.vertices[0])[1]);}
            else{context.lineTo((bpoly.vertices[i+1])[0],(bpoly.vertices[i+1])[1]);}
            
          }
          context.stroke();context.fill(); context.restore();
      }

}

let drawCustom = (context,stylec,vertices,name,solid,closed,mode,object)=>{
    let mycustom = new custom(vertices,closed,name,solid); 
    if((mode=='create') && (closed==true) && (solid==true)){
        mycustom.setParameters();
        context.save();
        for(let j=0;j<=(mycustom.vertices.length-1);j++){
            let vs = mycustom.vertices[j],central = mycustom.center;
            let vbest = [vs[0]-central[0],vs[1]-central[1]];
            if(j != (mycustom.vertices.length-1)){
               let vnext = mycustom.vertices[j+1];
               let vbnext = [vnext[0]-central[0],vnext[1]-central[1]];
               let vbside = pointOnLine(vbnext,vbest,[vbest[0],(vbest[1] + 30)]);
               if(vbside < 0){
                 let vblinecentral = pointFromLinePosition(0.5,vbest,vbnext);
                 let vectorcentral = [vblinecentral[0]-vbest[0],vblinecentral[1]-vbest[1]]
                 let cosa = Math.cos((15*Math.PI)/180), sina = Math.sin((15*Math.PI)/180);
                 let control1 = matrixMulPoint(2,2,vectorcentral,[[cosa,sina],[-sina,cosa]]) ;
                 let vectorcentral2 = [vblinecentral[0]-vbnext[0],vblinecentral[1]-vbnext[1]];
                 let control2 = matrixMulPoint(2,2,vectorcentral2,[[cosa,-sina],[sina,cosa]]) ;
                 mycustom.vertexObjects.push({vertex:[vbest[0],vbest[1]],interpolation:'linear',control1,control2});
               }else if(vbside > 0){
                let vblinecentral = pointFromLinePosition(0.5,vbest,vbnext);
                let vectorcentral = [vblinecentral[0]-vbest[0],vblinecentral[1]-vbest[1]]
                let cosa = Math.cos((15*Math.PI)/180), sina = Math.sin((15*Math.PI)/180);
                let control1 = matrixMulPoint(2,2,vectorcentral,[[cosa,-sina],[sina,cosa]]) ;
                let vectorcentral2 = [vblinecentral[0]-vbnext[0],vblinecentral[1]-vbnext[1]];
                let control2 = matrixMulPoint(2,2,vectorcentral2,[[cosa,sina],[-sina,cosa]]) ;
                mycustom.vertexObjects.push({vertex:[vbest[0],vbest[1]],interpolation:'linear',control1,control2});
               }
            }else if(j == (mycustom.vertices.length-1)){
                let vnext = mycustom.vertices[0];
                let vbnext = [vnext[0]-central[0],vnext[1]-central[1]];
                let vbside = pointOnLine(vbnext,vbest,[vbest[0],(vbest[1] + 30)]);
                if(vbside < 0){
                    let vblinecentral = pointFromLinePosition(0.5,vbest,vbnext);
                    let vectorcentral = [vblinecentral[0]-vbest[0],vblinecentral[1]-vbest[1]]
                    let cosa = Math.cos((15*Math.PI)/180), sina = Math.sin((15*Math.PI)/180);
                    let control1 = matrixMulPoint(2,2,vectorcentral,[[cosa,sina],[-sina,cosa]]) ;
                    let vectorcentral2 = [vblinecentral[0]-vbnext[0],vblinecentral[1]-vbnext[1]];
                    let control2 = matrixMulPoint(2,2,vectorcentral2,[[cosa,-sina],[sina,cosa]]) ;
                    mycustom.vertexObjects.push({vertex:[vbest[0],vbest[1]],interpolation:'linear',control1,control2});
                  }else if(vbside > 0){
                   let vblinecentral = pointFromLinePosition(0.5,vbest,vbnext);
                   let vectorcentral = [vblinecentral[0]-vbest[0],vblinecentral[1]-vbest[1]]
                   let cosa = Math.cos((15*Math.PI)/180), sina = Math.sin((15*Math.PI)/180);
                   let control1 = matrixMulPoint(2,2,vectorcentral,[[cosa,-sina],[sina,cosa]]) ;
                   let vectorcentral2 = [vblinecentral[0]-vbnext[0],vblinecentral[1]-vbnext[1]];
                   let control2 = matrixMulPoint(2,2,vectorcentral2,[[cosa,sina],[-sina,cosa]]) ;
                   mycustom.vertexObjects.push({vertex:[vbest[0],vbest[1]],interpolation:'linear',control1,control2});
                  }
            }

        }

          context.beginPath();
          context.fillStyle = stylec.fillStyle;
          context.strokeStyle = stylec.strokeStyle;
          context.lineWidth = stylec.lineWidth;
          context.lineJoin = stylec.lineJoin;
          context.moveTo(mycustom.vertexObjects[0].vertex[0],mycustom.vertexObjects[0].vertex[1]);
          for(let k=0;k<=(mycustom.vertexObjects.length-1);k++){
            if(k != (mycustom.vertexObjects.length-1)){
                
                context.lineTo(mycustom.vertexObjects[k+1].vertex[0],mycustom.vertexObjects[k+1].vertex[0])
            }else if(k == (mycustom.vertexObjects.length-1)){
                
                context.lineTo(mycustom.vertexObjects[0].vertex[0],mycustom.vertexObjects[0].vertex[0]);
            }
          }
          context.fill(); context.restore();
    }
    else if((mode=='create') && (closed==false) && (solid==false)){
        mycustom.setParameters();
        context.save();
        for(let j=0;j<=(mycustom.vertices.length-1);j++){
            let vs = mycustom.vertices[j],central = mycustom.center;
            let vbest = [vs[0]-central[0],vs[1]-central[1]];
            if(j != (mycustom.vertices.length-1)){
                let vnext = mycustom.vertices[j+1];
                let vbnext = [vnext[0]-central[0],vnext[1]-central[1]];
                let vbside = pointOnLine(vbnext,vbest,[vbest[0],(vbest[1] + 30)]);
                if(vbside < 0){
                  let vblinecentral = pointFromLinePosition(0.5,vbest,vbnext);
                  let vectorcentral = [vblinecentral[0]-vbest[0],vblinecentral[1]-vbest[1]]
                  let cosa = Math.cos((15*Math.PI)/180), sina = Math.sin((15*Math.PI)/180);
                  let control1 = matrixMulPoint(2,2,vectorcentral,[[cosa,sina],[-sina,cosa]]) ;
                  let vectorcentral2 = [vblinecentral[0]-vbnext[0],vblinecentral[1]-vbnext[1]];
                  let control2 = matrixMulPoint(2,2,vectorcentral2,[[cosa,-sina],[sina,cosa]]) ;
                  mycustom.vertexObjects.push({vertex:[vbest[0],vbest[1]],interpolation:'linear',control1,control2});
                }else if(vbside > 0){
                 let vblinecentral = pointFromLinePosition(0.5,vbest,vbnext);
                 let vectorcentral = [vblinecentral[0]-vbest[0],vblinecentral[1]-vbest[1]]
                 let cosa = Math.cos((15*Math.PI)/180), sina = Math.sin((15*Math.PI)/180);
                 let control1 = matrixMulPoint(2,2,vectorcentral,[[cosa,-sina],[sina,cosa]]) ;
                 let vectorcentral2 = [vblinecentral[0]-vbnext[0],vblinecentral[1]-vbnext[1]];
                 let control2 = matrixMulPoint(2,2,vectorcentral2,[[cosa,sina],[-sina,cosa]]) ;
                 mycustom.vertexObjects.push({vertex:[vbest[0],vbest[1]],interpolation:'linear',control1,control2});
                }
             } else if(j == (mycustom.vertices.length-1)){
                mycustom.vertexObjects.push({vertex:[vbest[0],vbest[1]],interpolation:'linear',control1:[],control2:[]});
             }

        }

          context.beginPath();
          context.fillStyle = stylec.fillStyle;
          context.strokeStyle = stylec.strokeStyle;
          context.lineWidth = stylec.lineWidth;
          context.lineJoin = stylec.lineJoin;
          context.moveTo(mycustom.vertexObjects[0].vertex[0],mycustom.vertexObjects[0].vertex[1]);
          for(let k=0;k<=(mycustom.vertexObjects.length-1);k++){
            if(k != (mycustom.vertexObjects.length-1)){
                
                context.lineTo(mycustom.vertexObjects[k+1].vertex[0],mycustom.vertexObjects[k+1].vertex[0])
            }else if(k == (mycustom.vertexObjects.length-1)) break;
          }
          context.stroke();
    }

    else if((mode=='create') && (closed==true) && (solid==false)){
        mycustom.setParameters();
        context.save();
        for(let j=0;j<=(mycustom.vertices.length-1);j++){
            let vs = mycustom.vertices[j],central = mycustom.center;
            let vbest = [vs[0]-central[0],vs[1]-central[1]];
            if(j != (mycustom.vertices.length-1)){
               let vnext = mycustom.vertices[j+1];
               let vbnext = [vnext[0]-central[0],vnext[1]-central[1]];
               let vbside = pointOnLine(vbnext,vbest,[vbest[0],(vbest[1] + 30)]);
               if(vbside < 0){
                 let vblinecentral = pointFromLinePosition(0.5,vbest,vbnext);
                 let vectorcentral = [vblinecentral[0]-vbest[0],vblinecentral[1]-vbest[1]]
                 let cosa = Math.cos((15*Math.PI)/180), sina = Math.sin((15*Math.PI)/180);
                 let control1 = matrixMulPoint(2,2,vectorcentral,[[cosa,sina],[-sina,cosa]]) ;
                 let vectorcentral2 = [vblinecentral[0]-vbnext[0],vblinecentral[1]-vbnext[1]];
                 let control2 = matrixMulPoint(2,2,vectorcentral2,[[cosa,-sina],[sina,cosa]]) ;
                 mycustom.vertexObjects.push({vertex:[vbest[0],vbest[1]],interpolation:'linear',control1,control2});
               }else if(vbside > 0){
                let vblinecentral = pointFromLinePosition(0.5,vbest,vbnext);
                let vectorcentral = [vblinecentral[0]-vbest[0],vblinecentral[1]-vbest[1]]
                let cosa = Math.cos((15*Math.PI)/180), sina = Math.sin((15*Math.PI)/180);
                let control1 = matrixMulPoint(2,2,vectorcentral,[[cosa,-sina],[sina,cosa]]) ;
                let vectorcentral2 = [vblinecentral[0]-vbnext[0],vblinecentral[1]-vbnext[1]];
                let control2 = matrixMulPoint(2,2,vectorcentral2,[[cosa,sina],[-sina,cosa]]) ;
                mycustom.vertexObjects.push({vertex:[vbest[0],vbest[1]],interpolation:'linear',control1,control2});
               }
            }else if(j == (mycustom.vertices.length-1)){
                let vnext = mycustom.vertices[0];
                let vbnext = [vnext[0]-central[0],vnext[1]-central[1]];
                let vbside = pointOnLine(vbnext,vbest,[vbest[0],(vbest[1] + 30)]);
                if(vbside < 0){
                    let vblinecentral = pointFromLinePosition(0.5,vbest,vbnext);
                    let vectorcentral = [vblinecentral[0]-vbest[0],vblinecentral[1]-vbest[1]]
                    let cosa = Math.cos((15*Math.PI)/180), sina = Math.sin((15*Math.PI)/180);
                    let control1 = matrixMulPoint(2,2,vectorcentral,[[cosa,sina],[-sina,cosa]]) ;
                    let vectorcentral2 = [vblinecentral[0]-vbnext[0],vblinecentral[1]-vbnext[1]];
                    let control2 = matrixMulPoint(2,2,vectorcentral2,[[cosa,-sina],[sina,cosa]]) ;
                    mycustom.vertexObjects.push({vertex:[vbest[0],vbest[1]],interpolation:'linear',control1,control2});
                  }else if(vbside > 0){
                   let vblinecentral = pointFromLinePosition(0.5,vbest,vbnext);
                   let vectorcentral = [vblinecentral[0]-vbest[0],vblinecentral[1]-vbest[1]]
                   let cosa = Math.cos((15*Math.PI)/180), sina = Math.sin((15*Math.PI)/180);
                   let control1 = matrixMulPoint(2,2,vectorcentral,[[cosa,-sina],[sina,cosa]]) ;
                   let vectorcentral2 = [vblinecentral[0]-vbnext[0],vblinecentral[1]-vbnext[1]];
                   let control2 = matrixMulPoint(2,2,vectorcentral2,[[cosa,sina],[-sina,cosa]]) ;
                   mycustom.vertexObjects.push({vertex:[vbest[0],vbest[1]],interpolation:'linear',control1,control2});
                  }
            }
        }
        context.beginPath();
          context.fillStyle = stylec.fillStyle;
          context.strokeStyle = stylec.strokeStyle;
          context.lineWidth = stylec.lineWidth;
          context.lineJoin = stylec.lineJoin;
          context.moveTo(mycustom.vertexObjects[0].vertex[0],mycustom.vertexObjects[0].vertex[1]);
          for(let k=0;k<=(mycustom.vertexObjects.length-1);k++){
            if(k != (mycustom.vertexObjects.length-1)){
               
                context.lineTo(mycustom.vertexObjects[k+1].vertex[0],mycustom.vertexObjects[k+1].vertex[0])
            }else if(k == (mycustom.vertexObjects.length-1)){
                
                context.lineTo(mycustom.vertexObjects[0].vertex[0],mycustom.vertexObjects[0].vertex[0]);
            }
          }
          
          context.stroke(); context.restore();
    }

    else if((mode=='edit') && (closed==true) && (solid==false)){
        mycustom.center = object.center;
        mycustom.vertexObjects = object.vertexObjects;
        mycustom.width = object.width;
        mycustom.height = object.height;
        
        context.save();
        
        context.beginPath();
        context.fillStyle = stylec.fillStyle;
        context.strokeStyle = stylec.strokeStyle;
        context.lineWidth = stylec.lineWidth;
        context.lineJoin = stylec.lineJoin;
        context.moveTo(mycustom.vertexObjects[0].vertex[0],mycustom.vertexObjects[0].vertex[1]);
        for(let k=0;k<=(mycustom.vertexObjects.length-1);k++){
          if(k != (mycustom.vertexObjects.length-1)){
              
              switch(mycustom.vertexObjects[k].interpolation){
                case 'linear': {context.lineTo(mycustom.vertexObjects[k+1].vertex[0],mycustom.vertexObjects[k+1].vertex[0]); break;}
                case 'bezier': {context.bezierCurveTo(mycustom.vertexObjects[k].control1[0],mycustom.vertexObjects[k].control1[1],mycustom.vertexObjects[k].control2[0],mycustom.vertexObjects[k].control2[1],mycustom.vertexObjects[k+1].vertex[0],mycustom.vertexObjects[k+1].vertex[1]);break;}
                case 'quadratic': {context.quadraticCurveTo(mycustom.vertexObjects[k].control1[0],mycustom.vertexObjects[k].control1[1],mycustom.vertexObjects[k+1].vertex[0],mycustom.vertexObjects[k+1].vertex[1]);break;}
              }
              
          }else if(k == (mycustom.vertexObjects.length-1)){
              
              switch(mycustom.vertexObjects[k].interpolation){
                case 'linear': {context.lineTo(mycustom.vertexObjects[0].vertex[0],mycustom.vertexObjects[0].vertex[1]); break;}
                case 'bezier': {context.bezierCurveTo(mycustom.vertexObjects[k].control1[0],mycustom.vertexObjects[k].control1[1],mycustom.vertexObjects[k].control2[0],mycustom.vertexObjects[k].control2[1],mycustom.vertexObjects[0].vertex[0],mycustom.vertexObjects[0].vertex[1]);break;}
                case 'quadratic': {context.quadraticCurveTo(mycustom.vertexObjects[k].control1[0],mycustom.vertexObjects[k].control1[1],mycustom.vertexObjects[0].vertex[0],mycustom.vertexObjects[0].vertex[1]);break;}
              }
              
          }
        }
        
        context.stroke(); context.restore();

    }
    else if((mode=='edit') && (closed==false) && (solid==false)){
      mycustom.center = object.center;
      mycustom.vertexObjects = object.vertexObjects;
      mycustom.width = object.width;
      mycustom.height = object.height;
      context.save();
        
      context.beginPath();
      context.fillStyle = stylec.fillStyle;
      context.strokeStyle = stylec.strokeStyle;
      context.lineWidth = stylec.lineWidth;
      context.lineJoin = stylec.lineJoin;
      context.moveTo(mycustom.vertexObjects[0].vertex[0],mycustom.vertexObjects[0].vertex[1]);
      for(let k=0;k<=(mycustom.vertexObjects.length-1);k++){
        if(k != (mycustom.vertexObjects.length-1)){
            
            switch(mycustom.vertexObjects[k].interpolation){
              case 'linear': {context.lineTo(mycustom.vertexObjects[k+1].vertex[0],mycustom.vertexObjects[k+1].vertex[0]); break;}
              case 'bezier': {context.bezierCurveTo(mycustom.vertexObjects[k].control1[0],mycustom.vertexObjects[k].control1[1],mycustom.vertexObjects[k].control2[0],mycustom.vertexObjects[k].control2[1],mycustom.vertexObjects[k+1].vertex[0],mycustom.vertexObjects[k+1].vertex[1]);break;}
              case 'quadratic': {context.quadraticCurveTo(mycustom.vertexObjects[k].control1[0],mycustom.vertexObjects[k].control1[1],mycustom.vertexObjects[k+1].vertex[0],mycustom.vertexObjects[k+1].vertex[1]);break;}
            }
            
        }else if(k == (mycustom.vertexObjects.length-1)){
            
           break;
            
        }
      }
    }
}

let createCanvas = ()=>{
    let context = document.createElement('canvas').getContext('2d');
    return context;
}

export {drawCircle,drawPolygon,drawCustom,createCanvas}