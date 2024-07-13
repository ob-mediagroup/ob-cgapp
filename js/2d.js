document.getElementById("drawing").width = document.querySelector('.draw-region').clientWidth;
document.getElementById("drawing").height = document.querySelector('.draw-region').clientHeight;
const ctx = document.getElementById("drawing").getContext("2d");
let width = document.getElementById("drawing").width, height = document.getElementById("drawing").height;
ctx.strokeStyle = "rgb(255,67,0)";ctx.lineWidth = 5;
ctx.beginPath();
let redius = width/8,centerw = width/2,centerh = height/2;
const p0 = [centerw,(centerh+redius)],p1 = [centerw,centerh-redius],pt1 = [centerw+redius,centerh];
let t = 0.5,b20 = Math.pow(1-t,2),b21 = t*(1-t),b22 = Math.pow(t,2);
let p2 = [(pt1[0] - (b20*p0[0] + b21*p1[0]))/b22,(pt1[1] - (b20*p0[1] + b21*p1[1]))/b22];
ctx.moveTo(p0[0],p0[1]);
ctx.quadraticCurveTo(pt1[0],pt1[1],p1[0],p1[1]);
ctx.stroke();
 