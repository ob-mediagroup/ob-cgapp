import {circle,scene,node} from "./shape.js"
import {drawCircle,drawPolygon,drawCustom,createCanvas} from "./draw.js"
import {createGui} from "./gui.js"
import { stylec } from "./stylec.js";
import { polygon } from "./polygon.js";
import { setObjectBehavior } from "./setBehavior.js";
import { matrixMul,matrixToCtx,getAllChildrenNode,isMemberOfArray,getIndex,lineParametricToImplicit,pointOnLine,matrixMulPoint } from "./matrix.js";
import { custom } from "./custom.js";



let scenestack = [],liststack = [];//liststack is an array for collecting all scene nodes

let maindiv = document.getElementById('app'); maindiv.style.position = 'relative';
let mgui = createGui;

let canvas = document.getElementById('canvas');
let defaultWidth = maindiv.clientWidth;
let defaultHeight = maindiv.clientHeight;
let width = 0,height = 0; let appwidth,appheight;
appwidth = (width >0)?width:defaultWidth;appheight = (height >0)?height:defaultHeight;
canvas.width = appwidth; canvas.height = appheight;maindiv.appendChild(canvas);
let maincontext = canvas.getContext('2d');


const defaultCircle = new circle([0,0],12,'circle',true);
const defaultPolygon = new polygon([0,0],17,'polygon',5,true);
const defaultStyle = new stylec('stylec','#dad310','#da102f',2,'miter',null);


let stackdiv = document.createElement('div'); stackdiv.setAttribute('id','stackdiv');

let stacklist = document.createElement('ul');stacklist.setAttribute('id','stacklist'); stacklist.setAttribute('class','list');
stackdiv.appendChild(stacklist);
let scenelist = document.createElement('li');scenelist.textContent="Root";
stacklist.appendChild(scenelist);

let leftbar = document.createElement('div'); leftbar.setAttribute('id','leftbar');
let rightbar = document.createElement('div'); rightbar.setAttribute('id','rightbar');

let propdiv = document.createElement('div');propdiv.setAttribute('id','propdiv');
let propdivlist = [];//propdivlist is an array for collecting all prop controls

let activeNode = null;
let dummygrp = {name:''};




let createSceneNode = (type,shape,parent,offset)=>{
    
    if(type == 'root'){
            let mat = [[1,0,0],[0,1,0],[0,0,1]];
            let mnode = new node('root',null,[0,0],[0,0],'root',[0,0],mat,mat);
            let mscene = new scene(null,mnode,defaultStyle);
            scenestack.push(mscene); liststack.push(mscene);
            activeNode = mscene;
            scenelist.setAttribute('data-name',''+ mscene.node.name);
            scenelist.setAttribute('class',''+ mscene.node.name);
            scenelist.style.backgroundColor = 'lightseagreen';
            scenelist.style.color = 'white';
            scenelist.onclick = (evt)=>{
                evt.stopPropagation();

                activeNode = mscene;
                
                let lilist = document.querySelectorAll('li[data-name]');
                if(lilist){
                    for(let k=0;k<=(lilist.length-1);k++){
                        lilist[k].style.backgroundColor = 'white';
                        lilist[k].style.color = 'black';
                    }
                }
                scenelist.style.backgroundColor = 'lightseagreen';
                scenelist.style.color = 'white';

                if(propdiv.firstElementChild.getAttribute('id') != scenelist.dataset.name){
                    propdiv.removeChild(propdiv.firstElementChild);
                    for(let i=0;i<=(propdivlist.length-1);i++){
                        if(propdivlist[i].getAttribute('id') == scenelist.dataset.name ){
                            propdiv.appendChild(propdivlist[i]);
                        }
                    }
                }
            }




            let data = {name:mscene.node.name,ui:scenelist.getAttribute('id')};
            mscene.node.data = data;
            let rootprop = [mscene.node,mscene.stylec];
            propdiv.appendChild(mgui(rootprop));
            propdiv.firstElementChild.setAttribute('id',''+mscene.node.name);
            propdivlist.push(propdiv.firstElementChild);
            
            
            let mainroot = propdiv.querySelector('#'+ mscene.node.name);
           
            let field1 = mainroot.querySelector('fieldset:nth-of-type(1)');
            
            if(field1){
                let inp = field1.querySelectorAll('select[data-parent]');
                //inp[1].value = ''+ mscene.node.parent;
                if(inp){
                    let opti = document.createElement('option');
                        opti.setAttribute('id',''+ mscene.node.parent);
                        opti.textContent = ''+ mscene.node.parent;
                        inp[0].appendChild(opti);
                }
                
            }
             
            return mscene;
        }
        else if( type == (''+ shape.name)){
            let mat = [[1,0,0],[0,1,0],[0,0,1]];
             let mnode1 = new node((''+shape.name+(setTypeCount(type,liststack) + 1)),parent,parent.node.orientation,[1,1],(''+ shape.name),offset,mat,mat);
             let mscene1 = new scene(shape,mnode1,defaultStyle);
             parent.node.children.push(mscene1);liststack.push(mscene1);
             return mscene1;
        }
        else if(type == 'group'){
            let mat = [[1,0,0],[0,1,0],[0,0,1]];
            let mnode1 = new node(('group'+(setTypeCount(type,liststack) +1)),parent,parent.node.orientation,[1,1],'group',offset,mat,mat);
            let mscene1 = new scene(null,mnode1,defaultStyle);
            parent.node.children.push(mscene1);liststack.push(mscene1);
            return mscene1;
       }
}
createSceneNode('root',null,null,[0,0]);



