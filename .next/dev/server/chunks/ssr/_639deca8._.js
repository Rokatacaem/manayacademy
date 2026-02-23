module.exports = [
"[project]/src/lib/prisma.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = globalThis;
console.log('Initializing Prisma Client. DB URL:', process.env.DATABASE_URL);
const prisma = globalForPrisma.prisma || new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]();
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[project]/src/actions/contacts.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40dfe6847e66df1e3c408ed447db04fca47a9e0b2d":"registerPublicLead","600d2e44a7728a748e37d87f3a6f228d8634bde38b":"deleteContact","606e766864c98aa864452b3656974c4951ee078fc1":"createContact","707745657741a6d22b155bb07456fdcf90c14b7053":"updateContact"},"",""] */ __turbopack_context__.s([
    "createContact",
    ()=>createContact,
    "deleteContact",
    ()=>deleteContact,
    "registerPublicLead",
    ()=>registerPublicLead,
    "updateContact",
    ()=>updateContact
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
async function createContact(tenantId, formData) {
    const email = formData.get('email');
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const tagsInput = formData.get('tags');
    if (!email) {
        throw new Error('Email is required');
    }
    // Handle Tags (comma separated)
    const tagNames = tagsInput.split(',').map((t)=>t.trim()).filter(Boolean);
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].contact.create({
            data: {
                tenantId,
                email,
                firstName,
                lastName,
                source: 'Manual Entry',
                tags: {
                    connectOrCreate: tagNames.map((name)=>({
                            where: {
                                tenantId_name: {
                                    name,
                                    tenantId
                                }
                            },
                            create: {
                                name,
                                tenantId
                            }
                        }))
                }
            }
        });
    } catch (error) {
        console.error('Failed to create contact:', error);
        // Handle duplicate email error
        return {
            error: 'Failed to create contact. Email might already exist.'
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/contacts');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/admin/contacts');
}
async function updateContact(tenantId, id, formData) {
    if (!id) return {
        error: 'ID required'
    };
    const email = formData.get('email');
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const tagsInput = formData.get('tags');
    const status = formData.get('status');
    if (!email) {
        return {
            error: 'Email is required'
        };
    }
    const tagNames = tagsInput.split(',').map((t)=>t.trim()).filter(Boolean);
    try {
        // Verify ownership
        const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].contact.findUnique({
            where: {
                id
            }
        });
        if (!existing || existing.tenantId !== tenantId) {
            return {
                error: 'Contact not found or access denied relative to tenant.'
            };
        }
        // First disconnect all tags, then connect/create the new ones
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].contact.update({
            where: {
                id
            },
            data: {
                email,
                firstName,
                lastName,
                status,
                tags: {
                    set: [],
                    connectOrCreate: tagNames.map((name)=>({
                            where: {
                                tenantId_name: {
                                    name,
                                    tenantId
                                }
                            },
                            create: {
                                name,
                                tenantId
                            }
                        }))
                }
            }
        });
    } catch (error) {
        console.error('Failed to update contact:', error);
        return {
            error: 'Failed to update contact.'
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/contacts');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/admin/contacts/${id}`);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/admin/contacts');
}
async function deleteContact(tenantId, id) {
    if (!id) return;
    try {
        const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].contact.findUnique({
            where: {
                id
            }
        });
        if (!existing || existing.tenantId !== tenantId) {
            return {
                error: 'Access denied.'
            };
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].contact.delete({
            where: {
                id
            }
        });
    } catch (error) {
        console.error('Failed to delete contact:', error);
        return {
            error: 'Failed to delete contact.'
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/contacts');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/admin/contacts');
}
async function registerPublicLead(formData) {
    const email = formData.get('email');
    const firstName = formData.get('firstName');
    // In single-tenant production, we use a default tenant or find the first one
    const tenant = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].tenant.findFirst();
    if (!tenant) return {
        error: 'System not initialized. No tenant found.'
    };
    if (!email) return {
        error: 'Email is required'
    };
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].contact.upsert({
            where: {
                tenantId_email: {
                    email,
                    tenantId: tenant.id
                }
            },
            update: {
                firstName
            },
            create: {
                tenantId: tenant.id,
                email,
                firstName,
                source: 'Web/Landing'
            }
        });
        return {
            success: true
        };
    } catch (error) {
        console.error('Failed to register lead:', error);
        return {
            error: 'Registration failed. Please try again.'
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createContact,
    updateContact,
    deleteContact,
    registerPublicLead
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createContact, "606e766864c98aa864452b3656974c4951ee078fc1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateContact, "707745657741a6d22b155bb07456fdcf90c14b7053", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteContact, "600d2e44a7728a748e37d87f3a6f228d8634bde38b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(registerPublicLead, "40dfe6847e66df1e3c408ed447db04fca47a9e0b2d", null);
}),
"[project]/.next-internal/server/app/(public)/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/contacts.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$contacts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/contacts.ts [app-rsc] (ecmascript)");
;
}),
"[project]/.next-internal/server/app/(public)/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/contacts.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "40dfe6847e66df1e3c408ed447db04fca47a9e0b2d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$contacts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerPublicLead"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$public$292f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$contacts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(public)/page/actions.js { ACTIONS_MODULE0 => "[project]/src/actions/contacts.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$contacts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/contacts.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_639deca8._.js.map