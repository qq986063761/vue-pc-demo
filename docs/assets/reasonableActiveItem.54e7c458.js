import{_ as i}from"./index.ae95e4f7.js";import{s as a,j as m,o as l,b as o,F as _,d as u,e as d,p as v}from"./vendor.308c3883.js";const f={data(){return{scroller:null,items:null,currentIndex:0}},methods:{onScroll(s,{index:r}){console.log(s,{index:r}),this.currentIndex=r}},mounted(){this.scroller=this.$refs.scroller,this.items=this.$refs.items}},p={class:"reasonable-active-item-demo",ref:"scroller"};function h(s,r,x,I,e,n){const c=a("reasonable-active-item");return m((l(),o("div",p,[(l(),o(_,null,u(10,(b,t)=>d("div",{ref_for:!0,ref:"items",class:v(["item",{active:t===e.currentIndex}]),key:t},null,2)),64))])),[[c,{scroller:e.scroller,items:e.items,onScroll:n.onScroll,currentIndex:e.currentIndex}]])}var k=i(f,[["render",h]]);export{k as default};