let setTypeCount = (type,liststack)=>{
     let count = 0;     
    for(let j=0;j<=(liststack.length-1);j++){
             if(type == liststack[j].node.type){
                count +=1;
                continue;
             }
          }
          return count;   
}

let drawSceneNode = (scenenode,mode,counterclockwise)=>{
    let scenetype = scenenode.node.type; let scenestyle = scenenode.stylec;
    let scenemat = scenenode.node.transform;
    let sceneshape = scenenode.shape;
    let offcanvas = document.createElement('canvas');offcanvas.width = appwidth;offcanvas.height= appheight;
    let proxycontext = offcanvas.getContext('2d');

    proxycontext.translate((appwidth/2),(appheight/2));
    let mobject = {shape1:new circle([0,0],12,'circle',true),
                   shape2:new polygon([0,0],17,'polygon',5,true)
                  };

    if(scenetype=="circle" && mode=="create"){
        proxycontext.transform(...(matrixToCtx(scenemat)));
        drawCircle(proxycontext,defaultStyle,mobject.shape1.center,mobject.shape1.radius,mobject.shape1.name,mobject.shape1.solid,true);
        return offcanvas;
    }
    if(scenetype=="circle" && mode=="edit" && counterclockwise==true){
        proxycontext.transform(...(matrixToCtx(scenemat)));
        drawCircle(proxycontext,scenestyle,sceneshape.center,sceneshape.radius,sceneshape.name,sceneshape.solid,true);
        return offcanvas;
    }
    if(scenetype=="circle" && mode=="edit" && counterclockwise==false){
        proxycontext.transform(...(matrixToCtx(scenemat)));
        drawCircle(proxycontext,scenestyle,sceneshape.center,sceneshape.radius,sceneshape.name,sceneshape.solid,false);
        return offcanvas;
    }
    if(scenetype=="polygon" && mode=="create"){
        proxycontext.transform(...(matrixToCtx(scenemat)));
        drawPolygon(proxycontext,defaultStyle,mobject.shape2.center,mobject.shape2.radius,mobject.shape2.name,mobject.shape2.sides,true,mobject.shape2.solid);
        
        return offcanvas;
    }
    if(scenetype=="polygon" && mode=="edit" && counterclockwise==false){
        proxycontext.transform(...(matrixToCtx(scenemat)));
        drawPolygon(proxycontext,scenestyle,sceneshape.center,sceneshape.radius,sceneshape.name,sceneshape.sides,false,sceneshape.solid);
        return offcanvas;
    }
    if(scenetype=="polygon" && mode=="edit" && counterclockwise==true){
        proxycontext.transform(...(matrixToCtx(scenemat)));
        drawPolygon(proxycontext,scenestyle,sceneshape.center,sceneshape.radius,sceneshape.name,sceneshape.sides,true,sceneshape.solid);
        return offcanvas;
    }
    if(scenetype=="custom" && mode=="create"){
        proxycontext.transform(...(matrixToCtx(scenemat)));
        let vertices = sceneshape.vertices;

        let myobject = {};
        drawCustom(proxycontext,scenestyle,vertices,sceneshape.name,false,sceneshape.closed,'create',{});
        
        return offcanvas;
    }
    if(scenetype=="custom" && mode=="edit"){
        proxycontext.transform(...(matrixToCtx(scenemat)));
        let vertices = sceneshape.vertices,center = sceneshape.center;
        let solid =  sceneshape.solid;
        let vertexObjects = sceneshape.vertexObjects;
        let width = sceneshape.width,height = sceneshape.height;
        let myobject = {
            vertices,vertexObjects,height,width,center
        };
        drawCustom(proxycontext,scenestyle,vertices,sceneshape.name,solid,sceneshape.closed,'edit',myobject);
        
        return offcanvas;
    }
    

}
let stackarrange = (scene,parent)=>{
    if(parent.node.children.length != 0){
        let parentlist = document.querySelectorAll(`[data-name="${parent.node.name}"]`);
        console.log(parentlist[0]);
        if(parentlist[0].nodeName == 'LI'){
           let myli = document.createElement('li');
           myli.setAttribute('data-name',''+ scene.node.name);myli.textContent = ''+ scene.node.name;
           parentlist[0].style.backgroundColor = 'white';
           parentlist[0].style.color = 'black ';
           myli.style.backgroundColor = 'lightseagreen';
           myli.style.color = 'white';
           
           myli.onclick = (evt)=>{
                evt.stopPropagation();

                for(let j=0;j<=(liststack.length-1);j++){
                    if(liststack[j].node.name == myli.dataset.name){
                        activeNode = liststack[j];
                    }
                }
                
                let lilist = document.querySelectorAll('li[data-name]');
                if(lilist){
                    for(let k=0;k<=(lilist.length-1);k++){
                        lilist[k].style.backgroundColor = 'white';
                        lilist[k].style.color = 'black';
                    }
                }
                myli.style.backgroundColor = 'lightseagreen';
                myli.style.color = 'white';

                if(propdiv.firstElementChild.getAttribute('id') != myli.dataset.name){
                    propdiv.removeChild(propdiv.firstElementChild);
                    for(let i=0;i<=(propdivlist.length-1);i++){
                        if(propdivlist[i].getAttribute('id') == myli.dataset.name ){
                            propdiv.appendChild(propdivlist[i]);
                        }
                    }
                }

                let allLi = stacklist.querySelectorAll('li');
                /*
                for(let j=0;j<= (allLi.length-1);j++){
                    if(allLi[j].classList.contains(''+ scene.node.name)){
                        allLi[j].classList.remove('unclicked');
                       allLi[j].classList.add('clicked');     
                    }
                    else if(!(allLi[j].classList.contains(''+ scene.node.name))){
                        allLi[j].classList.remove('clicked');
                        allLi[j].classList.add('unclicked'); 
                    }
                }
                */
           };
           parentlist[0].appendChild(myli);  
        }
    }
    else{
        let parentlist = document.getElementsByClassName(''+ parent.node.name);
        if(parentlist[0].nodeName == 'LI'){
            let myli = document.createElement('li'),myul = document.createElement('ul');
            myli.setAttribute('data-name',''+ scene.node.name); myli.textContent = ''+ scene.node.name;
            parentlist[0].style.backgroundColor = 'white';
            parentlist[0].style.color = 'black ';
            myli.style.backgroundColor = 'lightseagreen';
            myli.style.color = 'white';


            myli.onclick = (evt)=>{
                evt.stopPropagation();
                for(let j=0;j<=(liststack.length-1);j++){
                    if(liststack[j].node.name == myli.dataset.name){
                        activeNode = liststack[j];
                    }
                }
                
                let lilist = document.querySelectorAll('li[data-name]');
                if(lilist){
                    for(let k=0;k<=(lilist.length-1);k++){
                        lilist[k].style.backgroundColor = 'white';
                        lilist[k].style.color = 'black';
                    }
                }
                myli.style.backgroundColor = 'lightseagreen';
                myli.style.color = 'white';
                
                
                
                if(propdiv.firstElementChild.getAttribute('id') != myli.dataset.name){
                    propdiv.removeChild(propdiv.firstElementChild);
                    for(let i=0;i<=(propdivlist.length-1);i++){
                        if(propdivlist[i].getAttribute('id') == myli.dataset.name ){
                            propdiv.appendChild(propdivlist[i]);
                        }
                    }
                }
                /* 
                let allLi = stacklist.querySelectorAll('li');
                for(let j=0;j<= (allLi.length-1);j++){
                    if(allLi[j].classList.contains(''+ scene.node.name)){
                        allLi[j].classList.add('clicked');     
                    }
                    else if(!(allLi[j].classList.contains(''+ scene.node.name))){
                        allLi[j].classList.remove('clicked');
                        allLi[j].classList.add('unclicked'); 
                    }
                }
                */
           };
            myul.appendChild(myli); 
            parentlist[0].appendChild(myul);
         }
    }
}





