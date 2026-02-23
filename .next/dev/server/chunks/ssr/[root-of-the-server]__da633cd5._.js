module.exports = [
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/src/actions/campaigns.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"607b7ab258dd957502b50cdb4a7e9b1b5d4b8d99eb":"deleteCampaign","60a9f1d484accdc838b05a44f2af278508f05b7439":"createCampaign","700732c6797a0046cebc0c4b7987c4a65dc9c48a7e":"updateCampaign","70726a4c9135b4c0f66f92f7a2eea9aa886c1706bb":"sendTestEmail","7074171b872d72ab94603722085fd5398efe7218f6":"sendCampaign"},"",""] */ __turbopack_context__.s([
    "createCampaign",
    ()=>createCampaign,
    "deleteCampaign",
    ()=>deleteCampaign,
    "sendCampaign",
    ()=>sendCampaign,
    "sendTestEmail",
    ()=>sendTestEmail,
    "updateCampaign",
    ()=>updateCampaign
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/resend/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
// Initialize Resend lazily to avoid module-load crash when API key is missing
function getResend() {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error('RESEND_API_KEY is not configured. Go to resend.com to get your key and add it to .env');
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Resend"](key);
}
async function sendTestEmail(tenantId, campaignId, formData) {
    const testEmails = (formData.get('testEmails') ?? '').split(',').map((e)=>e.trim()).filter(Boolean);
    if (testEmails.length === 0) {
        return {
            error: 'Por favor ingresa al menos un correo de prueba.'
        };
    }
    const campaign = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].campaign.findUnique({
        where: {
            id: campaignId
        }
    });
    if (!campaign || campaign.tenantId !== tenantId) return {
        error: 'Campaña no encontrada.'
    };
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    try {
        await getResend().emails.send({
            from: fromEmail,
            to: testEmails,
            subject: `[PRUEBA] ${campaign.subject}`,
            html: campaign.content || '<p>Sin contenido</p>'
        });
        return {
            success: `✅ Email de prueba enviado a: ${testEmails.join(', ')}`
        };
    } catch (err) {
        console.error('sendTestEmail error:', err);
        return {
            error: `Error al enviar: ${err?.message ?? 'desconocido'}`
        };
    }
}
async function createCampaign(tenantId, formData) {
    const subject = formData.get('subject');
    const content = formData.get('content');
    if (!subject) {
        throw new Error('Subject is required');
    }
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].campaign.create({
            data: {
                tenantId,
                subject,
                content,
                status: 'DRAFT'
            }
        });
    } catch (error) {
        console.error('Failed to create campaign:', error);
        return {
            error: 'Failed to create campaign.'
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/campaigns');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/admin/campaigns');
}
async function updateCampaign(tenantId, id, formData) {
    if (!id) return;
    const subject = formData.get('subject');
    const content = formData.get('content');
    try {
        const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].campaign.findUnique({
            where: {
                id
            }
        });
        if (!existing || existing.tenantId !== tenantId) {
            return {
                error: 'Access denied'
            };
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].campaign.update({
            where: {
                id
            },
            data: {
                subject,
                content
            }
        });
    } catch (error) {
        console.error('Failed to update campaign:', error);
        return {
            error: 'Failed to update campaign.'
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/campaigns');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/admin/campaigns/${id}`);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/admin/campaigns');
}
async function deleteCampaign(tenantId, id) {
    if (!id) return;
    try {
        const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].campaign.findUnique({
            where: {
                id
            }
        });
        if (!existing || existing.tenantId !== tenantId) {
            return {
                error: 'Access denied'
            };
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].emailLog.deleteMany({
            where: {
                campaignId: id
            }
        });
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].campaign.delete({
            where: {
                id
            }
        });
    } catch (error) {
        console.error('Failed to delete campaign:', error);
        return {
            error: 'Failed to delete campaign.'
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/campaigns');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/admin/campaigns');
}
async function sendCampaign(tenantId, campaignId, formData) {
    if (!campaignId) return {
        error: 'Campaign ID required'
    };
    const targetType = formData.get('targetType')// 'all' or 'tags'
    ;
    const tagIds = formData.getAll('tags');
    // 1. Fetch Campaign & Verify Tenant
    const campaign = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].campaign.findUnique({
        where: {
            id: campaignId
        }
    });
    if (!campaign) return {
        error: 'Campaign not found'
    };
    if (campaign.tenantId !== tenantId) return {
        error: 'Access denied'
    };
    if (campaign.status === 'SENT') return {
        error: 'Campaign already sent'
    };
    // 2. Fetch Contacts Scoped by Tenant
    // Define a type for contacts to avoid any[] implicit type errors if needed, or let Prisma infer
    // But specific strict checking might need explicit type if complex
    let contacts = [] // Explicit any[] to bypass inference issues for now or better type it
    ;
    if (targetType === 'tags' && tagIds.length > 0) {
        contacts = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].contact.findMany({
            where: {
                tenantId,
                status: 'ACTIVE',
                tags: {
                    some: {
                        id: {
                            in: tagIds
                        }
                    }
                }
            }
        });
    } else {
        if (targetType === 'all') {
            contacts = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].contact.findMany({
                where: {
                    tenantId,
                    status: 'ACTIVE'
                }
            });
        } else {
            contacts = [];
        }
    }
    if (contacts.length === 0) {
        return {
            error: 'No active contacts found for selected criteria.'
        };
    }
    let sentCount = 0;
    let errorCount = 0;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    for (const contact of contacts){
        try {
            const { error } = await getResend().emails.send({
                from: fromEmail,
                to: contact.email,
                subject: campaign.subject,
                html: campaign.content || ''
            });
            if (error) {
                console.error(`Resend Error for ${contact.email}:`, error);
                errorCount++;
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].emailLog.create({
                    data: {
                        tenantId,
                        campaignId,
                        contactId: contact.id,
                        status: 'BOUNCED'
                    }
                });
            } else {
                sentCount++;
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].emailLog.create({
                    data: {
                        tenantId,
                        campaignId,
                        contactId: contact.id,
                        status: 'SENT'
                    }
                });
            }
        } catch (e) {
            console.error(`Unexpected Error for ${contact.email}:`, e);
            errorCount++;
        }
    }
    // 4. Update Campaign Status
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].campaign.update({
        where: {
            id: campaignId
        },
        data: {
            status: 'SENT',
            sentAt: new Date(),
            stats: {
                sent: sentCount,
                errors: errorCount,
                total: contacts.length
            }
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/admin/campaigns/${campaignId}`);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/campaigns');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(`/admin/campaigns/${campaignId}`);
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    sendTestEmail,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    sendCampaign
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(sendTestEmail, "70726a4c9135b4c0f66f92f7a2eea9aa886c1706bb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createCampaign, "60a9f1d484accdc838b05a44f2af278508f05b7439", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateCampaign, "700732c6797a0046cebc0c4b7987c4a65dc9c48a7e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteCampaign, "607b7ab258dd957502b50cdb4a7e9b1b5d4b8d99eb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(sendCampaign, "7074171b872d72ab94603722085fd5398efe7218f6", null);
}),
"[project]/.next-internal/server/app/tenant/[slug]/admin/campaigns/new/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/tenant/[slug]/admin/layout.tsx [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/actions/campaigns.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenant$2f5b$slug$5d2f$admin$2f$layout$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tenant/[slug]/admin/layout.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$campaigns$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/campaigns.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/tenant/[slug]/admin/campaigns/new/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/tenant/[slug]/admin/layout.tsx [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/actions/campaigns.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "00d2413c7b032011cc039227e801de69e758c1a19d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenant$2f5b$slug$5d2f$admin$2f$layout$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["$$RSC_SERVER_ACTION_0"],
    "607b7ab258dd957502b50cdb4a7e9b1b5d4b8d99eb",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$campaigns$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteCampaign"],
    "60a9f1d484accdc838b05a44f2af278508f05b7439",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$campaigns$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createCampaign"],
    "700732c6797a0046cebc0c4b7987c4a65dc9c48a7e",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$campaigns$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateCampaign"],
    "70726a4c9135b4c0f66f92f7a2eea9aa886c1706bb",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$campaigns$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendTestEmail"],
    "7074171b872d72ab94603722085fd5398efe7218f6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$campaigns$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendCampaign"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$tenant$2f5b$slug$5d2f$admin$2f$campaigns$2f$new$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$tenant$2f5b$slug$5d2f$admin$2f$layout$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$campaigns$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/tenant/[slug]/admin/campaigns/new/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/tenant/[slug]/admin/layout.tsx [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/actions/campaigns.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenant$2f5b$slug$5d2f$admin$2f$layout$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tenant/[slug]/admin/layout.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$campaigns$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/campaigns.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__da633cd5._.js.map