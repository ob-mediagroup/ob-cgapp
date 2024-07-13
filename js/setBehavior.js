import { matrixMul,getIndex,getAllChildrenNode,lineParametricToImplicit,pointOnLine,matrixMulPoint,pointFromLinePosition } from "./matrix.js";
import { scene } from "./shape.js";


let setObjectBehavior = (activeNode,propdiv,maincontext,appwidth,appheight,scenestack,loopdraw,liststack,propdivlist)=>{
      const nodesname = activeNode.node.name;
      let rootDiv = propdiv.querySelector('#'+ nodesname);

      //for radius control
      let radiusElement = rootDiv.querySelector('[name="radius"]');
      if(radiusElement){
        radiusElement.onchange = (evt)=>{
            activeNode.shape.radius = radiusElement.value;
            maincontext.clearRect(0,0,appwidth,appheight);
            loopdraw(scenestack[0],maincontext,'edit');
        }
      }

      //for solid control
      let solidElement = rootDiv.querySelector('[name="solid"]');
      if(solidElement){
        solidElement.onchange = (evt)=>{
            //activeNode.shape.solid = solidElement.value;
            activeNode.shape.solid = !(activeNode.shape.solid);
            maincontext.clearRect(0,0,appwidth,appheight);
            loopdraw(scenestack[0],maincontext,'edit');
        }
      }

      //for center control
      let centerx = rootDiv.querySelector('[name="center.x"]'),centery = rootDiv.querySelector('[name="center.y"]');
      if((centerx) && (centery)){
        centerx.onchange = (evt)=>{
            let transMat = [[1,0,centerx.value],[0,1,0],[0,0,1]]; 
            activeNode.node.resultTransform = matrixMul(3,transMat,activeNode.node.transform);
            activeNode.node.transform = activeNode.node.resultTransform;
            let childNodes = getAllChildrenNode(activeNode,liststack);
            if(childNodes){
              for(let k=0;k<=(childNodes.length-1);k++){
                childNodes[k].node.transform = matrixMul(3,transMat,childNodes[k].node.transform);
              }
            }


            //activeNode.shape.center[0] = centerx.value;
            maincontext.clearRect(0,0,appwidth,appheight);
            loopdraw(scenestack[0],maincontext,'edit'); 
            
        }

        centery.onchange = (evt)=>{
            let transMat = [[1,0,0],[0,1,centery.value],[0,0,1]]; 
            activeNode.node.resultTransform = matrixMul(3,transMat,activeNode.node.transform);
            activeNode.node.transform = activeNode.node.resultTransform;
            let childNodes = getAllChildrenNode(activeNode,liststack);
            if(childNodes){
              for(let k=0;k<=(childNodes.length-1);k++){
                childNodes[k].node.transform = matrixMul(3,transMat,childNodes[k].node.transform);
              }
            }
            
          
            //activeNode.shape.center[1] = centery.value;
            maincontext.clearRect(0,0,appwidth,appheight);
            loopdraw(scenestack[0],maincontext,'edit');
            
        }
      }

      //for sides control
      let sidesElement = rootDiv.querySelector('[name="sides"]');
      if(sidesElement){
        sidesElement.onchange = (evt)=>{
          activeNode.shape.sides = sidesElement.value;
          maincontext.clearRect(0,0,appwidth,appheight);
          loopdraw(scenestack[0],maincontext,'edit');
        }
      }

      //for orientation control 
      let orientElement = rootDiv.querySelector('[name="orientation"]');
      if(orientElement){
        orientElement.onchange = (evt)=>{
          //console.log('i just changed');
          let radval = (Math.PI*orientElement.value)/180;
          let transMat = [[Math.cos(radval),-(Math.sin(radval)),0],[Math.sin(radval),Math.cos(radval),0],[0,0,1]];
          activeNode.node.resultTransform = matrixMul(3,transMat,activeNode.node.transform);
          activeNode.node.transform = activeNode.node.resultTransform;
          
          let childNodes = getAllChildrenNode(activeNode,liststack);
            if(childNodes){
              for(let k=0;k<=(childNodes.length-1);k++){
                let ptrans = childNodes[k].node.parent.node.transform;
                let fakeMat = [[1,0,-(ptrans[0][2])],[0,1,-(ptrans[1][2])],[0,0,1]];
                let bmat = matrixMul(3,fakeMat,childNodes[k].node.transform);
                childNodes[k].node.transform = matrixMul(3,transMat,bmat);
              }
            }
          
          maincontext.clearRect(0,0,appwidth,appheight);
          loopdraw(scenestack[0],maincontext,'edit');


        }
      }
}



export {setObjectBehavior}