let propdivhide = (propdiv,activeNode)=>{
     let active = activeNode.node.data.ui; let kids = propdiv.children;
     console.log(activeNode.node.name);
    for(let j=0;j<=(kids.length-1);j++){
        if(active !=(kids[j].getAttribute('id'))){
            propdiv.removeChild(kids[j]);
        }else if(active ==(kids[j].getAttribute('id'))){
            propdiv.appendChild(kids[j]);
            
          }
    } 
}



let creatediv = document.createElement('div'); creatediv.setAttribute('id','creatediv');

let circlebtn = document.createElement('button'); circlebtn.setAttribute('id','circlebtn');circlebtn.textContent="Create Circle";
let polybtn = document.createElement('button'); polybtn.setAttribute('id','polybtn');polybtn.textContent="Create Polygon"
let groupbtn = document.createElement('button'); groupbtn.setAttribute('id','groupbtn');groupbtn.textContent="Create Group"
let custombtn = document.createElement('button'); custombtn.setAttribute('id','custombtn');custombtn.textContent="Create Custom"
creatediv.appendChild(circlebtn);creatediv.appendChild(polybtn);creatediv.appendChild(groupbtn);creatediv.appendChild(custombtn);


circlebtn.onclick = (evt)=>{
    maincontext.clearRect(0,0,appwidth,appheight);
    let nScene = createSceneNode('circle',new circle([0,0],12,'circle',true),activeNode,[0,0]);
    
    nScene.node.parent.node.children.push(nScene);
    let propobj = [nScene.shape,nScene.node,nScene.stylec];

    
    
    let circroot = mgui(propobj);  circroot.setAttribute('id',''+nScene.node.name);
    propdiv.appendChild(circroot);   
    
    let data = {name:nScene.node.name,ui:circroot.getAttribute('id')};

    nScene.node.data = data;
    activeNode = nScene;
    propdivlist.push(circroot);
    propdivhide(propdiv,activeNode);
    let mainroot = propdiv.querySelector('#'+ nScene.node.name);
            
            let field1 = mainroot.querySelector('fieldset:nth-of-type(2)');
            
            if(field1){
                let inp = field1.querySelectorAll('select[data-parent]');
                //inp[1].value = ''+ nScene.node.parent.node.name;
                if(inp){
                    for(let j=0;j<=(liststack.length-1);j++){
                        if(liststack[j].node.name == activeNode.node.name){
                            for(let i=0;i<=(propdivlist.length-1);i++){
                                if(propdivlist[i].getAttribute('id') == ''+ nScene.node.name){continue;}
                                
                                let getti = propdivlist[i].querySelectorAll('select[data-parent]');
                                let opti = document.createElement('option');
                                opti.setAttribute('id',''+liststack[j].node.name);
                                opti.textContent = ''+liststack[j].node.name;
                                getti[0].appendChild(opti);

                            }
                            continue;
                        }
                        let opti = document.createElement('option');
                        opti.setAttribute('id',''+liststack[j].node.name);
                        opti.textContent = ''+liststack[j].node.name;
                        inp[0].appendChild(opti);
                        if(liststack[j].node.name == activeNode.node.parent.node.name){
                            inp[0].selectedIndex = j;
                        }
                       
                    }
                }
                
            }

    stackarrange(nScene,nScene.node.parent);
    let dscenes = [],counter1 = 0;
    console.log(getAllChildrenNode(liststack[0],liststack));
     
    
    setObjectBehavior(activeNode,propdiv,maincontext,appwidth,appheight,scenestack,loopdraw,liststack,propdivlist);
    
    loopdraw(scenestack[0],maincontext,'create');
};

