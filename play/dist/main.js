var rg=Object.defineProperty;var og=(n,t)=>{for(var e in t)rg(n,e,{get:t[e],enumerable:!0})};var uf=n=>(n%12e5+12e5)%12e5/12e5;var al=/^[A-Za-z0-9_]{3,16}$/,ff=[{id:"wanderer",name:"Wanderer"},{id:"ranger",name:"Ranger",slim:!0},{id:"miner",name:"Miner"},{id:"knight",name:"Knight"},{id:"astronaut",name:"Astronaut"},{id:"wizard",name:"Wizard"},{id:"farmer",name:"Farmer"},{id:"robot",name:"Robot"},{id:"ninja",name:"Ninja"},{id:"scout",name:"Scout",slim:!0}];var Mt={grassTop:0,grassSide:1,dirt:2,stone:3,sand:4,logSide:5,logTop:6,leaves:7,planks:8,brick:9,glass:10,lamp:11,water:12,strawberry:13},It=[];It[0]={name:"Air",opaque:!1,solid:!1,filter:0,emit:0};function Nn(n,t,e,i={}){It[n]={name:t,tex:e,opaque:!0,solid:!0,filter:0,emit:0,hard:.5,...i}}Nn(1,"Grass",[Mt.grassTop,Mt.grassSide,Mt.dirt],{hard:.45,sound:"grass"});Nn(2,"Dirt",[Mt.dirt,Mt.dirt,Mt.dirt],{hard:.375,sound:"gravel"});Nn(3,"Stone",[Mt.stone,Mt.stone,Mt.stone],{hard:1.25,sound:"stone"});Nn(4,"Sand",[Mt.sand,Mt.sand,Mt.sand],{hard:.375,sound:"sand"});Nn(5,"Log",[Mt.logTop,Mt.logSide,Mt.logTop],{hard:1,sound:"wood"});Nn(6,"Leaves",[Mt.leaves,Mt.leaves,Mt.leaves],{opaque:!1,filter:1,hard:.15,sound:"leaves"});Nn(7,"Planks",[Mt.planks,Mt.planks,Mt.planks],{hard:.8,sound:"wood"});Nn(8,"Brick",[Mt.brick,Mt.brick,Mt.brick],{hard:1.75,sound:"stone"});Nn(9,"Glass",[Mt.glass,Mt.glass,Mt.glass],{opaque:!1,hard:.225,sound:"glass"});Nn(10,"Lamp",[Mt.lamp,Mt.lamp,Mt.lamp],{emit:15,hard:.225,sound:"glass"});Nn(11,"Water",[Mt.water,Mt.water,Mt.water],{opaque:!1,solid:!1,filter:2,water:!0});var cl=[1,2,3,4,5,6,7,8,9,10];var Vo=.01;function Jn(n,t,e){let i=n%4+Vo+t*(1-2*Vo),s=Math.floor(n/4)+1-(Vo+e*(1-2*Vo));return[i/4,1-s/4]}var ll=1536*16,Fe=(n,t,e)=>n+16*(e+16*t),Go=class{constructor(t,e){this.cx=t,this.cz=e,this.blocks=new Uint8Array(ll),this.sky=new Uint8Array(ll),this.blk=new Uint8Array(ll),this.requested=!1,this.ready=!1,this.lit=!1,this.meshed=!1}};function On(n){return()=>{n=n+1831565813|0;let t=Math.imul(n^n>>>15,1|n);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function ls(n,t,e){let i=(n^Math.imul(t,374761393)^Math.imul(e,668265263))>>>0;return i=Math.imul(i^i>>>13,1274126177)>>>0,((i^i>>>16)>>>0)/4294967296}function li(n,t,e,i=0){let s=x=>i?(x%i+i)%i:x,r=Math.floor(t),a=Math.floor(e),o=t-r,c=e-a,l=o*o*(3-2*o),u=c*c*(3-2*c),f=ls(n,s(r),s(a)),h=ls(n,s(r+1),s(a)),p=ls(n,s(r),s(a+1)),g=ls(n,s(r+1),s(a+1));return f+(h-f)*l+(p-f)*u+(f-h-p+g)*l*u}var fl=30,lg=(n,t,e)=>{let i=Math.min(1,Math.max(0,(e-n)/(t-n)));return i*i*(3-2*i)};function df(n,t,e){let i=li(n+3,t/220,e/220),s=1-Math.abs(li(n+4,t/90,e/90)*2-1),r=li(n,t/24,e/24)*.6+li(n+1,t/10,e/10)*.3+li(n+2,t/4,e/4)*.1,a=14+i*26+r*12+s**3*42*lg(.45,.75,i);return Math.max(2,Math.min(84,Math.floor(a)))}var pf=n=>n>=64?3:n<=fl+1?4:1,hg=(n,t,e,i)=>i>fl+1&&i<62&&ls(n+7,t,e)<.012;function mf(n){let t=4096/2,e=4096/2;for(let i=0;i<512;i+=4)for(let s=0;s<Math.max(1,i*2);s++){let r=s/Math.max(1,i*2)*Math.PI*2,a=Math.floor(t+Math.cos(r)*i),o=Math.floor(e+Math.sin(r)*i),c=df(n,a,o);if(pf(c)===1)return[a+.5,o+.5]}return[t+.5,e+.5]}function gf(n,t){let i=20,s=n.cx*16,r=n.cz*16,a=new Int16Array(i*i);for(let l=-2;l<18;l++)for(let u=-2;u<18;u++)a[u+2+i*(l+2)]=df(t,s+u,r+l);let o=n.blocks;for(let l=0;l<16;l++)for(let u=0;u<16;u++){let f=a[u+2+i*(l+2)],h=pf(f),p=h===1?2:h;for(let g=0;g<=f;g++)o[Fe(u,g,l)]=g===f?h:g>f-4?p:3;for(let g=f+1;g<=fl;g++)o[Fe(u,g,l)]=11}let c=(l,u,f,h,p)=>{if(l<0||f<0||l>=16||f>=16||u<0||u>=96)return;let g=Fe(l,u,f);(p||o[g]===0)&&(o[g]=h)};for(let l=-2;l<18;l++)for(let u=-2;u<18;u++){let f=s+u,h=r+l,p=a[u+2+i*(l+2)];if(hg(t,f,h,p)){for(let g=p+1;g<=p+4;g++)c(u,g,l,5,!0);for(let g=3;g<=6;g++){let x=g>=5?1:2;for(let m=-x;m<=x;m++)for(let d=-x;d<=x;d++)x===2&&Math.abs(m)===2&&Math.abs(d)===2&&ls(t+g,f+m,h+d)<.5||c(u+m,p+g,l+d,6,!1)}}}}var pe=48,Wo=pe*pe,Xo=pe*96*pe,qs=new Uint8Array(Xo),Gs=new Uint8Array(Xo),Jr=new Uint8Array(Xo),Ws=new Int16Array(Wo),Ii=[],Kr=(n,t,e)=>n+pe*(e+pe*t);function xf(n,t){qs.fill(0);for(let i=-1;i<=1;i++)for(let s=-1;s<=1;s++){let r=n.get(t.cx+s,t.cz+i);if(!r)continue;let a=(s+1)*16,o=(i+1)*16;for(let c=0;c<96;c++)for(let l=0;l<16;l++)qs.set(r.blocks.subarray(Fe(0,c,l),Fe(0,c,l)+16),Kr(a,c,o+l))}Gs.fill(0),Jr.fill(0),Ii.length=0;for(let i=0;i<pe;i++)for(let s=0;s<pe;s++){let r=95;for(;r>=0;r--){let o=Kr(s,r,i),c=It[qs[o]];if(c.opaque||c.filter)break;Gs[o]=15}Ws[s+pe*i]=r+1;let a=15;for(;r>=0;r--){let o=Kr(s,r,i),c=It[qs[o]];if(c.opaque||(a=Math.max(0,a-c.filter),!a))break;Gs[o]=a,Ii.push(o)}}for(let i=0;i<pe;i++)for(let s=0;s<pe;s++){let r=Ws[s+pe*i],a=r;s>0&&(a=Math.max(a,Ws[s-1+pe*i])),s<pe-1&&(a=Math.max(a,Ws[s+1+pe*i])),i>0&&(a=Math.max(a,Ws[s+pe*(i-1)])),i<pe-1&&(a=Math.max(a,Ws[s+pe*(i+1)]));for(let o=r;o<Math.min(96,a);o++)Ii.push(Kr(s,o,i))}_f(Gs),Ii.length=0;for(let i=0;i<Xo;i++){let s=It[qs[i]].emit;s&&(Jr[i]=s,Ii.push(i))}_f(Jr);let e=new Uint8Array(9);for(let i=0;i<96;i++)for(let s=0;s<16;s++)for(let r=0;r<16;r++){let a=Kr(r+16,i,s+16),o=Fe(r,i,s);if(!(t.sky[o]===Gs[a]&&t.blk[o]===Jr[a])){t.sky[o]=Gs[a],t.blk[o]=Jr[a];for(let c=s===0?-1:0;c<=(s===15?1:0);c++)for(let l=r===0?-1:0;l<=(r===15?1:0);l++)e[l+1+3*(c+1)]=1}}return e}function _f(n){for(let t=0;t<Ii.length;t++){let e=Ii[t],i=n[e];if(i<=1)continue;let s=e%pe,r=(e/pe|0)%pe,a=e/Wo|0;s>0&&Xs(n,e-1,i),s<pe-1&&Xs(n,e+1,i),r>0&&Xs(n,e-pe,i),r<pe-1&&Xs(n,e+pe,i),a>0&&Xs(n,e-Wo,i),a<95&&Xs(n,e+Wo,i)}}function Xs(n,t,e){let i=It[qs[t]];if(i.opaque)return;let s=e-1-i.filter;s>n[t]&&(n[t]=s,Ii.push(t))}var vf=[{d:[1,0,0],c:[[1,0,0],[1,1,0],[1,1,1],[1,0,1]],k:1,s:.86},{d:[-1,0,0],c:[[0,0,1],[0,1,1],[0,1,0],[0,0,0]],k:1,s:.86},{d:[0,1,0],c:[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],k:0,s:1},{d:[0,-1,0],c:[[0,0,0],[1,0,0],[1,0,1],[0,0,1]],k:2,s:.6},{d:[0,0,1],c:[[1,0,1],[1,1,1],[0,1,1],[0,0,1]],k:1,s:.76},{d:[0,0,-1],c:[[0,0,0],[0,1,0],[1,1,0],[1,0,0]],k:1,s:.76}];for(let n of vf){let t=n.d.findIndex(s=>s!==0),e=(t+1)%3,i=(t+2)%3;n.corners=n.c.map(s=>{let r=[...n.d],a=[...n.d];r[e]+=s[e]?1:-1,a[i]+=s[i]?1:-1;let o=[...r];o[i]+=s[i]?1:-1;let c=t===1?[s[0],s[2]]:t===0?[s[2],s[1]]:[s[0],s[1]];return{c:s,s1:r,s2:a,s3:o,uv:c}})}var ug=[.45,.65,.82,1];function fg(n,t){return It[t].opaque?!1:n===11?t!==11:n===9?t!==9:!0}function yf(){return{pos:[],nor:[],uv:[],light:[],ind:[]}}function Mf(n,t){let e=[];for(let f=-1;f<=1;f++)for(let h=-1;h<=1;h++)e.push(n.get(t.cx+h,t.cz+f));let i=(f,h)=>e[(f>>4)+1+3*((h>>4)+1)],s=(f,h,p)=>{if(h<0)return 3;if(h>=96)return 0;let g=i(f,p);return g?g.blocks[Fe(f&15,h,p&15)]:0},r=(f,h,p)=>It[s(f,h,p)].opaque,a=(f,h,p)=>{if(h>=96)return 15;if(h<0)return 0;let g=i(f,p);return g?g.sky[Fe(f&15,h,p&15)]:15},o=(f,h,p)=>{if(h<0||h>=96)return 0;let g=i(f,p);return g?g.blk[Fe(f&15,h,p&15)]:0},c=yf(),l=yf(),u=[0,0,0,0];for(let f=0;f<96;f++)for(let h=0;h<16;h++)for(let p=0;p<16;p++){let g=t.blocks[Fe(p,f,h)];if(!g)continue;let x=It[g],m=x.water?l:c,d=g===11&&s(p,f+1,h)!==11;for(let M of vf){let _=p+M.d[0],b=f+M.d[1],R=h+M.d[2];if(b<0||!fg(g,s(_,b,R)))continue;let A=x.tex[M.k],w=m.pos.length/3;for(let H=0;H<4;H++){let y=M.corners[H],T=r(p+y.s1[0],f+y.s1[1],h+y.s1[2]),k=r(p+y.s2[0],f+y.s2[1],h+y.s2[2]),Y=T&&k||r(p+y.s3[0],f+y.s3[1],h+y.s3[2]),it=T&&k?0:3-T-k-Y,L=a(_,b,R),O=o(_,b,R),G=1;T||(L+=a(p+y.s1[0],f+y.s1[1],h+y.s1[2]),O+=o(p+y.s1[0],f+y.s1[1],h+y.s1[2]),G++),k||(L+=a(p+y.s2[0],f+y.s2[1],h+y.s2[2]),O+=o(p+y.s2[0],f+y.s2[1],h+y.s2[2]),G++),Y||(L+=a(p+y.s3[0],f+y.s3[1],h+y.s3[2]),O+=o(p+y.s3[0],f+y.s3[1],h+y.s3[2]),G++);let q=L/G/15,X=O/G/15,W=ug[it]*M.s;x.emit&&(X=1,W=1),m.pos.push(p+y.c[0],f+(d&&y.c[1]?.875:y.c[1]),h+y.c[2]),m.nor.push(M.d[0],M.d[1],M.d[2]),m.uv.push(...Jn(A,y.uv[0],y.uv[1])),m.light.push(q,X,W),u[H]=W*Math.max(q,X)}u[0]+u[2]>=u[1]+u[3]?m.ind.push(w,w+1,w+2,w,w+2,w+3):m.ind.push(w,w+1,w+3,w+1,w+2,w+3)}}return{solid:c,water:l}}var dg=4096/16,us=4096/16,$o=4,Zo=24,jr=n=>(n-2)*16,dl=new Map;function pg(n){if(!dl.has(n)){let t=[];for(let e=-n;e<=n;e++)for(let i=-n;i<=n;i++)t.push([i,e]);t.sort((e,i)=>e[0]*e[0]+e[1]*e[1]-(i[0]*i[0]+i[1]*i[1])),dl.set(n,t)}return dl.get(n)}var Yo=class{constructor(t,e,i){this.seed=t,this.gen=e,this.chunks=new Map,this.frames=0,this.loadR=i}inBounds(t,e){return t>=0&&e>=0&&t<dg&&e<us}get(t,e){return this.inBounds(t,e)?this.chunks.get(t*us+e):void 0}getBlock(t,e,i){if(t<0||i<0||t>=4096||i>=4096)return-2;if(e<0)return 3;if(e>=96)return 0;let s=this.chunks.get((t>>4)*us+(i>>4));return s?s.blocks[Fe(t&15,e,i&15)]:-1}getLight(t,e,i){if(e>=96)return[15,0];let s=t>=0&&i>=0&&t<4096&&i<4096?this.chunks.get((t>>4)*us+(i>>4)):null;if(!s?.lit||e<0)return[15,0];let r=Fe(t&15,e,i&15);return[s.sky[r],s.blk[r]]}setBlock(t,e,i,s){if(e<0||e>=96||t<0||i<0||t>=4096||i>=4096)return!1;let r=this.chunks.get((t>>4)*us+(i>>4));if(!r)return!1;let a=Fe(t&15,e,i&15);if(r.blocks[a]===s)return!1;r.blocks[a]=s;for(let o=-1;o<=1;o++)for(let c=-1;c<=1;c++){let l=this.get(r.cx+c,r.cz+o);if(!l)continue;let u=l.cx*16,f=l.cz*16,h=Math.max(u-t,0,t-(u+16-1)),p=Math.max(f-i,0,i-(f+16-1));h+p<=15&&(l.lit=!1)}for(let o=-1;o<=1;o++)for(let c=-1;c<=1;c++){let l=this.get(t+c>>4,i+o>>4);l&&(l.meshed=!1)}return!0}applyEdits(t,e,i){let s=this.get(t,e);if(s){for(let[r,a,o,c]of i)r>>4!==t||o>>4!==e||a<0||a>=96||!It[c]||(s.blocks[Fe(r&15,a,o&15)]=c);s.ready=!0,s.lit=!1,s.meshed=!1}}around(t,e){for(let i=-1;i<=1;i++)for(let s=-1;s<=1;s++){if(!s&&!i||!this.inBounds(t.cx+s,t.cz+i))continue;let r=this.get(t.cx+s,t.cz+i);if(!r||!e(r))return!1}return!0}update(t,e,i,s){let r=performance.now(),a=()=>performance.now()-r>i,o=[];for(let[c,l]of pg(this.loadR)){let u=t+c,f=e+l;if(!this.inBounds(u,f))continue;let h=this.get(u,f);if(!h){if(a())continue;h=new Go(u,f),gf(h,this.seed),this.chunks.set(u*us+f,h)}if(h.requested||o.push(h),!!h.ready){if(!h.lit){if(a()||!this.around(h,g=>g.ready))continue;let p=xf(this,h);h.lit=!0;for(let g=0;g<9;g++){if(!p[g])continue;let x=this.get(h.cx+g%3-1,h.cz+Math.floor(g/3)-1);x&&(x.meshed=!1)}}if(!h.meshed){if(a()||!this.around(h,p=>p.lit))continue;s.mesh(h,Mf(this,h)),h.meshed=!0}}}if(o.length&&s.request(o),++this.frames%30===0)for(let c of this.chunks.values())Math.max(Math.abs(c.cx-t),Math.abs(c.cz-e))<=this.loadR+2||(s.unload(c),this.chunks.delete(c.cx*us+c.cz))}};var Sf="yardcraft.settings",fs=matchMedia("(pointer: coarse)").matches,Qr=[1024,2048,4096,8192],Dt={sens:100,volume:100,fov:75,distance:fs?6:9,view:0,shadows:!fs,shadowRes:2048,invert:!1,hand:!0,autoJump:fs};try{Object.assign(Dt,JSON.parse(localStorage.getItem(Sf)??"{}"))}catch{}Dt.distance=Math.max($o,Math.min(Zo,Math.round(Dt.distance)||9));Qr.includes(Dt.shadowRes)||(Dt.shadowRes=2048);var bf=[];function Fn(n,t){bf.push([n,t])}function Ys(n,t){Dt[n]=t;try{localStorage.setItem(Sf,JSON.stringify(Dt))}catch{}for(let[e,i]of bf)(e===n||e==="*")&&i(t,n)}var pl=["grass","gravel","sand","stone","wood","leaves","glass","shatter","hurt","pop","hum","hup","crunch","burp"],Ef=4,mg=.4;function ml(n,t,e,i){let s=2*Math.PI*Math.min(t,i*.45)/i,r=Math.cos(s),a=Math.sin(s)/(2*e),o,c,l;n==="lowpass"?(o=(1-r)/2,c=1-r,l=o):n==="highpass"?(o=(1+r)/2,c=-(1+r),l=o):(o=a,c=0,l=-a);let u=1+a;return[o/u,c/u,l/u,-2*r/u,(1-a)/u]}function ve(n,t,e,{at:i,len:s,decay:r,f:a,q:o=1,type:c="bandpass",amp:l,attack:u=.0025}){let[f,h,p,g,x]=ml(c,a,o,t),m=Math.floor(i*t),d=Math.min(n.length-m,Math.floor((s+r*6)*t)),M=0,_=0,b=0,R=0;for(let A=0;A<d;A++){let w=A/t,H=(w<u?w/u:1)*(w<s?1:Math.exp(-(w-s)/r)),y=(e()*2-1)*H,T=f*y+h*M+p*_-g*b-x*R;_=M,M=y,R=b,b=T,n[m+A]+=T*l}}function to(n,t,{at:e,f:i,decay:s,amp:r}){let a=Math.floor(e*t),o=Math.min(n.length-a,Math.floor(s*7*t));for(let c=0;c<o;c++){let l=c/t;n[a+c]+=Math.sin(2*Math.PI*i*l)*Math.exp(-l/s)*Math.min(1,l/.002)*r}}var at=(n,t,e)=>t+(e-t)*n(),ds={grass(n,t,e){ve(n,t,e,{at:0,len:.03,decay:.025,f:320,type:"lowpass",q:.7,amp:.7});for(let i=0,s=at(e,12,18);i<s;i++)ve(n,t,e,{at:.16*e()**1.7,len:at(e,.002,.007),decay:at(e,.003,.008),f:at(e,1300,4200),q:at(e,.7,1.2),amp:at(e,.2,.45)})},gravel(n,t,e){ve(n,t,e,{at:0,len:.02,decay:.025,f:240,type:"lowpass",q:.8,amp:.8});for(let i=0,s=at(e,18,26);i<s;i++)ve(n,t,e,{at:.17*e()**1.5,len:at(e,.003,.012),decay:at(e,.004,.012),f:at(e,500,2e3),q:at(e,.9,1.6),amp:at(e,.3,.6)})},sand(n,t,e){ve(n,t,e,{at:0,len:.035,decay:.025,f:at(e,1600,2400),q:.6,amp:.4,attack:.012}),ve(n,t,e,{at:0,len:.02,decay:.03,f:200,type:"lowpass",q:.7,amp:.35});for(let i=0,s=at(e,8,13);i<s;i++)ve(n,t,e,{at:.1*e()**1.4,len:at(e,.004,.012),decay:at(e,.005,.012),f:at(e,1e3,3200),q:at(e,.7,1.1),amp:at(e,.12,.28)})},stone(n,t,e){ve(n,t,e,{at:0,len:.004,decay:.018,f:at(e,260,420),q:2,amp:1.2});for(let i=0,s=at(e,3,6);i<s;i++)ve(n,t,e,{at:.025*e()**2,len:at(e,.001,.003),decay:at(e,.003,.007),f:at(e,1100,2800),q:at(e,1.8,3),amp:at(e,.4,.75)});for(let i=0,s=at(e,4,8);i<s;i++)ve(n,t,e,{at:at(e,.02,.12),len:.002,decay:at(e,.003,.006),f:at(e,700,2e3),q:1.5,amp:at(e,.1,.2)})},wood(n,t,e){let i=at(e,170,300);to(n,t,{at:0,f:i,decay:.022,amp:.45}),to(n,t,{at:0,f:i*2.65,decay:.014,amp:.3}),to(n,t,{at:0,f:i*4.9,decay:.01,amp:.18}),ve(n,t,e,{at:0,len:.002,decay:.004,f:at(e,1e3,1800),q:1,amp:.45}),ve(n,t,e,{at:0,len:.01,decay:.02,f:i*1.5,q:1.5,amp:.5});for(let s=0,r=at(e,3,6);s<r;s++)ve(n,t,e,{at:at(e,.01,.08),len:.003,decay:.006,f:at(e,700,1600),q:2,amp:at(e,.1,.2)})},leaves(n,t,e){for(let i=0,s=at(e,22,32);i<s;i++)ve(n,t,e,{at:.2*e()**1.3,len:at(e,.003,.012),decay:at(e,.004,.012),f:at(e,1800,5e3),q:at(e,.6,1.1),amp:at(e,.12,.32)});ve(n,t,e,{at:0,len:.04,decay:.04,f:2600,q:.5,amp:.15,attack:.015})},glass(n,t,e){ve(n,t,e,{at:0,len:.003,decay:.012,f:at(e,300,450),q:2,amp:.8}),ve(n,t,e,{at:0,len:.002,decay:.004,f:2200,q:1,amp:.35});for(let i=0,s=at(e,2,4);i<s;i++)to(n,t,{at:.012*e(),f:at(e,2600,4800),decay:at(e,.008,.02),amp:at(e,.15,.3)})},shatter(n,t,e){ve(n,t,e,{at:0,len:.01,decay:.02,f:1800,q:.8,amp:.9}),ve(n,t,e,{at:0,len:.005,decay:.02,f:300,type:"lowpass",amp:.6});for(let i=0,s=at(e,28,38);i<s;i++)ve(n,t,e,{at:.3*e()**2,len:at(e,.001,.004),decay:at(e,.01,.035),f:at(e,1800,6e3),q:at(e,3,7),amp:at(e,.18,.45)});for(let i=0,s=at(e,6,10);i<s;i++)to(n,t,{at:.2*e()**2,f:at(e,2e3,5e3),decay:at(e,.015,.05),amp:at(e,.05,.12)})}};ds.hurt=(n,t,e)=>{let i=Math.floor(.22*t),s=new Float32Array(i),r=at(e,150,200),a=0;for(let o=0;o<i;o++){let c=o/t;a+=r*(1-.35*Math.min(1,c/.18))/t;let l=Math.min(1,c/.012)*Math.exp(-Math.max(0,c-.05)/.05);s[o]=(a%1*2-1)*l}for(let[o,c,l]of[[360,4,1],[820,5,.45],[2400,6,.08]]){let[u,f,h,p,g]=ml("bandpass",o,c,t),x=0,m=0,d=0,M=0;for(let _=0;_<i;_++){let b=s[_],R=u*b+f*x+h*m-p*d-g*M;m=x,x=b,M=d,d=R,n[_]+=R*l}}ve(n,t,e,{at:.09,len:.04,decay:.03,f:1400,q:.7,amp:.05,attack:.02})};ds.pop=(n,t,e)=>{let i=Math.floor(.07*t),s=at(e,420,520),r=0;for(let a=0;a<i;a++){let o=a/t;r+=s*(1+1.8*(o/.07))/t,n[a]+=Math.sin(2*Math.PI*r)*Math.min(1,o/.003)*Math.exp(-o/.018)}};function gl(n,t,e,{len:i,f0:s,env:r,formants:a,rough:o=0}){let c=Math.floor(i*t),l=new Float32Array(c),u=0;for(let f=0;f<c;f++){let h=f/t;u+=s(h)*(1+(e()*2-1)*o)/t,l[f]=(u%1*2-1)*r(h)}for(let[f,h,p]of a){let[g,x,m,d,M]=ml("bandpass",f,h,t),_=0,b=0,R=0,A=0;for(let w=0;w<c;w++){let H=l[w],y=g*H+x*_+m*b-d*R-M*A;b=_,_=H,A=R,R=y,n[w]+=y*p}}}ds.hum=(n,t,e)=>{let i=at(e,300,360),s=[1,at(e,1.1,1.26),at(e,.88,1)];gl(n,t,e,{len:.38,f0:r=>i*s[Math.min(2,Math.floor(r/.125))]*(1+.015*Math.sin(r*40)),env:r=>Math.min(1,r/.03)*Math.exp(-Math.max(0,r-.28)/.04)*(.7+.3*Math.cos(r%.125/.125*Math.PI*2)),formants:[[420,3,1],[900,5,.25]]})};ds.hup=(n,t,e)=>{let i=at(e,520,640);gl(n,t,e,{len:.2,f0:s=>i*(1+.7*Math.min(1,s/.05)-.3*Math.max(0,(s-.08)/.12)),env:s=>Math.min(1,s/.006)*Math.exp(-Math.max(0,s-.09)/.035),formants:[[700,3,1],[1700,4,.5],[3e3,6,.12]],rough:.02})};ds.crunch=(n,t,e)=>{ve(n,t,e,{at:0,len:.02,decay:.03,f:380,type:"lowpass",q:.8,amp:.6});for(let i=0,s=at(e,14,22);i<s;i++)ve(n,t,e,{at:.09*e()**1.4,len:at(e,.002,.008),decay:at(e,.004,.01),f:at(e,900,3400),q:at(e,.8,1.5),amp:at(e,.25,.5)})};ds.burp=(n,t,e)=>{let i=at(e,80,100);gl(n,t,e,{len:.36,f0:s=>i*(1.1-.25*(s/.36)),env:s=>Math.min(1,s/.03)*Math.exp(-Math.max(0,s-.2)/.06),formants:[[420,3,1],[900,4,.5]],rough:.25})};function wf(n,t,e){let i=new Float32Array(Math.floor(mg*e));ds[n](i,e,On(pl.indexOf(n)*101+t*7+1));let s=0;for(let a of i)s=Math.max(s,Math.abs(a));let r=Math.floor(.01*e);for(let a=0;a<r;a++)i[i.length-1-a]*=a/r;if(s>0)for(let a=0;a<i.length;a++)i[a]*=.9/s;return i}var Tf={step:{volume:.32,rate:1},hit:{volume:.26,rate:.6},break:{volume:.9,rate:.8},place:{volume:.9,rate:.8}},gg={stone:1.5,glass:1.4,wood:1.15},_g=16,tn=null,Zs=null,Af=new Map,$s={x:0,y:0,z:0,yaw:0},Rf=1;function Cf(){if(!tn){let n=window.AudioContext??window.webkitAudioContext;if(!n)return;tn=new n,Zs=tn.createGain(),Zs.gain.value=Rf;let t=tn.createBiquadFilter();t.type="lowpass",t.frequency.value=5e3,t.Q.value=.5,Zs.connect(t).connect(tn.destination);for(let e of pl)Af.set(e,Array.from({length:Ef},(i,s)=>{let r=wf(e,s,tn.sampleRate),a=tn.createBuffer(1,r.length,tn.sampleRate);return a.copyToChannel(r,0),a}))}tn.state==="suspended"&&tn.resume()}function _l(n){Rf=n,Zs&&(Zs.gain.value=n)}function Pf(n,t,e,i){Object.assign($s,{x:n,y:t,z:e,yaw:i})}function Bn(n,t,e,i,{volume:s=1,rate:r=1}={}){if(!tn||tn.state!=="running")return;let a=t-$s.x,o=e-$s.y,c=i-$s.z,l=Math.hypot(a,o,c),u=Math.max(0,1-l/_g);if(u<=0)return;let f=Af.get(n),h=tn.createBufferSource();h.buffer=f[Math.floor(Math.random()*f.length)],h.playbackRate.value=r*(.92+Math.random()*.16);let p=tn.createGain();p.gain.value=s*u*(gg[n]??1);let g=tn.createStereoPanner(),x=l>.5?(a*Math.cos($s.yaw)-c*Math.sin($s.yaw))/l:0;g.pan.value=x*.7,h.connect(p).connect(g).connect(Zs),h.start()}function hn(n,t,e,i,s,r=1){if(!n?.sound)return;let a=t==="break"&&n.sound==="glass"?"shatter":n.sound;Bn(a,e,i,s,{volume:Tf[t].volume*r,rate:Tf[t].rate})}var xg=0,Lf=1,yg=2;var lp=1,Nh=2,mi=3,Qn=0,un=1,rn=2;var Hi=0,xr=1,If=2,Df=3,Uf=4,vg=5,ys=100,Mg=101,Sg=102,Nf=103,Of=104,bg=200,Eg=201,wg=202,Tg=203,Kl=204,jl=205,Ag=206,Rg=207,Cg=208,Pg=209,Lg=210,Ig=211,Dg=212,Ug=213,Ng=214,Og=0,Fg=1,Bg=2,Ra=3,zg=4,kg=5,Hg=6,Vg=7,Oh=0,Gg=1,Wg=2,Vi=0,Xg=1,qg=2,Yg=3,$g=4,Zg=5,Jg=6;var hp=300,Sr=301,br=302,Ql=303,th=304,ec=306,uo=1e3,Vn=1001,eh=1002,Ge=1003,Ff=1004;var xl=1005;var wn=1006,Kg=1007;var fo=1008;var Gi=1009,jg=1010,Qg=1011,Fh=1012,up=1013,Bi=1014,zi=1015,po=1016,fp=1017,dp=1018,Ms=1020,t_=1021,Gn=1023,e_=1024,n_=1025,Ss=1026,Er=1027,i_=1028,pp=1029,s_=1030,mp=1031,gp=1033,yl=33776,vl=33777,Ml=33778,Sl=33779,Bf=35840,zf=35841,kf=35842,Hf=35843,_p=36196,Vf=37492,Gf=37496,Wf=37808,Xf=37809,qf=37810,Yf=37811,$f=37812,Zf=37813,Jf=37814,Kf=37815,jf=37816,Qf=37817,td=37818,ed=37819,nd=37820,id=37821,bl=36492,sd=36494,rd=36495,r_=36283,od=36284,ad=36285,cd=36286;var Ca=2300,Pa=2301,El=2302,ld=2400,hd=2401,ud=2402;var xp=3e3,bs=3001,o_=3200,a_=3201,yp=0,c_=1,Tn="",Pe="srgb",yi="srgb-linear",Bh="display-p3",nc="display-p3-linear",La="linear",me="srgb",Ia="rec709",Da="p3";var Js=7680;var fd=519,l_=512,h_=513,u_=514,vp=515,f_=516,d_=517,p_=518,m_=519,nh=35044;var dd="300 es",ih=1035,_i=2e3,Ua=2001,Wi=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let i=this._listeners[t.type];if(i!==void 0){t.target=this;let s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}},Ye=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],pd=1234567,yr=Math.PI/180,mo=180/Math.PI;function xi(){let n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ye[n&255]+Ye[n>>8&255]+Ye[n>>16&255]+Ye[n>>24&255]+"-"+Ye[t&255]+Ye[t>>8&255]+"-"+Ye[t>>16&15|64]+Ye[t>>24&255]+"-"+Ye[e&63|128]+Ye[e>>8&255]+"-"+Ye[e>>16&255]+Ye[e>>24&255]+Ye[i&255]+Ye[i>>8&255]+Ye[i>>16&255]+Ye[i>>24&255]).toLowerCase()}function sn(n,t,e){return Math.max(t,Math.min(e,n))}function zh(n,t){return(n%t+t)%t}function g_(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function __(n,t,e){return n!==t?(e-n)/(t-n):0}function co(n,t,e){return(1-e)*n+e*t}function x_(n,t,e,i){return co(n,t,1-Math.exp(-e*i))}function y_(n,t=1){return t-Math.abs(zh(n,t*2)-t)}function v_(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function M_(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function S_(n,t){return n+Math.floor(Math.random()*(t-n+1))}function b_(n,t){return n+Math.random()*(t-n)}function E_(n){return n*(.5-Math.random())}function w_(n){n!==void 0&&(pd=n);let t=pd+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function T_(n){return n*yr}function A_(n){return n*mo}function sh(n){return(n&n-1)===0&&n!==0}function R_(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Na(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function C_(n,t,e,i,s){let r=Math.cos,a=Math.sin,o=r(e/2),c=a(e/2),l=r((t+i)/2),u=a((t+i)/2),f=r((t-i)/2),h=a((t-i)/2),p=r((i-t)/2),g=a((i-t)/2);switch(s){case"XYX":n.set(o*u,c*f,c*h,o*l);break;case"YZY":n.set(c*h,o*u,c*f,o*l);break;case"ZXZ":n.set(c*f,c*h,o*u,o*l);break;case"XZX":n.set(o*u,c*g,c*p,o*l);break;case"YXY":n.set(c*p,o*u,c*g,o*l);break;case"ZYZ":n.set(c*g,c*p,o*u,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function jn(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function re(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}var kh={DEG2RAD:yr,RAD2DEG:mo,generateUUID:xi,clamp:sn,euclideanModulo:zh,mapLinear:g_,inverseLerp:__,lerp:co,damp:x_,pingpong:y_,smoothstep:v_,smootherstep:M_,randInt:S_,randFloat:b_,randFloatSpread:E_,seededRandom:w_,degToRad:T_,radToDeg:A_,isPowerOfTwo:sh,ceilPowerOfTwo:R_,floorPowerOfTwo:Na,setQuaternionFromProperEuler:C_,normalize:re,denormalize:jn},$t=class n{constructor(t=0,e=0){n.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(sn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*i-a*s+t.x,this.y=r*s+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Yt=class n{constructor(t,e,i,s,r,a,o,c,l){n.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,c,l)}set(t,e,i,s,r,a,o,c,l){let u=this.elements;return u[0]=t,u[1]=s,u[2]=o,u[3]=e,u[4]=r,u[5]=c,u[6]=i,u[7]=a,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[3],c=i[6],l=i[1],u=i[4],f=i[7],h=i[2],p=i[5],g=i[8],x=s[0],m=s[3],d=s[6],M=s[1],_=s[4],b=s[7],R=s[2],A=s[5],w=s[8];return r[0]=a*x+o*M+c*R,r[3]=a*m+o*_+c*A,r[6]=a*d+o*b+c*w,r[1]=l*x+u*M+f*R,r[4]=l*m+u*_+f*A,r[7]=l*d+u*b+f*w,r[2]=h*x+p*M+g*R,r[5]=h*m+p*_+g*A,r[8]=h*d+p*b+g*w,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],u=t[8];return e*a*u-e*o*l-i*r*u+i*o*c+s*r*l-s*a*c}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],u=t[8],f=u*a-o*l,h=o*c-u*r,p=l*r-a*c,g=e*f+i*h+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/g;return t[0]=f*x,t[1]=(s*l-u*i)*x,t[2]=(o*i-s*a)*x,t[3]=h*x,t[4]=(u*e-s*c)*x,t[5]=(s*r-o*e)*x,t[6]=p*x,t[7]=(i*c-l*e)*x,t[8]=(a*e-i*r)*x,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,a,o){let c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*a+l*o)+a+t,-s*l,s*c,-s*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(wl.makeScale(t,e)),this}rotate(t){return this.premultiply(wl.makeRotation(-t)),this}translate(t,e){return this.premultiply(wl.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}},wl=new Yt;function Mp(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Oa(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function P_(){let n=Oa("canvas");return n.style.display="block",n}var md={};function lo(n){n in md||(md[n]=!0,console.warn(n))}var gd=new Yt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),_d=new Yt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Jo={[yi]:{transfer:La,primaries:Ia,toReference:n=>n,fromReference:n=>n},[Pe]:{transfer:me,primaries:Ia,toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[nc]:{transfer:La,primaries:Da,toReference:n=>n.applyMatrix3(_d),fromReference:n=>n.applyMatrix3(gd)},[Bh]:{transfer:me,primaries:Da,toReference:n=>n.convertSRGBToLinear().applyMatrix3(_d),fromReference:n=>n.applyMatrix3(gd).convertLinearToSRGB()}},L_=new Set([yi,nc]),oe={enabled:!0,_workingColorSpace:yi,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!L_.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,t,e){if(this.enabled===!1||t===e||!t||!e)return n;let i=Jo[t].toReference,s=Jo[e].fromReference;return s(i(n))},fromWorkingColorSpace:function(n,t){return this.convert(n,this._workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this._workingColorSpace)},getPrimaries:function(n){return Jo[n].primaries},getTransfer:function(n){return n===Tn?La:Jo[n].transfer}};function vr(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Tl(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var Ks,Fa=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Ks===void 0&&(Ks=Oa("canvas")),Ks.width=t.width,Ks.height=t.height;let i=Ks.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Ks}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Oa("canvas");e.width=t.width,e.height=t.height;let i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);let s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=vr(r[a]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(vr(e[i]/255)*255):e[i]=vr(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},I_=0,Ba=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:I_++}),this.uuid=xi(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Al(s[a].image)):r.push(Al(s[a]))}else r=Al(s);i.url=r}return e||(t.images[this.uuid]=i),i}};function Al(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Fa.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var D_=0,An=class n extends Wi{constructor(t=n.DEFAULT_IMAGE,e=n.DEFAULT_MAPPING,i=Vn,s=Vn,r=wn,a=fo,o=Gn,c=Gi,l=n.DEFAULT_ANISOTROPY,u=Tn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:D_++}),this.uuid=xi(),this.name="",this.source=new Ba(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new $t(0,0),this.repeat=new $t(1,1),this.center=new $t(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof u=="string"?this.colorSpace=u:(lo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=u===bs?Pe:Tn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==hp)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case uo:t.x=t.x-Math.floor(t.x);break;case Vn:t.x=t.x<0?0:1;break;case eh:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case uo:t.y=t.y-Math.floor(t.y);break;case Vn:t.y=t.y<0?0:1;break;case eh:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return lo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Pe?bs:xp}set encoding(t){lo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===bs?Pe:Tn}};An.DEFAULT_IMAGE=null;An.DEFAULT_MAPPING=hp;An.DEFAULT_ANISOTROPY=1;var ke=class n{constructor(t=0,e=0,i=0,s=1){n.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*i+a[11]*s+a[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r,c=t.elements,l=c[0],u=c[4],f=c[8],h=c[1],p=c[5],g=c[9],x=c[2],m=c[6],d=c[10];if(Math.abs(u-h)<.01&&Math.abs(f-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(f+x)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let _=(l+1)/2,b=(p+1)/2,R=(d+1)/2,A=(u+h)/4,w=(f+x)/4,H=(g+m)/4;return _>b&&_>R?_<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(_),s=A/i,r=w/i):b>R?b<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(b),i=A/s,r=H/s):R<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),i=w/r,s=H/r),this.set(i,s,r,e),this}let M=Math.sqrt((m-g)*(m-g)+(f-x)*(f-x)+(h-u)*(h-u));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(f-x)/M,this.z=(h-u)/M,this.w=Math.acos((l+p+d-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},rh=class extends Wi{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ke(0,0,t,e),this.scissorTest=!1,this.viewport=new ke(0,0,t,e);let s={width:t,height:e,depth:1};i.encoding!==void 0&&(lo("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),i.colorSpace=i.encoding===bs?Pe:Tn),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:wn,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},i),this.texture=new An(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=i.generateMipmaps,this.texture.internalFormat=i.internalFormat,this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}setSize(t,e,i=1){(this.width!==t||this.height!==e||this.depth!==i)&&(this.width=t,this.height=e,this.depth=i,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=i,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new Ba(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},vi=class extends rh{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}},za=class extends An{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Ge,this.minFilter=Ge,this.wrapR=Vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var oh=class extends An{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Ge,this.minFilter=Ge,this.wrapR=Vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Xi=class{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,a,o){let c=i[s+0],l=i[s+1],u=i[s+2],f=i[s+3],h=r[a+0],p=r[a+1],g=r[a+2],x=r[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=u,t[e+3]=f;return}if(o===1){t[e+0]=h,t[e+1]=p,t[e+2]=g,t[e+3]=x;return}if(f!==x||c!==h||l!==p||u!==g){let m=1-o,d=c*h+l*p+u*g+f*x,M=d>=0?1:-1,_=1-d*d;if(_>Number.EPSILON){let R=Math.sqrt(_),A=Math.atan2(R,d*M);m=Math.sin(m*A)/R,o=Math.sin(o*A)/R}let b=o*M;if(c=c*m+h*b,l=l*m+p*b,u=u*m+g*b,f=f*m+x*b,m===1-o){let R=1/Math.sqrt(c*c+l*l+u*u+f*f);c*=R,l*=R,u*=R,f*=R}}t[e]=c,t[e+1]=l,t[e+2]=u,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,s,r,a){let o=i[s],c=i[s+1],l=i[s+2],u=i[s+3],f=r[a],h=r[a+1],p=r[a+2],g=r[a+3];return t[e]=o*g+u*f+c*p-l*h,t[e+1]=c*g+u*h+l*f-o*p,t[e+2]=l*g+u*p+o*h-c*f,t[e+3]=u*g-o*f-c*h-l*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let i=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(i/2),u=o(s/2),f=o(r/2),h=c(i/2),p=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=h*u*f+l*p*g,this._y=l*p*f-h*u*g,this._z=l*u*g+h*p*f,this._w=l*u*f-h*p*g;break;case"YXZ":this._x=h*u*f+l*p*g,this._y=l*p*f-h*u*g,this._z=l*u*g-h*p*f,this._w=l*u*f+h*p*g;break;case"ZXY":this._x=h*u*f-l*p*g,this._y=l*p*f+h*u*g,this._z=l*u*g+h*p*f,this._w=l*u*f-h*p*g;break;case"ZYX":this._x=h*u*f-l*p*g,this._y=l*p*f+h*u*g,this._z=l*u*g-h*p*f,this._w=l*u*f+h*p*g;break;case"YZX":this._x=h*u*f+l*p*g,this._y=l*p*f+h*u*g,this._z=l*u*g-h*p*f,this._w=l*u*f-h*p*g;break;case"XZY":this._x=h*u*f-l*p*g,this._y=l*p*f-h*u*g,this._z=l*u*g+h*p*f,this._w=l*u*f+h*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,i=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],u=e[6],f=e[10],h=i+o+f;if(h>0){let p=.5/Math.sqrt(h+1);this._w=.25/p,this._x=(u-c)*p,this._y=(r-l)*p,this._z=(a-s)*p}else if(i>o&&i>f){let p=2*Math.sqrt(1+i-o-f);this._w=(u-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+l)/p}else if(o>f){let p=2*Math.sqrt(1+o-i-f);this._w=(r-l)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+u)/p}else{let p=2*Math.sqrt(1+f-i-o);this._w=(a-s)/p,this._x=(r+l)/p,this._y=(c+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(sn(this.dot(t),-1,1)))}rotateTowards(t,e){let i=this.angleTo(t);if(i===0)return this;let s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let i=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,u=e._w;return this._x=i*u+a*o+s*l-r*c,this._y=s*u+a*c+r*o-i*l,this._z=r*u+a*l+i*c-s*o,this._w=a*u-i*o-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let i=this._x,s=this._y,r=this._z,a=this._w,o=a*t._w+i*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=i,this._y=s,this._z=r,this;let c=1-o*o;if(c<=Number.EPSILON){let p=1-e;return this._w=p*a+e*this._w,this._x=p*i+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}let l=Math.sqrt(c),u=Math.atan2(l,o),f=Math.sin((1-e)*u)/l,h=Math.sin(e*u)/l;return this._w=a*f+this._w*h,this._x=i*f+this._x*h,this._y=s*f+this._y*h,this._z=r*f+this._z*h,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){let t=Math.random(),e=Math.sqrt(1-t),i=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),i*Math.sin(r),i*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},P=class n{constructor(t=0,e=0,i=0){n.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(xd.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(xd.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(t){let e=this.x,i=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*s-o*i),u=2*(o*e-r*s),f=2*(r*i-a*e);return this.x=e+c*l+a*f-o*u,this.y=i+c*u+o*l-r*f,this.z=s+c*f+r*u-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let i=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-i*c,this.z=i*o-s*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Rl.copy(this).projectOnVector(t),this.sub(Rl)}reflect(t){return this.sub(Rl.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(sn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){let s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,i=Math.sqrt(1-t**2);return this.x=i*Math.cos(e),this.y=i*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Rl=new P,xd=new Xi,Es=class{constructor(t=new P(1/0,1/0,1/0),e=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(zn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(zn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let i=zn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let i=t.geometry;if(i!==void 0){let r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,zn):zn.fromBufferAttribute(r,a),zn.applyMatrix4(t.matrixWorld),this.expandByPoint(zn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ko.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ko.copy(i.boundingBox)),Ko.applyMatrix4(t.matrixWorld),this.union(Ko)}let s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,zn),zn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(eo),jo.subVectors(this.max,eo),js.subVectors(t.a,eo),Qs.subVectors(t.b,eo),tr.subVectors(t.c,eo),Di.subVectors(Qs,js),Ui.subVectors(tr,Qs),ps.subVectors(js,tr);let e=[0,-Di.z,Di.y,0,-Ui.z,Ui.y,0,-ps.z,ps.y,Di.z,0,-Di.x,Ui.z,0,-Ui.x,ps.z,0,-ps.x,-Di.y,Di.x,0,-Ui.y,Ui.x,0,-ps.y,ps.x,0];return!Cl(e,js,Qs,tr,jo)||(e=[1,0,0,0,1,0,0,0,1],!Cl(e,js,Qs,tr,jo))?!1:(Qo.crossVectors(Di,Ui),e=[Qo.x,Qo.y,Qo.z],Cl(e,js,Qs,tr,jo))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,zn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(zn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(hi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),hi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),hi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),hi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),hi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),hi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),hi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),hi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(hi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},hi=[new P,new P,new P,new P,new P,new P,new P,new P],zn=new P,Ko=new Es,js=new P,Qs=new P,tr=new P,Di=new P,Ui=new P,ps=new P,eo=new P,jo=new P,Qo=new P,ms=new P;function Cl(n,t,e,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){ms.fromArray(n,r);let o=s.x*Math.abs(ms.x)+s.y*Math.abs(ms.y)+s.z*Math.abs(ms.z),c=t.dot(ms),l=e.dot(ms),u=i.dot(ms);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>o)return!1}return!0}var U_=new Es,no=new P,Pl=new P,ws=class{constructor(t=new P,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let i=this.center;e!==void 0?i.copy(e):U_.setFromPoints(t).getCenter(i);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;no.subVectors(t,this.center);let e=no.lengthSq();if(e>this.radius*this.radius){let i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(no,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Pl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(no.copy(t.center).add(Pl)),this.expandByPoint(no.copy(t.center).sub(Pl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},ui=new P,Ll=new P,ta=new P,Ni=new P,Il=new P,ea=new P,Dl=new P,go=class{constructor(t=new P,e=new P(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ui)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=ui.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ui.copy(this.origin).addScaledVector(this.direction,e),ui.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Ll.copy(t).add(e).multiplyScalar(.5),ta.copy(e).sub(t).normalize(),Ni.copy(this.origin).sub(Ll);let r=t.distanceTo(e)*.5,a=-this.direction.dot(ta),o=Ni.dot(this.direction),c=-Ni.dot(ta),l=Ni.lengthSq(),u=Math.abs(1-a*a),f,h,p,g;if(u>0)if(f=a*c-o,h=a*o-c,g=r*u,f>=0)if(h>=-g)if(h<=g){let x=1/u;f*=x,h*=x,p=f*(f+a*h+2*o)+h*(a*f+h+2*c)+l}else h=r,f=Math.max(0,-(a*h+o)),p=-f*f+h*(h+2*c)+l;else h=-r,f=Math.max(0,-(a*h+o)),p=-f*f+h*(h+2*c)+l;else h<=-g?(f=Math.max(0,-(-a*r+o)),h=f>0?-r:Math.min(Math.max(-r,-c),r),p=-f*f+h*(h+2*c)+l):h<=g?(f=0,h=Math.min(Math.max(-r,-c),r),p=h*(h+2*c)+l):(f=Math.max(0,-(a*r+o)),h=f>0?r:Math.min(Math.max(-r,-c),r),p=-f*f+h*(h+2*c)+l);else h=a>0?-r:r,f=Math.max(0,-(a*h+o)),p=-f*f+h*(h+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Ll).addScaledVector(ta,h),p}intersectSphere(t,e){ui.subVectors(t.center,this.origin);let i=ui.dot(this.direction),s=ui.dot(ui)-i*i,r=t.radius*t.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){let i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,a,o,c,l=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,h=this.origin;return l>=0?(i=(t.min.x-h.x)*l,s=(t.max.x-h.x)*l):(i=(t.max.x-h.x)*l,s=(t.min.x-h.x)*l),u>=0?(r=(t.min.y-h.y)*u,a=(t.max.y-h.y)*u):(r=(t.max.y-h.y)*u,a=(t.min.y-h.y)*u),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(t.min.z-h.z)*f,c=(t.max.z-h.z)*f):(o=(t.max.z-h.z)*f,c=(t.min.z-h.z)*f),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,ui)!==null}intersectTriangle(t,e,i,s,r){Il.subVectors(e,t),ea.subVectors(i,t),Dl.crossVectors(Il,ea);let a=this.direction.dot(Dl),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ni.subVectors(this.origin,t);let c=o*this.direction.dot(ea.crossVectors(Ni,ea));if(c<0)return null;let l=o*this.direction.dot(Il.cross(Ni));if(l<0||c+l>a)return null;let u=-o*Ni.dot(Dl);return u<0?null:this.at(u/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Ae=class n{constructor(t,e,i,s,r,a,o,c,l,u,f,h,p,g,x,m){n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,c,l,u,f,h,p,g,x,m)}set(t,e,i,s,r,a,o,c,l,u,f,h,p,g,x,m){let d=this.elements;return d[0]=t,d[4]=e,d[8]=i,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=c,d[2]=l,d[6]=u,d[10]=f,d[14]=h,d[3]=p,d[7]=g,d[11]=x,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){let e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,i=t.elements,s=1/er.setFromMatrixColumn(t,0).length(),r=1/er.setFromMatrixColumn(t,1).length(),a=1/er.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,i=t.x,s=t.y,r=t.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){let h=a*u,p=a*f,g=o*u,x=o*f;e[0]=c*u,e[4]=-c*f,e[8]=l,e[1]=p+g*l,e[5]=h-x*l,e[9]=-o*c,e[2]=x-h*l,e[6]=g+p*l,e[10]=a*c}else if(t.order==="YXZ"){let h=c*u,p=c*f,g=l*u,x=l*f;e[0]=h+x*o,e[4]=g*o-p,e[8]=a*l,e[1]=a*f,e[5]=a*u,e[9]=-o,e[2]=p*o-g,e[6]=x+h*o,e[10]=a*c}else if(t.order==="ZXY"){let h=c*u,p=c*f,g=l*u,x=l*f;e[0]=h-x*o,e[4]=-a*f,e[8]=g+p*o,e[1]=p+g*o,e[5]=a*u,e[9]=x-h*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){let h=a*u,p=a*f,g=o*u,x=o*f;e[0]=c*u,e[4]=g*l-p,e[8]=h*l+x,e[1]=c*f,e[5]=x*l+h,e[9]=p*l-g,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){let h=a*c,p=a*l,g=o*c,x=o*l;e[0]=c*u,e[4]=x-h*f,e[8]=g*f+p,e[1]=f,e[5]=a*u,e[9]=-o*u,e[2]=-l*u,e[6]=p*f+g,e[10]=h-x*f}else if(t.order==="XZY"){let h=a*c,p=a*l,g=o*c,x=o*l;e[0]=c*u,e[4]=-f,e[8]=l*u,e[1]=h*f+x,e[5]=a*u,e[9]=p*f-g,e[2]=g*f-p,e[6]=o*u,e[10]=x*f+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(N_,t,O_)}lookAt(t,e,i){let s=this.elements;return xn.subVectors(t,e),xn.lengthSq()===0&&(xn.z=1),xn.normalize(),Oi.crossVectors(i,xn),Oi.lengthSq()===0&&(Math.abs(i.z)===1?xn.x+=1e-4:xn.z+=1e-4,xn.normalize(),Oi.crossVectors(i,xn)),Oi.normalize(),na.crossVectors(xn,Oi),s[0]=Oi.x,s[4]=na.x,s[8]=xn.x,s[1]=Oi.y,s[5]=na.y,s[9]=xn.y,s[2]=Oi.z,s[6]=na.z,s[10]=xn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[4],c=i[8],l=i[12],u=i[1],f=i[5],h=i[9],p=i[13],g=i[2],x=i[6],m=i[10],d=i[14],M=i[3],_=i[7],b=i[11],R=i[15],A=s[0],w=s[4],H=s[8],y=s[12],T=s[1],k=s[5],Y=s[9],it=s[13],L=s[2],O=s[6],G=s[10],q=s[14],X=s[3],W=s[7],K=s[11],tt=s[15];return r[0]=a*A+o*T+c*L+l*X,r[4]=a*w+o*k+c*O+l*W,r[8]=a*H+o*Y+c*G+l*K,r[12]=a*y+o*it+c*q+l*tt,r[1]=u*A+f*T+h*L+p*X,r[5]=u*w+f*k+h*O+p*W,r[9]=u*H+f*Y+h*G+p*K,r[13]=u*y+f*it+h*q+p*tt,r[2]=g*A+x*T+m*L+d*X,r[6]=g*w+x*k+m*O+d*W,r[10]=g*H+x*Y+m*G+d*K,r[14]=g*y+x*it+m*q+d*tt,r[3]=M*A+_*T+b*L+R*X,r[7]=M*w+_*k+b*O+R*W,r[11]=M*H+_*Y+b*G+R*K,r[15]=M*y+_*it+b*q+R*tt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],u=t[2],f=t[6],h=t[10],p=t[14],g=t[3],x=t[7],m=t[11],d=t[15];return g*(+r*c*f-s*l*f-r*o*h+i*l*h+s*o*p-i*c*p)+x*(+e*c*p-e*l*h+r*a*h-s*a*p+s*l*u-r*c*u)+m*(+e*l*f-e*o*p-r*a*f+i*a*p+r*o*u-i*l*u)+d*(-s*o*u-e*c*f+e*o*h+s*a*f-i*a*h+i*c*u)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],u=t[8],f=t[9],h=t[10],p=t[11],g=t[12],x=t[13],m=t[14],d=t[15],M=f*m*l-x*h*l+x*c*p-o*m*p-f*c*d+o*h*d,_=g*h*l-u*m*l-g*c*p+a*m*p+u*c*d-a*h*d,b=u*x*l-g*f*l+g*o*p-a*x*p-u*o*d+a*f*d,R=g*f*c-u*x*c-g*o*h+a*x*h+u*o*m-a*f*m,A=e*M+i*_+s*b+r*R;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let w=1/A;return t[0]=M*w,t[1]=(x*h*r-f*m*r-x*s*p+i*m*p+f*s*d-i*h*d)*w,t[2]=(o*m*r-x*c*r+x*s*l-i*m*l-o*s*d+i*c*d)*w,t[3]=(f*c*r-o*h*r-f*s*l+i*h*l+o*s*p-i*c*p)*w,t[4]=_*w,t[5]=(u*m*r-g*h*r+g*s*p-e*m*p-u*s*d+e*h*d)*w,t[6]=(g*c*r-a*m*r-g*s*l+e*m*l+a*s*d-e*c*d)*w,t[7]=(a*h*r-u*c*r+u*s*l-e*h*l-a*s*p+e*c*p)*w,t[8]=b*w,t[9]=(g*f*r-u*x*r-g*i*p+e*x*p+u*i*d-e*f*d)*w,t[10]=(a*x*r-g*o*r+g*i*l-e*x*l-a*i*d+e*o*d)*w,t[11]=(u*o*r-a*f*r-u*i*l+e*f*l+a*i*p-e*o*p)*w,t[12]=R*w,t[13]=(u*x*s-g*f*s+g*i*h-e*x*h-u*i*m+e*f*m)*w,t[14]=(g*o*s-a*x*s-g*i*c+e*x*c+a*i*m-e*o*m)*w,t[15]=(a*f*s-u*o*s+u*i*c-e*f*c-a*i*h+e*o*h)*w,this}scale(t){let e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let i=Math.cos(e),s=Math.sin(e),r=1-i,a=t.x,o=t.y,c=t.z,l=r*a,u=r*o;return this.set(l*a+i,l*o-s*c,l*c+s*o,0,l*o+s*c,u*o+i,u*c-s*a,0,l*c-s*o,u*c+s*a,r*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,a){return this.set(1,i,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){let s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,u=a+a,f=o+o,h=r*l,p=r*u,g=r*f,x=a*u,m=a*f,d=o*f,M=c*l,_=c*u,b=c*f,R=i.x,A=i.y,w=i.z;return s[0]=(1-(x+d))*R,s[1]=(p+b)*R,s[2]=(g-_)*R,s[3]=0,s[4]=(p-b)*A,s[5]=(1-(h+d))*A,s[6]=(m+M)*A,s[7]=0,s[8]=(g+_)*w,s[9]=(m-M)*w,s[10]=(1-(h+x))*w,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){let s=this.elements,r=er.set(s[0],s[1],s[2]).length(),a=er.set(s[4],s[5],s[6]).length(),o=er.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],kn.copy(this);let l=1/r,u=1/a,f=1/o;return kn.elements[0]*=l,kn.elements[1]*=l,kn.elements[2]*=l,kn.elements[4]*=u,kn.elements[5]*=u,kn.elements[6]*=u,kn.elements[8]*=f,kn.elements[9]*=f,kn.elements[10]*=f,e.setFromRotationMatrix(kn),i.x=r,i.y=a,i.z=o,this}makePerspective(t,e,i,s,r,a,o=_i){let c=this.elements,l=2*r/(e-t),u=2*r/(i-s),f=(e+t)/(e-t),h=(i+s)/(i-s),p,g;if(o===_i)p=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===Ua)p=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,s,r,a,o=_i){let c=this.elements,l=1/(e-t),u=1/(i-s),f=1/(a-r),h=(e+t)*l,p=(i+s)*u,g,x;if(o===_i)g=(a+r)*f,x=-2*f;else if(o===Ua)g=r*f,x=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-h,c[1]=0,c[5]=2*u,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=x,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}},er=new P,kn=new Ae,N_=new P(0,0,0),O_=new P(1,1,1),Oi=new P,na=new P,xn=new P,yd=new Ae,vd=new Xi,ka=class n{constructor(t=0,e=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){let s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],u=s[9],f=s[2],h=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(sn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-sn(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(sn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,p),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-sn(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(sn(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-sn(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return yd.makeRotationFromQuaternion(t),this.setFromRotationMatrix(yd,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return vd.setFromEuler(this),this.setFromQuaternion(vd,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ka.DEFAULT_ORDER="XYZ";var Ha=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},F_=0,Md=new P,nr=new Xi,fi=new Ae,ia=new P,io=new P,B_=new P,z_=new Xi,Sd=new P(1,0,0),bd=new P(0,1,0),Ed=new P(0,0,1),k_={type:"added"},H_={type:"removed"},We=class n extends Wi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:F_++}),this.uuid=xi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let t=new P,e=new ka,i=new Xi,s=new P(1,1,1);function r(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ae},normalMatrix:{value:new Yt}}),this.matrix=new Ae,this.matrixWorld=new Ae,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ha,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return nr.setFromAxisAngle(t,e),this.quaternion.multiply(nr),this}rotateOnWorldAxis(t,e){return nr.setFromAxisAngle(t,e),this.quaternion.premultiply(nr),this}rotateX(t){return this.rotateOnAxis(Sd,t)}rotateY(t){return this.rotateOnAxis(bd,t)}rotateZ(t){return this.rotateOnAxis(Ed,t)}translateOnAxis(t,e){return Md.copy(t).applyQuaternion(this.quaternion),this.position.add(Md.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Sd,t)}translateY(t){return this.translateOnAxis(bd,t)}translateZ(t){return this.translateOnAxis(Ed,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(fi.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?ia.copy(t):ia.set(t,e,i);let s=this.parent;this.updateWorldMatrix(!0,!1),io.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?fi.lookAt(io,ia,this.up):fi.lookAt(ia,io,this.up),this.quaternion.setFromRotationMatrix(fi),s&&(fi.extractRotation(s.matrixWorld),nr.setFromRotationMatrix(fi),this.quaternion.premultiply(nr.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(k_)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(H_)),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),fi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),fi.multiply(t.parent.matrixWorld)),t.applyMatrix4(fi),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){let a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(io,t,B_),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(io,z_,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let i=0,s=e.length;i<s;i++){let r=e[i];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){let i=this.parent;if(t===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++){let o=s[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(t){let e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){let f=c[l];r(t.shapes,f)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){let o=a(t.geometries),c=a(t.materials),l=a(t.textures),u=a(t.images),f=a(t.shapes),h=a(t.skeletons),p=a(t.animations),g=a(t.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),h.length>0&&(i.skeletons=h),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=s,i;function a(o){let c=[];for(let l in o){let u=o[l];delete u.metadata,c.push(u)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){let s=t.children[i];this.add(s.clone())}return this}};We.DEFAULT_UP=new P(0,1,0);We.DEFAULT_MATRIX_AUTO_UPDATE=!0;We.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Hn=new P,di=new P,Ul=new P,pi=new P,ir=new P,sr=new P,wd=new P,Nl=new P,Ol=new P,Fl=new P,sa=!1,ki=class n{constructor(t=new P,e=new P,i=new P){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),Hn.subVectors(t,e),s.cross(Hn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){Hn.subVectors(s,e),di.subVectors(i,e),Ul.subVectors(t,e);let a=Hn.dot(Hn),o=Hn.dot(di),c=Hn.dot(Ul),l=di.dot(di),u=di.dot(Ul),f=a*l-o*o;if(f===0)return r.set(0,0,0),null;let h=1/f,p=(l*c-o*u)*h,g=(a*u-o*c)*h;return r.set(1-p-g,g,p)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,pi)===null?!1:pi.x>=0&&pi.y>=0&&pi.x+pi.y<=1}static getUV(t,e,i,s,r,a,o,c){return sa===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),sa=!0),this.getInterpolation(t,e,i,s,r,a,o,c)}static getInterpolation(t,e,i,s,r,a,o,c){return this.getBarycoord(t,e,i,s,pi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,pi.x),c.addScaledVector(a,pi.y),c.addScaledVector(o,pi.z),c)}static isFrontFacing(t,e,i,s){return Hn.subVectors(i,e),di.subVectors(t,e),Hn.cross(di).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Hn.subVectors(this.c,this.b),di.subVectors(this.a,this.b),Hn.cross(di).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return n.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return n.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,i,s,r){return sa===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),sa=!0),n.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}getInterpolation(t,e,i,s,r){return n.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return n.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return n.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let i=this.a,s=this.b,r=this.c,a,o;ir.subVectors(s,i),sr.subVectors(r,i),Nl.subVectors(t,i);let c=ir.dot(Nl),l=sr.dot(Nl);if(c<=0&&l<=0)return e.copy(i);Ol.subVectors(t,s);let u=ir.dot(Ol),f=sr.dot(Ol);if(u>=0&&f<=u)return e.copy(s);let h=c*f-u*l;if(h<=0&&c>=0&&u<=0)return a=c/(c-u),e.copy(i).addScaledVector(ir,a);Fl.subVectors(t,r);let p=ir.dot(Fl),g=sr.dot(Fl);if(g>=0&&p<=g)return e.copy(r);let x=p*l-c*g;if(x<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(i).addScaledVector(sr,o);let m=u*g-p*f;if(m<=0&&f-u>=0&&p-g>=0)return wd.subVectors(r,s),o=(f-u)/(f-u+(p-g)),e.copy(s).addScaledVector(wd,o);let d=1/(m+x+h);return a=x*d,o=h*d,e.copy(i).addScaledVector(ir,a).addScaledVector(sr,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Sp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Fi={h:0,s:0,l:0},ra={h:0,s:0,l:0};function Bl(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}var St=class{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Pe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,oe.toWorkingColorSpace(this,e),this}setRGB(t,e,i,s=oe.workingColorSpace){return this.r=t,this.g=e,this.b=i,oe.toWorkingColorSpace(this,s),this}setHSL(t,e,i,s=oe.workingColorSpace){if(t=zh(t,1),e=sn(e,0,1),i=sn(i,0,1),e===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+e):i+e-i*e,a=2*i-r;this.r=Bl(a,r,t+1/3),this.g=Bl(a,r,t),this.b=Bl(a,r,t-1/3)}return oe.toWorkingColorSpace(this,s),this}setStyle(t,e=Pe){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Pe){let i=Sp[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=vr(t.r),this.g=vr(t.g),this.b=vr(t.b),this}copyLinearToSRGB(t){return this.r=Tl(t.r),this.g=Tl(t.g),this.b=Tl(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Pe){return oe.fromWorkingColorSpace($e.copy(this),t),Math.round(sn($e.r*255,0,255))*65536+Math.round(sn($e.g*255,0,255))*256+Math.round(sn($e.b*255,0,255))}getHexString(t=Pe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=oe.workingColorSpace){oe.fromWorkingColorSpace($e.copy(this),e);let i=$e.r,s=$e.g,r=$e.b,a=Math.max(i,s,r),o=Math.min(i,s,r),c,l,u=(o+a)/2;if(o===a)c=0,l=0;else{let f=a-o;switch(l=u<=.5?f/(a+o):f/(2-a-o),a){case i:c=(s-r)/f+(s<r?6:0);break;case s:c=(r-i)/f+2;break;case r:c=(i-s)/f+4;break}c/=6}return t.h=c,t.s=l,t.l=u,t}getRGB(t,e=oe.workingColorSpace){return oe.fromWorkingColorSpace($e.copy(this),e),t.r=$e.r,t.g=$e.g,t.b=$e.b,t}getStyle(t=Pe){oe.fromWorkingColorSpace($e.copy(this),t);let e=$e.r,i=$e.g,s=$e.b;return t!==Pe?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Fi),this.setHSL(Fi.h+t,Fi.s+e,Fi.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Fi),t.getHSL(ra);let i=co(Fi.h,ra.h,e),s=co(Fi.s,ra.s,e),r=co(Fi.l,ra.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},$e=new St;St.NAMES=Sp;var V_=0,ti=class extends Wi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:V_++}),this.uuid=xi(),this.name="",this.type="Material",this.blending=xr,this.side=Qn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Kl,this.blendDst=jl,this.blendEquation=ys,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new St(0,0,0),this.blendAlpha=0,this.depthFunc=Ra,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=fd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Js,this.stencilZFail=Js,this.stencilZPass=Js,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==xr&&(i.blending=this.blending),this.side!==Qn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Kl&&(i.blendSrc=this.blendSrc),this.blendDst!==jl&&(i.blendDst=this.blendDst),this.blendEquation!==ys&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ra&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==fd&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Js&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Js&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Js&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(e){let r=s(t.textures),a=s(t.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,i=null;if(e!==null){let s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},ei=class extends ti{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new St(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Oh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Ce=new P,oa=new $t,vn=class{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=nh,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=zi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)oa.fromBufferAttribute(this,e),oa.applyMatrix3(t),this.setXY(e,oa.x,oa.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Ce.fromBufferAttribute(this,e),Ce.applyMatrix3(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Ce.fromBufferAttribute(this,e),Ce.applyMatrix4(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Ce.fromBufferAttribute(this,e),Ce.applyNormalMatrix(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Ce.fromBufferAttribute(this,e),Ce.transformDirection(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=jn(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=re(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=jn(e,this.array)),e}setX(t,e){return this.normalized&&(e=re(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=jn(e,this.array)),e}setY(t,e){return this.normalized&&(e=re(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=jn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=re(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=jn(e,this.array)),e}setW(t,e){return this.normalized&&(e=re(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=re(e,this.array),i=re(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=re(e,this.array),i=re(i,this.array),s=re(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=re(e,this.array),i=re(i,this.array),s=re(s,this.array),r=re(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==nh&&(t.usage=this.usage),t}};var Va=class extends vn{constructor(t,e,i){super(new Uint16Array(t),e,i)}};var Ga=class extends vn{constructor(t,e,i){super(new Uint32Array(t),e,i)}};var ce=class extends vn{constructor(t,e,i){super(new Float32Array(t),e,i)}};var G_=0,En=new Ae,zl=new We,rr=new P,yn=new Es,so=new Es,Be=new P,Le=class n extends Wi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:G_++}),this.uuid=xi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Mp(t)?Ga:Va)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new Yt().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return En.makeRotationFromQuaternion(t),this.applyMatrix4(En),this}rotateX(t){return En.makeRotationX(t),this.applyMatrix4(En),this}rotateY(t){return En.makeRotationY(t),this.applyMatrix4(En),this}rotateZ(t){return En.makeRotationZ(t),this.applyMatrix4(En),this}translate(t,e,i){return En.makeTranslation(t,e,i),this.applyMatrix4(En),this}scale(t,e,i){return En.makeScale(t,e,i),this.applyMatrix4(En),this}lookAt(t){return zl.lookAt(t),zl.updateMatrix(),this.applyMatrix4(zl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(rr).negate(),this.translate(rr.x,rr.y,rr.z),this}setFromPoints(t){let e=[];for(let i=0,s=t.length;i<s;i++){let r=t[i];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new ce(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Es);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){let r=e[i];yn.setFromBufferAttribute(r),this.morphTargetsRelative?(Be.addVectors(this.boundingBox.min,yn.min),this.boundingBox.expandByPoint(Be),Be.addVectors(this.boundingBox.max,yn.max),this.boundingBox.expandByPoint(Be)):(this.boundingBox.expandByPoint(yn.min),this.boundingBox.expandByPoint(yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ws);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new P,1/0);return}if(t){let i=this.boundingSphere.center;if(yn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];so.setFromBufferAttribute(o),this.morphTargetsRelative?(Be.addVectors(yn.min,so.min),yn.expandByPoint(Be),Be.addVectors(yn.max,so.max),yn.expandByPoint(Be)):(yn.expandByPoint(so.min),yn.expandByPoint(so.max))}yn.getCenter(i);let s=0;for(let r=0,a=t.count;r<a;r++)Be.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(Be));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],c=this.morphTargetsRelative;for(let l=0,u=o.count;l<u;l++)Be.fromBufferAttribute(o,l),c&&(rr.fromBufferAttribute(t,l),Be.add(rr)),s=Math.max(s,i.distanceToSquared(Be))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.array,s=e.position.array,r=e.normal.array,a=e.uv.array,o=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new vn(new Float32Array(4*o),4));let c=this.getAttribute("tangent").array,l=[],u=[];for(let T=0;T<o;T++)l[T]=new P,u[T]=new P;let f=new P,h=new P,p=new P,g=new $t,x=new $t,m=new $t,d=new P,M=new P;function _(T,k,Y){f.fromArray(s,T*3),h.fromArray(s,k*3),p.fromArray(s,Y*3),g.fromArray(a,T*2),x.fromArray(a,k*2),m.fromArray(a,Y*2),h.sub(f),p.sub(f),x.sub(g),m.sub(g);let it=1/(x.x*m.y-m.x*x.y);isFinite(it)&&(d.copy(h).multiplyScalar(m.y).addScaledVector(p,-x.y).multiplyScalar(it),M.copy(p).multiplyScalar(x.x).addScaledVector(h,-m.x).multiplyScalar(it),l[T].add(d),l[k].add(d),l[Y].add(d),u[T].add(M),u[k].add(M),u[Y].add(M))}let b=this.groups;b.length===0&&(b=[{start:0,count:i.length}]);for(let T=0,k=b.length;T<k;++T){let Y=b[T],it=Y.start,L=Y.count;for(let O=it,G=it+L;O<G;O+=3)_(i[O+0],i[O+1],i[O+2])}let R=new P,A=new P,w=new P,H=new P;function y(T){w.fromArray(r,T*3),H.copy(w);let k=l[T];R.copy(k),R.sub(w.multiplyScalar(w.dot(k))).normalize(),A.crossVectors(H,k);let it=A.dot(u[T])<0?-1:1;c[T*4]=R.x,c[T*4+1]=R.y,c[T*4+2]=R.z,c[T*4+3]=it}for(let T=0,k=b.length;T<k;++T){let Y=b[T],it=Y.start,L=Y.count;for(let O=it,G=it+L;O<G;O+=3)y(i[O+0]),y(i[O+1]),y(i[O+2])}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new vn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let h=0,p=i.count;h<p;h++)i.setXYZ(h,0,0,0);let s=new P,r=new P,a=new P,o=new P,c=new P,l=new P,u=new P,f=new P;if(t)for(let h=0,p=t.count;h<p;h+=3){let g=t.getX(h+0),x=t.getX(h+1),m=t.getX(h+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,x),a.fromBufferAttribute(e,m),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),o.fromBufferAttribute(i,g),c.fromBufferAttribute(i,x),l.fromBufferAttribute(i,m),o.add(u),c.add(u),l.add(u),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(x,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let h=0,p=e.count;h<p;h+=3)s.fromBufferAttribute(e,h+0),r.fromBufferAttribute(e,h+1),a.fromBufferAttribute(e,h+2),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Be.fromBufferAttribute(t,e),Be.normalize(),t.setXYZ(e,Be.x,Be.y,Be.z)}toNonIndexed(){function t(o,c){let l=o.array,u=o.itemSize,f=o.normalized,h=new l.constructor(c.length*u),p=0,g=0;for(let x=0,m=c.length;x<m;x++){o.isInterleavedBufferAttribute?p=c[x]*o.data.stride+o.offset:p=c[x]*u;for(let d=0;d<u;d++)h[g++]=l[p++]}return new vn(h,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new n,i=this.index.array,s=this.attributes;for(let o in s){let c=s[o],l=t(c,i);e.setAttribute(o,l)}let r=this.morphAttributes;for(let o in r){let c=[],l=r[o];for(let u=0,f=l.length;u<f;u++){let h=l[u],p=t(h,i);c.push(p)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let i=this.attributes;for(let c in i){let l=i[c];t.data.attributes[c]=l.toJSON(t.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],u=[];for(let f=0,h=l.length;f<h;f++){let p=l[f];u.push(p.toJSON(t.data))}u.length>0&&(s[c]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone(e));let s=t.attributes;for(let l in s){let u=s[l];this.setAttribute(l,u.clone(e))}let r=t.morphAttributes;for(let l in r){let u=[],f=r[l];for(let h=0,p=f.length;h<p;h++)u.push(f[h].clone(e));this.morphAttributes[l]=u}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let l=0,u=a.length;l<u;l++){let f=a[l];this.addGroup(f.start,f.count,f.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Td=new Ae,gs=new go,aa=new ws,Ad=new P,or=new P,ar=new P,cr=new P,kl=new P,ca=new P,la=new $t,ha=new $t,ua=new $t,Rd=new P,Cd=new P,Pd=new P,fa=new P,da=new P,ae=class extends We{constructor(t=new Le,e=new ei){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(r&&o){ca.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let u=o[c],f=r[c];u!==0&&(kl.fromBufferAttribute(f,t),a?ca.addScaledVector(kl,u):ca.addScaledVector(kl.sub(e),u))}e.add(ca)}return e}raycast(t,e){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),aa.copy(i.boundingSphere),aa.applyMatrix4(r),gs.copy(t.ray).recast(t.near),!(aa.containsPoint(gs.origin)===!1&&(gs.intersectSphere(aa,Ad)===null||gs.origin.distanceToSquared(Ad)>(t.far-t.near)**2))&&(Td.copy(r).invert(),gs.copy(t.ray).applyMatrix4(Td),!(i.boundingBox!==null&&gs.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,gs)))}_computeIntersections(t,e,i){let s,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,f=r.attributes.normal,h=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,x=h.length;g<x;g++){let m=h[g],d=a[m.materialIndex],M=Math.max(m.start,p.start),_=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let b=M,R=_;b<R;b+=3){let A=o.getX(b),w=o.getX(b+1),H=o.getX(b+2);s=pa(this,d,t,i,l,u,f,A,w,H),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,p.start),x=Math.min(o.count,p.start+p.count);for(let m=g,d=x;m<d;m+=3){let M=o.getX(m),_=o.getX(m+1),b=o.getX(m+2);s=pa(this,a,t,i,l,u,f,M,_,b),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,x=h.length;g<x;g++){let m=h[g],d=a[m.materialIndex],M=Math.max(m.start,p.start),_=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let b=M,R=_;b<R;b+=3){let A=b,w=b+1,H=b+2;s=pa(this,d,t,i,l,u,f,A,w,H),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,p.start),x=Math.min(c.count,p.start+p.count);for(let m=g,d=x;m<d;m+=3){let M=m,_=m+1,b=m+2;s=pa(this,a,t,i,l,u,f,M,_,b),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}};function W_(n,t,e,i,s,r,a,o){let c;if(t.side===un?c=i.intersectTriangle(a,r,s,!0,o):c=i.intersectTriangle(s,r,a,t.side===Qn,o),c===null)return null;da.copy(o),da.applyMatrix4(n.matrixWorld);let l=e.ray.origin.distanceTo(da);return l<e.near||l>e.far?null:{distance:l,point:da.clone(),object:n}}function pa(n,t,e,i,s,r,a,o,c,l){n.getVertexPosition(o,or),n.getVertexPosition(c,ar),n.getVertexPosition(l,cr);let u=W_(n,t,e,i,or,ar,cr,fa);if(u){s&&(la.fromBufferAttribute(s,o),ha.fromBufferAttribute(s,c),ua.fromBufferAttribute(s,l),u.uv=ki.getInterpolation(fa,or,ar,cr,la,ha,ua,new $t)),r&&(la.fromBufferAttribute(r,o),ha.fromBufferAttribute(r,c),ua.fromBufferAttribute(r,l),u.uv1=ki.getInterpolation(fa,or,ar,cr,la,ha,ua,new $t),u.uv2=u.uv1),a&&(Rd.fromBufferAttribute(a,o),Cd.fromBufferAttribute(a,c),Pd.fromBufferAttribute(a,l),u.normal=ki.getInterpolation(fa,or,ar,cr,Rd,Cd,Pd,new P),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));let f={a:o,b:c,c:l,normal:new P,materialIndex:0};ki.getNormal(or,ar,cr,f.normal),u.face=f}return u}var Rn=class n extends Le{constructor(t=1,e=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let c=[],l=[],u=[],f=[],h=0,p=0;g("z","y","x",-1,-1,i,e,t,a,r,0),g("z","y","x",1,-1,i,e,-t,a,r,1),g("x","z","y",1,1,t,i,e,s,a,2),g("x","z","y",1,-1,t,i,-e,s,a,3),g("x","y","z",1,-1,t,e,i,s,r,4),g("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new ce(l,3)),this.setAttribute("normal",new ce(u,3)),this.setAttribute("uv",new ce(f,2));function g(x,m,d,M,_,b,R,A,w,H,y){let T=b/w,k=R/H,Y=b/2,it=R/2,L=A/2,O=w+1,G=H+1,q=0,X=0,W=new P;for(let K=0;K<G;K++){let tt=K*k-it;for(let ut=0;ut<O;ut++){let V=ut*T-Y;W[x]=V*M,W[m]=tt*_,W[d]=L,l.push(W.x,W.y,W.z),W[x]=0,W[m]=0,W[d]=A>0?1:-1,u.push(W.x,W.y,W.z),f.push(ut/w),f.push(1-K/H),q+=1}}for(let K=0;K<H;K++)for(let tt=0;tt<w;tt++){let ut=h+tt+O*K,V=h+tt+O*(K+1),$=h+(tt+1)+O*(K+1),lt=h+(tt+1)+O*K;c.push(ut,V,lt),c.push(V,$,lt),X+=6}o.addGroup(p,X,y),p+=X,h+=q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function wr(n){let t={};for(let e in n){t[e]={};for(let i in n[e]){let s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function nn(n){let t={};for(let e=0;e<n.length;e++){let i=wr(n[e]);for(let s in i)t[s]=i[s]}return t}function X_(n){let t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function bp(n){return n.getRenderTarget()===null?n.outputColorSpace:oe.workingColorSpace}var q_={clone:wr,merge:nn},Y_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,$_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Mi=class extends ti{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Y_,this.fragmentShader=$_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=wr(t.uniforms),this.uniformsGroups=X_(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}},Wa=class extends We{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ae,this.projectionMatrix=new Ae,this.projectionMatrixInverse=new Ae,this.coordinateSystem=_i}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},ze=class extends Wa{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=mo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(yr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return mo*2*Math.atan(Math.tan(yr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,i,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(yr*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*i/l,s*=a.width/c,i*=a.height/l}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},lr=-90,hr=1,ah=class extends We{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new ze(lr,hr,t,e);s.layers=this.layers,this.add(s);let r=new ze(lr,hr,t,e);r.layers=this.layers,this.add(r);let a=new ze(lr,hr,t,e);a.layers=this.layers,this.add(a);let o=new ze(lr,hr,t,e);o.layers=this.layers,this.add(o);let c=new ze(lr,hr,t,e);c.layers=this.layers,this.add(c);let l=new ze(lr,hr,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[i,s,r,a,o,c]=e;for(let l of e)this.remove(l);if(t===_i)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Ua)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,l,u]=this.children,f=t.getRenderTarget(),h=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,r),t.setRenderTarget(i,1,s),t.render(e,a),t.setRenderTarget(i,2,s),t.render(e,o),t.setRenderTarget(i,3,s),t.render(e,c),t.setRenderTarget(i,4,s),t.render(e,l),i.texture.generateMipmaps=x,t.setRenderTarget(i,5,s),t.render(e,u),t.setRenderTarget(f,h,p),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},Xa=class extends An{constructor(t,e,i,s,r,a,o,c,l,u){t=t!==void 0?t:[],e=e!==void 0?e:Sr,super(t,e,i,s,r,a,o,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},ch=class extends vi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];e.encoding!==void 0&&(lo("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===bs?Pe:Tn),this.texture=new Xa(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:wn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Rn(5,5,5),r=new Mi({name:"CubemapFromEquirect",uniforms:wr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:un,blending:Hi});r.uniforms.tEquirect.value=e;let a=new ae(s,r),o=e.minFilter;return e.minFilter===fo&&(e.minFilter=wn),new ah(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,i,s){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,s);t.setRenderTarget(r)}},Hl=new P,Z_=new P,J_=new Yt,gi=class{constructor(t=new P(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){let s=Hl.subVectors(i,e).cross(Z_.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let i=t.delta(Hl),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(i,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let i=e||J_.getNormalMatrix(t),s=this.coplanarPoint(Hl).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},_s=new ws,ma=new P,_o=class{constructor(t=new gi,e=new gi,i=new gi,s=new gi,r=new gi,a=new gi){this.planes=[t,e,i,s,r,a]}set(t,e,i,s,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=_i){let i=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],c=s[3],l=s[4],u=s[5],f=s[6],h=s[7],p=s[8],g=s[9],x=s[10],m=s[11],d=s[12],M=s[13],_=s[14],b=s[15];if(i[0].setComponents(c-r,h-l,m-p,b-d).normalize(),i[1].setComponents(c+r,h+l,m+p,b+d).normalize(),i[2].setComponents(c+a,h+u,m+g,b+M).normalize(),i[3].setComponents(c-a,h-u,m-g,b-M).normalize(),i[4].setComponents(c-o,h-f,m-x,b-_).normalize(),e===_i)i[5].setComponents(c+o,h+f,m+x,b+_).normalize();else if(e===Ua)i[5].setComponents(o,f,x,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),_s.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),_s.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(_s)}intersectsSprite(t){return _s.center.set(0,0,0),_s.radius=.7071067811865476,_s.applyMatrix4(t.matrixWorld),this.intersectsSphere(_s)}intersectsSphere(t){let e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let i=0;i<6;i++){let s=e[i];if(ma.x=s.normal.x>0?t.max.x:t.min.x,ma.y=s.normal.y>0?t.max.y:t.min.y,ma.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ma)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Ep(){let n=null,t=!1,e=null,i=null;function s(r,a){e(r,a),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function K_(n,t){let e=t.isWebGL2,i=new WeakMap;function s(l,u){let f=l.array,h=l.usage,p=f.byteLength,g=n.createBuffer();n.bindBuffer(u,g),n.bufferData(u,f,h),l.onUploadCallback();let x;if(f instanceof Float32Array)x=n.FLOAT;else if(f instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(e)x=n.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else x=n.UNSIGNED_SHORT;else if(f instanceof Int16Array)x=n.SHORT;else if(f instanceof Uint32Array)x=n.UNSIGNED_INT;else if(f instanceof Int32Array)x=n.INT;else if(f instanceof Int8Array)x=n.BYTE;else if(f instanceof Uint8Array)x=n.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)x=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:g,type:x,bytesPerElement:f.BYTES_PER_ELEMENT,version:l.version,size:p}}function r(l,u,f){let h=u.array,p=u._updateRange,g=u.updateRanges;if(n.bindBuffer(f,l),p.count===-1&&g.length===0&&n.bufferSubData(f,0,h),g.length!==0){for(let x=0,m=g.length;x<m;x++){let d=g[x];e?n.bufferSubData(f,d.start*h.BYTES_PER_ELEMENT,h,d.start,d.count):n.bufferSubData(f,d.start*h.BYTES_PER_ELEMENT,h.subarray(d.start,d.start+d.count))}u.clearUpdateRanges()}p.count!==-1&&(e?n.bufferSubData(f,p.offset*h.BYTES_PER_ELEMENT,h,p.offset,p.count):n.bufferSubData(f,p.offset*h.BYTES_PER_ELEMENT,h.subarray(p.offset,p.offset+p.count)),p.count=-1),u.onUploadCallback()}function a(l){return l.isInterleavedBufferAttribute&&(l=l.data),i.get(l)}function o(l){l.isInterleavedBufferAttribute&&(l=l.data);let u=i.get(l);u&&(n.deleteBuffer(u.buffer),i.delete(l))}function c(l,u){if(l.isGLBufferAttribute){let h=i.get(l);(!h||h.version<l.version)&&i.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);let f=i.get(l);if(f===void 0)i.set(l,s(l,u));else if(f.version<l.version){if(f.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(f.buffer,l,u),f.version=l.version}}return{get:a,remove:o,update:c}}var xo=class n extends Le{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};let r=t/2,a=e/2,o=Math.floor(i),c=Math.floor(s),l=o+1,u=c+1,f=t/o,h=e/c,p=[],g=[],x=[],m=[];for(let d=0;d<u;d++){let M=d*h-a;for(let _=0;_<l;_++){let b=_*f-r;g.push(b,-M,0),x.push(0,0,1),m.push(_/o),m.push(1-d/c)}}for(let d=0;d<c;d++)for(let M=0;M<o;M++){let _=M+l*d,b=M+l*(d+1),R=M+1+l*(d+1),A=M+1+l*d;p.push(_,b,A),p.push(b,R,A)}this.setIndex(p),this.setAttribute("position",new ce(g,3)),this.setAttribute("normal",new ce(x,3)),this.setAttribute("uv",new ce(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.widthSegments,t.heightSegments)}},j_=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Q_=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,tx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ex=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,nx=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,ix=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,sx=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,rx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ox=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,ax=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,cx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,lx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,hx=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ux=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,fx=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,dx=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,px=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,mx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,gx=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,_x=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,xx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,yx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,vx=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Mx=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Sx=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,bx=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Ex=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,wx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Tx=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ax=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Rx="gl_FragColor = linearToOutputTexel( gl_FragColor );",Cx=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,Px=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Lx=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ix=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Dx=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ux=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Nx=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ox=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Fx=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Bx=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,zx=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,kx=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Hx=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Vx=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Gx=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Wx=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Xx=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,qx=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Yx=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,$x=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Zx=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Jx=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Kx=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,jx=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Qx=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ty=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ey=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ny=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,iy=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,sy=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,ry=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,oy=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ay=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,cy=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ly=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,hy=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,uy=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,fy=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,dy=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,py=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,my=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,gy=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,_y=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,xy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,yy=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,vy=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,My=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Sy=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,by=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Ey=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,wy=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ty=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Ay=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Ry=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Cy=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Py=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ly=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Iy=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Dy=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,Uy=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Ny=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Oy=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Fy=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,By=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,zy=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ky=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Hy=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Vy=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Gy=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Wy=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Xy=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,qy=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Yy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,$y=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Zy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Jy=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Ky=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,jy=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,tv=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ev=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,nv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,iv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,sv=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,rv=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,ov=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,av=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,cv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,lv=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,hv=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,uv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,fv=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dv=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,pv=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mv=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,gv=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_v=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,xv=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,yv=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vv=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Mv=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Sv=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bv=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ev=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wv=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Tv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Av=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Rv=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Cv=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Pv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ht={alphahash_fragment:j_,alphahash_pars_fragment:Q_,alphamap_fragment:tx,alphamap_pars_fragment:ex,alphatest_fragment:nx,alphatest_pars_fragment:ix,aomap_fragment:sx,aomap_pars_fragment:rx,batching_pars_vertex:ox,batching_vertex:ax,begin_vertex:cx,beginnormal_vertex:lx,bsdfs:hx,iridescence_fragment:ux,bumpmap_pars_fragment:fx,clipping_planes_fragment:dx,clipping_planes_pars_fragment:px,clipping_planes_pars_vertex:mx,clipping_planes_vertex:gx,color_fragment:_x,color_pars_fragment:xx,color_pars_vertex:yx,color_vertex:vx,common:Mx,cube_uv_reflection_fragment:Sx,defaultnormal_vertex:bx,displacementmap_pars_vertex:Ex,displacementmap_vertex:wx,emissivemap_fragment:Tx,emissivemap_pars_fragment:Ax,colorspace_fragment:Rx,colorspace_pars_fragment:Cx,envmap_fragment:Px,envmap_common_pars_fragment:Lx,envmap_pars_fragment:Ix,envmap_pars_vertex:Dx,envmap_physical_pars_fragment:Xx,envmap_vertex:Ux,fog_vertex:Nx,fog_pars_vertex:Ox,fog_fragment:Fx,fog_pars_fragment:Bx,gradientmap_pars_fragment:zx,lightmap_fragment:kx,lightmap_pars_fragment:Hx,lights_lambert_fragment:Vx,lights_lambert_pars_fragment:Gx,lights_pars_begin:Wx,lights_toon_fragment:qx,lights_toon_pars_fragment:Yx,lights_phong_fragment:$x,lights_phong_pars_fragment:Zx,lights_physical_fragment:Jx,lights_physical_pars_fragment:Kx,lights_fragment_begin:jx,lights_fragment_maps:Qx,lights_fragment_end:ty,logdepthbuf_fragment:ey,logdepthbuf_pars_fragment:ny,logdepthbuf_pars_vertex:iy,logdepthbuf_vertex:sy,map_fragment:ry,map_pars_fragment:oy,map_particle_fragment:ay,map_particle_pars_fragment:cy,metalnessmap_fragment:ly,metalnessmap_pars_fragment:hy,morphcolor_vertex:uy,morphnormal_vertex:fy,morphtarget_pars_vertex:dy,morphtarget_vertex:py,normal_fragment_begin:my,normal_fragment_maps:gy,normal_pars_fragment:_y,normal_pars_vertex:xy,normal_vertex:yy,normalmap_pars_fragment:vy,clearcoat_normal_fragment_begin:My,clearcoat_normal_fragment_maps:Sy,clearcoat_pars_fragment:by,iridescence_pars_fragment:Ey,opaque_fragment:wy,packing:Ty,premultiplied_alpha_fragment:Ay,project_vertex:Ry,dithering_fragment:Cy,dithering_pars_fragment:Py,roughnessmap_fragment:Ly,roughnessmap_pars_fragment:Iy,shadowmap_pars_fragment:Dy,shadowmap_pars_vertex:Uy,shadowmap_vertex:Ny,shadowmask_pars_fragment:Oy,skinbase_vertex:Fy,skinning_pars_vertex:By,skinning_vertex:zy,skinnormal_vertex:ky,specularmap_fragment:Hy,specularmap_pars_fragment:Vy,tonemapping_fragment:Gy,tonemapping_pars_fragment:Wy,transmission_fragment:Xy,transmission_pars_fragment:qy,uv_pars_fragment:Yy,uv_pars_vertex:$y,uv_vertex:Zy,worldpos_vertex:Jy,background_vert:Ky,background_frag:jy,backgroundCube_vert:Qy,backgroundCube_frag:tv,cube_vert:ev,cube_frag:nv,depth_vert:iv,depth_frag:sv,distanceRGBA_vert:rv,distanceRGBA_frag:ov,equirect_vert:av,equirect_frag:cv,linedashed_vert:lv,linedashed_frag:hv,meshbasic_vert:uv,meshbasic_frag:fv,meshlambert_vert:dv,meshlambert_frag:pv,meshmatcap_vert:mv,meshmatcap_frag:gv,meshnormal_vert:_v,meshnormal_frag:xv,meshphong_vert:yv,meshphong_frag:vv,meshphysical_vert:Mv,meshphysical_frag:Sv,meshtoon_vert:bv,meshtoon_frag:Ev,points_vert:wv,points_frag:Tv,shadow_vert:Av,shadow_frag:Rv,sprite_vert:Cv,sprite_frag:Pv},nt={common:{diffuse:{value:new St(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Yt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Yt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Yt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Yt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Yt},normalScale:{value:new $t(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Yt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Yt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Yt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Yt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new St(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new St(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0},uvTransform:{value:new Yt}},sprite:{diffuse:{value:new St(16777215)},opacity:{value:1},center:{value:new $t(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}}},Kn={basic:{uniforms:nn([nt.common,nt.specularmap,nt.envmap,nt.aomap,nt.lightmap,nt.fog]),vertexShader:Ht.meshbasic_vert,fragmentShader:Ht.meshbasic_frag},lambert:{uniforms:nn([nt.common,nt.specularmap,nt.envmap,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.fog,nt.lights,{emissive:{value:new St(0)}}]),vertexShader:Ht.meshlambert_vert,fragmentShader:Ht.meshlambert_frag},phong:{uniforms:nn([nt.common,nt.specularmap,nt.envmap,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.fog,nt.lights,{emissive:{value:new St(0)},specular:{value:new St(1118481)},shininess:{value:30}}]),vertexShader:Ht.meshphong_vert,fragmentShader:Ht.meshphong_frag},standard:{uniforms:nn([nt.common,nt.envmap,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.roughnessmap,nt.metalnessmap,nt.fog,nt.lights,{emissive:{value:new St(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ht.meshphysical_vert,fragmentShader:Ht.meshphysical_frag},toon:{uniforms:nn([nt.common,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.gradientmap,nt.fog,nt.lights,{emissive:{value:new St(0)}}]),vertexShader:Ht.meshtoon_vert,fragmentShader:Ht.meshtoon_frag},matcap:{uniforms:nn([nt.common,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.fog,{matcap:{value:null}}]),vertexShader:Ht.meshmatcap_vert,fragmentShader:Ht.meshmatcap_frag},points:{uniforms:nn([nt.points,nt.fog]),vertexShader:Ht.points_vert,fragmentShader:Ht.points_frag},dashed:{uniforms:nn([nt.common,nt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ht.linedashed_vert,fragmentShader:Ht.linedashed_frag},depth:{uniforms:nn([nt.common,nt.displacementmap]),vertexShader:Ht.depth_vert,fragmentShader:Ht.depth_frag},normal:{uniforms:nn([nt.common,nt.bumpmap,nt.normalmap,nt.displacementmap,{opacity:{value:1}}]),vertexShader:Ht.meshnormal_vert,fragmentShader:Ht.meshnormal_frag},sprite:{uniforms:nn([nt.sprite,nt.fog]),vertexShader:Ht.sprite_vert,fragmentShader:Ht.sprite_frag},background:{uniforms:{uvTransform:{value:new Yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ht.background_vert,fragmentShader:Ht.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Ht.backgroundCube_vert,fragmentShader:Ht.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ht.cube_vert,fragmentShader:Ht.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ht.equirect_vert,fragmentShader:Ht.equirect_frag},distanceRGBA:{uniforms:nn([nt.common,nt.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ht.distanceRGBA_vert,fragmentShader:Ht.distanceRGBA_frag},shadow:{uniforms:nn([nt.lights,nt.fog,{color:{value:new St(0)},opacity:{value:1}}]),vertexShader:Ht.shadow_vert,fragmentShader:Ht.shadow_frag}};Kn.physical={uniforms:nn([Kn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Yt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Yt},clearcoatNormalScale:{value:new $t(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Yt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Yt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Yt},sheen:{value:0},sheenColor:{value:new St(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Yt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Yt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Yt},transmissionSamplerSize:{value:new $t},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Yt},attenuationDistance:{value:0},attenuationColor:{value:new St(0)},specularColor:{value:new St(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Yt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Yt},anisotropyVector:{value:new $t},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Yt}}]),vertexShader:Ht.meshphysical_vert,fragmentShader:Ht.meshphysical_frag};var ga={r:0,b:0,g:0};function Lv(n,t,e,i,s,r,a){let o=new St(0),c=r===!0?0:1,l,u,f=null,h=0,p=null;function g(m,d){let M=!1,_=d.isScene===!0?d.background:null;_&&_.isTexture&&(_=(d.backgroundBlurriness>0?e:t).get(_)),_===null?x(o,c):_&&_.isColor&&(x(_,1),M=!0);let b=n.xr.getEnvironmentBlendMode();b==="additive"?i.buffers.color.setClear(0,0,0,1,a):b==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||M)&&n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil),_&&(_.isCubeTexture||_.mapping===ec)?(u===void 0&&(u=new ae(new Rn(1,1,1),new Mi({name:"BackgroundCubeMaterial",uniforms:wr(Kn.backgroundCube.uniforms),vertexShader:Kn.backgroundCube.vertexShader,fragmentShader:Kn.backgroundCube.fragmentShader,side:un,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(R,A,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),u.material.uniforms.envMap.value=_,u.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=d.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,u.material.toneMapped=oe.getTransfer(_.colorSpace)!==me,(f!==_||h!==_.version||p!==n.toneMapping)&&(u.material.needsUpdate=!0,f=_,h=_.version,p=n.toneMapping),u.layers.enableAll(),m.unshift(u,u.geometry,u.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new ae(new xo(2,2),new Mi({name:"BackgroundMaterial",uniforms:wr(Kn.background.uniforms),vertexShader:Kn.background.vertexShader,fragmentShader:Kn.background.fragmentShader,side:Qn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,l.material.toneMapped=oe.getTransfer(_.colorSpace)!==me,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(f!==_||h!==_.version||p!==n.toneMapping)&&(l.material.needsUpdate=!0,f=_,h=_.version,p=n.toneMapping),l.layers.enableAll(),m.unshift(l,l.geometry,l.material,0,0,null))}function x(m,d){m.getRGB(ga,bp(n)),i.buffers.color.setClear(ga.r,ga.g,ga.b,d,a)}return{getClearColor:function(){return o},setClearColor:function(m,d=1){o.set(m),c=d,x(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(m){c=m,x(o,c)},render:g}}function Iv(n,t,e,i){let s=n.getParameter(n.MAX_VERTEX_ATTRIBS),r=i.isWebGL2?null:t.get("OES_vertex_array_object"),a=i.isWebGL2||r!==null,o={},c=m(null),l=c,u=!1;function f(L,O,G,q,X){let W=!1;if(a){let K=x(q,G,O);l!==K&&(l=K,p(l.object)),W=d(L,q,G,X),W&&M(L,q,G,X)}else{let K=O.wireframe===!0;(l.geometry!==q.id||l.program!==G.id||l.wireframe!==K)&&(l.geometry=q.id,l.program=G.id,l.wireframe=K,W=!0)}X!==null&&e.update(X,n.ELEMENT_ARRAY_BUFFER),(W||u)&&(u=!1,H(L,O,G,q),X!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(X).buffer))}function h(){return i.isWebGL2?n.createVertexArray():r.createVertexArrayOES()}function p(L){return i.isWebGL2?n.bindVertexArray(L):r.bindVertexArrayOES(L)}function g(L){return i.isWebGL2?n.deleteVertexArray(L):r.deleteVertexArrayOES(L)}function x(L,O,G){let q=G.wireframe===!0,X=o[L.id];X===void 0&&(X={},o[L.id]=X);let W=X[O.id];W===void 0&&(W={},X[O.id]=W);let K=W[q];return K===void 0&&(K=m(h()),W[q]=K),K}function m(L){let O=[],G=[],q=[];for(let X=0;X<s;X++)O[X]=0,G[X]=0,q[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:G,attributeDivisors:q,object:L,attributes:{},index:null}}function d(L,O,G,q){let X=l.attributes,W=O.attributes,K=0,tt=G.getAttributes();for(let ut in tt)if(tt[ut].location>=0){let $=X[ut],lt=W[ut];if(lt===void 0&&(ut==="instanceMatrix"&&L.instanceMatrix&&(lt=L.instanceMatrix),ut==="instanceColor"&&L.instanceColor&&(lt=L.instanceColor)),$===void 0||$.attribute!==lt||lt&&$.data!==lt.data)return!0;K++}return l.attributesNum!==K||l.index!==q}function M(L,O,G,q){let X={},W=O.attributes,K=0,tt=G.getAttributes();for(let ut in tt)if(tt[ut].location>=0){let $=W[ut];$===void 0&&(ut==="instanceMatrix"&&L.instanceMatrix&&($=L.instanceMatrix),ut==="instanceColor"&&L.instanceColor&&($=L.instanceColor));let lt={};lt.attribute=$,$&&$.data&&(lt.data=$.data),X[ut]=lt,K++}l.attributes=X,l.attributesNum=K,l.index=q}function _(){let L=l.newAttributes;for(let O=0,G=L.length;O<G;O++)L[O]=0}function b(L){R(L,0)}function R(L,O){let G=l.newAttributes,q=l.enabledAttributes,X=l.attributeDivisors;G[L]=1,q[L]===0&&(n.enableVertexAttribArray(L),q[L]=1),X[L]!==O&&((i.isWebGL2?n:t.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](L,O),X[L]=O)}function A(){let L=l.newAttributes,O=l.enabledAttributes;for(let G=0,q=O.length;G<q;G++)O[G]!==L[G]&&(n.disableVertexAttribArray(G),O[G]=0)}function w(L,O,G,q,X,W,K){K===!0?n.vertexAttribIPointer(L,O,G,X,W):n.vertexAttribPointer(L,O,G,q,X,W)}function H(L,O,G,q){if(i.isWebGL2===!1&&(L.isInstancedMesh||q.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;_();let X=q.attributes,W=G.getAttributes(),K=O.defaultAttributeValues;for(let tt in W){let ut=W[tt];if(ut.location>=0){let V=X[tt];if(V===void 0&&(tt==="instanceMatrix"&&L.instanceMatrix&&(V=L.instanceMatrix),tt==="instanceColor"&&L.instanceColor&&(V=L.instanceColor)),V!==void 0){let $=V.normalized,lt=V.itemSize,yt=e.get(V);if(yt===void 0)continue;let xt=yt.buffer,Ft=yt.type,zt=yt.bytesPerElement,Rt=i.isWebGL2===!0&&(Ft===n.INT||Ft===n.UNSIGNED_INT||V.gpuType===up);if(V.isInterleavedBufferAttribute){let jt=V.data,U=jt.stride,Je=V.offset;if(jt.isInstancedInterleavedBuffer){for(let bt=0;bt<ut.locationSize;bt++)R(ut.location+bt,jt.meshPerAttribute);L.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=jt.meshPerAttribute*jt.count)}else for(let bt=0;bt<ut.locationSize;bt++)b(ut.location+bt);n.bindBuffer(n.ARRAY_BUFFER,xt);for(let bt=0;bt<ut.locationSize;bt++)w(ut.location+bt,lt/ut.locationSize,Ft,$,U*zt,(Je+lt/ut.locationSize*bt)*zt,Rt)}else{if(V.isInstancedBufferAttribute){for(let jt=0;jt<ut.locationSize;jt++)R(ut.location+jt,V.meshPerAttribute);L.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=V.meshPerAttribute*V.count)}else for(let jt=0;jt<ut.locationSize;jt++)b(ut.location+jt);n.bindBuffer(n.ARRAY_BUFFER,xt);for(let jt=0;jt<ut.locationSize;jt++)w(ut.location+jt,lt/ut.locationSize,Ft,$,lt*zt,lt/ut.locationSize*jt*zt,Rt)}}else if(K!==void 0){let $=K[tt];if($!==void 0)switch($.length){case 2:n.vertexAttrib2fv(ut.location,$);break;case 3:n.vertexAttrib3fv(ut.location,$);break;case 4:n.vertexAttrib4fv(ut.location,$);break;default:n.vertexAttrib1fv(ut.location,$)}}}}A()}function y(){Y();for(let L in o){let O=o[L];for(let G in O){let q=O[G];for(let X in q)g(q[X].object),delete q[X];delete O[G]}delete o[L]}}function T(L){if(o[L.id]===void 0)return;let O=o[L.id];for(let G in O){let q=O[G];for(let X in q)g(q[X].object),delete q[X];delete O[G]}delete o[L.id]}function k(L){for(let O in o){let G=o[O];if(G[L.id]===void 0)continue;let q=G[L.id];for(let X in q)g(q[X].object),delete q[X];delete G[L.id]}}function Y(){it(),u=!0,l!==c&&(l=c,p(l.object))}function it(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:f,reset:Y,resetDefaultState:it,dispose:y,releaseStatesOfGeometry:T,releaseStatesOfProgram:k,initAttributes:_,enableAttribute:b,disableUnusedAttributes:A}}function Dv(n,t,e,i){let s=i.isWebGL2,r;function a(u){r=u}function o(u,f){n.drawArrays(r,u,f),e.update(f,r,1)}function c(u,f,h){if(h===0)return;let p,g;if(s)p=n,g="drawArraysInstanced";else if(p=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",p===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[g](r,u,f,h),e.update(f,r,h)}function l(u,f,h){if(h===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<h;g++)this.render(u[g],f[g]);else{p.multiDrawArraysWEBGL(r,u,0,f,0,h);let g=0;for(let x=0;x<h;x++)g+=f[x];e.update(g,r,1)}}this.setMode=a,this.render=o,this.renderInstances=c,this.renderMultiDraw=l}function Uv(n,t,e){let i;function s(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){let w=t.get("EXT_texture_filter_anisotropic");i=n.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function r(w){if(w==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let a=typeof WebGL2RenderingContext<"u"&&n.constructor.name==="WebGL2RenderingContext",o=e.precision!==void 0?e.precision:"highp",c=r(o);c!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",c,"instead."),o=c);let l=a||t.has("WEBGL_draw_buffers"),u=e.logarithmicDepthBuffer===!0,f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),h=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),x=n.getParameter(n.MAX_VERTEX_ATTRIBS),m=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),d=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),_=h>0,b=a||t.has("OES_texture_float"),R=_&&b,A=a?n.getParameter(n.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:l,getMaxAnisotropy:s,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:u,maxTextures:f,maxVertexTextures:h,maxTextureSize:p,maxCubemapSize:g,maxAttributes:x,maxVertexUniforms:m,maxVaryings:d,maxFragmentUniforms:M,vertexTextures:_,floatFragmentTextures:b,floatVertexTextures:R,maxSamples:A}}function Nv(n){let t=this,e=null,i=0,s=!1,r=!1,a=new gi,o=new Yt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){let p=f.length!==0||h||i!==0||s;return s=h,i=f.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,h){e=u(f,h,0)},this.setState=function(f,h,p){let g=f.clippingPlanes,x=f.clipIntersection,m=f.clipShadows,d=n.get(f);if(!s||g===null||g.length===0||r&&!m)r?u(null):l();else{let M=r?0:i,_=M*4,b=d.clippingState||null;c.value=b,b=u(g,h,_,p);for(let R=0;R!==_;++R)b[R]=e[R];d.clippingState=b,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function u(f,h,p,g){let x=f!==null?f.length:0,m=null;if(x!==0){if(m=c.value,g!==!0||m===null){let d=p+x*4,M=h.matrixWorldInverse;o.getNormalMatrix(M),(m===null||m.length<d)&&(m=new Float32Array(d));for(let _=0,b=p;_!==x;++_,b+=4)a.copy(f[_]).applyMatrix4(M,o),a.normal.toArray(m,b),m[b+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,m}}function Ov(n){let t=new WeakMap;function e(a,o){return o===Ql?a.mapping=Sr:o===th&&(a.mapping=br),a}function i(a){if(a&&a.isTexture){let o=a.mapping;if(o===Ql||o===th)if(t.has(a)){let c=t.get(a).texture;return e(c,a.mapping)}else{let c=a.image;if(c&&c.height>0){let l=new ch(c.height/2);return l.fromEquirectangularTexture(n,a),t.set(a,l),a.addEventListener("dispose",s),e(l.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:i,dispose:r}}var qa=class extends Wa{constructor(t=-1,e=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-t,a=i+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},gr=4,Ld=[.125,.215,.35,.446,.526,.582],vs=20,Vl=new qa,Id=new St,Gl=null,Wl=0,Xl=0,xs=(1+Math.sqrt(5))/2,ur=1/xs,Dd=[new P(1,1,1),new P(-1,1,1),new P(1,1,-1),new P(-1,1,-1),new P(0,xs,ur),new P(0,xs,-ur),new P(ur,0,xs),new P(-ur,0,xs),new P(xs,ur,0),new P(-xs,ur,0)],Ya=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100){Gl=this._renderer.getRenderTarget(),Wl=this._renderer.getActiveCubeFace(),Xl=this._renderer.getActiveMipmapLevel(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,i,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Od(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Nd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Gl,Wl,Xl),t.scissorTest=!1,_a(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Sr||t.mapping===br?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Gl=this._renderer.getRenderTarget(),Wl=this._renderer.getActiveCubeFace(),Xl=this._renderer.getActiveMipmapLevel();let i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:wn,minFilter:wn,generateMipmaps:!1,type:po,format:Gn,colorSpace:yi,depthBuffer:!1},s=Ud(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ud(t,e,i);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Fv(r)),this._blurMaterial=Bv(r,t,e)}return s}_compileMaterial(t){let e=new ae(this._lodPlanes[0],t);this._renderer.compile(e,Vl)}_sceneToCubeUV(t,e,i,s){let o=new ze(90,1,e,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,h=u.toneMapping;u.getClearColor(Id),u.toneMapping=Vi,u.autoClear=!1;let p=new ei({name:"PMREM.Background",side:un,depthWrite:!1,depthTest:!1}),g=new ae(new Rn,p),x=!1,m=t.background;m?m.isColor&&(p.color.copy(m),t.background=null,x=!0):(p.color.copy(Id),x=!0);for(let d=0;d<6;d++){let M=d%3;M===0?(o.up.set(0,c[d],0),o.lookAt(l[d],0,0)):M===1?(o.up.set(0,0,c[d]),o.lookAt(0,l[d],0)):(o.up.set(0,c[d],0),o.lookAt(0,0,l[d]));let _=this._cubeSize;_a(s,M*_,d>2?_:0,_,_),u.setRenderTarget(s),x&&u.render(g,o),u.render(t,o)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=h,u.autoClear=f,t.background=m}_textureToCubeUV(t,e){let i=this._renderer,s=t.mapping===Sr||t.mapping===br;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Od()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Nd());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new ae(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;let c=this._cubeSize;_a(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(a,Vl)}_applyPMREM(t){let e=this._renderer,i=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){let r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Dd[(s-1)%Dd.length];this._blur(t,s-1,s,r,a)}e.autoClear=i}_blur(t,e,i,s,r){let a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,s,"latitudinal",r),this._halfBlur(a,t,i,i,s,"longitudinal",r)}_halfBlur(t,e,i,s,r,a,o){let c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let u=3,f=new ae(this._lodPlanes[s],l),h=l.uniforms,p=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*vs-1),x=r/g,m=isFinite(r)?1+Math.floor(u*x):vs;m>vs&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${vs}`);let d=[],M=0;for(let w=0;w<vs;++w){let H=w/x,y=Math.exp(-H*H/2);d.push(y),w===0?M+=y:w<m&&(M+=2*y)}for(let w=0;w<d.length;w++)d[w]=d[w]/M;h.envMap.value=t.texture,h.samples.value=m,h.weights.value=d,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);let{_lodMax:_}=this;h.dTheta.value=g,h.mipInt.value=_-i;let b=this._sizeLods[s],R=3*b*(s>_-gr?s-_+gr:0),A=4*(this._cubeSize-b);_a(e,R,A,3*b,2*b),c.setRenderTarget(e),c.render(f,Vl)}};function Fv(n){let t=[],e=[],i=[],s=n,r=n-gr+1+Ld.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);e.push(o);let c=1/o;a>n-gr?c=Ld[a-n+gr-1]:a===0&&(c=0),i.push(c);let l=1/(o-2),u=-l,f=1+l,h=[u,u,f,u,f,f,u,u,f,f,u,f],p=6,g=6,x=3,m=2,d=1,M=new Float32Array(x*g*p),_=new Float32Array(m*g*p),b=new Float32Array(d*g*p);for(let A=0;A<p;A++){let w=A%3*2/3-1,H=A>2?0:-1,y=[w,H,0,w+2/3,H,0,w+2/3,H+1,0,w,H,0,w+2/3,H+1,0,w,H+1,0];M.set(y,x*g*A),_.set(h,m*g*A);let T=[A,A,A,A,A,A];b.set(T,d*g*A)}let R=new Le;R.setAttribute("position",new vn(M,x)),R.setAttribute("uv",new vn(_,m)),R.setAttribute("faceIndex",new vn(b,d)),t.push(R),s>gr&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Ud(n,t,e){let i=new vi(n,t,e);return i.texture.mapping=ec,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function _a(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function Bv(n,t,e){let i=new Float32Array(vs),s=new P(0,1,0);return new Mi({name:"SphericalGaussianBlur",defines:{n:vs,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Hh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Hi,depthTest:!1,depthWrite:!1})}function Nd(){return new Mi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Hh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Hi,depthTest:!1,depthWrite:!1})}function Od(){return new Mi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Hh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Hi,depthTest:!1,depthWrite:!1})}function Hh(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function zv(n){let t=new WeakMap,e=null;function i(o){if(o&&o.isTexture){let c=o.mapping,l=c===Ql||c===th,u=c===Sr||c===br;if(l||u)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let f=t.get(o);return e===null&&(e=new Ya(n)),f=l?e.fromEquirectangular(o,f):e.fromCubemap(o,f),t.set(o,f),f.texture}else{if(t.has(o))return t.get(o).texture;{let f=o.image;if(l&&f&&f.height>0||u&&f&&s(f)){e===null&&(e=new Ya(n));let h=l?e.fromEquirectangular(o):e.fromCubemap(o);return t.set(o,h),o.addEventListener("dispose",r),h.texture}else return null}}}return o}function s(o){let c=0,l=6;for(let u=0;u<l;u++)o[u]!==void 0&&c++;return c===l}function r(o){let c=o.target;c.removeEventListener("dispose",r);let l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function kv(n){let t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(i){i.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(i){let s=e(i);return s===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function Hv(n,t,e,i){let s={},r=new WeakMap;function a(f){let h=f.target;h.index!==null&&t.remove(h.index);for(let g in h.attributes)t.remove(h.attributes[g]);for(let g in h.morphAttributes){let x=h.morphAttributes[g];for(let m=0,d=x.length;m<d;m++)t.remove(x[m])}h.removeEventListener("dispose",a),delete s[h.id];let p=r.get(h);p&&(t.remove(p),r.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function o(f,h){return s[h.id]===!0||(h.addEventListener("dispose",a),s[h.id]=!0,e.memory.geometries++),h}function c(f){let h=f.attributes;for(let g in h)t.update(h[g],n.ARRAY_BUFFER);let p=f.morphAttributes;for(let g in p){let x=p[g];for(let m=0,d=x.length;m<d;m++)t.update(x[m],n.ARRAY_BUFFER)}}function l(f){let h=[],p=f.index,g=f.attributes.position,x=0;if(p!==null){let M=p.array;x=p.version;for(let _=0,b=M.length;_<b;_+=3){let R=M[_+0],A=M[_+1],w=M[_+2];h.push(R,A,A,w,w,R)}}else if(g!==void 0){let M=g.array;x=g.version;for(let _=0,b=M.length/3-1;_<b;_+=3){let R=_+0,A=_+1,w=_+2;h.push(R,A,A,w,w,R)}}else return;let m=new(Mp(h)?Ga:Va)(h,1);m.version=x;let d=r.get(f);d&&t.remove(d),r.set(f,m)}function u(f){let h=r.get(f);if(h){let p=f.index;p!==null&&h.version<p.version&&l(f)}else l(f);return r.get(f)}return{get:o,update:c,getWireframeAttribute:u}}function Vv(n,t,e,i){let s=i.isWebGL2,r;function a(p){r=p}let o,c;function l(p){o=p.type,c=p.bytesPerElement}function u(p,g){n.drawElements(r,g,o,p*c),e.update(g,r,1)}function f(p,g,x){if(x===0)return;let m,d;if(s)m=n,d="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),d="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[d](r,g,o,p*c,x),e.update(g,r,x)}function h(p,g,x){if(x===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<x;d++)this.render(p[d]/c,g[d]);else{m.multiDrawElementsWEBGL(r,g,0,o,p,0,x);let d=0;for(let M=0;M<x;M++)d+=g[M];e.update(d,r,1)}}this.setMode=a,this.setIndex=l,this.render=u,this.renderInstances=f,this.renderMultiDraw=h}function Gv(n){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(e.calls++,a){case n.TRIANGLES:e.triangles+=o*(r/3);break;case n.LINES:e.lines+=o*(r/2);break;case n.LINE_STRIP:e.lines+=o*(r-1);break;case n.LINE_LOOP:e.lines+=o*r;break;case n.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function Wv(n,t){return n[0]-t[0]}function Xv(n,t){return Math.abs(t[1])-Math.abs(n[1])}function qv(n,t,e){let i={},s=new Float32Array(8),r=new WeakMap,a=new ke,o=[];for(let l=0;l<8;l++)o[l]=[l,0];function c(l,u,f){let h=l.morphTargetInfluences;if(t.isWebGL2===!0){let p=u.morphAttributes.position||u.morphAttributes.normal||u.morphAttributes.color,g=p!==void 0?p.length:0,x=r.get(u);if(x===void 0||x.count!==g){let L=function(){Y.dispose(),r.delete(u),u.removeEventListener("dispose",L)};x!==void 0&&x.texture.dispose();let M=u.morphAttributes.position!==void 0,_=u.morphAttributes.normal!==void 0,b=u.morphAttributes.color!==void 0,R=u.morphAttributes.position||[],A=u.morphAttributes.normal||[],w=u.morphAttributes.color||[],H=0;M===!0&&(H=1),_===!0&&(H=2),b===!0&&(H=3);let y=u.attributes.position.count*H,T=1;y>t.maxTextureSize&&(T=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);let k=new Float32Array(y*T*4*g),Y=new za(k,y,T,g);Y.type=zi,Y.needsUpdate=!0;let it=H*4;for(let O=0;O<g;O++){let G=R[O],q=A[O],X=w[O],W=y*T*4*O;for(let K=0;K<G.count;K++){let tt=K*it;M===!0&&(a.fromBufferAttribute(G,K),k[W+tt+0]=a.x,k[W+tt+1]=a.y,k[W+tt+2]=a.z,k[W+tt+3]=0),_===!0&&(a.fromBufferAttribute(q,K),k[W+tt+4]=a.x,k[W+tt+5]=a.y,k[W+tt+6]=a.z,k[W+tt+7]=0),b===!0&&(a.fromBufferAttribute(X,K),k[W+tt+8]=a.x,k[W+tt+9]=a.y,k[W+tt+10]=a.z,k[W+tt+11]=X.itemSize===4?a.w:1)}}x={count:g,texture:Y,size:new $t(y,T)},r.set(u,x),u.addEventListener("dispose",L)}let m=0;for(let M=0;M<h.length;M++)m+=h[M];let d=u.morphTargetsRelative?1:1-m;f.getUniforms().setValue(n,"morphTargetBaseInfluence",d),f.getUniforms().setValue(n,"morphTargetInfluences",h),f.getUniforms().setValue(n,"morphTargetsTexture",x.texture,e),f.getUniforms().setValue(n,"morphTargetsTextureSize",x.size)}else{let p=h===void 0?0:h.length,g=i[u.id];if(g===void 0||g.length!==p){g=[];for(let _=0;_<p;_++)g[_]=[_,0];i[u.id]=g}for(let _=0;_<p;_++){let b=g[_];b[0]=_,b[1]=h[_]}g.sort(Xv);for(let _=0;_<8;_++)_<p&&g[_][1]?(o[_][0]=g[_][0],o[_][1]=g[_][1]):(o[_][0]=Number.MAX_SAFE_INTEGER,o[_][1]=0);o.sort(Wv);let x=u.morphAttributes.position,m=u.morphAttributes.normal,d=0;for(let _=0;_<8;_++){let b=o[_],R=b[0],A=b[1];R!==Number.MAX_SAFE_INTEGER&&A?(x&&u.getAttribute("morphTarget"+_)!==x[R]&&u.setAttribute("morphTarget"+_,x[R]),m&&u.getAttribute("morphNormal"+_)!==m[R]&&u.setAttribute("morphNormal"+_,m[R]),s[_]=A,d+=A):(x&&u.hasAttribute("morphTarget"+_)===!0&&u.deleteAttribute("morphTarget"+_),m&&u.hasAttribute("morphNormal"+_)===!0&&u.deleteAttribute("morphNormal"+_),s[_]=0)}let M=u.morphTargetsRelative?1:1-d;f.getUniforms().setValue(n,"morphTargetBaseInfluence",M),f.getUniforms().setValue(n,"morphTargetInfluences",s)}}return{update:c}}function Yv(n,t,e,i){let s=new WeakMap;function r(c){let l=i.render.frame,u=c.geometry,f=t.get(c,u);if(s.get(f)!==l&&(t.update(f),s.set(f,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let h=c.skeleton;s.get(h)!==l&&(h.update(),s.set(h,l))}return f}function a(){s=new WeakMap}function o(c){let l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:a}}var $a=class extends An{constructor(t,e,i,s,r,a,o,c,l,u){if(u=u!==void 0?u:Ss,u!==Ss&&u!==Er)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===Ss&&(i=Bi),i===void 0&&u===Er&&(i=Ms),super(null,s,r,a,o,c,u,i,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:Ge,this.minFilter=c!==void 0?c:Ge,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},wp=new An,Tp=new $a(1,1);Tp.compareFunction=vp;var Ap=new za,Rp=new oh,Cp=new Xa,Fd=[],Bd=[],zd=new Float32Array(16),kd=new Float32Array(9),Hd=new Float32Array(4);function Rr(n,t,e){let i=n[0];if(i<=0||i>0)return n;let s=t*e,r=Fd[s];if(r===void 0&&(r=new Float32Array(s),Fd[s]=r),t!==0){i.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,n[a].toArray(r,o)}return r}function Ie(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function De(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function ic(n,t){let e=Bd[t];e===void 0&&(e=new Int32Array(t),Bd[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function $v(n,t){let e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function Zv(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;n.uniform2fv(this.addr,t),De(e,t)}}function Jv(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ie(e,t))return;n.uniform3fv(this.addr,t),De(e,t)}}function Kv(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;n.uniform4fv(this.addr,t),De(e,t)}}function jv(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(Ie(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),De(e,t)}else{if(Ie(e,i))return;Hd.set(i),n.uniformMatrix2fv(this.addr,!1,Hd),De(e,i)}}function Qv(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(Ie(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),De(e,t)}else{if(Ie(e,i))return;kd.set(i),n.uniformMatrix3fv(this.addr,!1,kd),De(e,i)}}function tM(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(Ie(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),De(e,t)}else{if(Ie(e,i))return;zd.set(i),n.uniformMatrix4fv(this.addr,!1,zd),De(e,i)}}function eM(n,t){let e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function nM(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;n.uniform2iv(this.addr,t),De(e,t)}}function iM(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ie(e,t))return;n.uniform3iv(this.addr,t),De(e,t)}}function sM(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;n.uniform4iv(this.addr,t),De(e,t)}}function rM(n,t){let e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function oM(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;n.uniform2uiv(this.addr,t),De(e,t)}}function aM(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ie(e,t))return;n.uniform3uiv(this.addr,t),De(e,t)}}function cM(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;n.uniform4uiv(this.addr,t),De(e,t)}}function lM(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r=this.type===n.SAMPLER_2D_SHADOW?Tp:wp;e.setTexture2D(t||r,s)}function hM(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||Rp,s)}function uM(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||Cp,s)}function fM(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||Ap,s)}function dM(n){switch(n){case 5126:return $v;case 35664:return Zv;case 35665:return Jv;case 35666:return Kv;case 35674:return jv;case 35675:return Qv;case 35676:return tM;case 5124:case 35670:return eM;case 35667:case 35671:return nM;case 35668:case 35672:return iM;case 35669:case 35673:return sM;case 5125:return rM;case 36294:return oM;case 36295:return aM;case 36296:return cM;case 35678:case 36198:case 36298:case 36306:case 35682:return lM;case 35679:case 36299:case 36307:return hM;case 35680:case 36300:case 36308:case 36293:return uM;case 36289:case 36303:case 36311:case 36292:return fM}}function pM(n,t){n.uniform1fv(this.addr,t)}function mM(n,t){let e=Rr(t,this.size,2);n.uniform2fv(this.addr,e)}function gM(n,t){let e=Rr(t,this.size,3);n.uniform3fv(this.addr,e)}function _M(n,t){let e=Rr(t,this.size,4);n.uniform4fv(this.addr,e)}function xM(n,t){let e=Rr(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function yM(n,t){let e=Rr(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function vM(n,t){let e=Rr(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function MM(n,t){n.uniform1iv(this.addr,t)}function SM(n,t){n.uniform2iv(this.addr,t)}function bM(n,t){n.uniform3iv(this.addr,t)}function EM(n,t){n.uniform4iv(this.addr,t)}function wM(n,t){n.uniform1uiv(this.addr,t)}function TM(n,t){n.uniform2uiv(this.addr,t)}function AM(n,t){n.uniform3uiv(this.addr,t)}function RM(n,t){n.uniform4uiv(this.addr,t)}function CM(n,t,e){let i=this.cache,s=t.length,r=ic(e,s);Ie(i,r)||(n.uniform1iv(this.addr,r),De(i,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||wp,r[a])}function PM(n,t,e){let i=this.cache,s=t.length,r=ic(e,s);Ie(i,r)||(n.uniform1iv(this.addr,r),De(i,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Rp,r[a])}function LM(n,t,e){let i=this.cache,s=t.length,r=ic(e,s);Ie(i,r)||(n.uniform1iv(this.addr,r),De(i,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Cp,r[a])}function IM(n,t,e){let i=this.cache,s=t.length,r=ic(e,s);Ie(i,r)||(n.uniform1iv(this.addr,r),De(i,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Ap,r[a])}function DM(n){switch(n){case 5126:return pM;case 35664:return mM;case 35665:return gM;case 35666:return _M;case 35674:return xM;case 35675:return yM;case 35676:return vM;case 5124:case 35670:return MM;case 35667:case 35671:return SM;case 35668:case 35672:return bM;case 35669:case 35673:return EM;case 5125:return wM;case 36294:return TM;case 36295:return AM;case 36296:return RM;case 35678:case 36198:case 36298:case 36306:case 35682:return CM;case 35679:case 36299:case 36307:return PM;case 35680:case 36300:case 36308:case 36293:return LM;case 36289:case 36303:case 36311:case 36292:return IM}}var lh=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=dM(e.type)}},hh=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=DM(e.type)}},uh=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(t,e[o.id],i)}}},ql=/(\w+)(\])?(\[|\.)?/g;function Vd(n,t){n.seq.push(t),n.map[t.id]=t}function UM(n,t,e){let i=n.name,s=i.length;for(ql.lastIndex=0;;){let r=ql.exec(i),a=ql.lastIndex,o=r[1],c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){Vd(e,l===void 0?new lh(o,n,t):new hh(o,n,t));break}else{let f=e.map[o];f===void 0&&(f=new uh(o),Vd(e,f)),e=f}}}var Mr=class{constructor(t,e){this.seq=[],this.map={};let i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){let r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);UM(r,a,this)}}setValue(t,e,i,s){let r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){let s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,a=e.length;r!==a;++r){let o=e[r],c=i[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){let i=[];for(let s=0,r=t.length;s!==r;++s){let a=t[s];a.id in e&&i.push(a)}return i}};function Gd(n,t,e){let i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}var NM=37297,OM=0;function FM(n,t){let e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){let o=a+1;i.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}function BM(n){let t=oe.getPrimaries(oe.workingColorSpace),e=oe.getPrimaries(n),i;switch(t===e?i="":t===Da&&e===Ia?i="LinearDisplayP3ToLinearSRGB":t===Ia&&e===Da&&(i="LinearSRGBToLinearDisplayP3"),n){case yi:case nc:return[i,"LinearTransferOETF"];case Pe:case Bh:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function Wd(n,t,e){let i=n.getShaderParameter(t,n.COMPILE_STATUS),s=n.getShaderInfoLog(t).trim();if(i&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+FM(n.getShaderSource(t),a)}else return s}function zM(n,t){let e=BM(t);return`vec4 ${n}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function kM(n,t){let e;switch(t){case Xg:e="Linear";break;case qg:e="Reinhard";break;case Yg:e="OptimizedCineon";break;case $g:e="ACESFilmic";break;case Jg:e="AgX";break;case Zg:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function HM(n){return[n.extensionDerivatives||n.envMapCubeUVHeight||n.bumpMap||n.normalMapTangentSpace||n.clearcoatNormalMap||n.flatShading||n.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(n.extensionFragDepth||n.logarithmicDepthBuffer)&&n.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",n.extensionDrawBuffers&&n.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(n.extensionShaderTextureLOD||n.envMap||n.transmission)&&n.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(_r).join(`
`)}function VM(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(_r).join(`
`)}function GM(n){let t=[];for(let e in n){let i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function WM(n,t){let e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(t,s),a=r.name,o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:n.getAttribLocation(t,a),locationSize:o}}return e}function _r(n){return n!==""}function Xd(n,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function qd(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var XM=/^[ \t]*#include +<([\w\d./]+)>/gm;function fh(n){return n.replace(XM,YM)}var qM=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function YM(n,t){let e=Ht[t];if(e===void 0){let i=qM.get(t);if(i!==void 0)e=Ht[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return fh(e)}var $M=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Yd(n){return n.replace($M,ZM)}function ZM(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function $d(n){let t="precision "+n.precision+` float;
precision `+n.precision+" int;";return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function JM(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===lp?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Nh?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===mi&&(t="SHADOWMAP_TYPE_VSM"),t}function KM(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Sr:case br:t="ENVMAP_TYPE_CUBE";break;case ec:t="ENVMAP_TYPE_CUBE_UV";break}return t}function jM(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case br:t="ENVMAP_MODE_REFRACTION";break}return t}function QM(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Oh:t="ENVMAP_BLENDING_MULTIPLY";break;case Gg:t="ENVMAP_BLENDING_MIX";break;case Wg:t="ENVMAP_BLENDING_ADD";break}return t}function tS(n){let t=n.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function eS(n,t,e,i){let s=n.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,c=JM(e),l=KM(e),u=jM(e),f=QM(e),h=tS(e),p=e.isWebGL2?"":HM(e),g=VM(e),x=GM(r),m=s.createProgram(),d,M,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(_r).join(`
`),d.length>0&&(d+=`
`),M=[p,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(_r).join(`
`),M.length>0&&(M+=`
`)):(d=[$d(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(_r).join(`
`),M=[p,$d(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+u:"",e.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Vi?"#define TONE_MAPPING":"",e.toneMapping!==Vi?Ht.tonemapping_pars_fragment:"",e.toneMapping!==Vi?kM("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Ht.colorspace_pars_fragment,zM("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(_r).join(`
`)),a=fh(a),a=Xd(a,e),a=qd(a,e),o=fh(o),o=Xd(o,e),o=qd(o,e),a=Yd(a),o=Yd(o),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,d=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,M=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===dd?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===dd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+M);let b=_+d+a,R=_+M+o,A=Gd(s,s.VERTEX_SHADER,b),w=Gd(s,s.FRAGMENT_SHADER,R);s.attachShader(m,A),s.attachShader(m,w),e.index0AttributeName!==void 0?s.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function H(Y){if(n.debug.checkShaderErrors){let it=s.getProgramInfoLog(m).trim(),L=s.getShaderInfoLog(A).trim(),O=s.getShaderInfoLog(w).trim(),G=!0,q=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(G=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,m,A,w);else{let X=Wd(s,A,"vertex"),W=Wd(s,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Program Info Log: `+it+`
`+X+`
`+W)}else it!==""?console.warn("THREE.WebGLProgram: Program Info Log:",it):(L===""||O==="")&&(q=!1);q&&(Y.diagnostics={runnable:G,programLog:it,vertexShader:{log:L,prefix:d},fragmentShader:{log:O,prefix:M}})}s.deleteShader(A),s.deleteShader(w),y=new Mr(s,m),T=WM(s,m)}let y;this.getUniforms=function(){return y===void 0&&H(this),y};let T;this.getAttributes=function(){return T===void 0&&H(this),T};let k=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return k===!1&&(k=s.getProgramParameter(m,NM)),k},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=OM++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=A,this.fragmentShader=w,this}var nS=0,dh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){let e=this.shaderCache,i=e.get(t);return i===void 0&&(i=new ph(t),e.set(t,i)),i}},ph=class{constructor(t){this.id=nS++,this.code=t,this.usedTimes=0}};function iS(n,t,e,i,s,r,a){let o=new Ha,c=new dh,l=[],u=s.isWebGL2,f=s.logarithmicDepthBuffer,h=s.vertexTextures,p=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(y){return y===0?"uv":`uv${y}`}function m(y,T,k,Y,it){let L=Y.fog,O=it.geometry,G=y.isMeshStandardMaterial?Y.environment:null,q=(y.isMeshStandardMaterial?e:t).get(y.envMap||G),X=q&&q.mapping===ec?q.image.height:null,W=g[y.type];y.precision!==null&&(p=s.getMaxPrecision(y.precision),p!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",p,"instead."));let K=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,tt=K!==void 0?K.length:0,ut=0;O.morphAttributes.position!==void 0&&(ut=1),O.morphAttributes.normal!==void 0&&(ut=2),O.morphAttributes.color!==void 0&&(ut=3);let V,$,lt,yt;if(W){let Ke=Kn[W];V=Ke.vertexShader,$=Ke.fragmentShader}else V=y.vertexShader,$=y.fragmentShader,c.update(y),lt=c.getVertexShaderID(y),yt=c.getFragmentShaderID(y);let xt=n.getRenderTarget(),Ft=it.isInstancedMesh===!0,zt=it.isBatchedMesh===!0,Rt=!!y.map,jt=!!y.matcap,U=!!q,Je=!!y.aoMap,bt=!!y.lightMap,Ut=!!y.bumpMap,mt=!!y.normalMap,xe=!!y.displacementMap,Vt=!!y.emissiveMap,E=!!y.metalnessMap,v=!!y.roughnessMap,F=y.anisotropy>0,j=y.clearcoat>0,J=y.iridescence>0,Q=y.sheen>0,gt=y.transmission>0,ot=F&&!!y.anisotropyMap,ft=j&&!!y.clearcoatMap,Tt=j&&!!y.clearcoatNormalMap,Gt=j&&!!y.clearcoatRoughnessMap,Z=J&&!!y.iridescenceMap,se=J&&!!y.iridescenceThicknessMap,Zt=Q&&!!y.sheenColorMap,Lt=Q&&!!y.sheenRoughnessMap,vt=!!y.specularMap,dt=!!y.specularColorMap,kt=!!y.specularIntensityMap,ne=gt&&!!y.transmissionMap,Me=gt&&!!y.thicknessMap,Xt=!!y.gradientMap,et=!!y.alphaMap,C=y.alphaTest>0,st=!!y.alphaHash,rt=!!y.extensions,Ct=!!O.attributes.uv1,Et=!!O.attributes.uv2,le=!!O.attributes.uv3,he=Vi;return y.toneMapped&&(xt===null||xt.isXRRenderTarget===!0)&&(he=n.toneMapping),{isWebGL2:u,shaderID:W,shaderType:y.type,shaderName:y.name,vertexShader:V,fragmentShader:$,defines:y.defines,customVertexShaderID:lt,customFragmentShaderID:yt,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:p,batching:zt,instancing:Ft,instancingColor:Ft&&it.instanceColor!==null,supportsVertexTextures:h,outputColorSpace:xt===null?n.outputColorSpace:xt.isXRRenderTarget===!0?xt.texture.colorSpace:yi,map:Rt,matcap:jt,envMap:U,envMapMode:U&&q.mapping,envMapCubeUVHeight:X,aoMap:Je,lightMap:bt,bumpMap:Ut,normalMap:mt,displacementMap:h&&xe,emissiveMap:Vt,normalMapObjectSpace:mt&&y.normalMapType===c_,normalMapTangentSpace:mt&&y.normalMapType===yp,metalnessMap:E,roughnessMap:v,anisotropy:F,anisotropyMap:ot,clearcoat:j,clearcoatMap:ft,clearcoatNormalMap:Tt,clearcoatRoughnessMap:Gt,iridescence:J,iridescenceMap:Z,iridescenceThicknessMap:se,sheen:Q,sheenColorMap:Zt,sheenRoughnessMap:Lt,specularMap:vt,specularColorMap:dt,specularIntensityMap:kt,transmission:gt,transmissionMap:ne,thicknessMap:Me,gradientMap:Xt,opaque:y.transparent===!1&&y.blending===xr,alphaMap:et,alphaTest:C,alphaHash:st,combine:y.combine,mapUv:Rt&&x(y.map.channel),aoMapUv:Je&&x(y.aoMap.channel),lightMapUv:bt&&x(y.lightMap.channel),bumpMapUv:Ut&&x(y.bumpMap.channel),normalMapUv:mt&&x(y.normalMap.channel),displacementMapUv:xe&&x(y.displacementMap.channel),emissiveMapUv:Vt&&x(y.emissiveMap.channel),metalnessMapUv:E&&x(y.metalnessMap.channel),roughnessMapUv:v&&x(y.roughnessMap.channel),anisotropyMapUv:ot&&x(y.anisotropyMap.channel),clearcoatMapUv:ft&&x(y.clearcoatMap.channel),clearcoatNormalMapUv:Tt&&x(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Gt&&x(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Z&&x(y.iridescenceMap.channel),iridescenceThicknessMapUv:se&&x(y.iridescenceThicknessMap.channel),sheenColorMapUv:Zt&&x(y.sheenColorMap.channel),sheenRoughnessMapUv:Lt&&x(y.sheenRoughnessMap.channel),specularMapUv:vt&&x(y.specularMap.channel),specularColorMapUv:dt&&x(y.specularColorMap.channel),specularIntensityMapUv:kt&&x(y.specularIntensityMap.channel),transmissionMapUv:ne&&x(y.transmissionMap.channel),thicknessMapUv:Me&&x(y.thicknessMap.channel),alphaMapUv:et&&x(y.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(mt||F),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,vertexUv1s:Ct,vertexUv2s:Et,vertexUv3s:le,pointsUvs:it.isPoints===!0&&!!O.attributes.uv&&(Rt||et),fog:!!L,useFog:y.fog===!0,fogExp2:L&&L.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:f,skinning:it.isSkinnedMesh===!0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:tt,morphTextureStride:ut,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:n.shadowMap.enabled&&k.length>0,shadowMapType:n.shadowMap.type,toneMapping:he,useLegacyLights:n._useLegacyLights,decodeVideoTexture:Rt&&y.map.isVideoTexture===!0&&oe.getTransfer(y.map.colorSpace)===me,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===rn,flipSided:y.side===un,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionDerivatives:rt&&y.extensions.derivatives===!0,extensionFragDepth:rt&&y.extensions.fragDepth===!0,extensionDrawBuffers:rt&&y.extensions.drawBuffers===!0,extensionShaderTextureLOD:rt&&y.extensions.shaderTextureLOD===!0,extensionClipCullDistance:rt&&y.extensions.clipCullDistance&&i.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:u||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:u||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:u||i.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()}}function d(y){let T=[];if(y.shaderID?T.push(y.shaderID):(T.push(y.customVertexShaderID),T.push(y.customFragmentShaderID)),y.defines!==void 0)for(let k in y.defines)T.push(k),T.push(y.defines[k]);return y.isRawShaderMaterial===!1&&(M(T,y),_(T,y),T.push(n.outputColorSpace)),T.push(y.customProgramCacheKey),T.join()}function M(y,T){y.push(T.precision),y.push(T.outputColorSpace),y.push(T.envMapMode),y.push(T.envMapCubeUVHeight),y.push(T.mapUv),y.push(T.alphaMapUv),y.push(T.lightMapUv),y.push(T.aoMapUv),y.push(T.bumpMapUv),y.push(T.normalMapUv),y.push(T.displacementMapUv),y.push(T.emissiveMapUv),y.push(T.metalnessMapUv),y.push(T.roughnessMapUv),y.push(T.anisotropyMapUv),y.push(T.clearcoatMapUv),y.push(T.clearcoatNormalMapUv),y.push(T.clearcoatRoughnessMapUv),y.push(T.iridescenceMapUv),y.push(T.iridescenceThicknessMapUv),y.push(T.sheenColorMapUv),y.push(T.sheenRoughnessMapUv),y.push(T.specularMapUv),y.push(T.specularColorMapUv),y.push(T.specularIntensityMapUv),y.push(T.transmissionMapUv),y.push(T.thicknessMapUv),y.push(T.combine),y.push(T.fogExp2),y.push(T.sizeAttenuation),y.push(T.morphTargetsCount),y.push(T.morphAttributeCount),y.push(T.numDirLights),y.push(T.numPointLights),y.push(T.numSpotLights),y.push(T.numSpotLightMaps),y.push(T.numHemiLights),y.push(T.numRectAreaLights),y.push(T.numDirLightShadows),y.push(T.numPointLightShadows),y.push(T.numSpotLightShadows),y.push(T.numSpotLightShadowsWithMaps),y.push(T.numLightProbes),y.push(T.shadowMapType),y.push(T.toneMapping),y.push(T.numClippingPlanes),y.push(T.numClipIntersection),y.push(T.depthPacking)}function _(y,T){o.disableAll(),T.isWebGL2&&o.enable(0),T.supportsVertexTextures&&o.enable(1),T.instancing&&o.enable(2),T.instancingColor&&o.enable(3),T.matcap&&o.enable(4),T.envMap&&o.enable(5),T.normalMapObjectSpace&&o.enable(6),T.normalMapTangentSpace&&o.enable(7),T.clearcoat&&o.enable(8),T.iridescence&&o.enable(9),T.alphaTest&&o.enable(10),T.vertexColors&&o.enable(11),T.vertexAlphas&&o.enable(12),T.vertexUv1s&&o.enable(13),T.vertexUv2s&&o.enable(14),T.vertexUv3s&&o.enable(15),T.vertexTangents&&o.enable(16),T.anisotropy&&o.enable(17),T.alphaHash&&o.enable(18),T.batching&&o.enable(19),y.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.skinning&&o.enable(4),T.morphTargets&&o.enable(5),T.morphNormals&&o.enable(6),T.morphColors&&o.enable(7),T.premultipliedAlpha&&o.enable(8),T.shadowMapEnabled&&o.enable(9),T.useLegacyLights&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),y.push(o.mask)}function b(y){let T=g[y.type],k;if(T){let Y=Kn[T];k=q_.clone(Y.uniforms)}else k=y.uniforms;return k}function R(y,T){let k;for(let Y=0,it=l.length;Y<it;Y++){let L=l[Y];if(L.cacheKey===T){k=L,++k.usedTimes;break}}return k===void 0&&(k=new eS(n,T,y,r),l.push(k)),k}function A(y){if(--y.usedTimes===0){let T=l.indexOf(y);l[T]=l[l.length-1],l.pop(),y.destroy()}}function w(y){c.remove(y)}function H(){c.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:b,acquireProgram:R,releaseProgram:A,releaseShaderCache:w,programs:l,dispose:H}}function sS(){let n=new WeakMap;function t(r){let a=n.get(r);return a===void 0&&(a={},n.set(r,a)),a}function e(r){n.delete(r)}function i(r,a,o){n.get(r)[a]=o}function s(){n=new WeakMap}return{get:t,remove:e,update:i,dispose:s}}function rS(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Zd(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Jd(){let n=[],t=0,e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function a(f,h,p,g,x,m){let d=n[t];return d===void 0?(d={id:f.id,object:f,geometry:h,material:p,groupOrder:g,renderOrder:f.renderOrder,z:x,group:m},n[t]=d):(d.id=f.id,d.object=f,d.geometry=h,d.material=p,d.groupOrder=g,d.renderOrder=f.renderOrder,d.z=x,d.group=m),t++,d}function o(f,h,p,g,x,m){let d=a(f,h,p,g,x,m);p.transmission>0?i.push(d):p.transparent===!0?s.push(d):e.push(d)}function c(f,h,p,g,x,m){let d=a(f,h,p,g,x,m);p.transmission>0?i.unshift(d):p.transparent===!0?s.unshift(d):e.unshift(d)}function l(f,h){e.length>1&&e.sort(f||rS),i.length>1&&i.sort(h||Zd),s.length>1&&s.sort(h||Zd)}function u(){for(let f=t,h=n.length;f<h;f++){let p=n[f];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:o,unshift:c,finish:u,sort:l}}function oS(){let n=new WeakMap;function t(i,s){let r=n.get(i),a;return r===void 0?(a=new Jd,n.set(i,[a])):s>=r.length?(a=new Jd,r.push(a)):a=r[s],a}function e(){n=new WeakMap}return{get:t,dispose:e}}function aS(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new P,color:new St};break;case"SpotLight":e={position:new P,direction:new P,color:new St,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new P,color:new St,distance:0,decay:0};break;case"HemisphereLight":e={direction:new P,skyColor:new St,groundColor:new St};break;case"RectAreaLight":e={color:new St,position:new P,halfWidth:new P,halfHeight:new P};break}return n[t.id]=e,e}}}function cS(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}var lS=0;function hS(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function uS(n,t){let e=new aS,i=cS(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)s.probe.push(new P);let r=new P,a=new Ae,o=new Ae;function c(u,f){let h=0,p=0,g=0;for(let Y=0;Y<9;Y++)s.probe[Y].set(0,0,0);let x=0,m=0,d=0,M=0,_=0,b=0,R=0,A=0,w=0,H=0,y=0;u.sort(hS);let T=f===!0?Math.PI:1;for(let Y=0,it=u.length;Y<it;Y++){let L=u[Y],O=L.color,G=L.intensity,q=L.distance,X=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)h+=O.r*G*T,p+=O.g*G*T,g+=O.b*G*T;else if(L.isLightProbe){for(let W=0;W<9;W++)s.probe[W].addScaledVector(L.sh.coefficients[W],G);y++}else if(L.isDirectionalLight){let W=e.get(L);if(W.color.copy(L.color).multiplyScalar(L.intensity*T),L.castShadow){let K=L.shadow,tt=i.get(L);tt.shadowBias=K.bias,tt.shadowNormalBias=K.normalBias,tt.shadowRadius=K.radius,tt.shadowMapSize=K.mapSize,s.directionalShadow[x]=tt,s.directionalShadowMap[x]=X,s.directionalShadowMatrix[x]=L.shadow.matrix,b++}s.directional[x]=W,x++}else if(L.isSpotLight){let W=e.get(L);W.position.setFromMatrixPosition(L.matrixWorld),W.color.copy(O).multiplyScalar(G*T),W.distance=q,W.coneCos=Math.cos(L.angle),W.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),W.decay=L.decay,s.spot[d]=W;let K=L.shadow;if(L.map&&(s.spotLightMap[w]=L.map,w++,K.updateMatrices(L),L.castShadow&&H++),s.spotLightMatrix[d]=K.matrix,L.castShadow){let tt=i.get(L);tt.shadowBias=K.bias,tt.shadowNormalBias=K.normalBias,tt.shadowRadius=K.radius,tt.shadowMapSize=K.mapSize,s.spotShadow[d]=tt,s.spotShadowMap[d]=X,A++}d++}else if(L.isRectAreaLight){let W=e.get(L);W.color.copy(O).multiplyScalar(G),W.halfWidth.set(L.width*.5,0,0),W.halfHeight.set(0,L.height*.5,0),s.rectArea[M]=W,M++}else if(L.isPointLight){let W=e.get(L);if(W.color.copy(L.color).multiplyScalar(L.intensity*T),W.distance=L.distance,W.decay=L.decay,L.castShadow){let K=L.shadow,tt=i.get(L);tt.shadowBias=K.bias,tt.shadowNormalBias=K.normalBias,tt.shadowRadius=K.radius,tt.shadowMapSize=K.mapSize,tt.shadowCameraNear=K.camera.near,tt.shadowCameraFar=K.camera.far,s.pointShadow[m]=tt,s.pointShadowMap[m]=X,s.pointShadowMatrix[m]=L.shadow.matrix,R++}s.point[m]=W,m++}else if(L.isHemisphereLight){let W=e.get(L);W.skyColor.copy(L.color).multiplyScalar(G*T),W.groundColor.copy(L.groundColor).multiplyScalar(G*T),s.hemi[_]=W,_++}}M>0&&(t.isWebGL2?n.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=nt.LTC_FLOAT_1,s.rectAreaLTC2=nt.LTC_FLOAT_2):(s.rectAreaLTC1=nt.LTC_HALF_1,s.rectAreaLTC2=nt.LTC_HALF_2):n.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=nt.LTC_FLOAT_1,s.rectAreaLTC2=nt.LTC_FLOAT_2):n.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=nt.LTC_HALF_1,s.rectAreaLTC2=nt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=h,s.ambient[1]=p,s.ambient[2]=g;let k=s.hash;(k.directionalLength!==x||k.pointLength!==m||k.spotLength!==d||k.rectAreaLength!==M||k.hemiLength!==_||k.numDirectionalShadows!==b||k.numPointShadows!==R||k.numSpotShadows!==A||k.numSpotMaps!==w||k.numLightProbes!==y)&&(s.directional.length=x,s.spot.length=d,s.rectArea.length=M,s.point.length=m,s.hemi.length=_,s.directionalShadow.length=b,s.directionalShadowMap.length=b,s.pointShadow.length=R,s.pointShadowMap.length=R,s.spotShadow.length=A,s.spotShadowMap.length=A,s.directionalShadowMatrix.length=b,s.pointShadowMatrix.length=R,s.spotLightMatrix.length=A+w-H,s.spotLightMap.length=w,s.numSpotLightShadowsWithMaps=H,s.numLightProbes=y,k.directionalLength=x,k.pointLength=m,k.spotLength=d,k.rectAreaLength=M,k.hemiLength=_,k.numDirectionalShadows=b,k.numPointShadows=R,k.numSpotShadows=A,k.numSpotMaps=w,k.numLightProbes=y,s.version=lS++)}function l(u,f){let h=0,p=0,g=0,x=0,m=0,d=f.matrixWorldInverse;for(let M=0,_=u.length;M<_;M++){let b=u[M];if(b.isDirectionalLight){let R=s.directional[h];R.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(d),h++}else if(b.isSpotLight){let R=s.spot[g];R.position.setFromMatrixPosition(b.matrixWorld),R.position.applyMatrix4(d),R.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(d),g++}else if(b.isRectAreaLight){let R=s.rectArea[x];R.position.setFromMatrixPosition(b.matrixWorld),R.position.applyMatrix4(d),o.identity(),a.copy(b.matrixWorld),a.premultiply(d),o.extractRotation(a),R.halfWidth.set(b.width*.5,0,0),R.halfHeight.set(0,b.height*.5,0),R.halfWidth.applyMatrix4(o),R.halfHeight.applyMatrix4(o),x++}else if(b.isPointLight){let R=s.point[p];R.position.setFromMatrixPosition(b.matrixWorld),R.position.applyMatrix4(d),p++}else if(b.isHemisphereLight){let R=s.hemi[m];R.direction.setFromMatrixPosition(b.matrixWorld),R.direction.transformDirection(d),m++}}}return{setup:c,setupView:l,state:s}}function Kd(n,t){let e=new uS(n,t),i=[],s=[];function r(){i.length=0,s.length=0}function a(f){i.push(f)}function o(f){s.push(f)}function c(f){e.setup(i,f)}function l(f){e.setupView(i,f)}return{init:r,state:{lightsArray:i,shadowsArray:s,lights:e},setupLights:c,setupLightsView:l,pushLight:a,pushShadow:o}}function fS(n,t){let e=new WeakMap;function i(r,a=0){let o=e.get(r),c;return o===void 0?(c=new Kd(n,t),e.set(r,[c])):a>=o.length?(c=new Kd(n,t),o.push(c)):c=o[a],c}function s(){e=new WeakMap}return{get:i,dispose:s}}var mh=class extends ti{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=o_,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},gh=class extends ti{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},dS=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,pS=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function mS(n,t,e){let i=new _o,s=new $t,r=new $t,a=new ke,o=new mh({depthPacking:a_}),c=new gh,l={},u=e.maxTextureSize,f={[Qn]:un,[un]:Qn,[rn]:rn},h=new Mi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new $t},radius:{value:4}},vertexShader:dS,fragmentShader:pS}),p=h.clone();p.defines.HORIZONTAL_PASS=1;let g=new Le;g.setAttribute("position",new vn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new ae(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=lp;let d=this.type;this.render=function(A,w,H){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;let y=n.getRenderTarget(),T=n.getActiveCubeFace(),k=n.getActiveMipmapLevel(),Y=n.state;Y.setBlending(Hi),Y.buffers.color.setClear(1,1,1,1),Y.buffers.depth.setTest(!0),Y.setScissorTest(!1);let it=d!==mi&&this.type===mi,L=d===mi&&this.type!==mi;for(let O=0,G=A.length;O<G;O++){let q=A[O],X=q.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;s.copy(X.mapSize);let W=X.getFrameExtents();if(s.multiply(W),r.copy(X.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/W.x),s.x=r.x*W.x,X.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/W.y),s.y=r.y*W.y,X.mapSize.y=r.y)),X.map===null||it===!0||L===!0){let tt=this.type!==mi?{minFilter:Ge,magFilter:Ge}:{};X.map!==null&&X.map.dispose(),X.map=new vi(s.x,s.y,tt),X.map.texture.name=q.name+".shadowMap",X.camera.updateProjectionMatrix()}n.setRenderTarget(X.map),n.clear();let K=X.getViewportCount();for(let tt=0;tt<K;tt++){let ut=X.getViewport(tt);a.set(r.x*ut.x,r.y*ut.y,r.x*ut.z,r.y*ut.w),Y.viewport(a),X.updateMatrices(q,tt),i=X.getFrustum(),b(w,H,X.camera,q,this.type)}X.isPointLightShadow!==!0&&this.type===mi&&M(X,H),X.needsUpdate=!1}d=this.type,m.needsUpdate=!1,n.setRenderTarget(y,T,k)};function M(A,w){let H=t.update(x);h.defines.VSM_SAMPLES!==A.blurSamples&&(h.defines.VSM_SAMPLES=A.blurSamples,p.defines.VSM_SAMPLES=A.blurSamples,h.needsUpdate=!0,p.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new vi(s.x,s.y)),h.uniforms.shadow_pass.value=A.map.texture,h.uniforms.resolution.value=A.mapSize,h.uniforms.radius.value=A.radius,n.setRenderTarget(A.mapPass),n.clear(),n.renderBufferDirect(w,null,H,h,x,null),p.uniforms.shadow_pass.value=A.mapPass.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,n.setRenderTarget(A.map),n.clear(),n.renderBufferDirect(w,null,H,p,x,null)}function _(A,w,H,y){let T=null,k=H.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(k!==void 0)T=k;else if(T=H.isPointLight===!0?c:o,n.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){let Y=T.uuid,it=w.uuid,L=l[Y];L===void 0&&(L={},l[Y]=L);let O=L[it];O===void 0&&(O=T.clone(),L[it]=O,w.addEventListener("dispose",R)),T=O}if(T.visible=w.visible,T.wireframe=w.wireframe,y===mi?T.side=w.shadowSide!==null?w.shadowSide:w.side:T.side=w.shadowSide!==null?w.shadowSide:f[w.side],T.alphaMap=w.alphaMap,T.alphaTest=w.alphaTest,T.map=w.map,T.clipShadows=w.clipShadows,T.clippingPlanes=w.clippingPlanes,T.clipIntersection=w.clipIntersection,T.displacementMap=w.displacementMap,T.displacementScale=w.displacementScale,T.displacementBias=w.displacementBias,T.wireframeLinewidth=w.wireframeLinewidth,T.linewidth=w.linewidth,H.isPointLight===!0&&T.isMeshDistanceMaterial===!0){let Y=n.properties.get(T);Y.light=H}return T}function b(A,w,H,y,T){if(A.visible===!1)return;if(A.layers.test(w.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&T===mi)&&(!A.frustumCulled||i.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,A.matrixWorld);let it=t.update(A),L=A.material;if(Array.isArray(L)){let O=it.groups;for(let G=0,q=O.length;G<q;G++){let X=O[G],W=L[X.materialIndex];if(W&&W.visible){let K=_(A,W,y,T);A.onBeforeShadow(n,A,w,H,it,K,X),n.renderBufferDirect(H,null,it,K,A,X),A.onAfterShadow(n,A,w,H,it,K,X)}}}else if(L.visible){let O=_(A,L,y,T);A.onBeforeShadow(n,A,w,H,it,O,null),n.renderBufferDirect(H,null,it,O,A,null),A.onAfterShadow(n,A,w,H,it,O,null)}}let Y=A.children;for(let it=0,L=Y.length;it<L;it++)b(Y[it],w,H,y,T)}function R(A){A.target.removeEventListener("dispose",R);for(let H in l){let y=l[H],T=A.target.uuid;T in y&&(y[T].dispose(),delete y[T])}}}function gS(n,t,e){let i=e.isWebGL2;function s(){let C=!1,st=new ke,rt=null,Ct=new ke(0,0,0,0);return{setMask:function(Et){rt!==Et&&!C&&(n.colorMask(Et,Et,Et,Et),rt=Et)},setLocked:function(Et){C=Et},setClear:function(Et,le,he,Ne,Ke){Ke===!0&&(Et*=Ne,le*=Ne,he*=Ne),st.set(Et,le,he,Ne),Ct.equals(st)===!1&&(n.clearColor(Et,le,he,Ne),Ct.copy(st))},reset:function(){C=!1,rt=null,Ct.set(-1,0,0,0)}}}function r(){let C=!1,st=null,rt=null,Ct=null;return{setTest:function(Et){Et?zt(n.DEPTH_TEST):Rt(n.DEPTH_TEST)},setMask:function(Et){st!==Et&&!C&&(n.depthMask(Et),st=Et)},setFunc:function(Et){if(rt!==Et){switch(Et){case Og:n.depthFunc(n.NEVER);break;case Fg:n.depthFunc(n.ALWAYS);break;case Bg:n.depthFunc(n.LESS);break;case Ra:n.depthFunc(n.LEQUAL);break;case zg:n.depthFunc(n.EQUAL);break;case kg:n.depthFunc(n.GEQUAL);break;case Hg:n.depthFunc(n.GREATER);break;case Vg:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}rt=Et}},setLocked:function(Et){C=Et},setClear:function(Et){Ct!==Et&&(n.clearDepth(Et),Ct=Et)},reset:function(){C=!1,st=null,rt=null,Ct=null}}}function a(){let C=!1,st=null,rt=null,Ct=null,Et=null,le=null,he=null,Ne=null,Ke=null;return{setTest:function(ue){C||(ue?zt(n.STENCIL_TEST):Rt(n.STENCIL_TEST))},setMask:function(ue){st!==ue&&!C&&(n.stencilMask(ue),st=ue)},setFunc:function(ue,je,Zn){(rt!==ue||Ct!==je||Et!==Zn)&&(n.stencilFunc(ue,je,Zn),rt=ue,Ct=je,Et=Zn)},setOp:function(ue,je,Zn){(le!==ue||he!==je||Ne!==Zn)&&(n.stencilOp(ue,je,Zn),le=ue,he=je,Ne=Zn)},setLocked:function(ue){C=ue},setClear:function(ue){Ke!==ue&&(n.clearStencil(ue),Ke=ue)},reset:function(){C=!1,st=null,rt=null,Ct=null,Et=null,le=null,he=null,Ne=null,Ke=null}}}let o=new s,c=new r,l=new a,u=new WeakMap,f=new WeakMap,h={},p={},g=new WeakMap,x=[],m=null,d=!1,M=null,_=null,b=null,R=null,A=null,w=null,H=null,y=new St(0,0,0),T=0,k=!1,Y=null,it=null,L=null,O=null,G=null,q=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),X=!1,W=0,K=n.getParameter(n.VERSION);K.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(K)[1]),X=W>=1):K.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),X=W>=2);let tt=null,ut={},V=n.getParameter(n.SCISSOR_BOX),$=n.getParameter(n.VIEWPORT),lt=new ke().fromArray(V),yt=new ke().fromArray($);function xt(C,st,rt,Ct){let Et=new Uint8Array(4),le=n.createTexture();n.bindTexture(C,le),n.texParameteri(C,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(C,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let he=0;he<rt;he++)i&&(C===n.TEXTURE_3D||C===n.TEXTURE_2D_ARRAY)?n.texImage3D(st,0,n.RGBA,1,1,Ct,0,n.RGBA,n.UNSIGNED_BYTE,Et):n.texImage2D(st+he,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Et);return le}let Ft={};Ft[n.TEXTURE_2D]=xt(n.TEXTURE_2D,n.TEXTURE_2D,1),Ft[n.TEXTURE_CUBE_MAP]=xt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(Ft[n.TEXTURE_2D_ARRAY]=xt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Ft[n.TEXTURE_3D]=xt(n.TEXTURE_3D,n.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),c.setClear(1),l.setClear(0),zt(n.DEPTH_TEST),c.setFunc(Ra),Vt(!1),E(Lf),zt(n.CULL_FACE),mt(Hi);function zt(C){h[C]!==!0&&(n.enable(C),h[C]=!0)}function Rt(C){h[C]!==!1&&(n.disable(C),h[C]=!1)}function jt(C,st){return p[C]!==st?(n.bindFramebuffer(C,st),p[C]=st,i&&(C===n.DRAW_FRAMEBUFFER&&(p[n.FRAMEBUFFER]=st),C===n.FRAMEBUFFER&&(p[n.DRAW_FRAMEBUFFER]=st)),!0):!1}function U(C,st){let rt=x,Ct=!1;if(C)if(rt=g.get(st),rt===void 0&&(rt=[],g.set(st,rt)),C.isWebGLMultipleRenderTargets){let Et=C.texture;if(rt.length!==Et.length||rt[0]!==n.COLOR_ATTACHMENT0){for(let le=0,he=Et.length;le<he;le++)rt[le]=n.COLOR_ATTACHMENT0+le;rt.length=Et.length,Ct=!0}}else rt[0]!==n.COLOR_ATTACHMENT0&&(rt[0]=n.COLOR_ATTACHMENT0,Ct=!0);else rt[0]!==n.BACK&&(rt[0]=n.BACK,Ct=!0);Ct&&(e.isWebGL2?n.drawBuffers(rt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(rt))}function Je(C){return m!==C?(n.useProgram(C),m=C,!0):!1}let bt={[ys]:n.FUNC_ADD,[Mg]:n.FUNC_SUBTRACT,[Sg]:n.FUNC_REVERSE_SUBTRACT};if(i)bt[Nf]=n.MIN,bt[Of]=n.MAX;else{let C=t.get("EXT_blend_minmax");C!==null&&(bt[Nf]=C.MIN_EXT,bt[Of]=C.MAX_EXT)}let Ut={[bg]:n.ZERO,[Eg]:n.ONE,[wg]:n.SRC_COLOR,[Kl]:n.SRC_ALPHA,[Lg]:n.SRC_ALPHA_SATURATE,[Cg]:n.DST_COLOR,[Ag]:n.DST_ALPHA,[Tg]:n.ONE_MINUS_SRC_COLOR,[jl]:n.ONE_MINUS_SRC_ALPHA,[Pg]:n.ONE_MINUS_DST_COLOR,[Rg]:n.ONE_MINUS_DST_ALPHA,[Ig]:n.CONSTANT_COLOR,[Dg]:n.ONE_MINUS_CONSTANT_COLOR,[Ug]:n.CONSTANT_ALPHA,[Ng]:n.ONE_MINUS_CONSTANT_ALPHA};function mt(C,st,rt,Ct,Et,le,he,Ne,Ke,ue){if(C===Hi){d===!0&&(Rt(n.BLEND),d=!1);return}if(d===!1&&(zt(n.BLEND),d=!0),C!==vg){if(C!==M||ue!==k){if((_!==ys||A!==ys)&&(n.blendEquation(n.FUNC_ADD),_=ys,A=ys),ue)switch(C){case xr:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case If:n.blendFunc(n.ONE,n.ONE);break;case Df:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Uf:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",C);break}else switch(C){case xr:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case If:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Df:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Uf:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",C);break}b=null,R=null,w=null,H=null,y.set(0,0,0),T=0,M=C,k=ue}return}Et=Et||st,le=le||rt,he=he||Ct,(st!==_||Et!==A)&&(n.blendEquationSeparate(bt[st],bt[Et]),_=st,A=Et),(rt!==b||Ct!==R||le!==w||he!==H)&&(n.blendFuncSeparate(Ut[rt],Ut[Ct],Ut[le],Ut[he]),b=rt,R=Ct,w=le,H=he),(Ne.equals(y)===!1||Ke!==T)&&(n.blendColor(Ne.r,Ne.g,Ne.b,Ke),y.copy(Ne),T=Ke),M=C,k=!1}function xe(C,st){C.side===rn?Rt(n.CULL_FACE):zt(n.CULL_FACE);let rt=C.side===un;st&&(rt=!rt),Vt(rt),C.blending===xr&&C.transparent===!1?mt(Hi):mt(C.blending,C.blendEquation,C.blendSrc,C.blendDst,C.blendEquationAlpha,C.blendSrcAlpha,C.blendDstAlpha,C.blendColor,C.blendAlpha,C.premultipliedAlpha),c.setFunc(C.depthFunc),c.setTest(C.depthTest),c.setMask(C.depthWrite),o.setMask(C.colorWrite);let Ct=C.stencilWrite;l.setTest(Ct),Ct&&(l.setMask(C.stencilWriteMask),l.setFunc(C.stencilFunc,C.stencilRef,C.stencilFuncMask),l.setOp(C.stencilFail,C.stencilZFail,C.stencilZPass)),F(C.polygonOffset,C.polygonOffsetFactor,C.polygonOffsetUnits),C.alphaToCoverage===!0?zt(n.SAMPLE_ALPHA_TO_COVERAGE):Rt(n.SAMPLE_ALPHA_TO_COVERAGE)}function Vt(C){Y!==C&&(C?n.frontFace(n.CW):n.frontFace(n.CCW),Y=C)}function E(C){C!==xg?(zt(n.CULL_FACE),C!==it&&(C===Lf?n.cullFace(n.BACK):C===yg?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Rt(n.CULL_FACE),it=C}function v(C){C!==L&&(X&&n.lineWidth(C),L=C)}function F(C,st,rt){C?(zt(n.POLYGON_OFFSET_FILL),(O!==st||G!==rt)&&(n.polygonOffset(st,rt),O=st,G=rt)):Rt(n.POLYGON_OFFSET_FILL)}function j(C){C?zt(n.SCISSOR_TEST):Rt(n.SCISSOR_TEST)}function J(C){C===void 0&&(C=n.TEXTURE0+q-1),tt!==C&&(n.activeTexture(C),tt=C)}function Q(C,st,rt){rt===void 0&&(tt===null?rt=n.TEXTURE0+q-1:rt=tt);let Ct=ut[rt];Ct===void 0&&(Ct={type:void 0,texture:void 0},ut[rt]=Ct),(Ct.type!==C||Ct.texture!==st)&&(tt!==rt&&(n.activeTexture(rt),tt=rt),n.bindTexture(C,st||Ft[C]),Ct.type=C,Ct.texture=st)}function gt(){let C=ut[tt];C!==void 0&&C.type!==void 0&&(n.bindTexture(C.type,null),C.type=void 0,C.texture=void 0)}function ot(){try{n.compressedTexImage2D.apply(n,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function ft(){try{n.compressedTexImage3D.apply(n,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Tt(){try{n.texSubImage2D.apply(n,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Gt(){try{n.texSubImage3D.apply(n,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Z(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function se(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Zt(){try{n.texStorage2D.apply(n,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Lt(){try{n.texStorage3D.apply(n,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function vt(){try{n.texImage2D.apply(n,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function dt(){try{n.texImage3D.apply(n,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function kt(C){lt.equals(C)===!1&&(n.scissor(C.x,C.y,C.z,C.w),lt.copy(C))}function ne(C){yt.equals(C)===!1&&(n.viewport(C.x,C.y,C.z,C.w),yt.copy(C))}function Me(C,st){let rt=f.get(st);rt===void 0&&(rt=new WeakMap,f.set(st,rt));let Ct=rt.get(C);Ct===void 0&&(Ct=n.getUniformBlockIndex(st,C.name),rt.set(C,Ct))}function Xt(C,st){let Ct=f.get(st).get(C);u.get(st)!==Ct&&(n.uniformBlockBinding(st,Ct,C.__bindingPointIndex),u.set(st,Ct))}function et(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),i===!0&&(n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null)),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},tt=null,ut={},p={},g=new WeakMap,x=[],m=null,d=!1,M=null,_=null,b=null,R=null,A=null,w=null,H=null,y=new St(0,0,0),T=0,k=!1,Y=null,it=null,L=null,O=null,G=null,lt.set(0,0,n.canvas.width,n.canvas.height),yt.set(0,0,n.canvas.width,n.canvas.height),o.reset(),c.reset(),l.reset()}return{buffers:{color:o,depth:c,stencil:l},enable:zt,disable:Rt,bindFramebuffer:jt,drawBuffers:U,useProgram:Je,setBlending:mt,setMaterial:xe,setFlipSided:Vt,setCullFace:E,setLineWidth:v,setPolygonOffset:F,setScissorTest:j,activeTexture:J,bindTexture:Q,unbindTexture:gt,compressedTexImage2D:ot,compressedTexImage3D:ft,texImage2D:vt,texImage3D:dt,updateUBOMapping:Me,uniformBlockBinding:Xt,texStorage2D:Zt,texStorage3D:Lt,texSubImage2D:Tt,texSubImage3D:Gt,compressedTexSubImage2D:Z,compressedTexSubImage3D:se,scissor:kt,viewport:ne,reset:et}}function _S(n,t,e,i,s,r,a){let o=s.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new WeakMap,f,h=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(E,v){return p?new OffscreenCanvas(E,v):Oa("canvas")}function x(E,v,F,j){let J=1;if((E.width>j||E.height>j)&&(J=j/Math.max(E.width,E.height)),J<1||v===!0)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap){let Q=v?Na:Math.floor,gt=Q(J*E.width),ot=Q(J*E.height);f===void 0&&(f=g(gt,ot));let ft=F?g(gt,ot):f;return ft.width=gt,ft.height=ot,ft.getContext("2d").drawImage(E,0,0,gt,ot),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+E.width+"x"+E.height+") to ("+gt+"x"+ot+")."),ft}else return"data"in E&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+E.width+"x"+E.height+")."),E;return E}function m(E){return sh(E.width)&&sh(E.height)}function d(E){return o?!1:E.wrapS!==Vn||E.wrapT!==Vn||E.minFilter!==Ge&&E.minFilter!==wn}function M(E,v){return E.generateMipmaps&&v&&E.minFilter!==Ge&&E.minFilter!==wn}function _(E){n.generateMipmap(E)}function b(E,v,F,j,J=!1){if(o===!1)return v;if(E!==null){if(n[E]!==void 0)return n[E];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let Q=v;if(v===n.RED&&(F===n.FLOAT&&(Q=n.R32F),F===n.HALF_FLOAT&&(Q=n.R16F),F===n.UNSIGNED_BYTE&&(Q=n.R8)),v===n.RED_INTEGER&&(F===n.UNSIGNED_BYTE&&(Q=n.R8UI),F===n.UNSIGNED_SHORT&&(Q=n.R16UI),F===n.UNSIGNED_INT&&(Q=n.R32UI),F===n.BYTE&&(Q=n.R8I),F===n.SHORT&&(Q=n.R16I),F===n.INT&&(Q=n.R32I)),v===n.RG&&(F===n.FLOAT&&(Q=n.RG32F),F===n.HALF_FLOAT&&(Q=n.RG16F),F===n.UNSIGNED_BYTE&&(Q=n.RG8)),v===n.RGBA){let gt=J?La:oe.getTransfer(j);F===n.FLOAT&&(Q=n.RGBA32F),F===n.HALF_FLOAT&&(Q=n.RGBA16F),F===n.UNSIGNED_BYTE&&(Q=gt===me?n.SRGB8_ALPHA8:n.RGBA8),F===n.UNSIGNED_SHORT_4_4_4_4&&(Q=n.RGBA4),F===n.UNSIGNED_SHORT_5_5_5_1&&(Q=n.RGB5_A1)}return(Q===n.R16F||Q===n.R32F||Q===n.RG16F||Q===n.RG32F||Q===n.RGBA16F||Q===n.RGBA32F)&&t.get("EXT_color_buffer_float"),Q}function R(E,v,F){return M(E,F)===!0||E.isFramebufferTexture&&E.minFilter!==Ge&&E.minFilter!==wn?Math.log2(Math.max(v.width,v.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?v.mipmaps.length:1}function A(E){return E===Ge||E===Ff||E===xl?n.NEAREST:n.LINEAR}function w(E){let v=E.target;v.removeEventListener("dispose",w),y(v),v.isVideoTexture&&u.delete(v)}function H(E){let v=E.target;v.removeEventListener("dispose",H),k(v)}function y(E){let v=i.get(E);if(v.__webglInit===void 0)return;let F=E.source,j=h.get(F);if(j){let J=j[v.__cacheKey];J.usedTimes--,J.usedTimes===0&&T(E),Object.keys(j).length===0&&h.delete(F)}i.remove(E)}function T(E){let v=i.get(E);n.deleteTexture(v.__webglTexture);let F=E.source,j=h.get(F);delete j[v.__cacheKey],a.memory.textures--}function k(E){let v=E.texture,F=i.get(E),j=i.get(v);if(j.__webglTexture!==void 0&&(n.deleteTexture(j.__webglTexture),a.memory.textures--),E.depthTexture&&E.depthTexture.dispose(),E.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(F.__webglFramebuffer[J]))for(let Q=0;Q<F.__webglFramebuffer[J].length;Q++)n.deleteFramebuffer(F.__webglFramebuffer[J][Q]);else n.deleteFramebuffer(F.__webglFramebuffer[J]);F.__webglDepthbuffer&&n.deleteRenderbuffer(F.__webglDepthbuffer[J])}else{if(Array.isArray(F.__webglFramebuffer))for(let J=0;J<F.__webglFramebuffer.length;J++)n.deleteFramebuffer(F.__webglFramebuffer[J]);else n.deleteFramebuffer(F.__webglFramebuffer);if(F.__webglDepthbuffer&&n.deleteRenderbuffer(F.__webglDepthbuffer),F.__webglMultisampledFramebuffer&&n.deleteFramebuffer(F.__webglMultisampledFramebuffer),F.__webglColorRenderbuffer)for(let J=0;J<F.__webglColorRenderbuffer.length;J++)F.__webglColorRenderbuffer[J]&&n.deleteRenderbuffer(F.__webglColorRenderbuffer[J]);F.__webglDepthRenderbuffer&&n.deleteRenderbuffer(F.__webglDepthRenderbuffer)}if(E.isWebGLMultipleRenderTargets)for(let J=0,Q=v.length;J<Q;J++){let gt=i.get(v[J]);gt.__webglTexture&&(n.deleteTexture(gt.__webglTexture),a.memory.textures--),i.remove(v[J])}i.remove(v),i.remove(E)}let Y=0;function it(){Y=0}function L(){let E=Y;return E>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+s.maxTextures),Y+=1,E}function O(E){let v=[];return v.push(E.wrapS),v.push(E.wrapT),v.push(E.wrapR||0),v.push(E.magFilter),v.push(E.minFilter),v.push(E.anisotropy),v.push(E.internalFormat),v.push(E.format),v.push(E.type),v.push(E.generateMipmaps),v.push(E.premultiplyAlpha),v.push(E.flipY),v.push(E.unpackAlignment),v.push(E.colorSpace),v.join()}function G(E,v){let F=i.get(E);if(E.isVideoTexture&&xe(E),E.isRenderTargetTexture===!1&&E.version>0&&F.__version!==E.version){let j=E.image;if(j===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{lt(F,E,v);return}}e.bindTexture(n.TEXTURE_2D,F.__webglTexture,n.TEXTURE0+v)}function q(E,v){let F=i.get(E);if(E.version>0&&F.__version!==E.version){lt(F,E,v);return}e.bindTexture(n.TEXTURE_2D_ARRAY,F.__webglTexture,n.TEXTURE0+v)}function X(E,v){let F=i.get(E);if(E.version>0&&F.__version!==E.version){lt(F,E,v);return}e.bindTexture(n.TEXTURE_3D,F.__webglTexture,n.TEXTURE0+v)}function W(E,v){let F=i.get(E);if(E.version>0&&F.__version!==E.version){yt(F,E,v);return}e.bindTexture(n.TEXTURE_CUBE_MAP,F.__webglTexture,n.TEXTURE0+v)}let K={[uo]:n.REPEAT,[Vn]:n.CLAMP_TO_EDGE,[eh]:n.MIRRORED_REPEAT},tt={[Ge]:n.NEAREST,[Ff]:n.NEAREST_MIPMAP_NEAREST,[xl]:n.NEAREST_MIPMAP_LINEAR,[wn]:n.LINEAR,[Kg]:n.LINEAR_MIPMAP_NEAREST,[fo]:n.LINEAR_MIPMAP_LINEAR},ut={[l_]:n.NEVER,[m_]:n.ALWAYS,[h_]:n.LESS,[vp]:n.LEQUAL,[u_]:n.EQUAL,[p_]:n.GEQUAL,[f_]:n.GREATER,[d_]:n.NOTEQUAL};function V(E,v,F){if(F?(n.texParameteri(E,n.TEXTURE_WRAP_S,K[v.wrapS]),n.texParameteri(E,n.TEXTURE_WRAP_T,K[v.wrapT]),(E===n.TEXTURE_3D||E===n.TEXTURE_2D_ARRAY)&&n.texParameteri(E,n.TEXTURE_WRAP_R,K[v.wrapR]),n.texParameteri(E,n.TEXTURE_MAG_FILTER,tt[v.magFilter]),n.texParameteri(E,n.TEXTURE_MIN_FILTER,tt[v.minFilter])):(n.texParameteri(E,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(E,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),(E===n.TEXTURE_3D||E===n.TEXTURE_2D_ARRAY)&&n.texParameteri(E,n.TEXTURE_WRAP_R,n.CLAMP_TO_EDGE),(v.wrapS!==Vn||v.wrapT!==Vn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),n.texParameteri(E,n.TEXTURE_MAG_FILTER,A(v.magFilter)),n.texParameteri(E,n.TEXTURE_MIN_FILTER,A(v.minFilter)),v.minFilter!==Ge&&v.minFilter!==wn&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),v.compareFunction&&(n.texParameteri(E,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(E,n.TEXTURE_COMPARE_FUNC,ut[v.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){let j=t.get("EXT_texture_filter_anisotropic");if(v.magFilter===Ge||v.minFilter!==xl&&v.minFilter!==fo||v.type===zi&&t.has("OES_texture_float_linear")===!1||o===!1&&v.type===po&&t.has("OES_texture_half_float_linear")===!1)return;(v.anisotropy>1||i.get(v).__currentAnisotropy)&&(n.texParameterf(E,j.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy)}}function $(E,v){let F=!1;E.__webglInit===void 0&&(E.__webglInit=!0,v.addEventListener("dispose",w));let j=v.source,J=h.get(j);J===void 0&&(J={},h.set(j,J));let Q=O(v);if(Q!==E.__cacheKey){J[Q]===void 0&&(J[Q]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,F=!0),J[Q].usedTimes++;let gt=J[E.__cacheKey];gt!==void 0&&(J[E.__cacheKey].usedTimes--,gt.usedTimes===0&&T(v)),E.__cacheKey=Q,E.__webglTexture=J[Q].texture}return F}function lt(E,v,F){let j=n.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(j=n.TEXTURE_2D_ARRAY),v.isData3DTexture&&(j=n.TEXTURE_3D);let J=$(E,v),Q=v.source;e.bindTexture(j,E.__webglTexture,n.TEXTURE0+F);let gt=i.get(Q);if(Q.version!==gt.__version||J===!0){e.activeTexture(n.TEXTURE0+F);let ot=oe.getPrimaries(oe.workingColorSpace),ft=v.colorSpace===Tn?null:oe.getPrimaries(v.colorSpace),Tt=v.colorSpace===Tn||ot===ft?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Tt);let Gt=d(v)&&m(v.image)===!1,Z=x(v.image,Gt,!1,s.maxTextureSize);Z=Vt(v,Z);let se=m(Z)||o,Zt=r.convert(v.format,v.colorSpace),Lt=r.convert(v.type),vt=b(v.internalFormat,Zt,Lt,v.colorSpace,v.isVideoTexture);V(j,v,se);let dt,kt=v.mipmaps,ne=o&&v.isVideoTexture!==!0&&vt!==_p,Me=gt.__version===void 0||J===!0,Xt=R(v,Z,se);if(v.isDepthTexture)vt=n.DEPTH_COMPONENT,o?v.type===zi?vt=n.DEPTH_COMPONENT32F:v.type===Bi?vt=n.DEPTH_COMPONENT24:v.type===Ms?vt=n.DEPTH24_STENCIL8:vt=n.DEPTH_COMPONENT16:v.type===zi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),v.format===Ss&&vt===n.DEPTH_COMPONENT&&v.type!==Fh&&v.type!==Bi&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),v.type=Bi,Lt=r.convert(v.type)),v.format===Er&&vt===n.DEPTH_COMPONENT&&(vt=n.DEPTH_STENCIL,v.type!==Ms&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),v.type=Ms,Lt=r.convert(v.type))),Me&&(ne?e.texStorage2D(n.TEXTURE_2D,1,vt,Z.width,Z.height):e.texImage2D(n.TEXTURE_2D,0,vt,Z.width,Z.height,0,Zt,Lt,null));else if(v.isDataTexture)if(kt.length>0&&se){ne&&Me&&e.texStorage2D(n.TEXTURE_2D,Xt,vt,kt[0].width,kt[0].height);for(let et=0,C=kt.length;et<C;et++)dt=kt[et],ne?e.texSubImage2D(n.TEXTURE_2D,et,0,0,dt.width,dt.height,Zt,Lt,dt.data):e.texImage2D(n.TEXTURE_2D,et,vt,dt.width,dt.height,0,Zt,Lt,dt.data);v.generateMipmaps=!1}else ne?(Me&&e.texStorage2D(n.TEXTURE_2D,Xt,vt,Z.width,Z.height),e.texSubImage2D(n.TEXTURE_2D,0,0,0,Z.width,Z.height,Zt,Lt,Z.data)):e.texImage2D(n.TEXTURE_2D,0,vt,Z.width,Z.height,0,Zt,Lt,Z.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){ne&&Me&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Xt,vt,kt[0].width,kt[0].height,Z.depth);for(let et=0,C=kt.length;et<C;et++)dt=kt[et],v.format!==Gn?Zt!==null?ne?e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,et,0,0,0,dt.width,dt.height,Z.depth,Zt,dt.data,0,0):e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,et,vt,dt.width,dt.height,Z.depth,0,dt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ne?e.texSubImage3D(n.TEXTURE_2D_ARRAY,et,0,0,0,dt.width,dt.height,Z.depth,Zt,Lt,dt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,et,vt,dt.width,dt.height,Z.depth,0,Zt,Lt,dt.data)}else{ne&&Me&&e.texStorage2D(n.TEXTURE_2D,Xt,vt,kt[0].width,kt[0].height);for(let et=0,C=kt.length;et<C;et++)dt=kt[et],v.format!==Gn?Zt!==null?ne?e.compressedTexSubImage2D(n.TEXTURE_2D,et,0,0,dt.width,dt.height,Zt,dt.data):e.compressedTexImage2D(n.TEXTURE_2D,et,vt,dt.width,dt.height,0,dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ne?e.texSubImage2D(n.TEXTURE_2D,et,0,0,dt.width,dt.height,Zt,Lt,dt.data):e.texImage2D(n.TEXTURE_2D,et,vt,dt.width,dt.height,0,Zt,Lt,dt.data)}else if(v.isDataArrayTexture)ne?(Me&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Xt,vt,Z.width,Z.height,Z.depth),e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Z.width,Z.height,Z.depth,Zt,Lt,Z.data)):e.texImage3D(n.TEXTURE_2D_ARRAY,0,vt,Z.width,Z.height,Z.depth,0,Zt,Lt,Z.data);else if(v.isData3DTexture)ne?(Me&&e.texStorage3D(n.TEXTURE_3D,Xt,vt,Z.width,Z.height,Z.depth),e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Z.width,Z.height,Z.depth,Zt,Lt,Z.data)):e.texImage3D(n.TEXTURE_3D,0,vt,Z.width,Z.height,Z.depth,0,Zt,Lt,Z.data);else if(v.isFramebufferTexture){if(Me)if(ne)e.texStorage2D(n.TEXTURE_2D,Xt,vt,Z.width,Z.height);else{let et=Z.width,C=Z.height;for(let st=0;st<Xt;st++)e.texImage2D(n.TEXTURE_2D,st,vt,et,C,0,Zt,Lt,null),et>>=1,C>>=1}}else if(kt.length>0&&se){ne&&Me&&e.texStorage2D(n.TEXTURE_2D,Xt,vt,kt[0].width,kt[0].height);for(let et=0,C=kt.length;et<C;et++)dt=kt[et],ne?e.texSubImage2D(n.TEXTURE_2D,et,0,0,Zt,Lt,dt):e.texImage2D(n.TEXTURE_2D,et,vt,Zt,Lt,dt);v.generateMipmaps=!1}else ne?(Me&&e.texStorage2D(n.TEXTURE_2D,Xt,vt,Z.width,Z.height),e.texSubImage2D(n.TEXTURE_2D,0,0,0,Zt,Lt,Z)):e.texImage2D(n.TEXTURE_2D,0,vt,Zt,Lt,Z);M(v,se)&&_(j),gt.__version=Q.version,v.onUpdate&&v.onUpdate(v)}E.__version=v.version}function yt(E,v,F){if(v.image.length!==6)return;let j=$(E,v),J=v.source;e.bindTexture(n.TEXTURE_CUBE_MAP,E.__webglTexture,n.TEXTURE0+F);let Q=i.get(J);if(J.version!==Q.__version||j===!0){e.activeTexture(n.TEXTURE0+F);let gt=oe.getPrimaries(oe.workingColorSpace),ot=v.colorSpace===Tn?null:oe.getPrimaries(v.colorSpace),ft=v.colorSpace===Tn||gt===ot?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ft);let Tt=v.isCompressedTexture||v.image[0].isCompressedTexture,Gt=v.image[0]&&v.image[0].isDataTexture,Z=[];for(let et=0;et<6;et++)!Tt&&!Gt?Z[et]=x(v.image[et],!1,!0,s.maxCubemapSize):Z[et]=Gt?v.image[et].image:v.image[et],Z[et]=Vt(v,Z[et]);let se=Z[0],Zt=m(se)||o,Lt=r.convert(v.format,v.colorSpace),vt=r.convert(v.type),dt=b(v.internalFormat,Lt,vt,v.colorSpace),kt=o&&v.isVideoTexture!==!0,ne=Q.__version===void 0||j===!0,Me=R(v,se,Zt);V(n.TEXTURE_CUBE_MAP,v,Zt);let Xt;if(Tt){kt&&ne&&e.texStorage2D(n.TEXTURE_CUBE_MAP,Me,dt,se.width,se.height);for(let et=0;et<6;et++){Xt=Z[et].mipmaps;for(let C=0;C<Xt.length;C++){let st=Xt[C];v.format!==Gn?Lt!==null?kt?e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,C,0,0,st.width,st.height,Lt,st.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,C,dt,st.width,st.height,0,st.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):kt?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,C,0,0,st.width,st.height,Lt,vt,st.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,C,dt,st.width,st.height,0,Lt,vt,st.data)}}}else{Xt=v.mipmaps,kt&&ne&&(Xt.length>0&&Me++,e.texStorage2D(n.TEXTURE_CUBE_MAP,Me,dt,Z[0].width,Z[0].height));for(let et=0;et<6;et++)if(Gt){kt?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,Z[et].width,Z[et].height,Lt,vt,Z[et].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,dt,Z[et].width,Z[et].height,0,Lt,vt,Z[et].data);for(let C=0;C<Xt.length;C++){let rt=Xt[C].image[et].image;kt?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,C+1,0,0,rt.width,rt.height,Lt,vt,rt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,C+1,dt,rt.width,rt.height,0,Lt,vt,rt.data)}}else{kt?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,Lt,vt,Z[et]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,dt,Lt,vt,Z[et]);for(let C=0;C<Xt.length;C++){let st=Xt[C];kt?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,C+1,0,0,Lt,vt,st.image[et]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,C+1,dt,Lt,vt,st.image[et])}}}M(v,Zt)&&_(n.TEXTURE_CUBE_MAP),Q.__version=J.version,v.onUpdate&&v.onUpdate(v)}E.__version=v.version}function xt(E,v,F,j,J,Q){let gt=r.convert(F.format,F.colorSpace),ot=r.convert(F.type),ft=b(F.internalFormat,gt,ot,F.colorSpace);if(!i.get(v).__hasExternalTextures){let Gt=Math.max(1,v.width>>Q),Z=Math.max(1,v.height>>Q);J===n.TEXTURE_3D||J===n.TEXTURE_2D_ARRAY?e.texImage3D(J,Q,ft,Gt,Z,v.depth,0,gt,ot,null):e.texImage2D(J,Q,ft,Gt,Z,0,gt,ot,null)}e.bindFramebuffer(n.FRAMEBUFFER,E),mt(v)?c.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,j,J,i.get(F).__webglTexture,0,Ut(v)):(J===n.TEXTURE_2D||J>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,j,J,i.get(F).__webglTexture,Q),e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ft(E,v,F){if(n.bindRenderbuffer(n.RENDERBUFFER,E),v.depthBuffer&&!v.stencilBuffer){let j=o===!0?n.DEPTH_COMPONENT24:n.DEPTH_COMPONENT16;if(F||mt(v)){let J=v.depthTexture;J&&J.isDepthTexture&&(J.type===zi?j=n.DEPTH_COMPONENT32F:J.type===Bi&&(j=n.DEPTH_COMPONENT24));let Q=Ut(v);mt(v)?c.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Q,j,v.width,v.height):n.renderbufferStorageMultisample(n.RENDERBUFFER,Q,j,v.width,v.height)}else n.renderbufferStorage(n.RENDERBUFFER,j,v.width,v.height);n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.RENDERBUFFER,E)}else if(v.depthBuffer&&v.stencilBuffer){let j=Ut(v);F&&mt(v)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,j,n.DEPTH24_STENCIL8,v.width,v.height):mt(v)?c.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,j,n.DEPTH24_STENCIL8,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,n.DEPTH_STENCIL,v.width,v.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.RENDERBUFFER,E)}else{let j=v.isWebGLMultipleRenderTargets===!0?v.texture:[v.texture];for(let J=0;J<j.length;J++){let Q=j[J],gt=r.convert(Q.format,Q.colorSpace),ot=r.convert(Q.type),ft=b(Q.internalFormat,gt,ot,Q.colorSpace),Tt=Ut(v);F&&mt(v)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Tt,ft,v.width,v.height):mt(v)?c.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Tt,ft,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,ft,v.width,v.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function zt(E,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,E),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(v.depthTexture).__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),G(v.depthTexture,0);let j=i.get(v.depthTexture).__webglTexture,J=Ut(v);if(v.depthTexture.format===Ss)mt(v)?c.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,j,0,J):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,j,0);else if(v.depthTexture.format===Er)mt(v)?c.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,j,0,J):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,j,0);else throw new Error("Unknown depthTexture format")}function Rt(E){let v=i.get(E),F=E.isWebGLCubeRenderTarget===!0;if(E.depthTexture&&!v.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");zt(v.__webglFramebuffer,E)}else if(F){v.__webglDepthbuffer=[];for(let j=0;j<6;j++)e.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[j]),v.__webglDepthbuffer[j]=n.createRenderbuffer(),Ft(v.__webglDepthbuffer[j],E,!1)}else e.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer=n.createRenderbuffer(),Ft(v.__webglDepthbuffer,E,!1);e.bindFramebuffer(n.FRAMEBUFFER,null)}function jt(E,v,F){let j=i.get(E);v!==void 0&&xt(j.__webglFramebuffer,E,E.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),F!==void 0&&Rt(E)}function U(E){let v=E.texture,F=i.get(E),j=i.get(v);E.addEventListener("dispose",H),E.isWebGLMultipleRenderTargets!==!0&&(j.__webglTexture===void 0&&(j.__webglTexture=n.createTexture()),j.__version=v.version,a.memory.textures++);let J=E.isWebGLCubeRenderTarget===!0,Q=E.isWebGLMultipleRenderTargets===!0,gt=m(E)||o;if(J){F.__webglFramebuffer=[];for(let ot=0;ot<6;ot++)if(o&&v.mipmaps&&v.mipmaps.length>0){F.__webglFramebuffer[ot]=[];for(let ft=0;ft<v.mipmaps.length;ft++)F.__webglFramebuffer[ot][ft]=n.createFramebuffer()}else F.__webglFramebuffer[ot]=n.createFramebuffer()}else{if(o&&v.mipmaps&&v.mipmaps.length>0){F.__webglFramebuffer=[];for(let ot=0;ot<v.mipmaps.length;ot++)F.__webglFramebuffer[ot]=n.createFramebuffer()}else F.__webglFramebuffer=n.createFramebuffer();if(Q)if(s.drawBuffers){let ot=E.texture;for(let ft=0,Tt=ot.length;ft<Tt;ft++){let Gt=i.get(ot[ft]);Gt.__webglTexture===void 0&&(Gt.__webglTexture=n.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&E.samples>0&&mt(E)===!1){let ot=Q?v:[v];F.__webglMultisampledFramebuffer=n.createFramebuffer(),F.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let ft=0;ft<ot.length;ft++){let Tt=ot[ft];F.__webglColorRenderbuffer[ft]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,F.__webglColorRenderbuffer[ft]);let Gt=r.convert(Tt.format,Tt.colorSpace),Z=r.convert(Tt.type),se=b(Tt.internalFormat,Gt,Z,Tt.colorSpace,E.isXRRenderTarget===!0),Zt=Ut(E);n.renderbufferStorageMultisample(n.RENDERBUFFER,Zt,se,E.width,E.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ft,n.RENDERBUFFER,F.__webglColorRenderbuffer[ft])}n.bindRenderbuffer(n.RENDERBUFFER,null),E.depthBuffer&&(F.__webglDepthRenderbuffer=n.createRenderbuffer(),Ft(F.__webglDepthRenderbuffer,E,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(J){e.bindTexture(n.TEXTURE_CUBE_MAP,j.__webglTexture),V(n.TEXTURE_CUBE_MAP,v,gt);for(let ot=0;ot<6;ot++)if(o&&v.mipmaps&&v.mipmaps.length>0)for(let ft=0;ft<v.mipmaps.length;ft++)xt(F.__webglFramebuffer[ot][ft],E,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,ft);else xt(F.__webglFramebuffer[ot],E,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0);M(v,gt)&&_(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Q){let ot=E.texture;for(let ft=0,Tt=ot.length;ft<Tt;ft++){let Gt=ot[ft],Z=i.get(Gt);e.bindTexture(n.TEXTURE_2D,Z.__webglTexture),V(n.TEXTURE_2D,Gt,gt),xt(F.__webglFramebuffer,E,Gt,n.COLOR_ATTACHMENT0+ft,n.TEXTURE_2D,0),M(Gt,gt)&&_(n.TEXTURE_2D)}e.unbindTexture()}else{let ot=n.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(o?ot=E.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(ot,j.__webglTexture),V(ot,v,gt),o&&v.mipmaps&&v.mipmaps.length>0)for(let ft=0;ft<v.mipmaps.length;ft++)xt(F.__webglFramebuffer[ft],E,v,n.COLOR_ATTACHMENT0,ot,ft);else xt(F.__webglFramebuffer,E,v,n.COLOR_ATTACHMENT0,ot,0);M(v,gt)&&_(ot),e.unbindTexture()}E.depthBuffer&&Rt(E)}function Je(E){let v=m(E)||o,F=E.isWebGLMultipleRenderTargets===!0?E.texture:[E.texture];for(let j=0,J=F.length;j<J;j++){let Q=F[j];if(M(Q,v)){let gt=E.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,ot=i.get(Q).__webglTexture;e.bindTexture(gt,ot),_(gt),e.unbindTexture()}}}function bt(E){if(o&&E.samples>0&&mt(E)===!1){let v=E.isWebGLMultipleRenderTargets?E.texture:[E.texture],F=E.width,j=E.height,J=n.COLOR_BUFFER_BIT,Q=[],gt=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ot=i.get(E),ft=E.isWebGLMultipleRenderTargets===!0;if(ft)for(let Tt=0;Tt<v.length;Tt++)e.bindFramebuffer(n.FRAMEBUFFER,ot.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Tt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,ot.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Tt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,ot.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,ot.__webglFramebuffer);for(let Tt=0;Tt<v.length;Tt++){Q.push(n.COLOR_ATTACHMENT0+Tt),E.depthBuffer&&Q.push(gt);let Gt=ot.__ignoreDepthValues!==void 0?ot.__ignoreDepthValues:!1;if(Gt===!1&&(E.depthBuffer&&(J|=n.DEPTH_BUFFER_BIT),E.stencilBuffer&&(J|=n.STENCIL_BUFFER_BIT)),ft&&n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,ot.__webglColorRenderbuffer[Tt]),Gt===!0&&(n.invalidateFramebuffer(n.READ_FRAMEBUFFER,[gt]),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[gt])),ft){let Z=i.get(v[Tt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Z,0)}n.blitFramebuffer(0,0,F,j,0,0,F,j,J,n.NEAREST),l&&n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Q)}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ft)for(let Tt=0;Tt<v.length;Tt++){e.bindFramebuffer(n.FRAMEBUFFER,ot.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Tt,n.RENDERBUFFER,ot.__webglColorRenderbuffer[Tt]);let Gt=i.get(v[Tt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,ot.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Tt,n.TEXTURE_2D,Gt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,ot.__webglMultisampledFramebuffer)}}function Ut(E){return Math.min(s.maxSamples,E.samples)}function mt(E){let v=i.get(E);return o&&E.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function xe(E){let v=a.render.frame;u.get(E)!==v&&(u.set(E,v),E.update())}function Vt(E,v){let F=E.colorSpace,j=E.format,J=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||E.format===ih||F!==yi&&F!==Tn&&(oe.getTransfer(F)===me?o===!1?t.has("EXT_sRGB")===!0&&j===Gn?(E.format=ih,E.minFilter=wn,E.generateMipmaps=!1):v=Fa.sRGBToLinear(v):(j!==Gn||J!==Gi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),v}this.allocateTextureUnit=L,this.resetTextureUnits=it,this.setTexture2D=G,this.setTexture2DArray=q,this.setTexture3D=X,this.setTextureCube=W,this.rebindTextures=jt,this.setupRenderTarget=U,this.updateRenderTargetMipmap=Je,this.updateMultisampleRenderTarget=bt,this.setupDepthRenderbuffer=Rt,this.setupFrameBufferTexture=xt,this.useMultisampledRTT=mt}function xS(n,t,e){let i=e.isWebGL2;function s(r,a=Tn){let o,c=oe.getTransfer(a);if(r===Gi)return n.UNSIGNED_BYTE;if(r===fp)return n.UNSIGNED_SHORT_4_4_4_4;if(r===dp)return n.UNSIGNED_SHORT_5_5_5_1;if(r===jg)return n.BYTE;if(r===Qg)return n.SHORT;if(r===Fh)return n.UNSIGNED_SHORT;if(r===up)return n.INT;if(r===Bi)return n.UNSIGNED_INT;if(r===zi)return n.FLOAT;if(r===po)return i?n.HALF_FLOAT:(o=t.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===t_)return n.ALPHA;if(r===Gn)return n.RGBA;if(r===e_)return n.LUMINANCE;if(r===n_)return n.LUMINANCE_ALPHA;if(r===Ss)return n.DEPTH_COMPONENT;if(r===Er)return n.DEPTH_STENCIL;if(r===ih)return o=t.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===i_)return n.RED;if(r===pp)return n.RED_INTEGER;if(r===s_)return n.RG;if(r===mp)return n.RG_INTEGER;if(r===gp)return n.RGBA_INTEGER;if(r===yl||r===vl||r===Ml||r===Sl)if(c===me)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===yl)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===vl)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Ml)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Sl)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===yl)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===vl)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Ml)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Sl)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Bf||r===zf||r===kf||r===Hf)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===Bf)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===zf)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===kf)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Hf)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===_p)return o=t.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Vf||r===Gf)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(r===Vf)return c===me?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===Gf)return c===me?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Wf||r===Xf||r===qf||r===Yf||r===$f||r===Zf||r===Jf||r===Kf||r===jf||r===Qf||r===td||r===ed||r===nd||r===id)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(r===Wf)return c===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Xf)return c===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===qf)return c===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Yf)return c===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===$f)return c===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Zf)return c===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Jf)return c===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Kf)return c===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===jf)return c===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Qf)return c===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===td)return c===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===ed)return c===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===nd)return c===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===id)return c===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===bl||r===sd||r===rd)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(r===bl)return c===me?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===sd)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===rd)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===r_||r===od||r===ad||r===cd)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(r===bl)return o.COMPRESSED_RED_RGTC1_EXT;if(r===od)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===ad)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===cd)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Ms?i?n.UNSIGNED_INT_24_8:(o=t.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):n[r]!==void 0?n[r]:null}return{convert:s}}var _h=class extends ze{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},He=class extends We{constructor(){super(),this.isGroup=!0,this.type="Group"}},yS={type:"move"},ho=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new He,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new He,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new He,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,a=null,o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(let x of t.hand.values()){let m=e.getJointPose(x,i),d=this._getHandJoint(l,x);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}let u=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],h=u.position.distanceTo(f.position),p=.02,g=.005;l.inputState.pinching&&h>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&h<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(yS)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let i=new He;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}},xh=class extends Wi{constructor(t,e){super();let i=this,s=null,r=1,a=null,o="local-floor",c=1,l=null,u=null,f=null,h=null,p=null,g=null,x=e.getContextAttributes(),m=null,d=null,M=[],_=[],b=new $t,R=null,A=new ze;A.layers.enable(1),A.viewport=new ke;let w=new ze;w.layers.enable(2),w.viewport=new ke;let H=[A,w],y=new _h;y.layers.enable(1),y.layers.enable(2);let T=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let $=M[V];return $===void 0&&($=new ho,M[V]=$),$.getTargetRaySpace()},this.getControllerGrip=function(V){let $=M[V];return $===void 0&&($=new ho,M[V]=$),$.getGripSpace()},this.getHand=function(V){let $=M[V];return $===void 0&&($=new ho,M[V]=$),$.getHandSpace()};function Y(V){let $=_.indexOf(V.inputSource);if($===-1)return;let lt=M[$];lt!==void 0&&(lt.update(V.inputSource,V.frame,l||a),lt.dispatchEvent({type:V.type,data:V.inputSource}))}function it(){s.removeEventListener("select",Y),s.removeEventListener("selectstart",Y),s.removeEventListener("selectend",Y),s.removeEventListener("squeeze",Y),s.removeEventListener("squeezestart",Y),s.removeEventListener("squeezeend",Y),s.removeEventListener("end",it),s.removeEventListener("inputsourceschange",L);for(let V=0;V<M.length;V++){let $=_[V];$!==null&&(_[V]=null,M[V].disconnect($))}T=null,k=null,t.setRenderTarget(m),p=null,h=null,f=null,s=null,d=null,ut.stop(),i.isPresenting=!1,t.setPixelRatio(R),t.setSize(b.width,b.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){r=V,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){o=V,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(V){l=V},this.getBaseLayer=function(){return h!==null?h:p},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(V){if(s=V,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",Y),s.addEventListener("selectstart",Y),s.addEventListener("selectend",Y),s.addEventListener("squeeze",Y),s.addEventListener("squeezestart",Y),s.addEventListener("squeezeend",Y),s.addEventListener("end",it),s.addEventListener("inputsourceschange",L),x.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(b),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){let $={antialias:s.renderState.layers===void 0?x.antialias:!0,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,$),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),d=new vi(p.framebufferWidth,p.framebufferHeight,{format:Gn,type:Gi,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil})}else{let $=null,lt=null,yt=null;x.depth&&(yt=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,$=x.stencil?Er:Ss,lt=x.stencil?Ms:Bi);let xt={colorFormat:e.RGBA8,depthFormat:yt,scaleFactor:r};f=new XRWebGLBinding(s,e),h=f.createProjectionLayer(xt),s.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),d=new vi(h.textureWidth,h.textureHeight,{format:Gn,type:Gi,depthTexture:new $a(h.textureWidth,h.textureHeight,lt,void 0,void 0,void 0,void 0,void 0,void 0,$),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0});let Ft=t.properties.get(d);Ft.__ignoreDepthValues=h.ignoreDepthValues}d.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),ut.setContext(s),ut.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function L(V){for(let $=0;$<V.removed.length;$++){let lt=V.removed[$],yt=_.indexOf(lt);yt>=0&&(_[yt]=null,M[yt].disconnect(lt))}for(let $=0;$<V.added.length;$++){let lt=V.added[$],yt=_.indexOf(lt);if(yt===-1){for(let Ft=0;Ft<M.length;Ft++)if(Ft>=_.length){_.push(lt),yt=Ft;break}else if(_[Ft]===null){_[Ft]=lt,yt=Ft;break}if(yt===-1)break}let xt=M[yt];xt&&xt.connect(lt)}}let O=new P,G=new P;function q(V,$,lt){O.setFromMatrixPosition($.matrixWorld),G.setFromMatrixPosition(lt.matrixWorld);let yt=O.distanceTo(G),xt=$.projectionMatrix.elements,Ft=lt.projectionMatrix.elements,zt=xt[14]/(xt[10]-1),Rt=xt[14]/(xt[10]+1),jt=(xt[9]+1)/xt[5],U=(xt[9]-1)/xt[5],Je=(xt[8]-1)/xt[0],bt=(Ft[8]+1)/Ft[0],Ut=zt*Je,mt=zt*bt,xe=yt/(-Je+bt),Vt=xe*-Je;$.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(Vt),V.translateZ(xe),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert();let E=zt+xe,v=Rt+xe,F=Ut-Vt,j=mt+(yt-Vt),J=jt*Rt/v*E,Q=U*Rt/v*E;V.projectionMatrix.makePerspective(F,j,J,Q,E,v),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}function X(V,$){$===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices($.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(s===null)return;y.near=w.near=A.near=V.near,y.far=w.far=A.far=V.far,(T!==y.near||k!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),T=y.near,k=y.far);let $=V.parent,lt=y.cameras;X(y,$);for(let yt=0;yt<lt.length;yt++)X(lt[yt],$);lt.length===2?q(y,A,w):y.projectionMatrix.copy(A.projectionMatrix),W(V,y,$)};function W(V,$,lt){lt===null?V.matrix.copy($.matrixWorld):(V.matrix.copy(lt.matrixWorld),V.matrix.invert(),V.matrix.multiply($.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy($.projectionMatrix),V.projectionMatrixInverse.copy($.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=mo*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(h===null&&p===null))return c},this.setFoveation=function(V){c=V,h!==null&&(h.fixedFoveation=V),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=V)};let K=null;function tt(V,$){if(u=$.getViewerPose(l||a),g=$,u!==null){let lt=u.views;p!==null&&(t.setRenderTargetFramebuffer(d,p.framebuffer),t.setRenderTarget(d));let yt=!1;lt.length!==y.cameras.length&&(y.cameras.length=0,yt=!0);for(let xt=0;xt<lt.length;xt++){let Ft=lt[xt],zt=null;if(p!==null)zt=p.getViewport(Ft);else{let jt=f.getViewSubImage(h,Ft);zt=jt.viewport,xt===0&&(t.setRenderTargetTextures(d,jt.colorTexture,h.ignoreDepthValues?void 0:jt.depthStencilTexture),t.setRenderTarget(d))}let Rt=H[xt];Rt===void 0&&(Rt=new ze,Rt.layers.enable(xt),Rt.viewport=new ke,H[xt]=Rt),Rt.matrix.fromArray(Ft.transform.matrix),Rt.matrix.decompose(Rt.position,Rt.quaternion,Rt.scale),Rt.projectionMatrix.fromArray(Ft.projectionMatrix),Rt.projectionMatrixInverse.copy(Rt.projectionMatrix).invert(),Rt.viewport.set(zt.x,zt.y,zt.width,zt.height),xt===0&&(y.matrix.copy(Rt.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),yt===!0&&y.cameras.push(Rt)}}for(let lt=0;lt<M.length;lt++){let yt=_[lt],xt=M[lt];yt!==null&&xt!==void 0&&xt.update(yt,$,l||a)}K&&K(V,$),$.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:$}),g=null}let ut=new Ep;ut.setAnimationLoop(tt),this.setAnimationLoop=function(V){K=V},this.dispose=function(){}}};function vS(n,t){function e(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function i(m,d){d.color.getRGB(m.fogColor.value,bp(n)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function s(m,d,M,_,b){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(m,d):d.isMeshToonMaterial?(r(m,d),f(m,d)):d.isMeshPhongMaterial?(r(m,d),u(m,d)):d.isMeshStandardMaterial?(r(m,d),h(m,d),d.isMeshPhysicalMaterial&&p(m,d,b)):d.isMeshMatcapMaterial?(r(m,d),g(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),x(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(a(m,d),d.isLineDashedMaterial&&o(m,d)):d.isPointsMaterial?c(m,d,M,_):d.isSpriteMaterial?l(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,e(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===un&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,e(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===un&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,e(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,e(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);let M=t.get(d).envMap;if(M&&(m.envMap.value=M,m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap){m.lightMap.value=d.lightMap;let _=n._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=d.lightMapIntensity*_,e(d.lightMap,m.lightMapTransform)}d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,m.aoMapTransform))}function a(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform))}function o(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function c(m,d,M,_){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*M,m.scale.value=_*.5,d.map&&(m.map.value=d.map,e(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function l(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function u(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function f(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function h(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,m.roughnessMapTransform)),t.get(d).envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,M){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===un&&m.clearcoatNormalScale.value.negate())),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,d){d.matcap&&(m.matcap.value=d.matcap)}function x(m,d){let M=t.get(d).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function MS(n,t,e,i){let s={},r={},a=[],o=e.isWebGL2?n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(M,_){let b=_.program;i.uniformBlockBinding(M,b)}function l(M,_){let b=s[M.id];b===void 0&&(g(M),b=u(M),s[M.id]=b,M.addEventListener("dispose",m));let R=_.program;i.updateUBOMapping(M,R);let A=t.render.frame;r[M.id]!==A&&(h(M),r[M.id]=A)}function u(M){let _=f();M.__bindingPointIndex=_;let b=n.createBuffer(),R=M.__size,A=M.usage;return n.bindBuffer(n.UNIFORM_BUFFER,b),n.bufferData(n.UNIFORM_BUFFER,R,A),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,_,b),b}function f(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(M){let _=s[M.id],b=M.uniforms,R=M.__cache;n.bindBuffer(n.UNIFORM_BUFFER,_);for(let A=0,w=b.length;A<w;A++){let H=Array.isArray(b[A])?b[A]:[b[A]];for(let y=0,T=H.length;y<T;y++){let k=H[y];if(p(k,A,y,R)===!0){let Y=k.__offset,it=Array.isArray(k.value)?k.value:[k.value],L=0;for(let O=0;O<it.length;O++){let G=it[O],q=x(G);typeof G=="number"||typeof G=="boolean"?(k.__data[0]=G,n.bufferSubData(n.UNIFORM_BUFFER,Y+L,k.__data)):G.isMatrix3?(k.__data[0]=G.elements[0],k.__data[1]=G.elements[1],k.__data[2]=G.elements[2],k.__data[3]=0,k.__data[4]=G.elements[3],k.__data[5]=G.elements[4],k.__data[6]=G.elements[5],k.__data[7]=0,k.__data[8]=G.elements[6],k.__data[9]=G.elements[7],k.__data[10]=G.elements[8],k.__data[11]=0):(G.toArray(k.__data,L),L+=q.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,Y,k.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(M,_,b,R){let A=M.value,w=_+"_"+b;if(R[w]===void 0)return typeof A=="number"||typeof A=="boolean"?R[w]=A:R[w]=A.clone(),!0;{let H=R[w];if(typeof A=="number"||typeof A=="boolean"){if(H!==A)return R[w]=A,!0}else if(H.equals(A)===!1)return H.copy(A),!0}return!1}function g(M){let _=M.uniforms,b=0,R=16;for(let w=0,H=_.length;w<H;w++){let y=Array.isArray(_[w])?_[w]:[_[w]];for(let T=0,k=y.length;T<k;T++){let Y=y[T],it=Array.isArray(Y.value)?Y.value:[Y.value];for(let L=0,O=it.length;L<O;L++){let G=it[L],q=x(G),X=b%R;X!==0&&R-X<q.boundary&&(b+=R-X),Y.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),Y.__offset=b,b+=q.storage}}}let A=b%R;return A>0&&(b+=R-A),M.__size=b,M.__cache={},this}function x(M){let _={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(_.boundary=4,_.storage=4):M.isVector2?(_.boundary=8,_.storage=8):M.isVector3||M.isColor?(_.boundary=16,_.storage=12):M.isVector4?(_.boundary=16,_.storage=16):M.isMatrix3?(_.boundary=48,_.storage=48):M.isMatrix4?(_.boundary=64,_.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),_}function m(M){let _=M.target;_.removeEventListener("dispose",m);let b=a.indexOf(_.__bindingPointIndex);a.splice(b,1),n.deleteBuffer(s[_.id]),delete s[_.id],delete r[_.id]}function d(){for(let M in s)n.deleteBuffer(s[M]);a=[],s={},r={}}return{bind:c,update:l,dispose:d}}var Ts=class{constructor(t={}){let{canvas:e=P_(),context:i=null,depth:s=!0,stencil:r=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1}=t;this.isWebGLRenderer=!0;let h;i!==null?h=i.getContextAttributes().alpha:h=a;let p=new Uint32Array(4),g=new Int32Array(4),x=null,m=null,d=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Pe,this._useLegacyLights=!1,this.toneMapping=Vi,this.toneMappingExposure=1;let _=this,b=!1,R=0,A=0,w=null,H=-1,y=null,T=new ke,k=new ke,Y=null,it=new St(0),L=0,O=e.width,G=e.height,q=1,X=null,W=null,K=new ke(0,0,O,G),tt=new ke(0,0,O,G),ut=!1,V=new _o,$=!1,lt=!1,yt=null,xt=new Ae,Ft=new $t,zt=new P,Rt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function jt(){return w===null?q:1}let U=i;function Je(S,I){for(let B=0;B<S.length;B++){let z=S[B],N=e.getContext(z,I);if(N!==null)return N}return null}try{let S={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine","three.js r160"),e.addEventListener("webglcontextlost",et,!1),e.addEventListener("webglcontextrestored",C,!1),e.addEventListener("webglcontextcreationerror",st,!1),U===null){let I=["webgl2","webgl","experimental-webgl"];if(_.isWebGL1Renderer===!0&&I.shift(),U=Je(I,S),U===null)throw Je(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&U instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),U.getShaderPrecisionFormat===void 0&&(U.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let bt,Ut,mt,xe,Vt,E,v,F,j,J,Q,gt,ot,ft,Tt,Gt,Z,se,Zt,Lt,vt,dt,kt,ne;function Me(){bt=new kv(U),Ut=new Uv(U,bt,t),bt.init(Ut),dt=new xS(U,bt,Ut),mt=new gS(U,bt,Ut),xe=new Gv(U),Vt=new sS,E=new _S(U,bt,mt,Vt,Ut,dt,xe),v=new Ov(_),F=new zv(_),j=new K_(U,Ut),kt=new Iv(U,bt,j,Ut),J=new Hv(U,j,xe,kt),Q=new Yv(U,J,j,xe),Zt=new qv(U,Ut,E),Gt=new Nv(Vt),gt=new iS(_,v,F,bt,Ut,kt,Gt),ot=new vS(_,Vt),ft=new oS,Tt=new fS(bt,Ut),se=new Lv(_,v,F,mt,Q,h,c),Z=new mS(_,Q,Ut),ne=new MS(U,xe,Ut,mt),Lt=new Dv(U,bt,xe,Ut),vt=new Vv(U,bt,xe,Ut),xe.programs=gt.programs,_.capabilities=Ut,_.extensions=bt,_.properties=Vt,_.renderLists=ft,_.shadowMap=Z,_.state=mt,_.info=xe}Me();let Xt=new xh(_,U);this.xr=Xt,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){let S=bt.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){let S=bt.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(S){S!==void 0&&(q=S,this.setSize(O,G,!1))},this.getSize=function(S){return S.set(O,G)},this.setSize=function(S,I,B=!0){if(Xt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}O=S,G=I,e.width=Math.floor(S*q),e.height=Math.floor(I*q),B===!0&&(e.style.width=S+"px",e.style.height=I+"px"),this.setViewport(0,0,S,I)},this.getDrawingBufferSize=function(S){return S.set(O*q,G*q).floor()},this.setDrawingBufferSize=function(S,I,B){O=S,G=I,q=B,e.width=Math.floor(S*B),e.height=Math.floor(I*B),this.setViewport(0,0,S,I)},this.getCurrentViewport=function(S){return S.copy(T)},this.getViewport=function(S){return S.copy(K)},this.setViewport=function(S,I,B,z){S.isVector4?K.set(S.x,S.y,S.z,S.w):K.set(S,I,B,z),mt.viewport(T.copy(K).multiplyScalar(q).floor())},this.getScissor=function(S){return S.copy(tt)},this.setScissor=function(S,I,B,z){S.isVector4?tt.set(S.x,S.y,S.z,S.w):tt.set(S,I,B,z),mt.scissor(k.copy(tt).multiplyScalar(q).floor())},this.getScissorTest=function(){return ut},this.setScissorTest=function(S){mt.setScissorTest(ut=S)},this.setOpaqueSort=function(S){X=S},this.setTransparentSort=function(S){W=S},this.getClearColor=function(S){return S.copy(se.getClearColor())},this.setClearColor=function(){se.setClearColor.apply(se,arguments)},this.getClearAlpha=function(){return se.getClearAlpha()},this.setClearAlpha=function(){se.setClearAlpha.apply(se,arguments)},this.clear=function(S=!0,I=!0,B=!0){let z=0;if(S){let N=!1;if(w!==null){let ht=w.texture.format;N=ht===gp||ht===mp||ht===pp}if(N){let ht=w.texture.type,_t=ht===Gi||ht===Bi||ht===Fh||ht===Ms||ht===fp||ht===dp,wt=se.getClearColor(),Pt=se.getClearAlpha(),Wt=wt.r,Nt=wt.g,Bt=wt.b;_t?(p[0]=Wt,p[1]=Nt,p[2]=Bt,p[3]=Pt,U.clearBufferuiv(U.COLOR,0,p)):(g[0]=Wt,g[1]=Nt,g[2]=Bt,g[3]=Pt,U.clearBufferiv(U.COLOR,0,g))}else z|=U.COLOR_BUFFER_BIT}I&&(z|=U.DEPTH_BUFFER_BIT),B&&(z|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",et,!1),e.removeEventListener("webglcontextrestored",C,!1),e.removeEventListener("webglcontextcreationerror",st,!1),ft.dispose(),Tt.dispose(),Vt.dispose(),v.dispose(),F.dispose(),Q.dispose(),kt.dispose(),ne.dispose(),gt.dispose(),Xt.dispose(),Xt.removeEventListener("sessionstart",Ke),Xt.removeEventListener("sessionend",ue),yt&&(yt.dispose(),yt=null),je.stop()};function et(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function C(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;let S=xe.autoReset,I=Z.enabled,B=Z.autoUpdate,z=Z.needsUpdate,N=Z.type;Me(),xe.autoReset=S,Z.enabled=I,Z.autoUpdate=B,Z.needsUpdate=z,Z.type=N}function st(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function rt(S){let I=S.target;I.removeEventListener("dispose",rt),Ct(I)}function Ct(S){Et(S),Vt.remove(S)}function Et(S){let I=Vt.get(S).programs;I!==void 0&&(I.forEach(function(B){gt.releaseProgram(B)}),S.isShaderMaterial&&gt.releaseShaderCache(S))}this.renderBufferDirect=function(S,I,B,z,N,ht){I===null&&(I=Rt);let _t=N.isMesh&&N.matrixWorld.determinant()<0,wt=eg(S,I,B,z,N);mt.setMaterial(z,_t);let Pt=B.index,Wt=1;if(z.wireframe===!0){if(Pt=J.getWireframeAttribute(B),Pt===void 0)return;Wt=2}let Nt=B.drawRange,Bt=B.attributes.position,Te=Nt.start*Wt,_n=(Nt.start+Nt.count)*Wt;ht!==null&&(Te=Math.max(Te,ht.start*Wt),_n=Math.min(_n,(ht.start+ht.count)*Wt)),Pt!==null?(Te=Math.max(Te,0),_n=Math.min(_n,Pt.count)):Bt!=null&&(Te=Math.max(Te,0),_n=Math.min(_n,Bt.count));let Oe=_n-Te;if(Oe<0||Oe===1/0)return;kt.setup(N,z,wt,B,Pt);let ci,ye=Lt;if(Pt!==null&&(ci=j.get(Pt),ye=vt,ye.setIndex(ci)),N.isMesh)z.wireframe===!0?(mt.setLineWidth(z.wireframeLinewidth*jt()),ye.setMode(U.LINES)):ye.setMode(U.TRIANGLES);else if(N.isLine){let qt=z.linewidth;qt===void 0&&(qt=1),mt.setLineWidth(qt*jt()),N.isLineSegments?ye.setMode(U.LINES):N.isLineLoop?ye.setMode(U.LINE_LOOP):ye.setMode(U.LINE_STRIP)}else N.isPoints?ye.setMode(U.POINTS):N.isSprite&&ye.setMode(U.TRIANGLES);if(N.isBatchedMesh)ye.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else if(N.isInstancedMesh)ye.renderInstances(Te,Oe,N.count);else if(B.isInstancedBufferGeometry){let qt=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,il=Math.min(B.instanceCount,qt);ye.renderInstances(Te,Oe,il)}else ye.render(Te,Oe)};function le(S,I,B){S.transparent===!0&&S.side===rn&&S.forceSinglePass===!1?(S.side=un,S.needsUpdate=!0,Ho(S,I,B),S.side=Qn,S.needsUpdate=!0,Ho(S,I,B),S.side=rn):Ho(S,I,B)}this.compile=function(S,I,B=null){B===null&&(B=S),m=Tt.get(B),m.init(),M.push(m),B.traverseVisible(function(N){N.isLight&&N.layers.test(I.layers)&&(m.pushLight(N),N.castShadow&&m.pushShadow(N))}),S!==B&&S.traverseVisible(function(N){N.isLight&&N.layers.test(I.layers)&&(m.pushLight(N),N.castShadow&&m.pushShadow(N))}),m.setupLights(_._useLegacyLights);let z=new Set;return S.traverse(function(N){let ht=N.material;if(ht)if(Array.isArray(ht))for(let _t=0;_t<ht.length;_t++){let wt=ht[_t];le(wt,B,N),z.add(wt)}else le(ht,B,N),z.add(ht)}),M.pop(),m=null,z},this.compileAsync=function(S,I,B=null){let z=this.compile(S,I,B);return new Promise(N=>{function ht(){if(z.forEach(function(_t){Vt.get(_t).currentProgram.isReady()&&z.delete(_t)}),z.size===0){N(S);return}setTimeout(ht,10)}bt.get("KHR_parallel_shader_compile")!==null?ht():setTimeout(ht,10)})};let he=null;function Ne(S){he&&he(S)}function Ke(){je.stop()}function ue(){je.start()}let je=new Ep;je.setAnimationLoop(Ne),typeof self<"u"&&je.setContext(self),this.setAnimationLoop=function(S){he=S,Xt.setAnimationLoop(S),S===null?je.stop():je.start()},Xt.addEventListener("sessionstart",Ke),Xt.addEventListener("sessionend",ue),this.render=function(S,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),Xt.enabled===!0&&Xt.isPresenting===!0&&(Xt.cameraAutoUpdate===!0&&Xt.updateCamera(I),I=Xt.getCamera()),S.isScene===!0&&S.onBeforeRender(_,S,I,w),m=Tt.get(S,M.length),m.init(),M.push(m),xt.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),V.setFromProjectionMatrix(xt),lt=this.localClippingEnabled,$=Gt.init(this.clippingPlanes,lt),x=ft.get(S,d.length),x.init(),d.push(x),Zn(S,I,0,_.sortObjects),x.finish(),_.sortObjects===!0&&x.sort(X,W),this.info.render.frame++,$===!0&&Gt.beginShadows();let B=m.state.shadowsArray;if(Z.render(B,S,I),$===!0&&Gt.endShadows(),this.info.autoReset===!0&&this.info.reset(),se.render(x,S),m.setupLights(_._useLegacyLights),I.isArrayCamera){let z=I.cameras;for(let N=0,ht=z.length;N<ht;N++){let _t=z[N];rf(x,S,_t,_t.viewport)}}else rf(x,S,I);w!==null&&(E.updateMultisampleRenderTarget(w),E.updateRenderTargetMipmap(w)),S.isScene===!0&&S.onAfterRender(_,S,I),kt.resetDefaultState(),H=-1,y=null,M.pop(),M.length>0?m=M[M.length-1]:m=null,d.pop(),d.length>0?x=d[d.length-1]:x=null};function Zn(S,I,B,z){if(S.visible===!1)return;if(S.layers.test(I.layers)){if(S.isGroup)B=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(I);else if(S.isLight)m.pushLight(S),S.castShadow&&m.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||V.intersectsSprite(S)){z&&zt.setFromMatrixPosition(S.matrixWorld).applyMatrix4(xt);let _t=Q.update(S),wt=S.material;wt.visible&&x.push(S,_t,wt,B,zt.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||V.intersectsObject(S))){let _t=Q.update(S),wt=S.material;if(z&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),zt.copy(S.boundingSphere.center)):(_t.boundingSphere===null&&_t.computeBoundingSphere(),zt.copy(_t.boundingSphere.center)),zt.applyMatrix4(S.matrixWorld).applyMatrix4(xt)),Array.isArray(wt)){let Pt=_t.groups;for(let Wt=0,Nt=Pt.length;Wt<Nt;Wt++){let Bt=Pt[Wt],Te=wt[Bt.materialIndex];Te&&Te.visible&&x.push(S,_t,Te,B,zt.z,Bt)}}else wt.visible&&x.push(S,_t,wt,B,zt.z,null)}}let ht=S.children;for(let _t=0,wt=ht.length;_t<wt;_t++)Zn(ht[_t],I,B,z)}function rf(S,I,B,z){let N=S.opaque,ht=S.transmissive,_t=S.transparent;m.setupLightsView(B),$===!0&&Gt.setGlobalState(_.clippingPlanes,B),ht.length>0&&tg(N,ht,I,B),z&&mt.viewport(T.copy(z)),N.length>0&&ko(N,I,B),ht.length>0&&ko(ht,I,B),_t.length>0&&ko(_t,I,B),mt.buffers.depth.setTest(!0),mt.buffers.depth.setMask(!0),mt.buffers.color.setMask(!0),mt.setPolygonOffset(!1)}function tg(S,I,B,z){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;let ht=Ut.isWebGL2;yt===null&&(yt=new vi(1,1,{generateMipmaps:!0,type:bt.has("EXT_color_buffer_half_float")?po:Gi,minFilter:fo,samples:ht?4:0})),_.getDrawingBufferSize(Ft),ht?yt.setSize(Ft.x,Ft.y):yt.setSize(Na(Ft.x),Na(Ft.y));let _t=_.getRenderTarget();_.setRenderTarget(yt),_.getClearColor(it),L=_.getClearAlpha(),L<1&&_.setClearColor(16777215,.5),_.clear();let wt=_.toneMapping;_.toneMapping=Vi,ko(S,B,z),E.updateMultisampleRenderTarget(yt),E.updateRenderTargetMipmap(yt);let Pt=!1;for(let Wt=0,Nt=I.length;Wt<Nt;Wt++){let Bt=I[Wt],Te=Bt.object,_n=Bt.geometry,Oe=Bt.material,ci=Bt.group;if(Oe.side===rn&&Te.layers.test(z.layers)){let ye=Oe.side;Oe.side=un,Oe.needsUpdate=!0,of(Te,B,z,_n,Oe,ci),Oe.side=ye,Oe.needsUpdate=!0,Pt=!0}}Pt===!0&&(E.updateMultisampleRenderTarget(yt),E.updateRenderTargetMipmap(yt)),_.setRenderTarget(_t),_.setClearColor(it,L),_.toneMapping=wt}function ko(S,I,B){let z=I.isScene===!0?I.overrideMaterial:null;for(let N=0,ht=S.length;N<ht;N++){let _t=S[N],wt=_t.object,Pt=_t.geometry,Wt=z===null?_t.material:z,Nt=_t.group;wt.layers.test(B.layers)&&of(wt,I,B,Pt,Wt,Nt)}}function of(S,I,B,z,N,ht){S.onBeforeRender(_,I,B,z,N,ht),S.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),N.onBeforeRender(_,I,B,z,S,ht),N.transparent===!0&&N.side===rn&&N.forceSinglePass===!1?(N.side=un,N.needsUpdate=!0,_.renderBufferDirect(B,I,z,N,S,ht),N.side=Qn,N.needsUpdate=!0,_.renderBufferDirect(B,I,z,N,S,ht),N.side=rn):_.renderBufferDirect(B,I,z,N,S,ht),S.onAfterRender(_,I,B,z,N,ht)}function Ho(S,I,B){I.isScene!==!0&&(I=Rt);let z=Vt.get(S),N=m.state.lights,ht=m.state.shadowsArray,_t=N.state.version,wt=gt.getParameters(S,N.state,ht,I,B),Pt=gt.getProgramCacheKey(wt),Wt=z.programs;z.environment=S.isMeshStandardMaterial?I.environment:null,z.fog=I.fog,z.envMap=(S.isMeshStandardMaterial?F:v).get(S.envMap||z.environment),Wt===void 0&&(S.addEventListener("dispose",rt),Wt=new Map,z.programs=Wt);let Nt=Wt.get(Pt);if(Nt!==void 0){if(z.currentProgram===Nt&&z.lightsStateVersion===_t)return cf(S,wt),Nt}else wt.uniforms=gt.getUniforms(S),S.onBuild(B,wt,_),S.onBeforeCompile(wt,_),Nt=gt.acquireProgram(wt,Pt),Wt.set(Pt,Nt),z.uniforms=wt.uniforms;let Bt=z.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Bt.clippingPlanes=Gt.uniform),cf(S,wt),z.needsLights=ig(S),z.lightsStateVersion=_t,z.needsLights&&(Bt.ambientLightColor.value=N.state.ambient,Bt.lightProbe.value=N.state.probe,Bt.directionalLights.value=N.state.directional,Bt.directionalLightShadows.value=N.state.directionalShadow,Bt.spotLights.value=N.state.spot,Bt.spotLightShadows.value=N.state.spotShadow,Bt.rectAreaLights.value=N.state.rectArea,Bt.ltc_1.value=N.state.rectAreaLTC1,Bt.ltc_2.value=N.state.rectAreaLTC2,Bt.pointLights.value=N.state.point,Bt.pointLightShadows.value=N.state.pointShadow,Bt.hemisphereLights.value=N.state.hemi,Bt.directionalShadowMap.value=N.state.directionalShadowMap,Bt.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Bt.spotShadowMap.value=N.state.spotShadowMap,Bt.spotLightMatrix.value=N.state.spotLightMatrix,Bt.spotLightMap.value=N.state.spotLightMap,Bt.pointShadowMap.value=N.state.pointShadowMap,Bt.pointShadowMatrix.value=N.state.pointShadowMatrix),z.currentProgram=Nt,z.uniformsList=null,Nt}function af(S){if(S.uniformsList===null){let I=S.currentProgram.getUniforms();S.uniformsList=Mr.seqWithValue(I.seq,S.uniforms)}return S.uniformsList}function cf(S,I){let B=Vt.get(S);B.outputColorSpace=I.outputColorSpace,B.batching=I.batching,B.instancing=I.instancing,B.instancingColor=I.instancingColor,B.skinning=I.skinning,B.morphTargets=I.morphTargets,B.morphNormals=I.morphNormals,B.morphColors=I.morphColors,B.morphTargetsCount=I.morphTargetsCount,B.numClippingPlanes=I.numClippingPlanes,B.numIntersection=I.numClipIntersection,B.vertexAlphas=I.vertexAlphas,B.vertexTangents=I.vertexTangents,B.toneMapping=I.toneMapping}function eg(S,I,B,z,N){I.isScene!==!0&&(I=Rt),E.resetTextureUnits();let ht=I.fog,_t=z.isMeshStandardMaterial?I.environment:null,wt=w===null?_.outputColorSpace:w.isXRRenderTarget===!0?w.texture.colorSpace:yi,Pt=(z.isMeshStandardMaterial?F:v).get(z.envMap||_t),Wt=z.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Nt=!!B.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),Bt=!!B.morphAttributes.position,Te=!!B.morphAttributes.normal,_n=!!B.morphAttributes.color,Oe=Vi;z.toneMapped&&(w===null||w.isXRRenderTarget===!0)&&(Oe=_.toneMapping);let ci=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,ye=ci!==void 0?ci.length:0,qt=Vt.get(z),il=m.state.lights;if($===!0&&(lt===!0||S!==y)){let bn=S===y&&z.id===H;Gt.setState(z,S,bn)}let Se=!1;z.version===qt.__version?(qt.needsLights&&qt.lightsStateVersion!==il.state.version||qt.outputColorSpace!==wt||N.isBatchedMesh&&qt.batching===!1||!N.isBatchedMesh&&qt.batching===!0||N.isInstancedMesh&&qt.instancing===!1||!N.isInstancedMesh&&qt.instancing===!0||N.isSkinnedMesh&&qt.skinning===!1||!N.isSkinnedMesh&&qt.skinning===!0||N.isInstancedMesh&&qt.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&qt.instancingColor===!1&&N.instanceColor!==null||qt.envMap!==Pt||z.fog===!0&&qt.fog!==ht||qt.numClippingPlanes!==void 0&&(qt.numClippingPlanes!==Gt.numPlanes||qt.numIntersection!==Gt.numIntersection)||qt.vertexAlphas!==Wt||qt.vertexTangents!==Nt||qt.morphTargets!==Bt||qt.morphNormals!==Te||qt.morphColors!==_n||qt.toneMapping!==Oe||Ut.isWebGL2===!0&&qt.morphTargetsCount!==ye)&&(Se=!0):(Se=!0,qt.__version=z.version);let as=qt.currentProgram;Se===!0&&(as=Ho(z,I,N));let lf=!1,Zr=!1,sl=!1,qe=as.getUniforms(),cs=qt.uniforms;if(mt.useProgram(as.program)&&(lf=!0,Zr=!0,sl=!0),z.id!==H&&(H=z.id,Zr=!0),lf||y!==S){qe.setValue(U,"projectionMatrix",S.projectionMatrix),qe.setValue(U,"viewMatrix",S.matrixWorldInverse);let bn=qe.map.cameraPosition;bn!==void 0&&bn.setValue(U,zt.setFromMatrixPosition(S.matrixWorld)),Ut.logarithmicDepthBuffer&&qe.setValue(U,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&qe.setValue(U,"isOrthographic",S.isOrthographicCamera===!0),y!==S&&(y=S,Zr=!0,sl=!0)}if(N.isSkinnedMesh){qe.setOptional(U,N,"bindMatrix"),qe.setOptional(U,N,"bindMatrixInverse");let bn=N.skeleton;bn&&(Ut.floatVertexTextures?(bn.boneTexture===null&&bn.computeBoneTexture(),qe.setValue(U,"boneTexture",bn.boneTexture,E)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}N.isBatchedMesh&&(qe.setOptional(U,N,"batchingTexture"),qe.setValue(U,"batchingTexture",N._matricesTexture,E));let rl=B.morphAttributes;if((rl.position!==void 0||rl.normal!==void 0||rl.color!==void 0&&Ut.isWebGL2===!0)&&Zt.update(N,B,as),(Zr||qt.receiveShadow!==N.receiveShadow)&&(qt.receiveShadow=N.receiveShadow,qe.setValue(U,"receiveShadow",N.receiveShadow)),z.isMeshGouraudMaterial&&z.envMap!==null&&(cs.envMap.value=Pt,cs.flipEnvMap.value=Pt.isCubeTexture&&Pt.isRenderTargetTexture===!1?-1:1),Zr&&(qe.setValue(U,"toneMappingExposure",_.toneMappingExposure),qt.needsLights&&ng(cs,sl),ht&&z.fog===!0&&ot.refreshFogUniforms(cs,ht),ot.refreshMaterialUniforms(cs,z,q,G,yt),Mr.upload(U,af(qt),cs,E)),z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(Mr.upload(U,af(qt),cs,E),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&qe.setValue(U,"center",N.center),qe.setValue(U,"modelViewMatrix",N.modelViewMatrix),qe.setValue(U,"normalMatrix",N.normalMatrix),qe.setValue(U,"modelMatrix",N.matrixWorld),z.isShaderMaterial||z.isRawShaderMaterial){let bn=z.uniformsGroups;for(let ol=0,sg=bn.length;ol<sg;ol++)if(Ut.isWebGL2){let hf=bn[ol];ne.update(hf,as),ne.bind(hf,as)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return as}function ng(S,I){S.ambientLightColor.needsUpdate=I,S.lightProbe.needsUpdate=I,S.directionalLights.needsUpdate=I,S.directionalLightShadows.needsUpdate=I,S.pointLights.needsUpdate=I,S.pointLightShadows.needsUpdate=I,S.spotLights.needsUpdate=I,S.spotLightShadows.needsUpdate=I,S.rectAreaLights.needsUpdate=I,S.hemisphereLights.needsUpdate=I}function ig(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return w},this.setRenderTargetTextures=function(S,I,B){Vt.get(S.texture).__webglTexture=I,Vt.get(S.depthTexture).__webglTexture=B;let z=Vt.get(S);z.__hasExternalTextures=!0,z.__hasExternalTextures&&(z.__autoAllocateDepthBuffer=B===void 0,z.__autoAllocateDepthBuffer||bt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),z.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(S,I){let B=Vt.get(S);B.__webglFramebuffer=I,B.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(S,I=0,B=0){w=S,R=I,A=B;let z=!0,N=null,ht=!1,_t=!1;if(S){let Pt=Vt.get(S);Pt.__useDefaultFramebuffer!==void 0?(mt.bindFramebuffer(U.FRAMEBUFFER,null),z=!1):Pt.__webglFramebuffer===void 0?E.setupRenderTarget(S):Pt.__hasExternalTextures&&E.rebindTextures(S,Vt.get(S.texture).__webglTexture,Vt.get(S.depthTexture).__webglTexture);let Wt=S.texture;(Wt.isData3DTexture||Wt.isDataArrayTexture||Wt.isCompressedArrayTexture)&&(_t=!0);let Nt=Vt.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Nt[I])?N=Nt[I][B]:N=Nt[I],ht=!0):Ut.isWebGL2&&S.samples>0&&E.useMultisampledRTT(S)===!1?N=Vt.get(S).__webglMultisampledFramebuffer:Array.isArray(Nt)?N=Nt[B]:N=Nt,T.copy(S.viewport),k.copy(S.scissor),Y=S.scissorTest}else T.copy(K).multiplyScalar(q).floor(),k.copy(tt).multiplyScalar(q).floor(),Y=ut;if(mt.bindFramebuffer(U.FRAMEBUFFER,N)&&Ut.drawBuffers&&z&&mt.drawBuffers(S,N),mt.viewport(T),mt.scissor(k),mt.setScissorTest(Y),ht){let Pt=Vt.get(S.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+I,Pt.__webglTexture,B)}else if(_t){let Pt=Vt.get(S.texture),Wt=I||0;U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,Pt.__webglTexture,B||0,Wt)}H=-1},this.readRenderTargetPixels=function(S,I,B,z,N,ht,_t){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let wt=Vt.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&_t!==void 0&&(wt=wt[_t]),wt){mt.bindFramebuffer(U.FRAMEBUFFER,wt);try{let Pt=S.texture,Wt=Pt.format,Nt=Pt.type;if(Wt!==Gn&&dt.convert(Wt)!==U.getParameter(U.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let Bt=Nt===po&&(bt.has("EXT_color_buffer_half_float")||Ut.isWebGL2&&bt.has("EXT_color_buffer_float"));if(Nt!==Gi&&dt.convert(Nt)!==U.getParameter(U.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Nt===zi&&(Ut.isWebGL2||bt.has("OES_texture_float")||bt.has("WEBGL_color_buffer_float")))&&!Bt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=S.width-z&&B>=0&&B<=S.height-N&&U.readPixels(I,B,z,N,dt.convert(Wt),dt.convert(Nt),ht)}finally{let Pt=w!==null?Vt.get(w).__webglFramebuffer:null;mt.bindFramebuffer(U.FRAMEBUFFER,Pt)}}},this.copyFramebufferToTexture=function(S,I,B=0){let z=Math.pow(2,-B),N=Math.floor(I.image.width*z),ht=Math.floor(I.image.height*z);E.setTexture2D(I,0),U.copyTexSubImage2D(U.TEXTURE_2D,B,0,0,S.x,S.y,N,ht),mt.unbindTexture()},this.copyTextureToTexture=function(S,I,B,z=0){let N=I.image.width,ht=I.image.height,_t=dt.convert(B.format),wt=dt.convert(B.type);E.setTexture2D(B,0),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,B.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,B.unpackAlignment),I.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,z,S.x,S.y,N,ht,_t,wt,I.image.data):I.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,z,S.x,S.y,I.mipmaps[0].width,I.mipmaps[0].height,_t,I.mipmaps[0].data):U.texSubImage2D(U.TEXTURE_2D,z,S.x,S.y,_t,wt,I.image),z===0&&B.generateMipmaps&&U.generateMipmap(U.TEXTURE_2D),mt.unbindTexture()},this.copyTextureToTexture3D=function(S,I,B,z,N=0){if(_.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let ht=S.max.x-S.min.x+1,_t=S.max.y-S.min.y+1,wt=S.max.z-S.min.z+1,Pt=dt.convert(z.format),Wt=dt.convert(z.type),Nt;if(z.isData3DTexture)E.setTexture3D(z,0),Nt=U.TEXTURE_3D;else if(z.isDataArrayTexture||z.isCompressedArrayTexture)E.setTexture2DArray(z,0),Nt=U.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,z.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,z.unpackAlignment);let Bt=U.getParameter(U.UNPACK_ROW_LENGTH),Te=U.getParameter(U.UNPACK_IMAGE_HEIGHT),_n=U.getParameter(U.UNPACK_SKIP_PIXELS),Oe=U.getParameter(U.UNPACK_SKIP_ROWS),ci=U.getParameter(U.UNPACK_SKIP_IMAGES),ye=B.isCompressedTexture?B.mipmaps[N]:B.image;U.pixelStorei(U.UNPACK_ROW_LENGTH,ye.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,ye.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,S.min.x),U.pixelStorei(U.UNPACK_SKIP_ROWS,S.min.y),U.pixelStorei(U.UNPACK_SKIP_IMAGES,S.min.z),B.isDataTexture||B.isData3DTexture?U.texSubImage3D(Nt,N,I.x,I.y,I.z,ht,_t,wt,Pt,Wt,ye.data):B.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),U.compressedTexSubImage3D(Nt,N,I.x,I.y,I.z,ht,_t,wt,Pt,ye.data)):U.texSubImage3D(Nt,N,I.x,I.y,I.z,ht,_t,wt,Pt,Wt,ye),U.pixelStorei(U.UNPACK_ROW_LENGTH,Bt),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Te),U.pixelStorei(U.UNPACK_SKIP_PIXELS,_n),U.pixelStorei(U.UNPACK_SKIP_ROWS,Oe),U.pixelStorei(U.UNPACK_SKIP_IMAGES,ci),N===0&&z.generateMipmaps&&U.generateMipmap(Nt),mt.unbindTexture()},this.initTexture=function(S){S.isCubeTexture?E.setTextureCube(S,0):S.isData3DTexture?E.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?E.setTexture2DArray(S,0):E.setTexture2D(S,0),mt.unbindTexture()},this.resetState=function(){R=0,A=0,w=null,mt.reset(),kt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return _i}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=t===Bh?"display-p3":"srgb",e.unpackColorSpace=oe.workingColorSpace===nc?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Pe?bs:xp}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===bs?Pe:yi}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}},yh=class extends Ts{};yh.prototype.isWebGL1Renderer=!0;var Za=class n{constructor(t,e=1,i=1e3){this.isFog=!0,this.name="",this.color=new St(t),this.near=e,this.far=i}clone(){return new n(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},As=class extends We{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}},vh=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=nh,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=xi()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[i+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=xi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=xi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},en=new P,Ja=class n{constructor(t,e,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)en.fromBufferAttribute(this,e),en.applyMatrix4(t),this.setXYZ(e,en.x,en.y,en.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)en.fromBufferAttribute(this,e),en.applyNormalMatrix(t),this.setXYZ(e,en.x,en.y,en.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)en.fromBufferAttribute(this,e),en.transformDirection(t),this.setXYZ(e,en.x,en.y,en.z);return this}setX(t,e){return this.normalized&&(e=re(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=re(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=re(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=re(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=jn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=jn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=jn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=jn(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=re(e,this.array),i=re(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=re(e,this.array),i=re(i,this.array),s=re(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=re(e,this.array),i=re(i,this.array),s=re(s,this.array),r=re(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let i=0;i<this.count;i++){let s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new vn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new n(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let i=0;i<this.count;i++){let s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},qi=class extends ti{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new St(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},fr,ro=new P,dr=new P,pr=new P,mr=new $t,oo=new $t,Pp=new Ae,xa=new P,ao=new P,ya=new P,jd=new $t,Yl=new $t,Qd=new $t,Rs=class extends We{constructor(t=new qi){if(super(),this.isSprite=!0,this.type="Sprite",fr===void 0){fr=new Le;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new vh(e,5);fr.setIndex([0,1,2,0,2,3]),fr.setAttribute("position",new Ja(i,3,0,!1)),fr.setAttribute("uv",new Ja(i,2,3,!1))}this.geometry=fr,this.material=t,this.center=new $t(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),dr.setFromMatrixScale(this.matrixWorld),Pp.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),pr.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&dr.multiplyScalar(-pr.z);let i=this.material.rotation,s,r;i!==0&&(r=Math.cos(i),s=Math.sin(i));let a=this.center;va(xa.set(-.5,-.5,0),pr,a,dr,s,r),va(ao.set(.5,-.5,0),pr,a,dr,s,r),va(ya.set(.5,.5,0),pr,a,dr,s,r),jd.set(0,0),Yl.set(1,0),Qd.set(1,1);let o=t.ray.intersectTriangle(xa,ao,ya,!1,ro);if(o===null&&(va(ao.set(-.5,.5,0),pr,a,dr,s,r),Yl.set(0,1),o=t.ray.intersectTriangle(xa,ya,ao,!1,ro),o===null))return;let c=t.ray.origin.distanceTo(ro);c<t.near||c>t.far||e.push({distance:c,point:ro.clone(),uv:ki.getInterpolation(ro,xa,ao,ya,jd,Yl,Qd,new $t),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}};function va(n,t,e,i,s,r){mr.subVectors(n,e).addScalar(.5).multiply(i),s!==void 0?(oo.x=r*mr.x-s*mr.y,oo.y=s*mr.x+r*mr.y):oo.copy(mr),n.copy(t),n.x+=oo.x,n.y+=oo.y,n.applyMatrix4(Pp)}var yo=class extends ti{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new St(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},tp=new P,ep=new P,np=new Ae,$l=new go,Ma=new ws,Mh=class extends We{constructor(t=new Le,e=new yo){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,i=[0];for(let s=1,r=e.count;s<r;s++)tp.fromBufferAttribute(e,s-1),ep.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=tp.distanceTo(ep);t.setAttribute("lineDistance",new ce(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let i=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ma.copy(i.boundingSphere),Ma.applyMatrix4(s),Ma.radius+=r,t.ray.intersectsSphere(Ma)===!1)return;np.copy(s).invert(),$l.copy(t.ray).applyMatrix4(np);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=new P,u=new P,f=new P,h=new P,p=this.isLineSegments?2:1,g=i.index,m=i.attributes.position;if(g!==null){let d=Math.max(0,a.start),M=Math.min(g.count,a.start+a.count);for(let _=d,b=M-1;_<b;_+=p){let R=g.getX(_),A=g.getX(_+1);if(l.fromBufferAttribute(m,R),u.fromBufferAttribute(m,A),$l.distanceSqToSegment(l,u,h,f)>c)continue;h.applyMatrix4(this.matrixWorld);let H=t.ray.origin.distanceTo(h);H<t.near||H>t.far||e.push({distance:H,point:f.clone().applyMatrix4(this.matrixWorld),index:_,face:null,faceIndex:null,object:this})}}else{let d=Math.max(0,a.start),M=Math.min(m.count,a.start+a.count);for(let _=d,b=M-1;_<b;_+=p){if(l.fromBufferAttribute(m,_),u.fromBufferAttribute(m,_+1),$l.distanceSqToSegment(l,u,h,f)>c)continue;h.applyMatrix4(this.matrixWorld);let A=t.ray.origin.distanceTo(h);A<t.near||A>t.far||e.push({distance:A,point:f.clone().applyMatrix4(this.matrixWorld),index:_,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}},ip=new P,sp=new P,Ka=class extends Mh{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,i=[];for(let s=0,r=e.count;s<r;s+=2)ip.fromBufferAttribute(e,s),sp.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+ip.distanceTo(sp);t.setAttribute("lineDistance",new ce(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var vo=class extends ti{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new St(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},rp=new Ae,Sh=new go,Sa=new ws,ba=new P,ja=class extends We{constructor(t=new Le,e=new vo){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let i=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Sa.copy(i.boundingSphere),Sa.applyMatrix4(s),Sa.radius+=r,t.ray.intersectsSphere(Sa)===!1)return;rp.copy(s).invert(),Sh.copy(t.ray).applyMatrix4(rp);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=i.index,f=i.attributes.position;if(l!==null){let h=Math.max(0,a.start),p=Math.min(l.count,a.start+a.count);for(let g=h,x=p;g<x;g++){let m=l.getX(g);ba.fromBufferAttribute(f,m),op(ba,m,c,s,t,e,this)}}else{let h=Math.max(0,a.start),p=Math.min(f.count,a.start+a.count);for(let g=h,x=p;g<x;g++)ba.fromBufferAttribute(f,g),op(ba,g,c,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function op(n,t,e,i,s,r,a){let o=Sh.distanceSqToPoint(n);if(o<e){let c=new P;Sh.closestPointToPoint(n,c),c.applyMatrix4(i);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:t,face:null,object:a})}}var Tr=class extends An{constructor(t,e,i,s,r,a,o,c,l){super(t,e,i,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Ea=new P,wa=new P,Zl=new P,Ta=new ki,Qa=class extends Le{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){let s=Math.pow(10,4),r=Math.cos(yr*e),a=t.getIndex(),o=t.getAttribute("position"),c=a?a.count:o.count,l=[0,0,0],u=["a","b","c"],f=new Array(3),h={},p=[];for(let g=0;g<c;g+=3){a?(l[0]=a.getX(g),l[1]=a.getX(g+1),l[2]=a.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);let{a:x,b:m,c:d}=Ta;if(x.fromBufferAttribute(o,l[0]),m.fromBufferAttribute(o,l[1]),d.fromBufferAttribute(o,l[2]),Ta.getNormal(Zl),f[0]=`${Math.round(x.x*s)},${Math.round(x.y*s)},${Math.round(x.z*s)}`,f[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,f[2]=`${Math.round(d.x*s)},${Math.round(d.y*s)},${Math.round(d.z*s)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let M=0;M<3;M++){let _=(M+1)%3,b=f[M],R=f[_],A=Ta[u[M]],w=Ta[u[_]],H=`${b}_${R}`,y=`${R}_${b}`;y in h&&h[y]?(Zl.dot(h[y].normal)<=r&&(p.push(A.x,A.y,A.z),p.push(w.x,w.y,w.z)),h[y]=null):H in h||(h[H]={index0:l[M],index1:l[_],normal:Zl.clone()})}}for(let g in h)if(h[g]){let{index0:x,index1:m}=h[g];Ea.fromBufferAttribute(o,x),wa.fromBufferAttribute(o,m),p.push(Ea.x,Ea.y,Ea.z),p.push(wa.x,wa.y,wa.z)}this.setAttribute("position",new ce(p,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}};var fn=class extends ti{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new St(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new St(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=yp,this.normalScale=new $t(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Oh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};function Aa(n,t,e){return!n||!e&&n.constructor===t?n:typeof t.BYTES_PER_ELEMENT=="number"?new t(n):Array.prototype.slice.call(n)}function SS(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}var Ar=class{constructor(t,e,i,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(i),this.sampleValues=e,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,i=this._cachedIndex,s=e[i],r=e[i-1];n:{t:{let a;e:{i:if(!(t<s)){for(let o=i+2;;){if(s===void 0){if(t<r)break i;return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(r=s,s=e[++i],t<s)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(i=2,r=o);for(let c=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===c)break;if(s=r,r=e[--i-1],t>=r)break t}a=i,i=0;break e}break n}for(;i<a;){let o=i+a>>>1;t<e[o]?a=o:i=o+1}if(s=e[i],r=e[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)e[a]=i[r+a];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},bh=class extends Ar{constructor(t,e,i,s){super(t,e,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ld,endingEnd:ld}}intervalChanged_(t,e,i){let s=this.parameterPositions,r=t-2,a=t+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case hd:r=t,o=2*e-i;break;case ud:r=s.length-2,o=e+s[r]-s[r+1];break;default:r=t,o=i}if(c===void 0)switch(this.getSettings_().endingEnd){case hd:a=t,c=2*i-e;break;case ud:a=1,c=i+s[1]-s[0];break;default:a=t-1,c=e}let l=(i-e)*.5,u=this.valueSize;this._weightPrev=l/(e-o),this._weightNext=l/(c-i),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(t,e,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,u=this._offsetPrev,f=this._offsetNext,h=this._weightPrev,p=this._weightNext,g=(i-e)/(s-e),x=g*g,m=x*g,d=-h*m+2*h*x-h*g,M=(1+h)*m+(-1.5-2*h)*x+(-.5+h)*g+1,_=(-1-p)*m+(1.5+p)*x+.5*g,b=p*m-p*x;for(let R=0;R!==o;++R)r[R]=d*a[u+R]+M*a[l+R]+_*a[c+R]+b*a[f+R];return r}},Eh=class extends Ar{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,u=(i-e)/(s-e),f=1-u;for(let h=0;h!==o;++h)r[h]=a[l+h]*f+a[c+h]*u;return r}},wh=class extends Ar{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Wn=class{constructor(t,e,i,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Aa(e,this.TimeBufferType),this.values=Aa(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,i;if(e.toJSON!==this.toJSON)i=e.toJSON(t);else{i={name:t.name,times:Aa(t.times,Array),values:Aa(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(i.interpolation=s)}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new wh(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Eh(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new bh(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Ca:e=this.InterpolantFactoryMethodDiscrete;break;case Pa:e=this.InterpolantFactoryMethodLinear;break;case El:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ca;case this.InterpolantFactoryMethodLinear:return Pa;case this.InterpolantFactoryMethodSmooth:return El}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]*=t}return this}trim(t,e){let i=this.times,s=i.length,r=0,a=s-1;for(;r!==s&&i[r]<t;)++r;for(;a!==-1&&i[a]>e;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=i.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let i=this.times,s=this.values,r=i.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let c=i[o];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,c),t=!1;break}if(a!==null&&a>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,c,a),t=!1;break}a=c}if(s!==void 0&&SS(s))for(let o=0,c=s.length;o!==c;++o){let l=s[o];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===El,r=t.length-1,a=1;for(let o=1;o<r;++o){let c=!1,l=t[o],u=t[o+1];if(l!==u&&(o!==1||l!==t[0]))if(s)c=!0;else{let f=o*i,h=f-i,p=f+i;for(let g=0;g!==i;++g){let x=e[f+g];if(x!==e[h+g]||x!==e[p+g]){c=!0;break}}}if(c){if(o!==a){t[a]=t[o];let f=o*i,h=a*i;for(let p=0;p!==i;++p)e[h+p]=e[f+p]}++a}}if(r>0){t[a]=t[r];for(let o=r*i,c=a*i,l=0;l!==i;++l)e[c+l]=e[o+l];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*i)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),i=this.constructor,s=new i(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};Wn.prototype.TimeBufferType=Float32Array;Wn.prototype.ValueBufferType=Float32Array;Wn.prototype.DefaultInterpolation=Pa;var Cs=class extends Wn{};Cs.prototype.ValueTypeName="bool";Cs.prototype.ValueBufferType=Array;Cs.prototype.DefaultInterpolation=Ca;Cs.prototype.InterpolantFactoryMethodLinear=void 0;Cs.prototype.InterpolantFactoryMethodSmooth=void 0;var Th=class extends Wn{};Th.prototype.ValueTypeName="color";var Ah=class extends Wn{};Ah.prototype.ValueTypeName="number";var Rh=class extends Ar{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(i-e)/(s-e),l=t*o;for(let u=l+o;l!==u;l+=4)Xi.slerpFlat(r,0,a,l-o,a,l,c);return r}},Mo=class extends Wn{InterpolantFactoryMethodLinear(t){return new Rh(this.times,this.values,this.getValueSize(),t)}};Mo.prototype.ValueTypeName="quaternion";Mo.prototype.DefaultInterpolation=Pa;Mo.prototype.InterpolantFactoryMethodSmooth=void 0;var Ps=class extends Wn{};Ps.prototype.ValueTypeName="string";Ps.prototype.ValueBufferType=Array;Ps.prototype.DefaultInterpolation=Ca;Ps.prototype.InterpolantFactoryMethodLinear=void 0;Ps.prototype.InterpolantFactoryMethodSmooth=void 0;var Ch=class extends Wn{};Ch.prototype.ValueTypeName="vector";var Ph=class{constructor(t,e,i){let s=this,r=!1,a=0,o=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=i,this.itemStart=function(u){o++,r===!1&&s.onStart!==void 0&&s.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,s.onProgress!==void 0&&s.onProgress(u,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,f){return l.push(u,f),this},this.removeHandler=function(u){let f=l.indexOf(u);return f!==-1&&l.splice(f,2),this},this.getHandler=function(u){for(let f=0,h=l.length;f<h;f+=2){let p=l[f],g=l[f+1];if(p.global&&(p.lastIndex=0),p.test(u))return g}return null}}},bS=new Ph,Lh=class{constructor(t){this.manager=t!==void 0?t:bS,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let i=this;return new Promise(function(s,r){i.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};Lh.DEFAULT_MATERIAL_NAME="__DEFAULT";var tc=class extends We{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new St(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}};var Jl=new Ae,ap=new P,cp=new P,Ih=class{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new $t(512,512),this.map=null,this.mapPass=null,this.matrix=new Ae,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new _o,this._frameExtents=new $t(1,1),this._viewportCount=1,this._viewports=[new ke(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,i=this.matrix;ap.setFromMatrixPosition(t.matrixWorld),e.position.copy(ap),cp.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(cp),e.updateMatrixWorld(),Jl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Jl),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Jl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var Dh=class extends Ih{constructor(){super(new qa(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Yi=class extends tc{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(We.DEFAULT_UP),this.updateMatrix(),this.target=new We,this.shadow=new Dh}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}},$i=class extends tc{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}};var Vh="\\[\\]\\.:\\/",ES=new RegExp("["+Vh+"]","g"),Gh="[^"+Vh+"]",wS="[^"+Vh.replace("\\.","")+"]",TS=/((?:WC+[\/:])*)/.source.replace("WC",Gh),AS=/(WCOD+)?/.source.replace("WCOD",wS),RS=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Gh),CS=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Gh),PS=new RegExp("^"+TS+AS+RS+CS+"$"),LS=["material","materials","bones","map"],Uh=class{constructor(t,e,i){let s=i||ge.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(t,e)}setValue(t,e){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].unbind()}},ge=class n{constructor(t,e,i){this.path=e,this.parsedPath=i||n.parseTrackName(e),this.node=n.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,i){return t&&t.isAnimationObjectGroup?new n.Composite(t,e,i):new n(t,e,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(ES,"")}static parseTrackName(t){let e=PS.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);LS.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(e);if(i!==void 0)return i}if(t.children){let i=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let c=i(o.children);if(c)return c}return null},s=i(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)t[e++]=i[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,i=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=n.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let l=e.objectIndex;switch(i){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===l){l=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let a=t[s];if(a===void 0){let l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ge.Composite=Uh;ge.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ge.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ge.prototype.GetterByBindingType=[ge.prototype._getValue_direct,ge.prototype._getValue_array,ge.prototype._getValue_arrayElement,ge.prototype._getValue_toArray];ge.prototype.SetterByBindingTypeAndVersioning=[[ge.prototype._setValue_direct,ge.prototype._setValue_direct_setNeedsUpdate,ge.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ge.prototype._setValue_array,ge.prototype._setValue_array_setNeedsUpdate,ge.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ge.prototype._setValue_arrayElement,ge.prototype._setValue_arrayElement_setNeedsUpdate,ge.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ge.prototype._setValue_fromArray,ge.prototype._setValue_fromArray_setNeedsUpdate,ge.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var k1=new Float32Array(1);typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"160"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="160");var pt=n=>document.getElementById(n),ni=n=>String(n).replace(/[&<>"']/g,t=>`&#${t.charCodeAt(0)};`);function dn(n,t={},...e){let i=Object.assign(document.createElement(n),t);return i.append(...e),i}function Mn(n){let t=new Tr(n);return t.magFilter=t.minFilter=Ge,t.generateMipmaps=!1,t.colorSpace=Pe,t}function Lp(){let t=document.createElement("canvas");t.width=t.height=64;let e=t.getContext("2d"),i=e.createImageData(t.width,t.height),s=On(20261006),r=(_,b)=>[_[0]*b,_[1]*b,_[2]*b,_[3]??255],a=(_,b)=>r(_,1-b+s()*b*2),o=(_,b)=>{let R=_%4*16,A=Math.floor(_/4)*16;for(let w=0;w<16;w++)for(let H=0;H<16;H++){let y=b(H,w),T=((A+w)*t.width+R+H)*4;i.data[T]=y[0],i.data[T+1]=y[1],i.data[T+2]=y[2],i.data[T+3]=y[3]??255}},c=[96,158,54],l=[134,96,67],u=[126,126,128],f=[102,80,48],h=[182,144,90],p=[152,70,56],g=(_,b)=>_===0||b===0||_===15||b===15,x=()=>{let _=s();return _<.08?a(r(l,.7),.1):_<.14?a(r(l,1.18),.1):a(l,.1)};o(Mt.grassTop,()=>{let _=a(c,.16);return s()<.12?r(_,.8):_});let m=Array.from({length:16},()=>2+Math.floor(s()*3));o(Mt.grassSide,(_,b)=>b<m[_]?a(c,.14):b===m[_]&&s()<.5?a(r(c,.75),.1):x()),o(Mt.dirt,x),o(Mt.stone,()=>{let _=s();return _<.12?a(r(u,.8),.05):_<.18?a(r(u,1.14),.05):a(u,.07)}),o(Mt.sand,()=>s()<.1?a([200,186,140],.05):a([222,210,160],.05));let d=Array.from({length:16},()=>.82+s()*.28);o(Mt.logSide,_=>{let b=a(r(f,d[_]),.08);return _%5===2&&s()<.6?r(b,.75):b}),o(Mt.logTop,(_,b)=>{let R=Math.max(Math.abs(_-7.5),Math.abs(b-7.5));return R>6.5?a(f,.08):a(Math.floor(R)%2?[176,140,88]:[150,116,70],.06)}),o(Mt.leaves,()=>{if(s()<.2)return[0,0,0,0];let _=a([58,128,40],.2);return s()<.2?r(_,.72):_}),o(Mt.planks,(_,b)=>{let R=b>>2;return b%4===3?a(r(h,.6),.05):_===(R%2?4:12)?a(r(h,.7),.05):a(r(h,.92+R%2*.08),.06)}),o(Mt.brick,(_,b)=>{let R=(b>>2)%2?4:0;return b%4===3||(_+R)%8===7?a([184,178,168],.05):a(p,.12)}),o(Mt.glass,(_,b)=>g(_,b)?[214,234,240,255]:_-b===4&&_>=6&&_<=10||_-b===7&&_>=10&&_<=12?[238,246,250,255]:[0,0,0,0]),o(Mt.lamp,(_,b)=>g(_,b)?a([176,120,50],.1):s()<.25?a([255,242,186],.04):a([250,204,110],.1)),o(Mt.water,()=>s()<.1?[96,146,232,175]:[...a([50,96,204],.08).slice(0,3),175]);let M=_=>_<4||_>14?0:5.6-5*((_-4)/10)**1.6;return o(Mt.strawberry,(_,b)=>{let R=Math.abs(_+.5-8),A=[.6,.6,2.5,5,4][b]??0;if(R<A)return b<2?[58,110,38,255]:a([86,160,58],.12);let w=M(b);return R>=w?[0,0,0,0]:R>=w-1||b===14?a([140,22,34],.05):(_*3+b*2)%7===0?[248,222,120,255]:a([218,40,54],.08)}),e.putImageData(i,0,0),t}function Ip(n,t){let e=document.createElement("canvas");e.width=e.height=16;let i=t%4*16,s=Math.floor(t/4)*16;return e.getContext("2d").drawImage(n,i,s,16,16,0,0,16,16),e}var So=10;function Dp(){let t=On(4242),e=[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]],i=new Float32Array(256).fill(1/0),s=new Uint8Array(256),r=[];function a(h,p,g,x,m,d){let M=g;for(let _=1;_<=m;_++){if(t()<.4?M=(g+(t()<.5?1:7))%8:t()<.5&&(M=g),h+=e[M][0],p+=e[M][1],h<0||p<0||h>=16||p>=16)return;let b=h+16*p,R=x+_;if(R<i[b]&&(i[b]===1/0&&r.push(b),i[b]=R,s[b]=d),d<2&&t()<.16){let A=t()<.5?2:6;a(h,p,(g+A+(t()<.5?0:t()<.5?1:7))%8,R,3+Math.floor(t()*4),d+1)}}}let o=7+Math.floor(t()*2),c=7+Math.floor(t()*2);i[o+16*c]=0,r.push(o+16*c);let l=Math.floor(t()*8);for(let h of[0,2,3,5,6])a(o,c,(l+h)%8,0,12,0);let u=Math.max(...r.map(h=>i[h]))+1;for(let h=0;h<12;h++){let p=r[Math.floor(t()*r.length)];a(p%16,Math.floor(p/16),Math.floor(t()*8),u+t()*6,2+Math.floor(t()*3),2)}let f=[...r].sort((h,p)=>i[h]-i[p]);return Array.from({length:So},(h,p)=>{let g=document.createElement("canvas");g.width=g.height=16;let x=g.getContext("2d"),m=x.createImageData(16,16),d=Math.ceil(f.length*((p+1)/So)**1.4);for(let M of f.slice(0,d))m.data[M*4+3]=s[M]<2?125:85;return x.putImageData(m,0,0),g})}function Up(){let t=document.createElement("canvas");t.width=t.height=64;let e=t.getContext("2d"),i=e.createImageData(64,64);for(let s=0;s<64;s++)for(let r=0;r<64;r++){let a=li(99,r/8,s/8,8)*.7+li(98,r/4,s/4,16)*.3,o=(s*64+r)*4;i.data.fill(255,o,o+3),i.data[o+3]=a>.58?225:0}return e.putImageData(i,0,0),t}function Wh(n,t){let e=document.createElement("canvas");e.width=e.height=32;let i=e.getContext("2d");return i.fillStyle=t,i.fillRect(4,4,24,24),i.fillStyle=n,i.fillRect(8,8,16,16),Mn(e)}var Si=pt("view"),Ze=new Ts({canvas:Si,antialias:!0});Ze.setPixelRatio(Math.min(devicePixelRatio,fs?1.5:2));Ze.shadowMap.enabled=!0;Ze.shadowMap.type=Nh;Ze.info.autoReset=!1;var Qt=new As;Qt.background=new St(9357823);Qt.fog=new Za(9357823,jr(Dt.distance)*.5,jr(Dt.distance)-4);var Ee=new ze(Dt.fov,1,.05,450);Ee.rotation.order="YXZ";Fn("fov",n=>{Ee.fov=n,Ee.updateProjectionMatrix()});var sc=new As,Xh=new ze(70,1,.01,10),Np=new Yi(16777215,Math.PI*.55);Np.position.set(-.4,1,.6);sc.add(Np,new $i(16777215,Math.PI*.55));function Op(){Ze.setSize(innerWidth,innerHeight,!1),Ee.aspect=Xh.aspect=innerWidth/innerHeight,Ee.updateProjectionMatrix(),Xh.updateProjectionMatrix()}addEventListener("resize",Op);Op();function Fp(n){Ze.info.reset(),Ze.render(Qt,Ee),n&&(Ze.autoClear=!1,Ze.clearDepth(),Ze.render(sc,Xh),Ze.autoClear=!0)}var bo=Lp(),Cr=Mn(bo),rc={uDaylight:{value:1},uSkyTint:{value:new St(.5,.54,.62)},uTorch:{value:new St(1,.82,.58)}};function Bp(n){return n.onBeforeCompile=t=>{Object.assign(t.uniforms,rc),t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
attribute vec3 aLight;
varying vec3 vLight;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vLight = aLight;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vLight;
uniform float uDaylight;
uniform vec3 uSkyTint;
uniform vec3 uTorch;`).replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
        float skyB = pow(0.8, (1.0 - vLight.x) * 15.0);
        float blkB = pow(0.8, (1.0 - vLight.y) * 15.0);
        vec3 amb = max(uSkyTint * skyB * uDaylight, uTorch * blkB);
        amb = max(amb, vec3(0.035));
        reflectedLight.indirectDiffuse = diffuseColor.rgb * amb * vLight.z;
        reflectedLight.directDiffuse *= smoothstep(0.7, 1.0, vLight.x) * mix(1.0, vLight.z, 0.5);`)},n}var qh=Bp(new fn({map:Cr,alphaTest:.5}));qh.shadowSide=Qn;var zp=Bp(new fn({map:Cr,transparent:!0,depthWrite:!1,side:rn}));var Eo=new URLSearchParams(location.search).get("world")||"main",Yh=new URL(`ws?world=${encodeURIComponent(Eo)}`,location.href);Yh.protocol=Yh.protocol==="https:"?"wss:":"ws:";var bi=null,kp=0,$h=new Map;function Kt(n,t){if($h.has(n))throw new Error(`Two handlers for "${n}" messages`);$h.set(n,t)}var Zh=()=>bi?.readyState===WebSocket.OPEN,Pr=null;setInterval(()=>ee({type:"ping",t:performance.now()}),2e3);Kt("pong",n=>Pr=Math.round(performance.now()-n.t));function ee(n){Zh()&&bi.send(JSON.stringify(n))}function Jh(n){bi=new WebSocket(Yh),bi.onmessage=t=>{let e=JSON.parse(t.data);$h.get(e.type)?.(e)},bi.onclose=()=>{Pr=null,n(),kp=setTimeout(()=>Jh(n),1e3)}}function Hp(){clearTimeout(kp),bi&&(bi.onclose=null,bi.close(),bi=null,Pr=null)}var ct={world:null,self:null,spawned:!1,spawnPending:!1,mode:"survival"},Xn=()=>ct.mode==="creative",D={pos:new P(4096/2,96,4096/2),vel:new P,yaw:0,pitch:0,eye:1.62,onGround:!1,flying:!1,sprinting:!1,sneaking:!1,stepDist:0,fallDist:0,knock:{x:0,z:0}},Sn=new P,At={hp:20,dead:!1,hurtAt:-1e9,deadAt:0,roll:0,regenAt:0,voidSent:!1},we={keys:new Set,move:{x:0,z:0},sprintArmed:!1},Re=(n,t,e)=>ct.world?ct.world.getBlock(n,t,e):-1,wo=(n,t,e)=>{let i=Re(n,t,e);return i<0||It[i].solid},Ji=n=>n.admin?`\u2605${n.name}`:n.name;var Gp=0,Wp=0,eu=()=>Date.now()+Gp,IS=()=>eu()+Wp;function nu(n){Gp=n.now-Date.now(),Wp=n.timeOffset}Kt("time",nu);var DS=!0,iu=1,fc=0,oc=80,on=new Yi(16777215,Math.PI*.5);on.castShadow=Dt.shadows;var Ls=Qr.filter(n=>n<=Ze.capabilities.maxTextureSize);function Xp(n){n=Ls.includes(n)?n:Ls[Ls.length-1],on.shadow.mapSize.set(n,n),on.shadow.map?.dispose(),on.shadow.map=null}Xp(Dt.shadowRes);Fn("shadowRes",Xp);Object.assign(on.shadow.camera,{left:-oc,right:oc,top:oc,bottom:-oc,near:1,far:450});on.shadow.camera.updateProjectionMatrix();on.shadow.bias=-6e-4;on.shadow.normalBias=.03;Qt.add(on,on.target);Fn("shadows",n=>on.castShadow=n);var qp=new $i(16777215,Math.PI*.5);Qt.add(qp);var US=new St(9357823),NS=new St(461596),OS=new St(15899234),FS=new St(.5,.54,.62),BS=new St(.35,.42,.7),zS=new St(.9,.62,.45),Vp=new St(1920911),Kh=new St,tu=400,lc=new Rs(new qi({map:Wh("#fffbe0","#ffe27a"),fog:!1,depthWrite:!1}));lc.scale.setScalar(58);var hc=new Rs(new qi({map:Wh("#f4f6ff","#c9cfe0"),fog:!1,depthWrite:!1}));hc.scale.setScalar(42);Qt.add(lc,hc);var Yp=[],jh=On(7);for(let n=0;n<700;n++){let t=new P(jh()*2-1,jh()*2-1,jh()*2-1).normalize().multiplyScalar(tu);Yp.push(t.x,t.y,t.z)}var $p=new Le;$p.setAttribute("position",new ce(Yp,3));var cc=new ja($p,new vo({color:16777215,size:2,sizeAttenuation:!1,transparent:!0,fog:!1,depthWrite:!1}));Qt.add(cc);var Lr=256,Ir=Mn(Up());Ir.wrapS=Ir.wrapT=uo;Ir.repeat.set(2,2);var uc=new ae(new xo(Lr*2,Lr*2),new ei({map:Ir,transparent:!0,opacity:.85,depthWrite:!1,side:rn}));uc.rotation.x=-Math.PI/2;Qt.add(uc);var ac=new P,Qh=new P;function Zp(n){let t=uf(IS()),e=t*Math.PI*2,i=Math.sin(e),s=kh.smoothstep(i,-.15,.2),r=Math.max(0,1-Math.abs(i)/.35);DS=s>.5,iu=s,fc=t;let a=D.pos;Qh.set(Math.round(a.x/4)*4,Math.round(a.y/4)*4,Math.round(a.z/4)*4),ac.set(Math.cos(e),i,.35).normalize(),on.position.copy(Qh).addScaledVector(ac,200),on.target.position.copy(Qh),on.intensity=Math.PI*.8*kh.smoothstep(i,-.02,.25),on.color.setRGB(1,.8+.2*s,.62+.38*s),qp.intensity=Math.PI*(.18+.5*s),Kh.copy(NS).lerp(US,s).lerp(OS,r*.7),rc.uDaylight.value=.16+.84*s,rc.uSkyTint.value.copy(BS).lerp(FS,s).lerp(zS,r*.45);let o=Ee.position,c=Re(Math.floor(o.x),Math.floor(o.y),Math.floor(o.z))===11;Qt.background.copy(c?Vp:Kh),Qt.fog.color.copy(c?Vp:Kh);let l=jr(Dt.distance);Qt.fog.near=c?0:l*.5,Qt.fog.far=c?16:l-4,lc.position.copy(o).addScaledVector(ac,tu),hc.position.copy(o).addScaledVector(ac,-tu),lc.visible=i>-.12,hc.visible=i<.12,cc.position.copy(o),cc.rotation.z=e,cc.material.opacity=1-s,uc.position.set(Math.round(a.x/Lr)*Lr,110,Math.round(a.z/Lr)*Lr),uc.material.color.setScalar(.25+.75*s),Ir.offset.x=(Ir.offset.x+n*.004)%1}var Jp=(n,t,e)=>ct.world?ct.world.getLight(Math.floor(n),Math.floor(t),Math.floor(e)):[15,0];function Ki(n,t,e){let[i,s]=Jp(n,t,e);return Math.max(Math.pow(.8,15-i),Math.pow(.8,15-s)*.68/(.18+.5*iu),.1)}function Kp(n,t,e){let[i,s]=Jp(n,t,e);return Math.max(Math.pow(.8,15-i)*(.25+.75*iu),Math.pow(.8,15-s),.08)}var kS=4.317,HS=5.612,VS=1.31,GS=10.92,WS=21.6,XS=7.5,jp=9,qS=28,YS=7.5,an=.3,su=1.8,ru=1.62,ou=1.27,Dr=1/.6;function dc(n){let t=Math.floor(n.x-an),e=Math.floor(n.x+an-1e-6),i=Math.floor(n.y),s=Math.floor(n.y+su-1e-6),r=Math.floor(n.z-an),a=Math.floor(n.z+an-1e-6);for(let o=t;o<=e;o++)for(let c=i;c<=s;c++)for(let l=r;l<=a;l++)if(wo(o,c,l))return!0;return!1}function $S(n){let t=Math.floor(n.y-.05);for(let e=Math.floor(n.x-an);e<=Math.floor(n.x+an-1e-6);e++)for(let i=Math.floor(n.z-an);i<=Math.floor(n.z+an-1e-6);i++)if(wo(e,t,i))return!0;return!1}function To(n){let t=Math.floor(n.y-.2),e=Re(Math.floor(n.x),t,Math.floor(n.z));if(e>0&&It[e].solid)return e;for(let[i,s]of[[-1,-1],[1,-1],[-1,1],[1,1]])if(e=Re(Math.floor(n.x+i*an),t,Math.floor(n.z+s*an)),e>0&&It[e].solid)return e;return 0}function Is(n=new P){let t=Math.cos(D.pitch);return n.set(-Math.sin(D.yaw)*t,Math.sin(D.pitch),-Math.cos(D.yaw)*t)}function Ds(){let[n,t]=mf(ct.world.seed);D.pos.set(n,96,t),D.vel.set(0,0,0),D.flying=!1,D.sprinting=!1,D.fallDist=0,D.knock.x=D.knock.z=0,At.voidSent=!1,ct.spawnPending=!0}function ZS(){let n=Math.floor(D.pos.x),t=Math.floor(D.pos.z);if(!ct.world.get(n>>4,t>>4)?.ready)return;let e=95;for(;e>0&&!It[Re(n,e-1,t)].solid;)e--;D.pos.y=e,ct.spawnPending=!1}function em(n){let t=D.pos;if(Sn.set(t.x,t.y+D.eye,t.z),ct.spawnPending)return ZS();if(!ct.world.get(Math.floor(t.x)>>4,Math.floor(t.z)>>4)?.ready)return;let{keys:e}=we,i=e.has("ShiftLeft")||e.has("ShiftRight"),s=we.move.x,r=we.move.z;e.has("KeyW")&&(r-=1),e.has("KeyS")&&(r+=1),e.has("KeyA")&&(s-=1),e.has("KeyD")&&(s+=1);let a=r<-.5,o=!D.flying&&Re(Math.floor(t.x),Math.floor(t.y+.4),Math.floor(t.z))===11,c=i&&!D.flying&&!o;D.sneaking=c,a&&(e.has("ControlLeft")||e.has("ControlRight")||we.sprintArmed)&&(D.sprinting=!0,we.sprintArmed=!1),(!a||c)&&(D.sprinting=!1);let l=D.flying?D.sprinting?WS:GS:c?VS:D.sprinting?HS:kS;o&&(l*=.55);let u=Math.max(1,Math.hypot(s,r)),f=Math.sin(D.yaw),h=Math.cos(D.yaw);D.vel.x=(s*h+r*f)/u*l+D.knock.x,D.vel.z=(-s*f+r*h)/u*l+D.knock.z;let p=Math.exp(-n*(D.onGround?10:1.5));if(D.knock.x*=p,D.knock.z*=p,D.flying){let w=((e.has("Space")?1:0)-(i?1:0))*XS;D.vel.y+=(w-D.vel.y)*Math.min(1,n*10)}else o?(D.vel.y=Math.max(D.vel.y-10*n,-3),e.has("Space")&&(D.vel.y=Math.min(D.vel.y+30*n,4))):(D.vel.y=Math.max(D.vel.y-qS*n,-40),e.has("Space")&&D.onGround&&(D.vel.y=jp));let g=D.onGround,x=-D.vel.y,m=D.vel.x,d=D.vel.z,M=t.clone(),_=JS(t,n,c&&g),b=Math.hypot(m,d);if(_&&Dt.autoJump&&D.onGround&&!c&&!D.flying&&!o&&b>1){let w=t.clone();w.x+=m*.35/b,w.z+=d*.35/b,w.y+=1.01,dc(w)||(D.vel.y=jp)}let R=o||Re(Math.floor(t.x),Math.floor(t.y),Math.floor(t.z))===11;if(_&&R&&!D.flying&&b>.1){let w=t.clone();w.x+=m*.35/b,w.z+=d*.35/b,w.y+=1.01,dc(w)||(D.vel.y=Math.max(D.vel.y,YS))}KS(M,g,o),jS(M,g,x,c);let A=At.dead?.3:c?ou:ru;D.eye+=(A-D.eye)*Math.min(1,n*(At.dead?6:15)),Sn.set(t.x,t.y+D.eye,t.z)}function JS(n,t,e){let i=!1;D.onGround=!1;for(let s of["x","y","z"]){let r=n[s];if(n[s]+=D.vel[s]*t,s!=="y"&&e&&!$S(n)){n[s]=r;continue}dc(n)&&(n[s]=r,s!=="y"?i=!0:D.vel.y<0&&(D.onGround=!0,D.flying=!1,n.y=Math.floor(r),dc(n)&&(n.y=r)),D.vel[s]=0)}return i}function KS(n,t,e){let i=D.pos;if(D.flying||e||At.dead?D.fallDist=0:i.y<n.y&&(D.fallDist+=n.y-i.y),D.onGround){let s=Math.ceil(D.fallDist-3);!t&&s>0&&ee({type:"fall",dmg:s}),D.fallDist=0}i.y<-20&&!At.voidSent&&!At.dead&&(At.voidSent=!0,ee({type:"fall",dmg:200,void:!0}))}function jS(n,t,e,i){let s=D.pos;if(!D.onGround){D.stepDist=Dr*.7;return}let r=It[To(s)];!t&&e>6&&hn(r,"step",s.x,s.y,s.z,1.6),D.stepDist+=Math.hypot(s.x-n.x,s.z-n.z),D.stepDist>Dr&&(D.stepDist=0,hn(r,"step",s.x,s.y,s.z,i?.5:1))}var Qp=0,tm="";function nm(n,t){if(n-Qp<100||ct.spawnPending)return;Qp=n;let e=c=>Math.round(c*100)/100,i=[e(D.pos.x),e(D.pos.y),e(D.pos.z)],s=e(D.yaw),r=e(D.pitch),a=(D.sneaking?1:0)|(t?2:0),o=`${i}|${s}|${r}|${a}`;o!==tm&&(tm=o,ee({type:"move",p:i,ry:s,rx:r,s:a}))}var Us=["First person","Third person (back)","Third person (front)"],QS=1.13,Ao=new P;function im(n){let t=At.roll+(At.dead?.5:0);At.roll*=Math.exp(-n*8),Ee.rotation.set(D.pitch,D.yaw,t),Ee.position.copy(Sn);let e=Dt.fov*(D.sprinting?QS:1);if(Math.abs(Ee.fov-e)>.05&&(Ee.fov+=(e-Ee.fov)*Math.min(1,n*8),Ee.updateProjectionMatrix()),Dt.view===0)return;Is(Ao).multiplyScalar(Dt.view===1?-1:1);let i=4;for(let s=.1;s<=4;s+=.1){let r=Sn.x+Ao.x*s,a=Sn.y+Ao.y*s,o=Sn.z+Ao.z*s,c=Re(Math.floor(r),Math.floor(a),Math.floor(o));if(c>0&&It[c].opaque){i=Math.max(.3,s-.25);break}}Ee.position.addScaledVector(Ao,i),Dt.view===2&&Ee.rotation.set(-D.pitch,D.yaw+Math.PI,t)}var pc=256,Cn={};for(let n of cl)Cn[n]={name:It[n].name,tile:It[n].tex[1],block:n};Cn[pc]={name:"Strawberry",tile:Mt.strawberry,food:2};var sm=[...cl,pc];var ji=36,Pn=9,ii=64;var rm=()=>({slots:Array(ji).fill(null),cursor:null}),CE={1:2,9:0,6:0,11:0};function om(n,t,e,i,s){for(let r of["merge","empty"])for(let a=i;a<s&&e>0;a++){let o=n.slots[a];if(r==="merge"?o?.[0]===t&&o[1]<ii:!o){let c=Math.min(e,ii-(o?.[1]??0));n.slots[a]=[t,(o?.[1]??0)+c],e-=c}}return e}var am=(n,t,e)=>om(n,t,e,0,ji);function au(n,t,e){let i=n.slots[t];if(!i||e<1)return null;let s=Math.min(e,i[1]);return n.slots[t]=i[1]>s?[i[0],i[1]-s]:null,[i[0],s]}function tb(n,t){let e=n.slots[t];if(!e)return!1;let[i,s]=t<Pn?[Pn,ji]:[0,Pn];n.slots[t]=null;let r=om(n,e[0],e[1],i,s);return n.slots[t]=r?[e[0],r]:null,r<e[1]}function cm(n,t,e,i){if(!Number.isInteger(t)||t<0||t>=ji)return!1;if(i)return tb(n,t);let s=n.slots[t],r=n.cursor;if(!r){if(!s)return!1;let a=e===2?Math.ceil(s[1]/2):s[1];return n.cursor=[s[0],a],n.slots[t]=s[1]>a?[s[0],s[1]-a]:null,!0}if(!s||s[0]===r[0]){let a=ii-(s?.[1]??0),o=Math.min(e===2?1:r[1],a);return o<=0?!1:(n.slots[t]=[r[0],(s?.[1]??0)+o],n.cursor=r[1]>o?[r[0],r[1]-o]:null,!0)}return n.slots[t]=r,n.cursor=s,!0}var lm=new Map,hm=new Rn(1,1,1).attributes.uv;function um(n){let t=lm.get(n);if(t)return t;t=new Rn(1,1,1);let[e,i,s]=It[n].tex,r=[i,i,e,s,i,i],a=t.attributes.uv;for(let o=0;o<24;o++)a.setXY(o,...Jn(r[o>>2],hm.getX(o),hm.getY(o)));return lm.set(n,t),t}var mn=16,cu=new Map,Ro=n=>Cn[n]?.block===void 0;function mc(n){return Ro(n)?(cu.has(n)||cu.set(n,eb(Cn[n].tile)),cu.get(n)):um(Cn[n].block)}function eb(n){let t=n%4*mn,e=Math.floor(n/4)*mn,i=bo.getContext("2d").getImageData(t,e,mn,mn).data,s=(M,_)=>M>=0&&_>=0&&M<mn&&_<mn&&i[(_*mn+M)*4+3]>127,r=[],a=[],o=[],c=[],l=.5/mn,u=(M,_,b)=>{let R=r.length/3;M.forEach((A,w)=>{r.push(...A),a.push(..._),o.push(...b[w])}),c.push(R,R+1,R+2,R,R+2,R+3)},f=M=>M/mn-.5,h=M=>.5-M/mn,p=Jn(n,0,1),g=Jn(n,1,1),x=Jn(n,0,0),m=Jn(n,1,0);u([[-.5,-.5,l],[.5,-.5,l],[.5,.5,l],[-.5,.5,l]],[0,0,1],[x,m,g,p]),u([[.5,-.5,-l],[-.5,-.5,-l],[-.5,.5,-l],[.5,.5,-l]],[0,0,-1],[m,x,p,g]);for(let M=0;M<mn;M++)for(let _=0;_<mn;_++){if(!s(_,M))continue;let b=Jn(n,(_+.5)/mn,1-(M+.5)/mn),R=[b,b,b,b],A=f(_),w=f(_+1),H=h(M+1),y=h(M);s(_-1,M)||u([[A,H,-l],[A,H,l],[A,y,l],[A,y,-l]],[-1,0,0],R),s(_+1,M)||u([[w,H,l],[w,H,-l],[w,y,-l],[w,y,l]],[1,0,0],R),s(_,M-1)||u([[A,y,l],[w,y,l],[w,y,-l],[A,y,-l]],[0,1,0],R),s(_,M+1)||u([[A,H,-l],[w,H,-l],[w,H,l],[A,H,l]],[0,-1,0],R)}let d=new Le;return d.setAttribute("position",new ce(r,3)),d.setAttribute("normal",new ce(a,3)),d.setAttribute("uv",new ce(o,2)),d.setIndex(c),d}var _e=rm(),Ns=0,fm=[];function gc(n){fm.push(n)}var Ei=()=>fm.forEach(n=>n());function lu(n,t){for(let e=0;e<ji;e++)_e.slots[e]=n?.[e]??null;_e.cursor=t??null,Ei()}Kt("inventory",n=>lu(n.inv,n.cursor));function _c(n){ct.mode=n,Xn()||(D.flying=!1),Ei()}var Qi=()=>Ns,Ur=()=>_e.slots[Ns]?.[0]??null;function Nr(n){Ns=(n+Pn)%Pn,Ei()}function hu(){!Xn()&&au(_e,Ns,1)&&Ei()}function xc(n){au(_e,Ns,n?ii:1)&&(Ei(),ee({type:"drop",slot:Ns,all:n}))}function dm(n,t,e){cm(_e,n,t,e)&&(Ei(),ee({type:"invclick",slot:n,button:t,shift:e}))}function pm(){_e.cursor&&(_e.cursor=null,Ei(),ee({type:"drop",cursor:!0}))}function mm(){if(!_e.cursor)return;let[n,t]=_e.cursor;_e.cursor=null,am(_e,n,t),Ei(),ee({type:"invclose"})}function yc(n,t){n==="cursor"?_e.cursor=t:_e.slots[n]=t,Ei(),ee({type:"creative",target:n,item:t})}var gm=()=>{let n=_e.slots.slice(0,Pn).indexOf(null);return n<0?Ns:n};function Os(n,t,e,i,s){return{top:[n+s,t,e,s],bottom:[n+s+e,t,e,s],right:[n,t+s,s,i],front:[n+s,t+s,e,i],left:[n+s+e,t+s,s,i],back:[n+s+e+s,t+s,e,i]}}var ts=64,Fs={head:{size:[8,8,8],base:[0,0],over:[32,0],inflate:.5},body:{size:[8,12,4],base:[16,16],over:[16,32],inflate:.25},armR:{size:[4,12,4],base:[40,16],over:[40,32],inflate:.25,arm:!0},armL:{size:[4,12,4],base:[32,48],over:[48,48],inflate:.25,arm:!0},legR:{size:[4,12,4],base:[0,16],over:[0,32],inflate:.25},legL:{size:[4,12,4],base:[16,48],over:[0,48],inflate:.25}},vc=(n,t)=>Fs[n].arm&&t?[3,12,4]:Fs[n].size;function uu(){let n=document.createElement("canvas");return n.width=n.height=ts,n}function Mc(n){let t=n.naturalWidth??n.width,e=n.naturalHeight??n.height;if(t!==64||e!==64&&e!==32)throw new Error(`Skins are 64\xD764 or 64\xD732 pixels; this one is ${t}\xD7${e}.`);let i=uu(),s=i.getContext("2d",{willReadFrequently:!0});s.drawImage(n,0,0);let r=s.getImageData(0,0,64,64),a=e===32,o=!a&&r.data[1334*4+3]===0;a&&nb(r);for(let[c,l,u,f]of[[0,0,32,16],[0,16,64,32],[16,48,48,64]])for(let h=l;h<f;h++)for(let p=c;p<u;p++)r.data[(h*64+p)*4+3]=255;return s.putImageData(r,0,0),{canvas:i,slim:o}}function nb(n){let t=new Uint8ClampedArray(n.data),e=(s,r,a,o,c,l)=>{for(let u=0;u<l;u++)for(let f=0;f<c;f++){let h=((r+u)*64+s+f)*4,p=((r+o+u)*64+s+a+(c-1-f))*4;for(let g=0;g<4;g++)n.data[p+g]=t[h+g]}};for(let[s,r,a,o,c,l]of[[4,16,16,32,4,4],[8,16,16,32,4,4],[0,20,24,32,4,12],[4,20,16,32,4,12],[8,20,8,32,4,12],[12,20,16,32,4,12],[44,16,-8,32,4,4],[48,16,-8,32,4,4],[40,20,0,32,4,12],[44,20,-8,32,4,12],[48,20,-16,32,4,12],[52,20,-8,32,4,12]])e(s,r,a,o,c,l);let i=!0;for(let s=0;s<16&&i;s++)for(let r=32;r<64;r++)if(t[(s*64+r)*4+3]<128){i=!1;break}if(i)for(let s=0;s<16;s++)for(let r=32;r<64;r++)n.data[(s*64+r)*4+3]=0}function Sc(n){return new Promise((t,e)=>{let i=new Image;i.onload=()=>t(i),i.onerror=()=>e(new Error("That file isn't an image this browser can read.")),i.src=n})}function bc(n,t=32){let e=document.createElement("canvas");e.width=e.height=t;let i=e.getContext("2d");return i.imageSmoothingEnabled=!1,i.drawImage(n,8,8,8,8,0,0,t,t),i.drawImage(n,40,8,8,8,0,0,t,t),e}var ib=500,sb={front:{n:[0,0,-1],c:[[1,1,-1],[-1,1,-1],[1,-1,-1],[-1,-1,-1]]},back:{n:[0,0,1],c:[[-1,1,1],[1,1,1],[-1,-1,1],[1,-1,1]]},right:{n:[1,0,0],c:[[1,1,1],[1,1,-1],[1,-1,1],[1,-1,-1]]},left:{n:[-1,0,0],c:[[-1,1,-1],[-1,1,1],[-1,-1,-1],[-1,-1,1]]},top:{n:[0,1,0],c:[[1,1,1],[-1,1,1],[1,1,-1],[-1,1,-1]]},bottom:{n:[0,-1,0],c:[[1,-1,-1],[-1,-1,-1],[1,-1,1],[-1,-1,1]]}};function Ec([n,t,e],[i,s],r,a,[o,c]){let l=(n/2+r)*a,u=(t/2+r)*a,f=(e/2+r)*a,h=Os(i,s,n,t,e),p=[],g=[],x=[],m=[];for(let[M,{n:_,c:b}]of Object.entries(sb)){let[R,A,w,H]=h[M],y=[[R,A],[R+w,A],[R,A+H],[R+w,A+H]],T=p.length/3;b.forEach(([k,Y,it],L)=>{p.push(k*l,Y*u,it*f),g.push(..._),x.push(y[L][0]/o,1-y[L][1]/c)}),m.push(T,T+2,T+1,T+1,T+2,T+3)}let d=new Le;return d.setAttribute("position",new ce(p,3)),d.setAttribute("normal",new ce(g,3)),d.setAttribute("uv",new ce(x,2)),d.setIndex(m),d}function wc(n,{hurtAt:t=-1e9,dead:e=!1,deadAt:i=0}={}){return{red:e||n-t<ib,tip:e?Math.min(1,(n-i)/400)*(Math.PI/2):0}}var rb=n=>n*Math.PI/180;function _m(n,t){let e=n.px??.0625,i=new fn({map:t,alphaTest:.5}),s=new He,r={},a=(o,c,l)=>{let u=new He;if(u.rotation.order="YXZ",u.position.fromArray(l.pivot??[0,0,0]).multiplyScalar(e),l.rotate&&u.rotation.set(...l.rotate.map(rb)),l.size){let f=new ae(Ec(l.size,l.uv,l.inflate??0,e,n.texture),i);f.position.fromArray(l.at??[0,0,0]).multiplyScalar(e),f.castShadow=f.receiveShadow=!0,u.add(f)}for(let[f,h]of Object.entries(l.children??{}))a(u,f,h);o.add(u),r[c]=u};for(let[o,c]of Object.entries(n.parts))a(s,o,c);return{root:s,parts:r,mat:i,dispose(){s.traverse(o=>o.geometry?.dispose()),i.dispose()}}}var es=.9375/16;function Bs(n,t,e,[i,s,r]){let a=vc(n,t),o=Fs[n],c=[ts,ts],l=new ae(Ec(a,o.base,0,es,c),e.base),u=new ae(Ec(a,o.over,o.inflate,es,c),e.over);for(let f of[l,u])f.position.set(i*es,s*es,r*es),f.castShadow=!0;return l.receiveShadow=!0,[l,u]}function xm(n){return{base:new fn({map:n}),over:new fn({map:n,alphaTest:.5,side:rn})}}var Or=(n,t,e)=>{let i=new He;return i.position.set(n*es,t*es,e*es),i};function Fr(n,t){let e=xm(n),i=new He,s=Or(0,12,0),r=Or(0,12,0);r.rotation.order="YXZ",r.add(...Bs("head",t,e,[0,4,0])),s.add(...Bs("body",t,e,[0,6,0]));let a=t?.5:1,o=Or(5,10,0),c=Or(-5,10,0);o.add(...Bs("armR",t,e,[a,-4,0])),c.add(...Bs("armL",t,e,[-a,-4,0])),s.add(r,o,c);let l=Or(1.9,12,0),u=Or(-1.9,12,0);l.add(...Bs("legR",t,e,[0,-6,0])),u.add(...Bs("legL",t,e,[0,-6,0]));let f=new He;f.add(s,l,u),i.add(f);let h={walk:0,swing:1,bodyYaw:0,time:Math.random()*100,lean:0,drop:0};return{root:i,head:r,mats:e,animate(p,{yaw:g,pitch:x,speed:m,sneaking:d,swinging:M}){h.time+=p;let _=Math.atan2(Math.sin(g-h.bodyYaw),Math.cos(g-h.bodyYaw));m>.3?h.bodyYaw+=_*Math.min(1,p*10):Math.abs(_)>.87&&(h.bodyYaw+=_-Math.sign(_)*.87),_=Math.atan2(Math.sin(g-h.bodyYaw),Math.cos(g-h.bodyYaw)),f.rotation.y=h.bodyYaw;let b=Math.min(1,m/4.3);h.walk+=m*p*2.1;let R=Math.sin(h.walk)*.95*b;l.rotation.x=R,u.rotation.x=-R,h.lean+=((d?-.45:0)-h.lean)*Math.min(1,p*15),h.drop+=((d?.18:0)-h.drop)*Math.min(1,p*15),s.rotation.x=h.lean,f.position.y=-h.drop,l.position.z=u.position.z=-h.lean*.3;let A=Math.sin(h.time*1.1)*.05;if(o.rotation.set(-R*.85-h.lean*.9,0,.05+A),c.rotation.set(R*.85-h.lean*.9,0,-.05-A),M&&h.swing>=1&&(h.swing=0),h.swing<1){h.swing=Math.min(1,h.swing+p/.3);let w=Math.sin(h.swing*Math.PI);o.rotation.x+=w*1.3+.2*Math.sin(h.swing*Math.PI*2),o.rotation.z-=w*.35,f.rotation.y+=Math.sin(Math.sqrt(h.swing)*Math.PI*2)*.12}r.rotation.y=_,r.rotation.x=x-h.lean},swing(){h.swing=0},shade(p,g,x){let{red:m,tip:d}=wc(g,x),M=m?p*.4:p;e.base.color.setRGB(p,M,M),e.over.color.setRGB(p,M,M),i.rotation.z=-d},dispose(){i.traverse(p=>p.geometry?.dispose()),e.base.dispose(),e.over.dispose()}}}function ym(n,t){let e=xm(n),i=new He;return i.add(...Bs("armR",t,e,[t?.5:1,-4,0])),i.traverse(s=>s.castShadow=!1),{arm:i,mats:e}}var Co=ff;function ob(n){let t=uu(),e=t.getContext("2d"),i=e.createImageData(64,64),s=On(n),r={slim:!1,set(a,o,c,l=255,u=.05){let f=(o*64+a)*4,h=1+(s()*2-1)*u;i.data[f]=c[0]*h,i.data[f+1]=c[1]*h,i.data[f+2]=c[2]*h,i.data[f+3]=l},clear(a,o){i.data[(o*64+a)*4+3]=0},rect([a,o,c,l],u,f){for(let h=0;h<l;h++)for(let p=0;p<c;p++)r.set(a+p,o+h,u,255,f)},faces(a,o="base"){let[c,l]=Fs[a][o];return Os(c,l,...vc(a,r.slim))},fill(a,o,c="base",l){for(let u of Object.values(r.faces(a,c)))r.rect(u,o,l)},band(a,o,c,l,u="base",f){let h=r.faces(a,u);for(let g of["front","back","left","right"])r.rect([h[g][0],h[g][1]+o,h[g][2],c-o],l,f);let p=h.front[3];o===0&&r.rect(h.top,l,f),c===p&&r.rect(h.bottom,l,f)},at(a,o,c,l,u,f="base",h){let p=r.faces(a,f)[o];r.set(p[0]+c,p[1]+l,u,255,h)},done(){return e.putImageData(i,0,0),t}};return r}var si=(n,t)=>n.map(e=>Math.min(255,e*t));function wi(n,t){let e=t.skin,i=t.hair;n.fill("head",e);let s=n.faces("head");n.rect(s.top,i),n.rect([s.front[0],s.front[1],8,t.fringe??2],i);for(let o of["left","right"])n.rect([s[o][0],s[o][1],8,t.long?7:3],i);if(n.rect([s.back[0],s.back[1],8,t.long?8:6],i),t.long){n.at("head","front",0,2,i),n.at("head","front",7,2,i);for(let o=2;o<6;o++)n.at("head","front",0,o,i),n.at("head","front",7,o,i)}let r=t.eyes??[70,110,190];n.at("head","front",1,4,[245,245,245],"base",0),n.at("head","front",2,4,r,"base",0),n.at("head","front",5,4,r,"base",0),n.at("head","front",6,4,[245,245,245],"base",0);let a=si(i,.8);if(!t.noBrows)for(let o of[1,2,5,6])n.at("head","front",o,3,a);n.at("head","front",3,5,si(e,.85)),n.at("head","front",4,5,si(e,.85));for(let o of[3,4])n.at("head","front",o,6,t.mouth??si(e,.62));t.mouthWide&&(n.at("head","front",2,6,si(e,.75)),n.at("head","front",5,6,si(e,.75))),n.fill("body",t.shirt);for(let o of["armR","armL"])n.fill(o,e),n.band(o,0,t.sleeves??4,t.shirt),t.cuff&&n.band(o,(t.sleeves??4)-1,t.sleeves??4,t.cuff);for(let o of["legR","legL"])n.fill(o,t.pants),n.band(o,12-(t.shoeRows??2),12,t.shoes);if(t.belt&&n.band("body",10,11,t.belt),t.collar)for(let o=2;o<6;o++)n.at("body","front",o,0,t.collar)}function vm(n,t){let e=n.faces("body");for(let i=4;i<12;i++)for(let s=1;s<7;s++)n.at("body","front",s,i,t);for(let i=0;i<4;i++)n.at("body","front",1,i,t),n.at("body","front",6,i,t);for(let i=0;i<12;i++)n.at("body","back",1,i,t),n.at("body","back",6,i,t);n.rect([e.back[0]+1,e.back[1]+7,6,5],t),n.band("body",9,12,t),n.at("body","front",2,5,[220,200,120],"base",0),n.at("body","front",5,5,[220,200,120],"base",0);for(let i of["legR","legL"])n.band(i,0,10,t)}var cn={light:[236,196,164],tan:[204,152,112],brown:[150,98,66],dark:[104,66,44]},ab={wanderer(n){wi(n,{skin:cn.tan,hair:[74,50,32],shirt:[62,128,74],sleeves:5,pants:[72,64,118],shoes:[58,50,46],belt:[96,66,40],collar:si(cn.tan,.9)})},ranger(n){wi(n,{skin:cn.light,hair:[196,92,40],long:!0,eyes:[60,140,90],shirt:[46,120,120],sleeves:12,cuff:[30,84,84],pants:[58,52,60],shoes:[110,72,42],shoeRows:4,belt:[110,72,42]}),n.band("body",0,12,[44,82,46],"over");let t=n.faces("body","over");for(let e=0;e<12;e++)for(let i=0;i<8;i++)n.clear(t.front[0]+i,t.front[1]+e);n.rect([t.front[0],t.front[1],2,12],[44,82,46]),n.rect([t.front[0]+6,t.front[1],2,12],[44,82,46]),n.at("body","front",2,0,[214,180,70],"over",0)},miner(n){wi(n,{skin:cn.brown,hair:[36,28,24],shirt:[150,150,146],sleeves:6,pants:[60,80,140],shoes:[54,40,30],shoeRows:3,eyes:[70,50,34]}),vm(n,[60,80,140]);let t=[232,190,44];n.band("head",0,3,t,"over");let e=n.faces("head","over");for(let i=0;i<8;i++)for(let s=0;s<8;s++)if(i>2)for(let r of["front","back","left","right"])n.clear(e[r][0]+s,e[r][1]+i);n.rect(e.bottom,t);for(let i=0;i<8;i++)for(let s=0;s<8;s++)n.clear(e.bottom[0]+s,e.bottom[1]+i);n.at("head","front",3,1,[255,250,200],"over",0),n.at("head","front",4,1,[255,250,200],"over",0),n.at("head","front",3,2,[140,140,140],"over",0),n.at("head","front",4,2,[140,140,140],"over",0),n.at("head","front",6,5,si(cn.brown,.7)),n.at("head","front",1,6,si(cn.brown,.75))},knight(n){let t=[176,180,188],e=[104,108,118],i=[164,40,44];wi(n,{skin:cn.light,hair:[120,80,40],shirt:e,sleeves:12,pants:e,shoes:[70,72,80]}),n.fill("head",t,"over",.08);for(let r=1;r<7;r++)n.at("head","front",r,4,[26,26,30],"over",0);for(let r=5;r<8;r+=2)for(let a=2;a<6;a+=1)n.at("head","front",a,r,si(t,.75),"over");let s=n.faces("head","over").top;n.rect([s[0]+3,s[1],2,8],i);for(let r=0;r<8;r++)for(let a=0;a<8;a++)n.clear(n.faces("head","over").bottom[0]+a,n.faces("head","over").bottom[1]+r);n.fill("body",t,"over",.08);for(let r=0;r<12;r++)for(let a=2;a<6;a++)n.at("body","front",a,r,i,"over");for(let r=2;r<6;r++)n.at("body","front",r,10,[214,178,64],"over",0);for(let r of["armR","armL"])n.band(r,0,4,t,"over"),n.band(r,9,12,t,"over");for(let r of["legR","legL"])n.band(r,0,12,t,"over"),n.band(r,10,12,[80,82,90],"over")},astronaut(n){let t=[232,234,238],e=[214,92,40],i=[24,36,72];wi(n,{skin:cn.tan,hair:[40,30,26],shirt:t,sleeves:12,pants:t,shoes:[120,124,132],shoeRows:3});for(let s of["armR","armL"])n.band(s,10,12,[160,164,172]),n.band(s,3,4,e);for(let s of["legR","legL"])n.band(s,5,6,e);for(let s=3;s<7;s++)for(let r=2;r<6;r++)n.at("body","front",r,s,[90,96,110]);n.at("body","front",2,4,[80,220,120],"base",0),n.at("body","front",4,4,[230,70,60],"base",0),n.at("body","front",3,5,[70,160,240],"base",0),n.at("body","front",5,5,[240,200,60],"base",0),n.band("body",9,10,e),n.fill("head",t,"over",.03);for(let s=2;s<7;s++)for(let r=1;r<7;r++)n.at("head","front",r,s,i,"over",.1);n.at("head","front",2,3,[170,200,240],"over",0),n.at("head","front",3,2,[120,150,210],"over",0);for(let s of["left","right"])for(let r=3;r<6;r++)n.at("head",s,1,r,e,"over")},wizard(n){let t=[86,52,140],e=[58,34,98],i=[228,228,232],s=[226,186,70];wi(n,{skin:cn.light,hair:i,eyes:[60,70,150],shirt:t,sleeves:10,cuff:s,pants:t,shoes:e,shoeRows:1,mouth:i});for(let a=5;a<8;a++)for(let o=1;o<7;o++)a===5&&o>2&&o<5||n.at("head","front",o,a,i);for(let a=0;a<5;a++)for(let o=2+(a>>1);o<6-(a>>1);o++)n.at("body","front",o,a,i,"over");n.band("body",10,11,s),n.band("head",0,3,t,"over");let r=n.faces("head","over");for(let a=3;a<8;a++)for(let o of["front","back","left","right"])for(let c=0;c<8;c++)n.clear(r[o][0]+c,r[o][1]+a);for(let a=0;a<8;a++)for(let o=0;o<8;o++)n.clear(r.bottom[0]+o,r.bottom[1]+a);for(let a of["front","back","left","right"])for(let o=0;o<8;o++)n.set(r[a][0]+o,r[a][1]+2,s,255,.03);n.at("head","front",4,0,s,"over",0),n.at("head","front",3,1,[255,230,120],"over",0),n.rect(r.top,e)},farmer(n){wi(n,{skin:cn.tan,hair:[150,100,52],shirt:[178,52,48],sleeves:8,pants:[70,100,156],shoes:[92,62,36],shoeRows:3,eyes:[90,130,70]});for(let i of["body","armR","armL"]){let s=n.faces(i);for(let r of Object.values(s))for(let a=0;a<r[3];a++)for(let o=0;o<r[2];o++)((o+r[0])%4===0||(a+r[1])%4===0)&&n.set(r[0]+o,r[1]+a,[120,30,30]);if(i!=="body")for(let r=8;r<12;r++)for(let a of["front","back","left","right"])for(let o=0;o<s[a][2];o++)n.set(s[a][0]+o,s[a][1]+r,cn.tan)}vm(n,[70,100,156]);let t=[222,192,110];n.band("head",0,2,t,"over");let e=n.faces("head","over");for(let i=2;i<8;i++)for(let s of["front","back","left","right"])for(let r=0;r<8;r++)n.clear(e[s][0]+r,e[s][1]+i);for(let i=0;i<8;i++)for(let s=0;s<8;s++)n.clear(e.bottom[0]+s,e.bottom[1]+i);for(let i of["front","back","left","right"])for(let s=0;s<8;s++)n.set(e[i][0]+s,e[i][1]+1,[170,60,50],255,.03)},robot(n){let t=[150,158,166],e=[84,90,98],i=[80,230,240];for(let a of Object.keys(Fs))n.fill(a,t,"base",.1);for(let a of[1,2,5,6])n.at("head","front",a,3,i,"base",0);for(let a=2;a<6;a++)n.at("head","front",a,5,e),n.at("head","front",a,6,a%2?e:[60,64,70]);for(let[a,o]of[[0,0],[7,0],[0,7],[7,7]])n.at("head","front",a,o,[196,200,206],"base",0);for(let a of["left","right"])for(let o=2;o<6;o++)for(let c=3;c<5;c++)n.at("head",a,c,o,e);for(let a=2;a<8;a++)for(let o=1;o<7;o++)n.at("body","front",o,a,e);[[255,90,80],[250,210,70],[90,230,120],i].forEach((a,o)=>n.at("body","front",2+o,3,a,"base",0));for(let a=2;a<6;a++)n.at("body","front",a,5,a%2?i:e,"base",.1);for(let a of["armR","armL"])n.band(a,4,5,e),n.band(a,10,12,e);for(let a of["legR","legL"])n.band(a,5,6,e),n.band(a,10,12,[60,64,70]);n.band("body",11,12,e);let r=n.faces("head","over");n.set(r.top[0]+3,r.top[1]+3,[255,80,70],255,0),n.set(r.top[0]+4,r.top[1]+3,[255,80,70],255,0)},ninja(n){let t=[36,36,44],e=[190,40,46];wi(n,{skin:cn.tan,hair:t,shirt:t,sleeves:12,pants:t,shoes:[24,24,28],eyes:[40,30,26],noBrows:!0}),n.fill("head",t);for(let s=1;s<7;s++)n.at("head","front",s,4,cn.tan);n.at("head","front",2,4,[30,24,20],"base",0),n.at("head","front",5,4,[30,24,20],"base",0);for(let s=1;s<7;s++)n.at("head","front",s,3,cn.tan);n.at("head","front",1,3,t),n.at("head","front",6,3,t),n.band("head",2,3,e,"over");let i=n.faces("head","over");for(let s=3;s<7;s++)n.set(i.back[0]+3+(s&1),i.back[1]+s,e);n.band("body",8,10,e),n.at("body","front",5,10,e),n.at("body","front",5,11,e);for(let s of["armR","armL"])n.band(s,9,12,[24,24,28])},scout(n){wi(n,{skin:cn.dark,hair:[30,22,20],fringe:1,eyes:[60,40,30],shirt:[240,236,226],sleeves:4,pants:[60,84,130],shoes:[236,236,236],mouth:[150,70,70]});let t=[226,120,40];n.fill("body",t,"over");let e=n.faces("body","over");for(let s=0;s<12;s++)for(let r=2;r<6;r++)n.clear(e.front[0]+r,e.front[1]+s);for(let s=0;s<4;s++)for(let r=0;r<8;r++)n.clear(e.bottom[0]+r,e.bottom[1]+s);for(let s of["armR","armL"])n.band(s,0,10,t,"over"),n.band(s,9,10,[180,90,30],"over");for(let s of["armR","armL"]){let r=n.faces(s,"over");for(let a=0;a<r.bottom[3];a++)for(let o=0;o<r.bottom[2];o++)n.clear(r.bottom[0]+o,r.bottom[1]+a)}let i=n.faces("head","over").top;for(let s=2;s<6;s++)for(let r=2;r<6;r++)n.set(i[0]+r,i[1]+s,[40,30,26])}},fu=new Map;function Po(n){if(!fu.has(n)){let t=Co.find(i=>i.id===n)??Co[0],e=ob(n.length*7919+n.charCodeAt(0));e.slim=!!t.slim,ab[t.id](e),fu.set(n,e.done())}return fu.get(n)}var du=new Map,Mm=[];function Sm(n){Mm.push(n)}var bm=n=>du.has(n);function ri(n){let t=du.get(n);if(t)return t;let e=document.createElement("canvas");return e.width=e.height=ts,t={canvas:e,texture:Mn(e)},du.set(n,t),n.startsWith("custom:")?(e.getContext("2d").drawImage(Po("wanderer"),0,0),Sc(`skins/${n.slice(7)}.png`).then(i=>pu(n,Mc(i).canvas)).catch(()=>{})):e.getContext("2d").drawImage(Po(n.slice(7)),0,0),t}function pu(n,t){let e=ri(n),i=e.canvas.getContext("2d");i.clearRect(0,0,ts,ts),i.drawImage(t,0,0),e.texture.needsUpdate=!0;for(let s of Mm)s(n)}function ns(n=6,t=Sn,e=Is()){let i=Math.floor(t.x),s=Math.floor(t.y),r=Math.floor(t.z),a=Math.sign(e.x),o=Math.sign(e.y),c=Math.sign(e.z),l=Math.abs(1/e.x),u=Math.abs(1/e.y),f=Math.abs(1/e.z),h=(a>0?i+1-t.x:t.x-i)*l,p=(o>0?s+1-t.y:t.y-s)*u,g=(c>0?r+1-t.z:t.z-r)*f,x=null,m=0;for(;m<=n;){let d=Re(i,s,r);if(d>0&&d!==11)return{hit:[i,s,r],prev:x,t:m};x=[i,s,r],h<p&&h<g?(i+=a,m=h,h+=l):p<g?(s+=o,m=p,p+=u):(r+=c,m=g,g+=f)}return null}function Tc(n,t,e,i,s,r,a,o){let c=0,l=1/0;for(let[u,f,h,p]of[[n.x,t.x,e,r],[n.y,t.y,i,a],[n.z,t.z,s,o]]){if(Math.abs(f)<1e-9){if(u<h||u>p)return null;continue}let g=(h-u)/f,x=(p-u)/f;if(g>x&&([g,x]=[x,g]),c=Math.max(c,g),l=Math.min(l,x),c>l)return null}return c}var Em=new Rn(1.004,1.004,1.004),Ac=new Ka(new Qa(Em),new yo({color:0,transparent:!0,opacity:.6}));Ac.visible=!1;Qt.add(Ac);var wm=Dp().map(Mn),Lo=new ae(Em,new ei({map:wm[0],transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4}));Lo.visible=!1;Qt.add(Lo);function Tm(n){Ac.visible=!!n,n&&Ac.position.set(n[0]+.5,n[1]+.5,n[2]+.5)}function Io(n,t=0){Lo.visible=!!n,n&&(Lo.position.set(n[0]+.5,n[1]+.5,n[2]+.5),Lo.material.map=wm[Math.min(So-1,Math.floor(t*So))])}var mu={gnome:{name:"Gnome",hp:10,box:[.5,.95],walk:1.1,panic:2.6,drops:[[pc,1,3]],spawn:{on:[1],group:[2,3],near:6},ai:["panic","wander"]}};function cb(n,t,e){let i=Math.hypot(t[0]-n[0],t[2]-n[2]),s=n[1]-t[1];return Math.max(i,.3)/e+(s>0?Math.sqrt(s/8):0)}var Am=n=>Math.max(0,Math.min(1,n));function Rm(n,t,e,i=0){let s=Math.max(0,e);for(let a=1;a<n.length;a++){let o=n[a-1],c=n[a],l=c[0]-o[0],u=c[2]-o[2],f=c[1]-o[1];(l||u)&&(i=Math.atan2(-l,-u));let h=cb(o,c,t);if(s>=h){s-=h;continue}let p=s/h,g=o[1],x=0;if(f>0){let m=Am(p/.4);g+=f*m,x=Math.sin(m*Math.PI)*.3}else if(f<0){let m=l||u?Am((p-.45)/.55):p;g+=f*m*m}return{x:o[0]+.5+l*p,y:g,z:o[2]+.5+u*p,yaw:i,hop:x,cell:p<.5?a-1:a,done:!1}}let r=n[n.length-1];return{x:r[0]+.5,y:r[1],z:r[2]+.5,yaw:i,hop:0,cell:n.length-1,done:!0}}var gu={};og(gu,{model:()=>Nm,motion:()=>lb,paint:()=>mb});function Cm(n,t){let[e,i]=n.texture,s=document.createElement("canvas");s.width=e,s.height=i;let r=s.getContext("2d"),a=r.createImageData(e,i),o=On(t),c={},l=h=>{for(let[p,g]of Object.entries(h))c[p]=g,l(g.children??{})};l(n.parts);let u=h=>{let p=c[h];return Os(...p.uv,...p.size)},f={rnd:o,set(h,p,g,x=.05){let m=(p*e+h)*4,d=1+(o()*2-1)*x;a.data[m]=g[0]*d,a.data[m+1]=g[1]*d,a.data[m+2]=g[2]*d,a.data[m+3]=255},part(h,p,g){for(let[x,[m,d,M,_]]of Object.entries(u(h)))for(let b=0;b<_;b++)for(let R=0;R<M;R++)f.set(m+R,d+b,p(x,R,b,M,_),g)},at(h,p,g,x,m,d=.02){let[M,_]=u(h)[p];f.set(M+g,_+x,m,d)},done(){return r.putImageData(a,0,0),s}};return f}var Nm={texture:[64,64],px:1/28,parts:{body:{pivot:[0,7,0],size:[8,6,5],uv:[0,22]},head:{pivot:[0,10,0],size:[6,6,6],uv:[0,0],at:[0,3,0],children:{beard:{size:[6,4,1],uv:[24,0],at:[0,1,-3.5]},nose:{size:[2,2,2],uv:[40,0],at:[0,4,-4]},hat:{pivot:[0,6,0],rotate:[12,0,0],size:[7,3,7],uv:[0,12],at:[0,1.5,0],children:{hat2:{size:[5,3,5],uv:[28,12],at:[0,4.5,.3]},hat3:{size:[3,3,3],uv:[48,12],at:[0,7.5,.6]},hat4:{size:[1,2,1],uv:[60,12],at:[0,10,.9]}}}}},armR:{pivot:[5,10,0],size:[2,5,2],uv:[26,22],at:[0,-2.5,0]},armL:{pivot:[-5,10,0],size:[2,5,2],uv:[26,22],at:[0,-2.5,0]},legR:{pivot:[1.6,4,0],size:[3,4,3],uv:[34,22],at:[0,-2,0]},legL:{pivot:[-1.6,4,0],size:[3,4,3],uv:[34,22],at:[0,-2,0]}}},lb={legs:{legR:1,legL:-1,armR:-.8,armL:.8},swing:1,stride:5,head:"head",sounds:{ambient:"hum",hurt:"hup",death:"hup"}},Pm=[238,194,160],hb=[228,146,128],Lm=[236,236,230],Im=[204,38,42],Dm=[52,92,176],ub=[72,46,26],fb=[242,202,74],db=[46,56,96],pb=[74,48,28],Um=[36,28,30];function mb(){let n=Cm(Nm,28174),t=(e,i)=>e.map(s=>s*i);n.part("head",()=>Pm,.03),n.part("nose",()=>hb,.03),n.part("beard",(e,i,s)=>s>0&&n.rnd()<.15?t(Lm,.9):Lm,.02);for(let e of["hat","hat2","hat3","hat4"])n.part(e,()=>n.rnd()<.12?t(Im,.85):Im,.04);return n.part("body",(e,i,s,r,a)=>e!=="top"&&e!=="bottom"&&s===a-2?e==="front"&&(i===3||i===4)?fb:ub:Dm,.05),n.part("armR",(e,i,s,r,a)=>e!=="top"&&s===a-1||e==="bottom"?Pm:Dm,.04),n.part("legR",(e,i,s,r,a)=>e==="bottom"||e!=="top"&&s>=a-2?pb:db,.04),n.at("head","front",1,2,Um),n.at("head","front",4,2,Um),n.done()}var xu={gnome:gu},_u=new Map;function Om(n){return _u.has(n)||_u.set(n,Mn(xu[n].paint())),_u.get(n)}var Fm=96,gb=6,_b=1e3,Ln=new Map,Bm=(n,t)=>Math.atan2(Math.sin(t-n),Math.cos(t-n)),qn=(n,t)=>n+Math.random()*(t-n);function zm(n,t){let e=xu[n.kind];if(!e||!mu[n.kind])return;let i=_m(e.model,Om(n.kind));i.root.rotation.order="YXZ",Qt.add(i.root);let s={id:n.id,kind:mu[n.kind],look:e,model:i,pos:new P,placed:!1,yaw:n.ry,moving:0,walk:0,head:{yaw:0,pitch:0,glanceYaw:0,glancePitch:0,glanceAt:0},hurtAt:-1e9,dead:!1,deadAt:0,soundAt:t+qn(2e3,12e3),stepDist:0};Ln.set(s.id,s),km(s,n,t)}function km(n,t,e){Object.assign(n,{path:t.path,speed:t.speed,ry:t.ry,hp:t.hp,start:e-t.age})}function yu(n){Qt.remove(n.model.root),n.model.dispose(),Ln.delete(n.id)}function vu(n){for(let e of[...Ln.values()])yu(e);let t=performance.now();for(let e of n??[])zm(e,t)}var Mu=(n,t,e)=>t&&Bn(t,n.pos.x,n.pos.y+.6,n.pos.z,e);Kt("mob",({mob:n})=>{let t=performance.now(),e=Ln.get(n.id);e&&!e.dead?km(e,n,t):e||zm(n,t)});Kt("mobhurt",n=>{let t=Ln.get(n.id);t&&(t.hp=n.hp,t.hurtAt=performance.now(),n.hp>0&&Mu(t,t.look.motion.sounds.hurt,{volume:.8}))});Kt("mobdeath",n=>{let t=Ln.get(n.id);t&&(Object.assign(t,{dead:!0,deadAt:performance.now(),moving:0}),Mu(t,t.look.motion.sounds.death,{volume:.9,rate:.75}))});Kt("mobgone",n=>{let t=Ln.get(n.id);t&&yu(t)});function xb(n){let t=null,e=gb,i=(s,r)=>{let a=Math.hypot(s.x-n.x,s.z-n.z);a<e&&(t={x:s.x,y:s.y+r,z:s.z},e=a)};i(D.pos,D.sneaking?1.27:1.62);for(let s of ie.values())s.dead||i(s.model.root.position,1.62);return t}function yb(n,t,e){let i=n.model.parts[n.look.motion.head];if(!i)return;let s=n.head,r={x:n.pos.x,y:n.pos.y+i.position.y,z:n.pos.z},a=xb(r),o,c;if(a&&!n.dead)o=Bm(n.yaw,Math.atan2(-(a.x-r.x),-(a.z-r.z))),c=Math.atan2(a.y-r.y,Math.hypot(a.x-r.x,a.z-r.z));else{if(e>s.glanceAt){s.glanceAt=e+qn(2e3,6e3);let u=Math.random()<.4;s.glanceYaw=u?0:qn(-.9,.9),s.glancePitch=u?0:qn(-.3,.2)}o=s.glanceYaw,c=s.glancePitch}o=Math.max(-1.2,Math.min(1.2,o)),c=Math.max(-.7,Math.min(.7,c));let l=Math.min(1,t*8);s.yaw+=(o-s.yaw)*l,s.pitch+=(c-s.pitch)*l,i.rotation.y=s.yaw,i.rotation.x=s.pitch}function Hm(n,t){bb(n);let e=D.pos;for(let i of Ln.values()){let s=i.model.root;if(i.dead&&t-i.deadAt>_b){Sb(i.pos.x,i.pos.y+i.kind.box[1]/2,i.pos.z),yu(i);continue}let r=Rm(i.path,i.speed,(t-i.start)/1e3,i.ry),a=Math.abs(r.x-e.x)<Fm&&Math.abs(r.z-e.z)<Fm;if(s.visible=a,!a)continue;let o=i.pos.clone();i.dead||(i.placed?i.pos.lerp({x:r.x,y:r.y+r.hop,z:r.z},1-Math.exp(-n*20)):(i.pos.set(r.x,r.y+r.hop,r.z),i.placed=!0));let c=Math.hypot(i.pos.x-o.x,i.pos.z-o.z);i.moving+=(c/Math.max(n,.001)-i.moving)*Math.min(1,n*10),i.yaw+=Bm(i.yaw,r.yaw)*Math.min(1,n*10),s.position.copy(i.pos),s.rotation.y=i.yaw;let{legs:l,swing:u,stride:f}=i.look.motion;i.walk+=i.moving*n*f;let h=Math.min(1,i.moving/i.kind.walk)*u;for(let[m,d]of Object.entries(l))i.model.parts[m].rotation.x=Math.sin(i.walk)*h*d;yb(i,n,t);let p=Ki(i.pos.x,i.pos.y+.5,i.pos.z),{red:g,tip:x}=wc(t,i);i.model.mat.color.setRGB(p,g?p*.4:p,g?p*.4:p),s.rotation.z=x,i.dead||vb(i,c,r,t)}}function vb(n,t,e,i){if(i>n.soundAt&&(n.soundAt=i+qn(6e3,12e3),Mu(n,n.look.motion.sounds.ambient,{volume:.6})),!e.hop&&(n.stepDist+=t,n.stepDist>Dr)){n.stepDist=0;let s=To(n.pos);s!==0&&hn(It[s],"step",n.pos.x,n.pos.y,n.pos.z,.5)}}var Rc=[],Mb=new Rn(.14,.14,.14);function Sb(n,t,e){let i=new ei({color:14540253,transparent:!0,depthWrite:!1}),s=Array.from({length:10},()=>{let r=new ae(Mb,i);return r.position.set(n+qn(-.35,.35),t+qn(-.3,.3),e+qn(-.35,.35)),Qt.add(r),{mesh:r,v:new P(qn(-.6,.6),qn(.4,1.2),qn(-.6,.6))}});Rc.push({bits:s,mat:i,t:0})}function bb(n){for(let t=Rc.length-1;t>=0;t--){let e=Rc[t];e.t+=n/.7,e.mat.opacity=Math.max(0,1-e.t);for(let i of e.bits)i.mesh.position.addScaledVector(i.v,n),i.mesh.scale.setScalar(1+e.t);if(!(e.t<1)){for(let i of e.bits)Qt.remove(i.mesh);e.mat.dispose(),Rc.splice(t,1)}}}var Vm=n=>{let t=n.kind.box[0]/2;return[n.pos.x-t,n.pos.y,n.pos.z-t,n.pos.x+t,n.pos.y+n.kind.box[1],n.pos.z+t]};function Gm(n,t,e){let i=null;for(let s of Ln.values()){if(s.dead||!s.model.root.visible)continue;let r=Tc(n,t,...Vm(s));r!==null&&r<(i?.t??e)&&(i={mob:s,t:r})}return i}function Wm(n,t,e,i,s,r){for(let a of Ln.values()){if(a.dead)continue;let[o,c,l,u,f,h]=Vm(a);if(o<i&&u>n&&c<s&&f>t&&l<r&&h>e)return!0}return!1}var Xm=n=>[...Ln.values()].filter(t=>t.pos.distanceTo(D.pos)<n).length,qm=()=>Ln.size;var $n=null,In=null,Do=0,Dn=new He;sc.add(Dn);var Yn=new ae(void 0,new fn({map:Cr,alphaTest:.5}));Yn.visible=!1;Dn.add(Yn);var Ve={swing:1,bob:0,eat:0},Ym=()=>Dn.visible&&!!ct.self;function Cc(){$n&&(Qt.remove($n.root),$n.dispose()),In&&(Dn.remove(In.arm),In.arm.traverse(e=>e.geometry?.dispose()),In.mats.base.dispose(),In.mats.over.dispose());let n=ri(ct.self.skin),t=ct.self.model==="slim";$n=Fr(n.texture,t),Qt.add($n.root),In=ym(n.texture,t),In.arm.position.set(.62,-.68,-.42),In.arm.rotation.order="YXZ",In.arm.rotation.set(1.75,.35,0),Dn.add(In.arm)}function $m(n){Yn.visible=n!==null,n!==null&&(Yn.geometry=mc(n),Ro(n)?(Yn.scale.setScalar(.42),Yn.position.set(.44,-.36,-.95),Yn.rotation.set(0,-1.2,.35)):(Yn.scale.setScalar(.24),Yn.position.set(.4,-.43,-1.08),Yn.rotation.set(.1,Math.PI/4+.3,0)))}function Pc(){Ve.swing=0,$n?.swing(),ee({type:"swing"})}function Zm(n,t,e,i){if(!$n)return;let s=D.pos,r=Math.hypot(D.vel.x,D.vel.z)*(D.onGround||D.flying?1:.4);if(Do+=(r-Do)*Math.min(1,n*10),$n.root.position.copy(s),$n.root.visible=Dt.view!==0,$n.animate(n,{yaw:D.yaw,pitch:D.pitch,speed:Do,sneaking:D.sneaking,swinging:e}),$n.shade(Ki(s.x,s.y+1,s.z),t,At),Dn.visible=Dt.view===0&&Dt.hand&&!At.dead,!Dn.visible)return;e&&Ve.swing>=1&&(Ve.swing=0),Ve.swing=Math.min(1,Ve.swing+n/.3),Ve.bob+=Do*n*2.1;let a=Ve.swing<1?Math.sin(Ve.swing*Math.PI):0,o=Ve.swing<1?Math.sin(Math.sqrt(Ve.swing)*Math.PI):0,c=Math.min(1,Do/4.3);if(Dn.position.set(Math.sin(Ve.bob)*.025*c-o*.12,-Math.abs(Math.cos(Ve.bob))*.03*c+o*.08-a*.12,-a*.12),Dn.rotation.set(-a*.5,o*.35,a*.15),Ve.eat+=((i?1:0)-Ve.eat)*Math.min(1,n*12),Ve.eat>.01){let u=i?Math.abs(Math.sin(t/70))*.04:0;Dn.position.x-=Ve.eat*.38,Dn.position.y+=Ve.eat*.12-u,Dn.rotation.y+=Ve.eat*.5}let l=Kp(s.x,s.y+1,s.z);In.mats.base.color.setScalar(l),In.mats.over.color.setScalar(l),Yn.material.color.setScalar(l)}var bu=.2,fe={held:!1,target:null,block:0,progress:0,cooldown:0,hitTimer:0},Eu=()=>fe.held&&!!fe.target;function Ti(){fe.held=!1,fe.target=null,fe.progress=0,Io(null)}function jm(n,t){t||Eb(),Tb(n);let e=t?ns():null;Tm(e?.hit),fe.cooldown=Math.max(0,fe.cooldown-n);let i=e&&e.hit[1]>=1?e.hit:null,s=i?Re(...i):0;if(!fe.held||!i||fe.cooldown>0){fe.target=null,Io(null);return}(!fe.target||fe.target.some((c,l)=>c!==i[l])||fe.block!==s)&&(fe.target=i,fe.block=s,fe.progress=0,fe.hitTimer=0),fe.progress+=Xn()?1:n/It[s].hard,fe.hitTimer-=n;let[r,a,o]=[i[0]+.5,i[1]+.5,i[2]+.5];if(fe.progress>=1){hn(It[s],"break",r,a,o),wu(...i,0),fe.target=null,fe.cooldown=.25,Io(null);return}fe.hitTimer<=0&&(fe.hitTimer=bu,hn(It[s],"hit",r,a,o)),Io(i,fe.progress)}function Lc(){let n=ns(),t=Math.min(3,n?n.t:3),e=Rb(t),i=Gm(Sn,Is(),e?e.t:t);i?Km({type:"hitmob",id:i.mob.id}):e?Km({type:"attack",id:e.player.id}):fe.held=!0,!e&&!i&&!n&&Pc()}function Br(){Ue.held=!0,t0()||Ab()}function zr(){Ue.held=!1,Su()}function Eb(){Ue.held&&zr()}var wb=1.6,Ue={held:!1,eating:!1,slot:0,item:null,t:0,crunch:0},Qm=()=>Ue.eating;function t0(){let n=Ur();return!Cn[n]?.food||At.dead||At.hp>=20?!1:(Object.assign(Ue,{eating:!0,slot:Qi(),item:n,t:0,crunch:0}),ee({type:"eatstart",slot:Ue.slot}),!0)}function Su(){Ue.eating=!1}function Tb(n){if(!Ue.eating)return;if(Qi()!==Ue.slot||Ur()!==Ue.item||At.dead)return Su();Ue.t+=n,Ue.crunch-=n;let t=D.pos;Ue.crunch<=0&&(Ue.crunch=.22,Bn("crunch",t.x,t.y+1.5,t.z,{volume:.45,rate:.9+Math.random()*.3})),!(Ue.t<wb)&&(ee({type:"eat",slot:Ue.slot}),hu(),Bn("burp",t.x,t.y+1.5,t.z,{volume:.4}),Su(),Ue.held&&setTimeout(()=>Ue.held&&!Ue.eating&&t0(),400))}function Ab(){let n=ns();if(!n?.prev)return;let[t,e,i]=n.prev,s=Cn[Ur()]?.block;if(s===void 0)return;let r=D.pos,a=t<r.x+an&&t+1>r.x-an&&e<r.y+su&&e+1>r.y&&i<r.z+an&&i+1>r.z-an;It[s].solid&&(a||Wm(t,e,i,t+1,e+1,i+1))||(wu(t,e,i,s,Qi()),hu(),hn(It[s],"place",t+.5,e+.5,i+.5),Pc())}function Rb(n){let t=Is(),e=null;for(let i of ie.values()){if(i.dead)continue;let s=i.model.root.position,r=i.s&1?1.5:1.8,a=Tc(Sn,t,s.x-.3,s.y,s.z-.3,s.x+.3,s.y+r,s.z+.3);a!==null&&a<(e?.t??n)&&(e={player:i,t:a})}return e}function Km(n){let t=!D.onGround&&!D.flying&&D.vel.y<0;ee({...n,crit:t,sprint:D.sprinting}),D.sprinting=!1,Pc()}var Tu=new Map;function Cb(n){return Tu.has(n)||Tu.set(n,`url(${Ip(bo,Cn[n].tile).toDataURL()})`),Tu.get(n)}var Uo=(n={})=>dn("div",{className:"slot",...n},dn("span",{className:"count"}));function kr(n,t){n.style.backgroundImage=t?Cb(t[0]):"",n.title=t?Cn[t[0]].name:"",n.firstChild.textContent=t&&t[1]>1?t[1]:""}function zs(){let n=ct.self?[{...ct.self,name:`${ct.self.name} (you)`},...ie.values()]:[...ie.values()];pt("players").replaceChildren(...n.map(t=>dn("li",{},bc(ri(t.skin).canvas,16),Ji(t)))),pt("menu-foot").textContent=ct.self?`World \u201C${Eo}\u201D \xB7 ${ie.size+1} online \xB7 you are ${Ji(ct.self)}`:""}Sm(()=>zs());var Pb=pt("hotbar"),e0=Array.from({length:Pn},(n,t)=>{let e=Uo();return e.onclick=()=>Nr(t),e});Pb.replaceChildren(...e0);function Au(){e0.forEach((n,t)=>{kr(n,_e.slots[t]),n.classList.toggle("on",t===Qi())}),$m(Ur())}gc(Au);var Hr=new URLSearchParams(location.search).has("embed"),Lb=2e4;document.documentElement.classList.toggle("embed",Hr);if(Hr){let n=new URL(location.href);n.searchParams.delete("embed");let t=pt("open-tab");t.hidden=!1,t.onclick=()=>open(n,"_blank","noopener")}function n0(n,t){let e=!1,i=!1,s=0,r=()=>{clearTimeout(s),e&&document.visibilityState==="visible"?i||(i=!0,n()):i&&(s=setTimeout(()=>{i=!1,t()},Lb))};new IntersectionObserver(a=>{e=a.some(o=>o.isIntersecting),r()}).observe(document.documentElement),document.addEventListener("visibilitychange",r)}var ss=pt("char-name"),Cu=pt("char-msg"),Ib=pt("skin-grid"),Ic=pt("skin-file"),Ru=pt("char-save"),is=pt("char-view"),oi=null,de=null,Jt=null,Dc=!1;async function Pu(){try{localStorage.removeItem("yardcraft.guest")}catch{}try{let n=await fetch("api/profile");n.status===401&&(await fetch("__yard/auth/guest",{method:"POST"}),n=await fetch("api/profile")),n.ok&&({profile:oi,guest:Dc}=await n.json())}catch{}pt("menu-guest").hidden=!Dc}function i0(){fetch("__yard/auth/guest",{method:"DELETE"}).catch(()=>{})}function s0(){let n=document.createElement("a");return n.href="__yard/auth/login?return=/",n.textContent="Sign in",Hr&&(n.target="_blank"),n}pt("menu-guest").append("Playing as a guest \xB7 ",s0()," to keep your character everywhere");function rs(n,t=""){Cu.textContent=n,Cu.className=`note ${t}`}async function r0(){if(oi||await Pu(),!oi)return rs("Couldn't load your character. Try again in a moment.","err");de={...oi,upload:null},ss.value=de.name,ss.classList.remove("bad"),pt("skin-upload").hidden=!!Dc,Dc?(rs(""),Cu.append("You're playing as a guest. ",s0()," to upload your own skin and keep your character on any device.")):rs("Upload any Minecraft skin (64\xD764 or 64\xD732 PNG)."),Lu(),Uc(),Db(),Nc()}function o0(){de=null}function Lu(){let n=Co.map(t=>({key:`preset:${t.id}`,name:t.name,canvas:Po(t.id)}));oi.skin.startsWith("custom:")&&n.unshift({key:oi.skin,name:"Yours",canvas:ri(oi.skin).canvas}),de.upload&&n.unshift({key:"upload",name:"Upload",canvas:de.upload}),Ib.replaceChildren(...n.map(t=>{let e=document.createElement("button");return e.className=t.key===de.skin?"on":"",e.append(bc(t.canvas,32),t.name),e.onclick=()=>{de.skin=t.key;let i=Co.find(s=>`preset:${s.id}`===t.key);i&&(de.model=i.slim?"slim":"classic"),Lu(),Uc(),Nc()},e}))}function Uc(){for(let n of document.querySelectorAll("#char-model button"))n.classList.toggle("on",n.dataset.model===de.model)}pt("char-model").onclick=n=>{let t=n.target.closest("[data-model]");!t||!de||(de.model=t.dataset.model,Uc(),Nc())};var a0=()=>de.skin==="upload"?de.upload:ri(de.skin).canvas;pt("skin-upload").onclick=()=>Ic.click();Ic.onchange=async()=>{let n=Ic.files[0];if(Ic.value="",!!n)try{let t=URL.createObjectURL(n),e=await Sc(t).finally(()=>URL.revokeObjectURL(t)),{canvas:i,slim:s}=Mc(e);de.upload=i,de.skin="upload",de.model=s?"slim":"classic",rs(`Loaded ${n.name}${e.height===32?" (an older 64\xD732 skin, converted)":""}. ${s?"Slim":"Classic"} arms detected.`,"ok"),Lu(),Uc(),Nc()}catch(t){rs(t.message,"err")}};pt("skin-download").onclick=()=>{if(!de)return;let n=document.createElement("a");n.href=a0().toDataURL("image/png"),n.download=`${ss.value||"skin"}.png`,n.click()};ss.oninput=()=>ss.classList.toggle("bad",!al.test(ss.value));Ru.onclick=async()=>{let n=ss.value.trim();if(!al.test(n))return ss.classList.add("bad"),rs("Names are 3\u201316 letters, digits or underscores.","err");let t={name:n,model:de.model,skin:de.skin};de.skin==="upload"&&(t.png=de.upload.toDataURL("image/png").split(",")[1]),Ru.disabled=!0,rs("Saving\u2026");try{let e=await fetch("api/profile",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),i=await e.json().catch(()=>({}));if(!e.ok)throw new Error(i.error||`Saving failed (${e.status}).`);oi=i.profile,de.skin==="upload"&&!bm(oi.skin)&&pu(oi.skin,de.upload),ee({type:"profile"}),ln("main")}catch(e){rs(e.message,"err")}finally{Ru.disabled=!1}};function Db(){if(Jt)return;let n=new Ts({canvas:is,antialias:!0,alpha:!0});n.setPixelRatio(Math.min(devicePixelRatio,2));let t=new As,e=new ze(30,1,.1,20);e.position.set(0,1.05,4.6),e.lookAt(0,.95,0);let i=new Yi(16777215,Math.PI*.6);i.position.set(1.5,2.5,3),t.add(i,new $i(16777215,Math.PI*.55)),Jt={r:n,sc:t,cam:e,model:null,turn:Math.PI-.5,texture:null,drag:null,t:0},is.addEventListener("pointerdown",s=>{Jt.drag=s.clientX,is.setPointerCapture(s.pointerId)}),is.addEventListener("pointermove",s=>{Jt.drag!==null&&(Jt.turn+=(s.clientX-Jt.drag)*.012,Jt.drag=s.clientX)}),is.addEventListener("pointerup",()=>Jt.drag=null)}function Nc(){!Jt||!de||(Jt.model&&(Jt.sc.remove(Jt.model.root),Jt.model.dispose()),Jt.texture?.dispose(),Jt.texture=Mn(a0()),Jt.model=Fr(Jt.texture,de.model==="slim"),Jt.model.root.traverse(n=>n.castShadow=!1),Jt.sc.add(Jt.model.root))}function c0(n){if(!Jt?.model||l0()!=="character")return;let t=is.clientWidth,e=is.clientHeight;is.width!==Math.floor(t*Jt.r.getPixelRatio())&&(Jt.r.setSize(t,e,!1),Jt.cam.aspect=t/e,Jt.cam.updateProjectionMatrix()),Jt.t+=n,Jt.drag===null&&(Jt.turn+=n*.25),Jt.model.animate(n,{yaw:Jt.turn+Math.sin(Jt.t*.7)*.4,pitch:Math.sin(Jt.t*.9)*.15,speed:0,sneaking:!1,swinging:!1}),Jt.model.root.rotation.y=0,Jt.r.render(Jt.sc,Jt.cam)}var Oc=n=>n?"On":"Off",Ub=["Low","Medium","High","Ultra"],Nb=[{key:"sens",label:"Look sensitivity",range:[10,300,5],show:n=>`${n}%`},{key:"volume",label:"Sound",range:[0,100,5],show:n=>n?`${n}%`:"Off"},{key:"fov",label:"Field of view",range:[50,110,1],show:n=>n},{key:"distance",label:"Render distance",range:[$o,Zo,1],show:n=>`${n} chunks`},{key:"view",label:"View",next:n=>(n+1)%Us.length,show:n=>Us[n]},{key:"shadows",label:"Shadows",next:n=>!n,show:Oc},{key:"shadowRes",label:"Shadow quality",next:n=>Ls[(Ls.indexOf(n)+1)%Ls.length],show:n=>`${Ub[Qr.indexOf(n)]} (${n}px)`},{key:"invert",label:"Invert mouse",next:n=>!n,show:Oc},{key:"hand",label:"Show hand",next:n=>!n,show:Oc},{key:"autoJump",label:"Auto-jump",next:n=>!n,show:Oc}],h0=Nb.map(n=>{if(n.range){let[e,i,s]=n.range,r=dn("b"),a=dn("input",{type:"range",min:e,max:i,step:s});return a.oninput=()=>Ys(n.key,Number(a.value)),{o:n,node:dn("label",{className:"slider"},dn("span",{},`${n.label}: `,r),a),input:a,value:r}}let t=dn("button",{className:"mc"});return t.onclick=()=>Ys(n.key,n.next(Dt[n.key])),{o:n,node:t,button:t}});pt("opts").replaceChildren(...h0.map(n=>n.node));function Iu(){for(let{o:n,input:t,value:e,button:i}of h0){let s=Dt[n.key];t?(t.value=s,e.textContent=n.show(s)):i.textContent=`${n.label}: ${n.show(s)}`}}Fn("*",Iu);var No=pt("overlay"),Ob=[...No.querySelectorAll(".screen")],Fc="main",Vr=()=>!No.classList.contains("hidden"),l0=()=>Vr()?Fc:null;function ln(n){Fc==="character"&&n!=="character"&&o0(),Fc=n,No.classList.remove("hidden");for(let t of Ob)t.hidden=t.dataset.screen!==n;n==="character"&&r0(),n==="options"&&Iu()}function Bc(){No.classList.add("hidden")}No.addEventListener("click",n=>{let t=n.target.closest("[data-go]");t&&ln(t.dataset.go)});document.addEventListener("keydown",n=>{n.code==="Escape"&&Vr()&&Fc!=="main"&&document.activeElement?.id!=="char-name"&&ln("main")});var zc=pt("inventory"),Du=pt("inv-cursor"),os=!1,u0=!1,Uu=Array.from({length:ji},(n,t)=>Uo({onpointerdown:e=>zb(e,t)}));pt("inv-main").replaceChildren(...Uu.slice(Pn));pt("inv-hotbar").replaceChildren(...Uu.slice(0,Pn));var Fb=sm.map(n=>{let t=Uo({onpointerdown:e=>kb(e,n)});return kr(t,[n,1]),t});pt("inv-palette").replaceChildren(...Fb);var kc=()=>os;function Nu(){os?Hc():Bb()}function Bb(){!ct.self||At.dead||(u0=gn(),ai(),os=!0,zc.hidden=!1,f0())}function Hc(n=!0){os&&(os=!1,zc.hidden=!0,mm(),n&&u0&&Ai())}function f0(){if(!os)return;let n=Xn();pt("inv-title").textContent=n?"Creative":"Inventory",pt("inv-palette").hidden=!n,pt("inv-main").hidden=n,pt("inv-hint").textContent=n?"Click an item to take a stack \xB7 Shift-click to put it in the hotbar \xB7 Drop a stack here to delete it":"Click to pick up \xB7 Right-click for half \xB7 Shift-click to move \xB7 Click outside to throw",Uu.forEach((t,e)=>kr(t,_e.slots[e])),kr(Du,_e.cursor),Du.hidden=!_e.cursor}gc(f0);var d0=n=>n.button===2?2:0;function zb(n,t){n.stopPropagation(),dm(t,d0(n),n.shiftKey),Ou(n)}function kb(n,t){n.stopPropagation(),_e.cursor?yc("cursor",null):n.shiftKey?yc(gm(),[t,ii]):yc("cursor",[t,d0(n)===2?1:ii]),Ou(n)}function Ou(n){Du.style.transform=`translate(${n.clientX}px, ${n.clientY}px)`}zc.addEventListener("pointermove",Ou);zc.addEventListener("pointerdown",n=>{n.target.closest(".inv-panel")||pm()});pt("inv-done").onclick=()=>Hc();document.addEventListener("keydown",n=>{n.repeat||!(n.code==="KeyE"||os&&n.code==="Escape")||!os&&!gn()||(n.preventDefault(),Nu())});var Oo=pt("death"),p0=pt("hurt"),m0=()=>!Oo.hidden;function Fu(n=20){Object.assign(At,{hp:n,dead:!1,voidSent:!1}),Oo.hidden=!0}function Bu(){ee({type:"respawn"}),Oo.hidden=!0}function g0(n){!ct.self||At.dead||At.hp>=20||n-At.regenAt<4e3||(At.regenAt=n,ee({type:"regen"}))}pt("respawn").onclick=()=>{Bu(),Ai()};pt("death-title").onclick=()=>{Oo.hidden=!0,ln("main")};Kt("hurt",n=>{let t=performance.now();if(n.id!==ct.self?.id){let e=ie.get(n.id);if(!e)return;e.hurtAt=t;let i=e.model.root.position;Bn("hurt",i.x,i.y+1.5,i.z,{volume:.8});return}if(At.hp=n.hp,At.hurtAt=t,At.roll=(Math.random()<.5?-1:1)*.25,p0.classList.add("on"),setTimeout(()=>p0.classList.remove("on"),80),Bn("hurt",D.pos.x,D.pos.y+1.5,D.pos.z,{volume:.8}),n.knock){let[e,i,s]=n.knock;D.knock.x=e*7*s,D.knock.z=i*7*s,D.flying||(D.vel.y=Math.max(D.vel.y,6.5))}});Kt("death",n=>{Ri(ni(n.text));let t=performance.now();if(n.id!==ct.self?.id){let e=ie.get(n.id);e&&Object.assign(e,{dead:!0,deadAt:t});return}Object.assign(At,{hp:0,dead:!0,deadAt:t}),D.flying=!1,Ti(),pt("death-msg").textContent=n.text,_0(),Hc(!1),Bc(),Oo.hidden=!1,ai()});Kt("respawn",n=>{if(n.id!==ct.self?.id){let t=ie.get(n.id);t&&Object.assign(t,{dead:!1,snap:!0});return}Fu(n.hp),Ds()});Kt("health",n=>{At.hp=n.hp});var x0=300,zu=0,y0=0;function Vc(n,t,e){e*=Dt.sens/100,D.yaw-=n*e,D.pitch=Math.max(-1.55,Math.min(1.55,D.pitch-t*e*(Dt.invert?-1:1)))}var ku=()=>Ys("view",(Dt.view+1)%Us.length);function Gc(n,t=!1){if(we.keys.add(n),t)return;/^Digit[1-9]$/.test(n)&&Nr(Number(n.slice(5))-1),n==="KeyF"&&Br(),n==="KeyQ"&&xc(we.keys.has("ControlLeft")||we.keys.has("ControlRight")),n==="KeyG"&&Ys("shadows",!Dt.shadows),(n==="F5"||n==="KeyV")&&ku();let e=performance.now();n==="KeyW"&&(e-y0<x0&&(D.sprinting=!0),y0=e),n==="Space"&&Xn()&&(e-zu<x0?(D.flying=!D.flying,D.vel.y=0,zu=0):zu=e)}function Hu(n,t){try{n.setPointerCapture(t)}catch{}}function v0(n,t,e){let i=n.querySelector("#stick-zone"),s=n.querySelector("#stick"),r=n.querySelector("#knob"),a=null,o=0,c=0,l=new Map,u=new Map;i.addEventListener("pointerdown",g=>{if(a!==null)return;g.preventDefault(),a=g.pointerId,Hu(i,g.pointerId);let x=i.getBoundingClientRect();o=g.clientX,c=g.clientY,s.style.left=`${o-x.left}px`,s.style.top=`${c-x.top}px`,s.classList.add("on"),h(0,0)}),i.addEventListener("pointermove",g=>{if(g.pointerId!==a)return;let x=g.clientX-o,m=g.clientY-c,d=Math.hypot(x,m);d>52&&(x*=52/d,m*=52/d),h(x,m),e.move(x/52,m/52)});let f=g=>{g.pointerId===a&&(a=null,s.classList.remove("on"),e.move(0,0))};i.addEventListener("pointerup",f),i.addEventListener("pointercancel",f);function h(g,x){r.style.transform=`translate(${g}px, ${x}px)`}t.addEventListener("pointerdown",g=>{g.pointerType==="mouse"||n.hidden||(Hu(t,g.pointerId),l.set(g.pointerId,[g.clientX,g.clientY]))}),t.addEventListener("pointermove",g=>{let x=l.get(g.pointerId);x&&(e.look(g.clientX-x[0],g.clientY-x[1]),l.set(g.pointerId,[g.clientX,g.clientY]))});let p=g=>l.delete(g.pointerId);t.addEventListener("pointerup",p),t.addEventListener("pointercancel",p);for(let g of n.querySelectorAll("[data-t]")){g.addEventListener("pointerdown",m=>{m.preventDefault(),Hu(g,m.pointerId),u.set(m.pointerId,g),g.classList.add("down"),e.down(g.dataset.t)});let x=m=>{u.get(m.pointerId)===g&&(u.delete(m.pointerId),g.classList.remove("down"),e.up(g.dataset.t))};g.addEventListener("pointerup",x),g.addEventListener("pointercancel",x),g.addEventListener("contextmenu",m=>m.preventDefault())}return{reset(){for(let g of u.values())g.classList.remove("down"),e.up(g.dataset.t);u.clear(),l.clear(),a!==null&&(a=null,s.classList.remove("on")),e.move(0,0)}}}var Vu=pt("touch"),{keys:Gr}=we,Hb=v0(Vu,Si,{look:(n,t)=>Vc(n,t,.006),move(n,t){we.move.x=n,we.move.z=t},down(n){n==="jump"?Gc("Space"):n==="sneak"?D.flying||!Gr.has("ShiftLeft")?Gr.add("ShiftLeft"):Gr.delete("ShiftLeft"):n==="sprint"?we.sprintArmed=!D.sprinting:n==="break"?Lc():n==="place"?Br():n==="view"?ku():n==="chat"?Xc():n==="inv"?Nu():n==="drop"?xc(!1):n==="pause"&&(ai(),ln("main")),Wc()},up(n){n==="jump"?Gr.delete("Space"):n==="sneak"&&D.flying?Gr.delete("ShiftLeft"):n==="break"?Ti():n==="place"&&zr(),Wc()}}),M0=()=>Hb.reset(),Vb=Vu.querySelector('[data-t="sneak"]'),Gb=Vu.querySelector('[data-t="sprint"]');function Wc(){Vb.classList.toggle("on",Gr.has("ShiftLeft")&&!D.flying),Gb.classList.toggle("on",we.sprintArmed||D.sprinting)}var Fo=pt("play"),Wb=pt("touch"),Wr=fs,Xr=!1,Un=()=>document.pointerLockElement===Si,ks=()=>Wr,S0=()=>Xr,gn=()=>Un()||Xr;addEventListener("pointerdown",n=>{gn()||(Wr=n.pointerType==="touch"||n.pointerType==="pen",Bo())},!0);function Bo(){document.body.classList.toggle("touch",Wr),Wb.hidden=!(Wr&&Xr)}function b0(){Bc(),Fo.textContent="Back to game"}function Ai(){if(Cf(),!!ct.self){if(!Wr)return Si.requestPointerLock()?.catch?.(()=>!Un()&&ln("main"));Xr=!0,b0(),document.fullscreenElement||document.documentElement.requestFullscreen?.({navigationUI:"hide"})?.catch(()=>{}),Bo()}}function ai(){Xr=!1,we.sprintArmed=!1,M0(),we.keys.clear(),Ti(),Bo(),Un()&&document.exitPointerLock()}Fo.onclick=()=>{At.dead&&Bu(),Ai()};function Gu(n){Fo.disabled=!n,n&&Fo.textContent==="Connecting\u2026"&&(Fo.textContent="Play")}Si.addEventListener("click",()=>!Wr&&!Un()&&!Vr()&&Ai());document.addEventListener("pointerlockchange",()=>{if(Un())return b0();Xr||(we.keys.clear(),Ti(),!qr()&&!m0()&&!kc()&&ln("main"))});addEventListener("beforeunload",n=>{Un()&&n.preventDefault()});var Yr=pt("chat"),Wu=pt("log"),$r=pt("say"),Xb=12,qr=()=>Yr.classList.contains("open");function Ri(n,t){let e=document.createElement("div");for(e.innerHTML=n,t&&(e.className=t),Wu.append(e);Wu.children.length>Xb;)Wu.firstChild.remove();setTimeout(()=>e.classList.add("old"),1e4)}function Xc(n=""){let t=gn();ai(),Yr.classList.add("open"),Yr.dataset.resume=t?"1":"",pt("overlay").classList.add("hidden"),$r.value=n,$r.focus()}function qc(){Yr.classList.remove("open"),$r.blur(),ks()&&Yr.dataset.resume?Ai():Un()||ln("main")}function _0(){Yr.classList.remove("open")}pt("say-form").addEventListener("submit",n=>{n.preventDefault();let t=$r.value.trim();t.startsWith("/")?ee({type:"command",text:t}):t&&ee({type:"chat",text:t}),$r.value="",qc(),Ai()});$r.addEventListener("blur",()=>{ks()&&qr()&&setTimeout(()=>qr()&&qc(),150)});Kt("chat",n=>Ri(`<b style="color:${ni(n.color)}">${ni(Ji(n))}</b> ${ni(n.text)}`));Kt("system",n=>{for(let t of String(n.text).split(`
`))Ri(ni(t),n.error?"sys err":"sys")});var ie=new Map;function qb(n){let t=document.createElement("canvas"),e=t.getContext("2d"),i="bold 28px ui-monospace, Menlo, monospace";e.font=i,t.width=Math.ceil(e.measureText(n).width)+20,t.height=40,e.font=i,e.fillStyle="rgba(0,0,0,0.5)",e.fillRect(0,0,t.width,t.height),e.fillStyle="#fff",e.textBaseline="middle",e.fillText(n,10,21);let s=new Rs(new qi({map:new Tr(t),depthTest:!1}));return s.scale.set(t.width/t.height*.35,.35,1),s.position.y=2.2,s.renderOrder=10,s}function Xu(n){let t=ie.get(n.id);qu(n.id);let e=Fr(ri(n.skin).texture,n.model==="slim"),i=qb(Ji(n));e.root.add(i),e.root.position.fromArray(n.p),t&&e.root.position.copy(t.model.root.position),Qt.add(e.root),ie.set(n.id,{...n,model:e,tag:i,target:new P().fromArray(n.p),yaw:t?.yaw??n.ry,pitch:t?.pitch??n.rx??0,deadAt:-1e9,speed:0,last:e.root.position.clone(),stepDist:0,hitTimer:0}),zs()}function qu(n){let t=ie.get(n);t&&(Qt.remove(t.model.root),t.model.dispose(),t.tag.material.map.dispose(),t.tag.material.dispose(),ie.delete(n),zs())}function T0(n){for(let t of[...ie.keys()])qu(t);for(let t of n)Xu(t)}function A0(n,t){let e=1-Math.exp(-n*12);for(let i of ie.values()){let s=i.model.root;s.position.lerp(i.target,e);let r=Math.hypot(s.position.x-i.last.x,s.position.z-i.last.z);i.last.copy(s.position),i.speed+=(r/Math.max(n,.001)-i.speed)*Math.min(1,n*10),i.yaw+=Math.atan2(Math.sin(i.ry-i.yaw),Math.cos(i.ry-i.yaw))*e,i.pitch+=((i.rx??0)-i.pitch)*e,i.model.animate(n,{yaw:i.yaw,pitch:i.pitch,speed:i.speed,sneaking:!!(i.s&1),swinging:!!(i.s&2)}),i.tag.position.y=i.s&1?2:2.2,i.model.shade(Ki(s.position.x,s.position.y+1,s.position.z),t,i),s.visible=!i.dead||t-i.deadAt<1500,i.dead||Yb(i,r,n)}}var E0=new P,w0=new P;function Yb(n,t,e){let i=n.model.root.position,s=Math.abs(i.y-n.target.y)<.3?To(i):0;if(s&&(n.stepDist+=t,n.stepDist>Dr&&(n.stepDist=0,hn(It[s],"step",i.x,i.y,i.z,n.s&1?.5:1))),n.hitTimer-=e,n.s&2&&n.hitTimer<=0){n.hitTimer=bu;let r=n.rx??0,a=Math.cos(r);E0.set(i.x,i.y+(n.s&1?ou:ru),i.z),w0.set(-Math.sin(n.ry)*a,Math.sin(r),-Math.cos(n.ry)*a);let o=ns(6,E0,w0);o&&hn(It[Re(...o.hit)],"hit",o.hit[0]+.5,o.hit[1]+.5,o.hit[2]+.5)}}var R0=n=>`<b style="color:${ni(n.color)}">${ni(Ji(n))}</b>`;Kt("join",n=>{Xu(n.player),Ri(`${R0(n.player)} joined`)});Kt("leave",n=>{let t=ie.get(n.id);t&&Ri(`${R0(t)} left`),qu(n.id)});Kt("move",n=>{let t=ie.get(n.id);t&&(t.target.fromArray(n.p),t.snap&&(t.model.root.position.copy(t.target),t.last.copy(t.target),t.snap=!1),t.ry=n.ry,t.rx=n.rx,t.s=n.s)});Kt("swing",n=>ie.get(n.id)?.model.swing());Kt("mode",n=>{n.id===ct.self?.id?_c(n.mode):ie.has(n.id)&&(ie.get(n.id).mode=n.mode)});Kt("profile",({player:n})=>{if(n.id===ct.self?.id)ct.self={...ct.self,...n},Cc(),zs();else if(ie.has(n.id)){let t=ie.get(n.id);Xu({...n,p:t.target.toArray(),ry:t.ry,rx:t.rx,s:t.s})}});var $b=300*1e3,$c=.25,Yc=$c/2,Zb=16,C0=Math.pow(.98,20),Jb=Math.pow(.6*.98,20),P0=80,Kb=300,Hs=new Map;function L0(n){for(let t of[n.y,n.y+$c-.001])for(let e of[n.x-Yc,n.x+Yc])for(let i of[n.z-Yc,n.z+Yc])if(wo(Math.floor(e),Math.floor(t),Math.floor(i)))return!0;return!1}function D0(n,t){let e=n.pos,i=n.vel;for(let r=0;r<3&&L0(e);r++)e.y=Math.floor(e.y)+1;i.y-=Zb*t,n.onGround=!1;for(let r of["x","y","z"])e[r]+=i[r]*t,L0(e)&&(e[r]-=i[r]*t,r==="y"&&i.y<0&&(n.onGround=!0),i[r]=0);let s=Math.pow(n.onGround?Jb:C0,t);i.x*=s,i.z*=s,i.y*=Math.pow(C0,t)}var jb=n=>n===1?1:n<=16?2:n<=32?3:4;function I0(n){n.group.clear();let t=mc(n.b),e=Ro(n.b);for(let i=0,s=jb(n.n);i<s;i++){let r=new ae(t,n.material);e?(r.scale.setScalar($c*2),r.position.set(i*.03,.15+i*.03,-i*.04)):(r.scale.setScalar($c),r.position.set(i?(i*37%7/7-.5)*.12:0,i*.03,i?(i*53%5/5-.5)*.12:0)),r.castShadow=!0,n.group.add(r)}}function Yu(n){let t=performance.now(),e=Hs.get(n.id);if(e){e.n!==n.n&&(e.n=n.n,I0(e));return}let i={id:n.id,b:n.b,n:n.n,pos:new P(...n.p),vel:new P(...n.v),bornAt:t-n.age,readyAt:t+n.wait,askedAt:0,onGround:!1,leaving:null,group:new He,material:new fn({map:Cr,alphaTest:.5}),spin:Math.random()*Math.PI*2};I0(i);for(let s=Math.min(n.age/1e3,3);s>0;s-=.05)D0(i,.05);Qt.add(i.group),Hs.set(i.id,i)}function Zc(n){Qt.remove(n.group),n.material.dispose(),Hs.delete(n.id)}function U0(){for(let n of[...Hs.values()])Zc(n)}var Qb=n=>_e.slots.some(t=>!t||t[0]===n&&t[1]<ii);function N0(n,t){let e=D.pos;for(let i of Hs.values()){if(t-i.bornAt>$b){Zc(i);continue}if(i.leaving){i.leaving.t+=n/.15,i.group.position.lerp(i.leaving.to,Math.min(1,i.leaving.t)),i.leaving.t>=1&&Zc(i);continue}let s=Math.abs(i.pos.x-e.x)<P0&&Math.abs(i.pos.z-e.z)<P0;if(i.group.visible=s,!s)continue;D0(i,n),i.spin+=n*1.6,i.group.position.set(i.pos.x,i.pos.y+.1+Math.sin(i.spin*1.3)*.05,i.pos.z),i.group.rotation.y=i.spin,i.material.color.setScalar(Ki(i.pos.x,i.pos.y+.2,i.pos.z));let r=Math.abs(i.pos.x-e.x),a=Math.abs(i.pos.z-e.z),o=i.pos.y-e.y;r<1.3&&a<1.3&&o>-.5&&o<2.3&&ct.self&&!At.dead&&t>=i.readyAt&&t-i.askedAt>Kb&&Qb(i.b)&&(i.askedAt=t,ee({type:"pickup",id:i.id}))}}var O0=n=>[...Hs.values()].filter(t=>t.pos.distanceTo(D.pos)<n).length;Kt("item",n=>Yu(n.item));Kt("itemgone",n=>{let t=Hs.get(n.id);if(!t)return;let e=n.by===ct.self?.id?D.pos:ie.get(n.by)?.model.root.position;if(!e)return Zc(t);Bn("pop",t.pos.x,t.pos.y,t.pos.z,{volume:.35,rate:1.4+Math.random()*.6}),t.leaving={to:e.clone().setY(e.y+.8),t:0}});var Jc=new Map;function B0(n,t,e,i){if(!n.ind.length)return null;let s=new Le;s.setAttribute("position",new ce(n.pos,3)),s.setAttribute("normal",new ce(n.nor,3)),s.setAttribute("uv",new ce(n.uv,2)),s.setAttribute("aLight",new ce(n.light,3)),s.setIndex(n.ind);let r=new ae(s,t);return r.position.set(i.cx*16,0,i.cz*16),r.castShadow=e,r.receiveShadow=!0,Qt.add(r),r}function $u(n){for(let t of Jc.get(n)??[])Qt.remove(t),t.geometry.dispose();Jc.delete(n)}var t1={mesh(n,t){$u(n),Jc.set(n,[B0(t.solid,qh,!0,n),B0(t.water,zp,!1,n)].filter(Boolean))},unload:$u,request(n){if(Zh())for(let t=0;t<n.length;t+=32){let e=n.slice(t,t+32);ee({type:"chunks",list:e.map(i=>[i.cx,i.cz])});for(let i of e)i.requested=!0}}};function Zu(n,t){for(let e of[...Jc.keys()])$u(e);U0(),ct.world=new Yo(n,t,Dt.distance)}Fn("distance",n=>{ct.world&&(ct.world.loadR=n)});function z0(n){ct.world.update(Math.floor(D.pos.x)>>4,Math.floor(D.pos.z)>>4,n,t1)}function wu(n,t,e,i,s){ct.world?.setBlock(n,t,e,i)&&ee({type:"set",x:n,y:t,z:e,b:i,slot:s})}Kt("chunkdata",n=>{if(!(!ct.world||n.gen!==ct.world.gen)){ct.world.applyEdits(n.cx,n.cz,n.edits);for(let t of n.items??[])Yu(t)}});Kt("set",n=>{if(!It[n.b])return;let t=Re(n.x,n.y,n.z);if(t>=0&&t!==n.b&&!n.undo){let[e,i]=n.b===0?["break",t]:["place",n.b];hn(It[i],e,n.x+.5,n.y+.5,n.z+.5)}ct.world?.setBlock(n.x,n.y,n.z,n.b)});var Ju=pt("status"),ju=pt("debug"),k0=250,zo=!1,Qc="Connecting\u2026",Kc=0,jc=performance.now(),Ku=0,H0=0,V0=0;function tl(n){Qc=n,Qu()}function Qu(){Ju.textContent=Qc??(ks()?"Tap for debug info":"F3 for debug info"),Ju.hidden=zo&&!Qc,ju.hidden=!zo}function el(){zo=!zo,Ku=0,Qu()}Ju.addEventListener("click",()=>ks()&&!Qc&&el());ju.addEventListener("click",()=>ks()&&el());function G0(n){Kc++,n-jc>=k0&&(H0=Math.round(Kc*1e3/(n-jc)),V0=(n-jc)/Kc,Kc=0,jc=n),!(n-Ku<k0)&&(Ku=n,Qu(),zo&&ju.replaceChildren(...n1().map(([t,e])=>dn("div",{},dn("b",{textContent:t}),e))))}var Ci=(n,t=2)=>n.toFixed(t),e1=["north (-Z)","west (-X)","south (+Z)","east (+X)"];function n1(){let n=D.pos,t=ct.world,e=Math.floor(n.x),i=Math.floor(n.y),s=Math.floor(n.z),r=(D.yaw%(2*Math.PI)+2*Math.PI)%(2*Math.PI),[a,o]=t?t.getLight(e,Math.min(95,i),s):[15,0],c=t?ns(8)?.hit:null,l=0;for(let x of t?.chunks.values()??[])l+=x.meshed;let u=(fc*24+6)%24,f=`${String(Math.floor(u)).padStart(2,"0")}:${String(Math.floor(u%1*60)).padStart(2,"0")}`,h=[D.flying?"flying":D.onGround?"on ground":"in the air",D.sprinting&&"sprinting",D.sneaking&&"sneaking"].filter(Boolean),{render:p,memory:g}=Ze.info;return[["Yardcraft ",`world \u201C${Eo}\u201D \xB7 seed ${t?.seed??"?"} \xB7 generation ${t?.gen??"?"}`],["Performance ",`${H0} fps (${Ci(V0,1)} ms/frame)`],["Latency ",Pr===null?"measuring\u2026":`${Pr} ms`],["XYZ ",`${Ci(n.x,3)} / ${Ci(n.y,3)} / ${Ci(n.z,3)}`],["Block ",`${e} ${i} ${s} \xB7 chunk ${e>>4} ${s>>4} (at ${e&15} ${s&15})`],["Facing ",`${e1[Math.round(r/(Math.PI/2))%4]} \xB7 yaw ${Ci(r*180/Math.PI,1)}\xB0 pitch ${Ci(D.pitch*180/Math.PI,1)}\xB0`],["Looking at ",c?`${It[Re(...c)]?.name??"?"} at ${c.join(" ")}`:"nothing"],["Light ",`sky ${a} \xB7 block ${o}`],["Moving ",`${h.join(", ")} \xB7 ${Ci(Math.hypot(D.vel.x,D.vel.z))} blocks/s`],["Mode ",ct.mode],["Health ",`${At.hp}/${20}${At.dead?" (dead)":""}`],["Items ",`${O0(32)} on the ground within 32 blocks`],["Mobs ",`${Xm(32)} within 32 blocks \xB7 ${qm()} known`],["Time ",`${f} (day ${Ci(fc*100,0)}%)`],["Players ",`${ie.size+(ct.self?1:0)} online`],["Chunks ",`${t?.chunks.size??0} loaded \xB7 ${l} drawn \xB7 render distance ${Dt.distance}`],["Renderer ",`${p.calls} draw calls \xB7 ${Math.round(p.triangles/1e3)}k triangles \xB7 ${g.geometries} geometries`],["Graphics ",`shadows ${Dt.shadows?"on":"off"} \xB7 fov ${Dt.fov} \xB7 ${Us[Dt.view].toLowerCase()} \xB7 ${innerWidth}\xD7${innerHeight} @${Ci(Ze.getPixelRatio(),1)}x`]]}var X0=pt("hearts"),i1=[".###.###.","#########","#########","#########",".#######.","..#####..","...###...","....#...."];function s1(n,t){let e=document.createElement("canvas");e.width=e.height=9;let i=e.getContext("2d"),s=(r,a)=>i1[a]?.[r]==="#";for(let r=0;r<8;r++)for(let a=0;a<9;a++){if(!s(a,r))continue;let o=s(a-1,r)&&s(a+1,r)&&s(a,r-1)&&s(a,r+1),c=n==="full"||n==="half"&&a<=4;i.fillStyle=o?c?a===2&&r===1?"#ffb3b3":r>=4?"#b01010":"#e02020":"#2b0d0d":t,i.fillRect(a,r+1,1,1)}return`url(${e.toDataURL()})`}var q0={};for(let n of["full","half","empty"])for(let[t,e]of[["dark","#1a0505"],["blink","#f4f4f4"]])q0[`${n}-${t}`]=s1(n,e);var r1=Array.from({length:20/2},()=>X0.appendChild(document.createElement("i"))),W0="";function Y0(n){let t=n-At.hurtAt<600&&Math.floor((n-At.hurtAt)/120)%2===0,e=At.hp<=4&&!At.dead?Math.floor(n/90):-1,i=!!ct.self&&!Xn(),s=`${At.hp}|${t}|${e}|${i}`;s!==W0&&(W0=s,X0.hidden=!i,r1.forEach((r,a)=>{let o=At.hp>=a*2+2?"full":At.hp===a*2+1?"half":"empty";r.style.backgroundImage=q0[`${o}-${t?"blink":"dark"}`],r.style.transform=e>=0?`translateY(${(e*7+a*13)%5-2}px)`:""}))}var nl=pt("reset-timer"),tf=null,$0="";function ef(n){tf=n}function Z0(){let n=tf===null?null:Math.max(0,Math.ceil((tf-eu())/1e3)),t=n===null?"":n>0?`World resets in ${Math.floor(n/60)}:${String(n%60).padStart(2,"0")}`:"Resetting\u2026";t!==$0&&($0=t,nl.hidden=!t,nl.textContent=t,nl.classList.toggle("soon",n!==null&&n<=60),nl.classList.toggle("now",n!==null&&n<=15))}document.addEventListener("mousemove",n=>{Un()&&Vc(n.movementX,n.movementY,.0025)});var nf=!1;document.addEventListener("mousedown",n=>{if(!Un())return;let t=n.metaKey||n.altKey;n.button===2||n.button===0&&t?(nf=!0,Br()):n.button===0&&Lc()});document.addEventListener("mouseup",n=>{nf&&(n.button===2||n.button===0)?(nf=!1,zr()):n.button===0&&Ti()});document.addEventListener("contextmenu",n=>n.preventDefault());Si.addEventListener("wheel",n=>{Un()&&(n.preventDefault(),Nr(Qi()+Math.sign(n.deltaY)))},{passive:!1});document.addEventListener("keydown",n=>{if(!kc()){if(qr()){n.code==="Escape"&&qc();return}if(n.code==="F3"){n.preventDefault(),n.repeat||el();return}if((n.code==="Enter"||n.code==="Slash")&&ct.self&&(gn()||!Vr())){n.preventDefault(),Xc(n.code==="Slash"?"/":"");return}gn()&&(n.code==="Space"&&n.preventDefault(),Gc(n.code,n.repeat))}});document.addEventListener("keyup",n=>{we.keys.delete(n.code),n.code==="KeyF"&&zr()});addEventListener("keydown",n=>n.code==="F5"&&gn()&&n.preventDefault(),!0);Kt("welcome",n=>{let t=ct.world&&ct.world.gen!==n.gen;ct.self=n.self,n.forgetGuest&&i0(),_c(n.self.mode??"survival"),lu(n.inv,n.cursor),Cc(),Fu(ct.self.hp??20),nu(n),ef(n.resetAt),Zu(n.seed,n.gen),T0(n.players),vu(n.mobs),ct.spawned?t&&Ds():(Ds(),ct.spawned=!0,Ri("Type <b>/help</b> to see the commands you can use.","sys")),Gu(!0),tl(null),zs()});Kt("reset",n=>{ef(n.resetAt),Zu(n.seed,n.gen),vu([]),Ds()});Kt("teleport",n=>{n.spawn&&Ds()});_l(Dt.volume/100);Fn("volume",n=>_l(n/100));Au();Bo();tl("Connecting\u2026");function j0(){tl("Reconnecting\u2026"),Gu(!1)}var o1=null,sf=0;function J0(){let n=++sf;(o1??(o1=Pu())).then(()=>n===sf&&Jh(j0))}function a1(){sf++,gn()&&(ai(),ln("main")),Hp(),j0()}Hr?n0(J0,a1):J0();var K0=performance.now();function Q0(n){let t=Math.min(.05,(n-K0)/1e3);K0=n,ct.self&&ct.world&&(em(t),nm(n,Eu()),jm(t,gn()),z0(gn()?6:16),g0(n)),im(t),Pf(Ee.position.x,Ee.position.y,Ee.position.z,Ee.rotation.y),Zp(t),G0(n),S0()&&Wc(),Y0(n),Z0(),A0(t,n),Zm(t,n,Eu(),Qm()),N0(t,n),Hm(t,n),Fp(Ym()),c0(t),requestAnimationFrame(Q0)}requestAnimationFrame(Q0);
