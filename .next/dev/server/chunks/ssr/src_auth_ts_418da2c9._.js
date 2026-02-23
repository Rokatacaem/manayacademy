module.exports = [
"[project]/src/auth.ts [app-rsc] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/node_modules_@auth_core_e00e322b._.js",
  "server/chunks/ssr/node_modules_jose_dist_webapi_f15cbee2._.js",
  "server/chunks/ssr/node_modules_next_86a28cf4._.js",
  "server/chunks/ssr/node_modules_zod_v4_34378348._.js",
  "server/chunks/ssr/node_modules_c69909f6._.js",
  "server/chunks/ssr/[root-of-the-server]__434e3fcc._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/auth.ts [app-rsc] (ecmascript)");
    });
});
}),
];