polybtn.onclick = (evt)=>{
    maincontext.clearRect(0,0,appwidth,appheight);
    let nScene = createSceneNode('polygon',new polygon([0,0],17,'polygon',5,true),activeNode,[0,0]);
    nScene.node.parent.node.children.push(nScene);

    let propobj = [nScene.shape,nScene.node,nScene.stylec];
    
    let polyroot = mgui(propobj);  polyroot.setAttribute('id',''+nScene.node.name);
    propdiv.appendChild(polyroot);  
    let data = {name:nScene.node.name,ui:polyroot.getAttribute('id')};
    nScene.node.data = data;
    activeNode = nScene;
    propdivlist.push(polyroot);
    propdivhide(propdiv,activeNode);
    
    let mainroot = propdiv.querySelector('#'+ nScene.node.name);
            
            let field1 = mainroot.querySelector('fieldset:nth-of-type(2)');
            
            if(field1){
                let inp = field1.querySelectorAll('select[data-parent]');
                //inp[1].value = ''+ nScene.node.parent.node.name;
                if(inp){
                    for(let j=0;j<=(liststack.length-1);j++){
                        if(liststack[j].node.name == activeNode.node.name){
                            for(let i=0;i<=(propdivlist.length-1);i++){
                                if(propdivlist[i].getAttribute('id') == ''+ nScene.node.name){continue;}
                                
                                let getti = propdivlist[i].querySelectorAll('select[data-parent]');
                                let opti = document.createElement('option');
                                opti.setAttribute('id',''+liststack[j].node.name);
                                opti.textContent = ''+liststack[j].node.name;
                                getti[0].appendChild(opti);

                            }
                            continue;
                        }
                        let opti = document.createElement('option');
                        opti.setAttribute('id',''+liststack[j].node.name);
                        opti.textContent = ''+liststack[j].node.name;
                        inp[0].appendChild(opti);
                        if(liststack[j].node.name == activeNode.node.parent.node.name){
                            inp[0].selectedIndex = j;
                        }
                       
                        
                    }
                }
                
            }
    
     stackarrange(nScene,nScene.node.parent); 
     loopdraw(scenestack[0],maincontext,'create'); 
    setObjectBehavior(activeNode,propdiv,maincontext,appwidth,appheight,scenestack,loopdraw,liststack,propdivlist); 
};

