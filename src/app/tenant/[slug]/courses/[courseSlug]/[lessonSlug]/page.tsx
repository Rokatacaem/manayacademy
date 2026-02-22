import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function LessonPage({
    params
}: {
    params: Promise<{ slug: string, courseSlug: string, lessonSlug: string }>
}) {
    const resolvedParams = await params;
    const { slug, courseSlug, lessonSlug } = resolvedParams;

    const tenant = await prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) notFound();

    // Verify Course exists in Tenant
    const course = await prisma.course.findUnique({
        where: {
            tenantId_slug: { tenantId: tenant.id, slug: courseSlug }
        }
    });
    if (!course) notFound();

    // Fetch Lesson + Previous/Next context logic could be added here
    // Note: We need to filter by tenant/course implicitly via the module relations, 
    // or just fetch by slug and verify parentage.
    // Simplest: FindFirst where slug = lessonSlug AND module.course.id = course.id
    const lesson = await prisma.lesson.findFirst({
        where: {
            slug: lessonSlug,
            module: {
                courseId: course.id
            }
        }
    });

    if (!lesson) {
        notFound();
    }

    // Helper function to embed videos
    const getVideoEmbed = (url: string) => {
        if (!url) return null;
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.split('v=')[1] || url.split('/').pop();
            return `https://www.youtube.com/embed/${videoId}`;
        }
        if (url.includes('vimeo')) {
            const videoId = url.split('/').pop();
            return `https://player.vimeo.com/video/${videoId}`;
        }
        return null;
        // fallback for direct mp4?? No, let's assume iframe compatible for now.
    }

    const embedUrl = lesson.videoUrl ? getVideoEmbed(lesson.videoUrl) : null;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-black">
            {/* Video Player Area */}
            {embedUrl ? (
                <div className="w-full bg-black aspect-video">
                    <iframe
                        src={embedUrl}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                </div>
            ) : (
                lesson.videoUrl && (
                    <div className="w-full p-8 bg-gray-100 text-center">
                        <p>Video URL no soportada para embed simple: <a href={lesson.videoUrl} target="_blank" className="underline text-blue-600">{lesson.videoUrl}</a></p>
                    </div>
                )
            )}

            {/* Content Area */}
            <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
                <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>

                {lesson.content && (
                    <div className="prose dark:prose-invert max-w-none">
                        {/* We should sanitize HTML if we were allowing rich text, but for admin-generated content, simple render is "okay" for MVP if we trust admin.
                            Actually, we don't have a markdown parser installed yet. 
                            Let's assume content is plain text or simple HTML for now.
                            For MVP, simple whitespace preservation.
                        */}
                        <div className="whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-300">
                            {lesson.content}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
