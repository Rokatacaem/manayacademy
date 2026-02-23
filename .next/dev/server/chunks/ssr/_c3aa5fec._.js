module.exports = [
"[project]/src/actions/tags.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"603fdd9831f65d2fdcfcfe3db48cdd207587d7b891":"deleteTag","609fec0bbf176a2b4b139e41f1de51f31c318de8c9":"createTag"},"",""] */ __turbopack_context__.s([
    "createTag",
    ()=>createTag,
    "deleteTag",
    ()=>deleteTag
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function createTag(tenantId, formData) {
    const name = formData.get('name');
    if (!name || name.trim() === '') {
        return {
            error: 'Tag name is required'
        };
    }
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].tag.create({
            data: {
                name: name.trim(),
                tenantId
            }
        });
    } catch (error) {
        console.error('Failed to create tag:', error);
        return {
            error: 'Failed to create tag. Name might already exist.'
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/tags');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/contacts'); // Revalidate contacts as they use tags
}
async function deleteTag(tenantId, id) {
    if (!id) return;
    try {
        const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].tag.findUnique({
            where: {
                id
            }
        });
        if (!existing || existing.tenantId !== tenantId) {
            return {
                error: 'Access denied'
            };
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].tag.delete({
            where: {
                id
            }
        });
    } catch (error) {
        console.error('Failed to delete tag:', error);
        return {
            error: 'Failed to delete tag.'
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/tags');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/contacts');
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createTag,
    deleteTag
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createTag, "609fec0bbf176a2b4b139e41f1de51f31c318de8c9", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteTag, "603fdd9831f65d2fdcfcfe3db48cdd207587d7b891", null);
}),
"[project]/.next-internal/server/app/tenant/[slug]/admin/tags/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/tags.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$tags$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/tags.ts [app-rsc] (ecmascript)");
;
;
}),
"[project]/.next-internal/server/app/tenant/[slug]/admin/tags/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/tags.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "603fdd9831f65d2fdcfcfe3db48cdd207587d7b891",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$tags$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteTag"],
    "609fec0bbf176a2b4b139e41f1de51f31c318de8c9",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$tags$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createTag"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$tenant$2f5b$slug$5d2f$admin$2f$tags$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$tags$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/tenant/[slug]/admin/tags/page/actions.js { ACTIONS_MODULE0 => "[project]/src/actions/tags.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$tags$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/tags.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_c3aa5fec._.js.map