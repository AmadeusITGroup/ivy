import{c as t,d as e,g as a,h as o,I as n,R as s,n as i,o as d,e as c,f as r}from"./index-24a0c4db.js";import{M as g,m as u}from"./menu-layout-5d0f63cc.js";var f,m=new g;function v(t){f=t,t.add({"/getting-started/*":function(t,e){e.pageContent=b,m.categoryCode=y.categories[0].code,m.itemCode=y.categories[0].items[0].code}})}var p,l,h,y={categories:[{title:"todo",code:"base",items:[{title:"todo",code:"todo",content:(l=["class","md"],h=["id","under-construction"],t("todo",".../getting-started/getting-started.ts",p={},(function(t){var a=e(t,p,3);c(t,a,0,0,"div",1,0,l),c(t,a,1,1,"h1",1,0,h),r(t,a,0,2,2,0,"under construction...",0),d(t)})))}]}]};function C(t){f.navigate("/api/"+t.data)}var b=function(){var c={};return t("pageLayout",".../getting-started/getting-started.ts",c,(function(t){var r=e(t,c,2);a(t,r,0,0,0,o(t,0,u),0),n(t,r,0,0,"state",o(t,1,m)),n(t,r,0,0,"content",o(t,2,y)),s(t,r,1,0,"change",C),i(t,0),d(t)}))}();export{v as loadRoutes};
