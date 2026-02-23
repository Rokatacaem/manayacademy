module.exports=[46786,(a,b,c)=>{b.exports=a.x("os",()=>require("os"))},70722,(a,b,c)=>{b.exports=a.x("tty",()=>require("tty"))},22734,(a,b,c)=>{b.exports=a.x("fs",()=>require("fs"))},33405,(a,b,c)=>{b.exports=a.x("child_process",()=>require("child_process"))},24868,(a,b,c)=>{b.exports=a.x("fs/promises",()=>require("fs/promises"))},10430,(a,b,c)=>{b.exports=a.x("async_hooks",()=>require("async_hooks"))},27699,(a,b,c)=>{b.exports=a.x("events",()=>require("events"))},20500,a=>{"use strict";var b=a.i(7997),c=a.i(66518);a.i(70396);var d=a.i(73727);async function e({children:a,params:e}){let{slug:f}=await e,g=await c.prisma.tenant.findUnique({where:{slug:f}});return g||(0,d.notFound)(),(0,b.jsxs)("div",{className:"min-h-screen bg-gray-50 dark:bg-zinc-900","data-tenant":g.id,style:g.brandColor?{"--primary":g.brandColor}:void 0,children:[g.brandColor&&(0,b.jsx)("style",{dangerouslySetInnerHTML:{__html:`
                    :root { --primary: ${g.brandColor}; }
                    .bg-primary { background-color: ${g.brandColor}; }
                    .text-primary { color: ${g.brandColor}; }
                    .border-primary { border-color: ${g.brandColor}; }
                    /* Add more utility overrides if needed or use CSS variables in CSS file */
                `}}),a]})}a.s(["default",()=>e])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__aeacb352._.js.map