import{x as t,_ as e,ζ as o,a as n,b as s,c as r,d as i,O as a,e as l,K as c,h as p,o as d,p as u,M as g,N as f,g as v,L as h,q as m,f as w,r as y,s as C,u as k,P as x,G as b,Q as j,R as B}from"./index-bc691374.js";var N,D,L,O,F,$,M,I="https://github.com/amadeusITGroup/ivy/tree/master/",z=(N={},D=["width","105px","height","44px","viewBox","0 0 105 44"],L=["transform","translate(3,3)","fill","none","fill-rule","nonzero","stroke-linecap","round","stroke-width","7"],O=["d","M12.5,0.5 L0.5,21.5"],F=["stroke-linejoin","round","points","55.5 0.5 43.2291116 21.5970036 31.1303622 0.5"],$=["stroke-linejoin","round","points","98.3696378 1 86.1524963 22.0575024 77.9815673 36.5759163 86.1848189 22.0575024 74 1"],M=function(){function r(){this.ΔΔclassName="ivyLogoDark"}return r.prototype.ΔDefault=function(e){switch(e){case"className":return"ivyLogoDark"}return t},e([o(),n("design:type",Object)],r.prototype,"className",void 0),r=e([s],r)}(),r("ivyLogo",".../doc/widgets.ts",N,(function(t,e,o){var n=o.className,s=i(t,N,5);a(t,0,"http://www.w3.org/2000/svg"),l(t,s,0,0,"svg",1,0,D),c(t,0,0,"class",p(t,0,n)),l(t,s,1,1,"g",1,0,L),l(t,s,2,2,"path",0,0,O),l(t,s,3,2,"polyline",0,0,F),l(t,s,4,2,"polyline",0,0,$),a(t),d(t)}),M)),A=function(){var g={},f=["width","38px","height","21px","viewBox","0 0 38 21"],v=["class","triangle","stroke","none","stroke-width","1","fill","none","fill-rule","evenodd","stroke-linejoin","round"],h=["transform","translate(-308, -180)","fill-rule","nonzero"],m=["points","327 181 345 201 309 201"],w=function(){function r(){this.ΔΔpos="top"}return r.prototype.ΔDefault=function(e){switch(e){case"pos":return"top"}return t},e([o(u),n("design:type",String)],r.prototype,"pos",void 0),r=e([s],r)}();return r("triangle",".../doc/widgets.ts",g,(function(t,e,o){var n=o.pos,s=i(t,g,4),r="top"===n?-.8:.8;a(t,0,"http://www.w3.org/2000/svg"),l(t,s,0,0,"svg",1,0,f),c(t,0,0,"class",p(t,0,n)),l(t,s,1,1,"g",1,0,v),l(t,s,2,2,"g",1,0,h),l(t,s,3,3,"polygon",0,0,m),c(t,0,3,"transform",p(t,1,"translate(327, 191) scale(1, "+r+") translate(-327, -188) ")),a(t),d(t)}),w)}(),R=/top/,S=/bottom/,_=function(){var a={},u=["pos","top"],w=["pos","bottom"],y=[1,3],C=function(){function r(){this.ΔΔindicators="top"}return r.prototype.ΔDefault=function(e){switch(e){case"indicators":return"top"}return t},e([o(),n("design:type",Object)],r.prototype,"$content",void 0),e([o(),n("design:type",Object)],r.prototype,"indicators",void 0),r=e([s],r)}();return r("code",".../doc/widgets.ts",a,(function(t,e,o){o.$content;var n,s,r,C,k=o.indicators,x=0,b=0,j=i(t,a,4);l(t,j,0,0,"div",1),c(t,0,0,"class",p(t,0,"code "+k.replace(";"," "))),g(t,j,1,1,1),k.match(R)&&(s=(n=f(t,0,1,1,++x)).cm,v(n,s,0,0,0,p(n,0,A),1,0,u),d(n)),h(t,j,2,1),m(t,0,2,e,1),g(t,j,3,1,1),k.match(S)&&(C=(r=f(t,0,3,1,++b)).cm,v(r,C,0,0,0,p(r,0,A),1,0,w),d(r)),d(t,j,y)}),C)}(),q=function(){var a={},u=["class","title"],v=[" ",""," "],y=[1,3],C=[1,3,4],k=function(){function r(){this.ΔΔtitle="[title]",this.ΔΔclassName="variantA",this.ΔΔproportions="2;2;10;1"}return r.prototype.ΔDefault=function(e){switch(e){case"title":return"[title]";case"className":return"variantA";case"proportions":return"2;2;10;1"}return t},e([o(),n("design:type",Object)],r.prototype,"title",void 0),e([o(),n("design:type",Object)],r.prototype,"className",void 0),e([o(),n("design:type",Object)],r.prototype,"proportions",void 0),e([o(),n("design:type",Object)],r.prototype,"$content",void 0),r=e([s],r)}();return r("infoBlock",".../doc/widgets.ts",a,(function(t,e,o){var n,s,r,k,x,b,j=o.title,B=o.className,N=o.proportions,D=(o.$content,0),L=0,O=0,F=i(t,a,4);h(t,F,0,0);var $=N.split(";");g(t,F,1,1,1),4!==$.length&&console.log("[*infoBlock] Invalid proportions value: "+N),l(t,F,2,1,"div",1),c(t,0,2,"class",p(t,0,"infoBlock "+B)),g(t,F,3,2,1);for(var M=0;4>M;M++)L=O=0,s=(n=f(t,0,3,5,++D)).cm,h(n,s,0,0),g(n,s,1,1,1),"0"!==$[M]&&(l(n,s,2,1,"div",1),c(n,0,2,"style",p(n,0,"flex:"+$[M])),c(n,0,2,"class",p(n,1,2==M?"content":"")),g(n,s,3,2,1),g(n,s,4,2,1),1===M?(k=(r=f(n,0,3,2,++L)).cm,l(r,k,0,0,"div",1,0,u),w(r,k,0,1,1,0,v,1,p(r,0,j)),d(r)):2===M&&(b=(x=f(n,0,4,1,++O)).cm,h(x,b,0,0),m(x,0,0,e,1),d(x)),d(n,s,C));d(t,F,y)}),k)}(),G=function(){function t(){}return e([y(C),n("design:type",String)],t.prototype,"name",void 0),e([y(),n("design:type",Object)],t.prototype,"$content",void 0),t=e([k],t)}(),Z=function(){var t={},a=["class","notions"],c=["class","block"],u=["class","title"],v=[" Notion",""," covered in this example "],y=["class","notion"],C=["class","name"],k=[" ",""," "],j=[5],B=[3],N=function(){function t(){}return e([o(x(b(G))),n("design:type",Array)],t.prototype,"notionList",void 0),t=e([s],t)}();return r("notions",".../doc/widgets.ts",t,(function(e,o,n){var s,r,x,b,N=n.notionList,D=0,L=0,O=i(e,t,6),F=N.length;l(e,O,0,0,"div",1,0,a),l(e,O,1,1,"div",1,0,c),l(e,O,2,2,"div",1,0,u),w(e,O,0,3,3,0,v,1,p(e,0,1!==F?"s":"")),l(e,O,4,2,"ul",1),g(e,O,5,3,1);for(var $=0,M=N;$<M.length;$++){var I=M[$];L=0,r=(s=f(e,0,5,4,++D)).cm,l(s,r,0,0,"li",1,0,y),l(s,r,1,1,"span",1,0,C),w(s,r,0,2,2,0,k,1,p(s,0,I.name)),g(s,r,3,1,1),I.$content&&(b=(x=f(s,0,3,3,++L)).cm,h(x,b,0,0),w(x,b,0,1,1,0," : ",0),h(x,b,2,1),m(x,0,2,p(x,0,I.$content)),d(x)),d(s,r,B)}d(e,O,j)}),N)}(),K=function(){var t={},e=["class","svgDemoBtn","width","17px","height","18px","viewBox","0 0 17 18"],o=["stroke","none","stroke-width","1","fill","none","fill-rule","evenodd"],n=["fill-rule","nonzero"],s=["d","M8,2.75 C3.99593556,2.75 0.75,5.99593556 0.75,10 C0.75,14.0040644 3.99593556,17.25 8,17.25 C12.0040644,17.25 15.25,14.0040644 15.25,10 C15.25,5.99593556 12.0040644,2.75 8,2.75 Z","id","Rectangle","stroke-width","1.5"],c=["fill","#FFFFFF","transform","translate(12.148310, 3.984250) rotate(-54.000000) translate(-12.148310, -3.984250) ","x","9.14830963","y","1.98425028","width","6","height","4"],p=["stroke-linejoin","round","transform","translate(13.609118, 5.913799) rotate(-26.000000) translate(-13.609118, -5.913799) ","points","13.6091182 3.91379881 16.1091182 7.91379881 11.1091182 7.91379881"];return r("reloadBtn",".../doc/widgets.ts",t,(function(r){var u=i(r,t,6);a(r,0,"http://www.w3.org/2000/svg"),l(r,u,0,0,"svg",1,0,e),l(r,u,1,1,"g",1,0,o),l(r,u,2,2,"g",1,0,n),l(r,u,3,3,"path",0,0,s),l(r,u,4,3,"rect",0,0,c),l(r,u,5,3,"polygon",0,0,p),a(r),d(r)}))}(),P=function(){var t={},e=["class","svgDemoBtn","width","20px","height","20px","viewBox","0 0 20 20"],o=["stroke","none","stroke-width","1","fill","none","fill-rule","evenodd"],n=["id","Open-outside","fill-rule","nonzero"],s=["d","M5.52969938,4.75 C3.18248919,4.75 1.27969938,6.65278981 1.27969938,9 L1.27969938,15 C1.27969938,17.3472102 3.18248919,19.25 5.52969938,19.25 L11.5296994,19.25 C13.8769096,19.25 15.7796994,17.3472102 15.7796994,15 L15.7796994,9 C15.7796994,6.65278981 13.8769096,4.75 11.5296994,4.75 L5.52969938,4.75 Z","stroke-width","1.5"],c=["transform","translate(11.135391, 8.656494) rotate(-42.000000) translate(-11.135391, -8.656494) translate(4.135391, 3.656494)"],p=["fill","#FFFFFF","x","0.875671632","y","0.627673419","width","13","height","9"],u=["transform","translate(2.412679, 2.833811)","stroke","#0D5598"],g=["fill","#0D5598","stroke-linejoin","round","transform","translate(7.369026, 2.595538) rotate(90.000000) translate(-7.369026, -2.595538) ","points","7.36902625 0.595537535 9.86902625 4.59553754 4.86902625 4.59553754"],f=["d","M0.131428293,3.64028132 L7.13142829,1.64028132","id","Line-2","stroke-width","1.5","stroke-linecap","round","stroke-linejoin","bevel","transform","translate(3.631428, 2.640281) rotate(12.000000) translate(-3.631428, -2.640281) "];return r("openOutsideBtn",".../doc/widgets.ts",t,(function(r){var v=i(r,t,9);a(r,0,"http://www.w3.org/2000/svg"),l(r,v,0,0,"svg",1,0,e),l(r,v,1,1,"g",1,0,o),l(r,v,2,2,"g",1,0,n),l(r,v,3,3,"path",0,0,s),l(r,v,4,3,"g",1,0,c),l(r,v,5,4,"rect",0,0,p),l(r,v,6,4,"g",1,0,u),l(r,v,7,5,"polygon",0,0,g),l(r,v,8,5,"path",0,0,f),a(r),d(r)}))}(),Q=function(){var u={},g=["viewBox","-1 -1 26 26"],f=["class","logo","stroke","none","stroke-width","1","fill-rule","evenodd","fill","none"],v=["stroke-width","2","d","M11.9945425,0.455 C5.54802758,0.455 0.32,5.68231082 0.32,12.130976 C0.32,17.2894782 3.66510621,21.6652813 8.30467606,23.2091765 C8.88883324,23.3166901 9.10171015,22.9561612 9.10171015,22.646522 C9.10171015,22.3698537 9.09167555,21.6351775 9.08594149,20.6611044 C5.83831427,21.3663935 5.15309432,19.0957065 5.15309432,19.0957065 C4.62197717,17.7467693 3.8564804,17.3876739 3.8564804,17.3876739 C2.79639639,16.6637491 3.93675722,16.6780842 3.93675722,16.6780842 C5.10865537,16.7605113 5.72506662,17.8815197 5.72506662,17.8815197 C6.76651495,19.6655285 8.45806212,19.15018 9.12321287,18.8512923 C9.22929295,18.0972636 9.53104776,17.5826319 9.8643399,17.2909117 C7.27182883,16.9963244 4.5460009,15.9942978 4.5460009,11.5202988 C4.5460009,10.2459044 5.00114177,9.20302256 5.74800286,8.38735278 C5.62758763,8.09204878 5.22692032,6.90438198 5.86268402,5.29741216 C5.86268402,5.29741216 6.84249122,4.98347247 9.07303986,6.49439681 C10.0041076,6.23493068 11.0032672,6.10591437 11.995976,6.10089707 C12.9879681,6.10591437 13.986411,6.23493068 14.9189122,6.49439681 C17.1480273,4.98347247 18.126401,5.29741216 18.126401,5.29741216 C18.7635982,6.90438198 18.3629309,8.09204878 18.2432325,8.38735278 C18.9915271,9.20302256 19.4430841,10.2459044 19.4430841,11.5202988 C19.4430841,16.0057659 16.7129557,16.9927406 14.1125603,17.2815938 C14.5311465,17.6421227 14.9045771,18.3545795 14.9045771,19.4440505 C14.9045771,21.0044311 14.8902419,22.2637737 14.8902419,22.646522 C14.8902419,22.9590282 15.1009686,23.3224242 15.6930101,23.2084597 C20.3289961,21.6609808 23.6712353,17.2880446 23.6712353,12.130976 C23.6712353,5.68231082 18.4432077,0.455 11.9945425,0.455"],h=function(){function r(){this.ΔΔclassName=""}return r.prototype.ΔDefault=function(e){switch(e){case"className":return""}return t},e([o(),n("design:type",Object)],r.prototype,"className",void 0),r=e([s],r)}();return r("githubBtn",".../doc/widgets.ts",u,(function(t,e,o){var n=o.className,s=i(t,u,3);a(t,0,"http://www.w3.org/2000/svg"),l(t,s,0,0,"svg",1,0,g),c(t,0,0,"class",p(t,0,n)),l(t,s,1,1,"g",1,0,f),l(t,s,2,2,"path",0,0,v),a(t),d(t)}),h)}(),T=function(){var a={},g=["class","demo"],f=["class","text"],h=["title","Reload demo"],m=["target","_blank","title","Open demo in a separate window"],y=["tabIndex",-1],C=["target","_blank","title","View code in github"],k=["tabIndex",-1],x=["className","svgDemoBtn"],b=["#frame"],N=function(){function r(){this.ΔΔheight=120}return r.prototype.ΔDefault=function(e){switch(e){case"height":return 120}return t},e([o(u),n("design:type",String)],r.prototype,"src",void 0),e([o(j),n("design:type",Number)],r.prototype,"height",void 0),r=e([s],r)}();return r("demo",".../doc/widgets.ts",a,(function(t,e,o,n){var s=o.src,r=o.height,u=i(t,a,12);l(t,u,0,0,"div",1,0,g),l(t,u,1,1,"h1",1),l(t,u,2,2,"span",1,0,f),w(t,u,0,3,3,0," live demo ",0),l(t,u,4,2,"span",1,0,h),B(t,u,5,4,"click",(function(){return n.query("#frame").contentDocument.location.reload()}),1),v(t,u,0,6,3,p(t,0,K),1),l(t,u,7,2,"a",1,0,m,y),c(t,0,7,"href",p(t,1,"./examples/"+s+"/")),v(t,u,0,8,3,p(t,2,P),1),l(t,u,9,2,"a",1,0,C,k),c(t,0,9,"href",p(t,3,I+"src/doc/examples/"+s)),v(t,u,0,10,3,p(t,4,Q),1,0,x),l(t,u,11,1,"iframe",0,b),c(t,0,11,"style",p(t,5,"height:"+r+"px")),c(t,0,11,"src",p(t,6,"./examples/"+s+"/")),d(t)}),N)}(),V={ivyLogo:z,githubBtn:Q,code:_,infoBlock:q,notions:Z,demo:T};export{I,V as w};