groupbtn.onclick = (evt)=>{
    maincontext.clearRect(0,0,appwidth,appheight);
    let nScene = createSceneNode('group',dummygrp,activeNode,[0,0]);
    nScene.node.parent.node.children.push(nScene);
    let propobj = [nScene.node,nScene.stylec];

    let grproot = mgui(propobj);  grproot.setAttribute('id','' +nScene.node.name);
    propdiv.appendChild(grproot);
    let data = {name:nScene.node.name,ui:grproot.getAttribute('id')};
    
    nScene.node.data = data;
    activeNode = nScene;
    propdivlist.push(grproot);
    propdivhide(propdiv,activeNode);


    let mainroot = propdiv.querySelector('#'+ nScene.node.name);
    console.log(mainroot.children);
           
            let field1 = mainroot.querySelector('fieldset:nth-of-type(1)');
            
            if(field1){
                let inp = field1.querySelectorAll('select[data-parent]');
                //inp[1].value = ''+ nScene.node.parent.node.name;
                if(inp){
                    for(let j=0;j<=(liststack.length-1);j++){
                        if(liststack[j].node.name == activeNode.node.name){
                            for(let i=0;i<=(propdivlist.length-1);i++){
                                if(propdivlist[i].getAttribute('id') == ''+ nScene.node.name){continue;}
                                
                                let getti = propdivlist[i].querySelectorAll('select[data-parent]');
                                let opti = document.createElement('option');
                                opti.setAttribute('id',''+liststack[j].node.name);
                                opti.textContent = ''+liststack[j].node.name;
                                getti[0].appendChild(opti);

                            }
                            continue;
                        }
                        let opti = document.createElement('option');
                        opti.setAttribute('id',''+liststack[j].node.name);
                        opti.textContent = ''+liststack[j].node.name;
                        inp[0].appendChild(opti);

                        if(liststack[j].node.name == activeNode.node.parent.node.name){
                            inp[0].selectedIndex = j;
                        }
                    }
                }
                
            }
    stackarrange(nScene,nScene.node.parent);
    loopdraw(scenestack[0],maincontext,'create');
    setObjectBehavior(activeNode,propdiv,maincontext,appwidth,appheight,scenestack,loopdraw,liststack,propdivlist); 
};

