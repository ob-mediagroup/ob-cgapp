let matrixMul = (size,a,b)=>{
    if(size == 3){
        //row 1
        let a11 = (a[0][0]*b[0][0]) + (a[0][1]*b[1][0]) + (a[0][2]*b[2][0]);
        let a12 = (a[0][0]*b[0][1]) + (a[0][1]*b[1][1]) + (a[0][2]*b[2][1]);
        let a13 = (a[0][0]*b[0][2]) + (a[0][1]*b[1][2]) + (a[0][2]*b[2][2]);
        //row 2
        let a21 = (a[1][0]*b[0][0]) + (a[1][1]*b[1][0]) + (a[1][2]*b[2][0]);
        let a22 = (a[1][0]*b[0][1]) + (a[1][1]*b[1][1]) + (a[1][2]*b[2][1]);
        let a23 = (a[1][0]*b[0][2]) + (a[1][1]*b[1][2]) + (a[1][2]*b[2][2]);
        //row3
        let a31 = (a[2][0]*b[0][0]) + (a[2][1]*b[1][0]) + (a[2][2]*b[2][0]);
        let a32 = (a[2][0]*b[0][1]) + (a[2][1]*b[1][1]) + (a[2][2]*b[2][1]);
        let a33 = (a[2][0]*b[0][2]) + (a[2][1]*b[1][2]) + (a[2][2]*b[2][2]);
        let result = [[a11,a12,a13],[a21,a22,a23],[a31,a32,a33]];
        return result;
    }
    if(size==2){
        let a11 = (a[0][0]*b[0][0]) + (a[0][1]*b[1][0]) ;
        let a12 = (a[0][0]*b[0][1]) + (a[0][1]*b[1][1]) ;
        let a21 = (a[1][0]*b[0][0]) + (a[1][1]*b[1][0]) ;
        let a22 = (a[1][0]*b[0][1]) + (a[1][1]*b[1][1]) ;
        let result = [[a11,a12],[a21,a22]];
        return result;
    }
}

let matrixMulPoint = (sizePoint,sizeMatrix,p,mat)=>{
    if((sizePoint==2) && (sizeMatrix==2)){
        let a0 = (mat[0][0]*p[0]) + (mat[0][1]*p[1]),a1 = (mat[1][0]*p[0]) + (mat[1][1]*p[1]) ;
        return [a0,a1];
    }
    if((sizePoint==3) && (sizeMatrix==3)){
        let a0 = (mat[0][0]*p[0]) + (mat[0][1]*p[1]) + (mat[0][2]*p[2]);
        let a1 = (mat[1][0]*p[0]) + (mat[1][1]*p[1]) + (mat[1][2]*p[2]);
        let a2 = (mat[2][0]*p[0]) + (mat[2][1]*p[1]) + (mat[2][2]*p[2]);
        return [a0,a1,a2];
    }
}

let matrixToCtx = (a)=>{
    return [a[0][0],a[1][0],a[0][1],a[1][1],a[0][2],a[1][2]];
}

let isMemberOfArray = (item,darray)=>{
    for(let i=0;i<=(darray.length-1);i++){
        if(darray[i] == item){
            return true;
            
        }
    }
    return false;
}

let getIndex = (item,darray)=>{
    for(let i=0;i<=(darray.length-1);i++){
        if(darray[i] == item){
            return i;
            
        }
    }
    return null;
}


let lineParametricToImplicit = (a,b)=>{
    let ax = a[0],ay = a[1],bx = b[0],by = b[1];
    return [(by-ay),-(bx-ax),((ay*bx)-(ax*by))];
}

let pointOnLine = (p,a,b)=>{
    let line = lineParametricToImplicit(a,b);
    return ((p[0]*line[0]) + (p[1]*line[1]) + line[2]);
}


let pointFromLinePosition = (t,a,b)=>{
    let a0 = (((1-t)*a[0]) + (t*b[0])), a1 = (((1-t)*a[1]) + (t*b[1]));
    return [a0,a1];
}


let getAllChildrenNode = (scene,liststack)=>{
    if(scene.node.children.length != 0){
      let total = liststack.length, forbidindex = [0];
      let child1 = [], scindex = (isMemberOfArray(scene,liststack))?getIndex(scene,liststack):-1;
      forbidindex.push(scindex);
      for(let i=0;i<=(total-1);i++){
          if(isMemberOfArray(i,forbidindex)) continue;
          if(liststack[i].node.parent.node.name == scene.node.name){
             child1.push(liststack[i]); forbidindex.push(i);
          }
      }
      let newkid1 = [];
      for(let j=0;j<=(child1.length-1);j++){
          if(child1[j].node.children.length != 0){
              
              for(let i=0;i<=(total-1);i++){
                 if(isMemberOfArray(i,forbidindex)) continue;
                 if(liststack[i].node.parent.node.name == child1[j].node.name){
                   child1.push(liststack[i]); forbidindex.push(i);
                   newkid1.push(liststack[i]);
                 }
              }
          }
          continue;
      }
      
      
      let newkid2;
      if((newkid1 != null) && (newkid1.length != 0)) newkid2=[];

      if(newkid2){
          for(let j=0;j<=(newkid1.length-1);j++){
              if(newkid1[j].node.children.length != 0){
                  
                  for(let i=0;i<=(total-1);i++){
                     if(isMemberOfArray(i,forbidindex)) continue;
                     if(liststack[i].node.parent.node.name == newkid1[j].node.name){
                       child1.push(liststack[i]); forbidindex.push(i);
                       newkid2.push(liststack[i]);
                     }
                  }
              }
              continue;
          }
      }
      let newkid3 ;
      if((newkid2 != null) && (newkid2.length != 0)) newkid3=[];
      if(newkid3){
          for(let j=0;j<=(newkid2.length-1);j++){
              if(newkid2[j].node.children.length != 0){
                  
                  for(let i=0;i<=(total-1);i++){
                     if(isMemberOfArray(i,forbidindex)) continue;
                     if(liststack[i].node.parent.node.name == newkid2[j].node.name){
                       child1.push(liststack[i]); forbidindex.push(i);
                       newkid3.push(liststack[i]);
                     }
                  }
              }
              continue;
          }
      }

      let newkid4 ;
      if((newkid3 != null) && (newkid3.length != 0)) newkid4=[];
      if(newkid3){
          for(let j=0;j<=(newkid3.length-1);j++){
              if(newkid3[j].node.children.length != 0){
                  
                  for(let i=0;i<=(total-1);i++){
                     if(isMemberOfArray(i,forbidindex)) continue;
                     if(liststack[i].node.parent.node.name == newkid3[j].node.name){
                       child1.push(liststack[i]); forbidindex.push(i);
                       newkid4.push(liststack[i]);
                     }
                  }
              }
              continue;
          }
      }

      let newkid5 ;
      if((newkid4 != null) && (newkid4.length != 0)) newkid5=[];
      if(newkid4){
          for(let j=0;j<=(newkid4.length-1);j++){
              if(newkid4[j].node.children.length != 0){
                  
                  for(let i=0;i<=(total-1);i++){
                     if(isMemberOfArray(i,forbidindex)) continue;
                     if(liststack[i].node.parent.node.name == newkid4[j].node.name){
                       child1.push(liststack[i]); forbidindex.push(i);
                       newkid5.push(liststack[i]);
                     }
                  }
              }
              continue;
          }
      }


      return child1;
    }

   
}


export {matrixMul,matrixToCtx,getAllChildrenNode,isMemberOfArray,getIndex,lineParametricToImplicit,pointOnLine,matrixMulPoint,pointFromLinePosition}