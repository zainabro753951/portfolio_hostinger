import{r as l,j as r}from"./index-B6b0WSdJ.js";import{r as c}from"./Utils-Cgil2a5D.js";const d=({markedDesc:e,children:n,className:s="",lang:o="en"})=>{const t=l.useMemo(()=>{if(!e)return null;try{return{__html:c(e)}}catch(i){return console.error("Markdown rendering failed:",i),null}},[e]),a=t!==null;return r.jsx("article",{"code-path":"src\\sections\\MarkUpTextRender.jsx:24:5",className:`
        text-left
        prose 
        prose-invert 
        max-w-none
        text-sm sm:text-base md:text-lg
        leading-relaxed sm:leading-8
        break-words
        overflow-wrap-anywhere
        ${s}
      `.trim(),lang:o,role:"region","aria-label":"Content section",itemScope:!0,itemType:"https://schema.org/Article",children:a?r.jsx("div",{"code-path":"src\\sections\\MarkUpTextRender.jsx:43:9",className:"prose-content break-words",dangerouslySetInnerHTML:t,itemProp:"articleBody",style:{fontSize:"inherit",lineHeight:"inherit"}}):r.jsx("div",{"code-path":"src\\sections\\MarkUpTextRender.jsx:53:9",className:"prose-content",itemProp:"articleBody",children:n})})};d.displayName="MarkUpTextRender";export{d as M};