let custombtnstate = false; let btnmode = ['create','edit'],moder = btnmode[0];
let vertarray = [];
function bigger(evtr){
    let clickposx = evtr.clientX - canvas.getBoundingClientRect().x;
    let clickposy = evtr.clientY - canvas.getBoundingClientRect().y;
    vertarray.push([clickposx,clickposy]);
    if((vertarray.length >= 3) && (clickposx == vertarray[0]) && (clickposy == vertarray[1])){
        maincontext.clearRect(0,0,appwidth,appheight);
        let nScene = createSceneNode('custom',new custom(vertarray,true,'custom',false),activeNode,[0,0]);
        nScene.node.parent.node.children.push(nScene);
    }
    if(vertarray.length <= 1){
        maincontext.fillRect(vertarray[0][0],vertarray[0][1],2,2);
    }
    else if(vertarray.length > 1){
        maincontext.beginPath();
        maincontext.moveTo((vertarray[vertarray.length-2])[0],(vertarray[vertarray.length-2])[1]);
        maincontext.lineTo((vertarray[vertarray.length-1])[0],(vertarray[vertarray.length-1])[1]);
        maincontext.stroke();
        maincontext.fillRect((vertarray[vertarray.length-1])[0],(vertarray[vertarray.length-1])[1],2,2);
    }
}
custombtn.onclick = function(evt){
    
   
    if((!custombtnstate) && (moder == btnmode[0])){
        this.style.backgroundColor = 'lightseagreen';
        this.style.color = 'white';
        custombtnstate = !(custombtnstate);moder = btnmode[1];
        canvas.addEventListener('click',bigger);
    }
    else if((custombtnstate) && (moder == btnmode[1])){
        this.style.backgroundColor = '#efefef';
        this.style.color = 'black';
        custombtnstate = !(custombtnstate);moder = btnmode[0];
        canvas.removeEventListener('click',bigger);
        vertarray = [];
        

    }

}


leftbar.appendChild(creatediv);leftbar.appendChild(stackdiv);
rightbar.appendChild(propdiv);
maindiv.appendChild(leftbar);maindiv.appendChild(rightbar);







/*
let loopdraw = (scene,maincontext,mode)=>{
     
    if(scene.node.children.length != 0){
        for(let j=0;j<=(scene.node.children.length-1);j++){
            let child = scene.node.children[j];
            if(child.node.type=='group'){
                let nodecanvas = document.createElement('canvas');
                nodecanvas.width = appwidth;nodecanvas.height = appheight;
                let thiscontext = nodecanvas.getContext('2d'); 
                maincontext.drawImage(thiscontext,0,0);
                loopdraw(child,maincontext,mode);
            }
            else if(child.node.type=='circle'){
                
                maincontext.drawImage(drawSceneNode(child,mode,true),0,0);
                loopdraw(child,maincontext,mode);
            }
            else if(child.node.type=='polygon'){
                
                maincontext.drawImage(drawSceneNode(child,mode,true),0,0);
                loopdraw(child,maincontext,mode);
            }
        }
      }
      
}   */
let loopdraw = (scene,maincontext,mode)=>{
     
    if(scene.node.children.length != 0){
        for(let j=0;j<=(scene.node.children.length-1);j++){
            let child = scene.node.children[j];
            if(child.node.type=='group'){
                let nodecanvas = document.createElement('canvas');
                nodecanvas.width = appwidth;nodecanvas.height = appheight;
                let thiscontext = nodecanvas.getContext('2d'); 
                maincontext.drawImage(nodecanvas,0,0);
                loopdraw(child,maincontext,mode);
            }
            else if((child.node.type=='circle') || (child.node.type=='polygon') ){
                
                maincontext.drawImage(drawSceneNode(child,mode,true),0,0);
                loopdraw(child,maincontext,mode);
            }
            
        }
      }
      
} 


