

let createGui = (objects)=>{
    //args here represent the array of callback functions to be matched with each object props 
    let root = document.createElement('div');
     for(let i=0;i<=(objects.length-1);i++){
        //root.setAttribute('id','root'+ i);
        let fields = document.createElement('fieldset');
        let legend = document.createElement('legend');legend.textContent = ''+ objects[i].name;
        fields.appendChild(legend); 
        let proparray = [];
        for(let j=0; j <= (objects[i].prop.length - 1);j++){
            proparray.push(objects[i].prop[j]);
        }
        let mui = guiCreator(...proparray);
        for(let i =0;i<=(mui.length-1);i++){
            let div = document.createElement('div');div.setAttribute('class','prop-control');
            if(mui[i].label) div.appendChild(mui[i].label);
            if(mui[i].control) div.appendChild(mui[i].control);
            if(mui[i].label1) div.appendChild(mui[i].label1);
            if(mui[i].control1) div.appendChild(mui[i].control1);
            if(mui[i].label2) div.appendChild(mui[i].label2);
            if(mui[i].control2) div.appendChild(mui[i].control2);
            fields.appendChild(div);
        }
        
        root.appendChild(fields);
     }
     return root;
}

let guiCreator = (...args)=>{
    let myarr = [];
    let props = (function(){
        for(let i=0;i<= (args.length-1);i++){myarr.push(args[i])}
        return myarr;
     })();
    let uis = [];
    for(let i=0;i<= (props.length-1);i++){
        if(props[i].type=="float"){
            let proxy = {label:document.createElement('label'),control:document.createElement('input'),type:props[i].type};
            proxy.control.setAttribute('type','number');
            proxy.control.setAttribute('min','-60.0');
            proxy.control.setAttribute('max','60.0');
            proxy.control.setAttribute('step','0.25');
            proxy.control.setAttribute('name',''+props[i].name);
            proxy.control.setAttribute('value',''+props[i].value);
            proxy.label.setAttribute('for',''+proxy.control.getAttribute('name'));
            proxy.label.textContent = props[i].name;
            uis.push(proxy);
        }
        else if(props[i].type=="integer"){
            let proxy = {label:document.createElement('label'),control:document.createElement('input'),type:props[i].type};
            proxy.control.setAttribute('type','number');
            proxy.control.setAttribute('min','-1090.0');
            proxy.control.setAttribute('max','1090.0');
            proxy.control.setAttribute('step','2');
            proxy.control.setAttribute('name',''+props[i].name);
            proxy.control.setAttribute('value',''+props[i].value);
            proxy.label.setAttribute('for',''+proxy.control.getAttribute('name'));
            proxy.label.textContent = props[i].name;
            uis.push(proxy);
        }
        else if(props[i].type=="ivec2"){
            let proxy = {label1:document.createElement('label'),control1:document.createElement('input'),label2:document.createElement('label'),control2:document.createElement('input'),type:props[i].type};
            proxy.control1.setAttribute('type','number');
            proxy.control1.setAttribute('min','-1090');
            proxy.control1.setAttribute('max','1090');
            proxy.control1.setAttribute('step','1');
            proxy.control1.setAttribute('name',''+props[i].name+'.x');
            proxy.control1.setAttribute('value',''+props[i].value[0]);
            proxy.label1.setAttribute('for',''+proxy.control1.getAttribute('name'));
            proxy.label1.textContent = props[i].name + '.x';

            proxy.control2.setAttribute('type','number');
            proxy.control2.setAttribute('min','-1090');
            proxy.control2.setAttribute('max','1090');
            proxy.control2.setAttribute('step','1');
            proxy.control2.setAttribute('name',''+props[i].name+'.y');
            proxy.control2.setAttribute('value',''+props[i].value[1]);
            proxy.label2.setAttribute('for',''+proxy.control1.getAttribute('name'));
            proxy.label2.textContent = props[i].name +'.y';
            uis.push(proxy);
        }
        else if(props[i].type=="string"){
            let proxy = {label:document.createElement('label'),control:document.createElement('input')};
            proxy.control.setAttribute('type','text');
            proxy.control.setAttribute('minlength','2');
            proxy.control.setAttribute('maxlength','20');
            proxy.control.setAttribute('name',''+props[i].name);
            proxy.control.setAttribute('value',''+props[i].name);
            proxy.label.setAttribute('for',''+proxy.control.getAttribute('name'));
            proxy.label.textContent = props[i].name;
            uis.push(proxy);
        }
        else if(props[i].type=="boolean"){
            let proxy = {label:document.createElement('label'),control:document.createElement('input')};
            proxy.control.setAttribute('type','checkbox');
            
            proxy.control.setAttribute('name',''+props[i].name);
            proxy.control.setAttribute('value',''+props[i].name);
            proxy.label.setAttribute('for',''+proxy.control.getAttribute('name'));
            proxy.label.textContent = props[i].name;
            uis.push(proxy);
        }
        else if(props[i].type=="hexadecimal"){
            let proxy = {label:document.createElement('label'),control:document.createElement('input')};
            proxy.control.setAttribute('type','color');
            
            proxy.control.setAttribute('name',''+props[i].name);
            proxy.control.setAttribute('value',''+props[i].color);
            proxy.label.setAttribute('for',''+proxy.control.getAttribute('name'));
            proxy.label.textContent = props[i].name;
            uis.push(proxy);
        }
        else if(props[i].type=="stringdrop"){
            let proxy = {label:document.createElement('label'),control:document.createElement('select')};
            proxy.control.setAttribute('name',''+props[i].name);
            proxy.control.setAttribute('data-'+props[i].name,'');
            proxy.label.setAttribute('for',''+proxy.control.getAttribute('name'));
            proxy.label.textContent = props[i].name;
            uis.push(proxy);
        }

        else if(props[i].type=="divenum"){
            let proxy = {label:document.createElement('span'),control:document.createElement('div')};
            proxy.control.setAttribute('data-'+props[i].name,'');
            proxy.label.textContent = props[i].name;
            uis.push(proxy);
        }
        else if(props[i].type=="output"){
            let proxy = {label:document.createElement('span'),control:document.createElement('div')};
            proxy.control.setAttribute('data-'+props[i].name,'');
            proxy.label.textContent = props[i].name;
            uis.push(proxy);
        }
    }
    return uis;
}

export {createGui} ;