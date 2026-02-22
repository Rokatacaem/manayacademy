'use client'

import { useEffect, useRef, useState } from 'react'

interface RichEditorProps {
    name: string
    initialValue?: string
}

function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve(); return;
        }
        const s = document.createElement('script')
        s.src = src
        s.onload = () => resolve()
        s.onerror = reject
        document.head.appendChild(s)
    })
}

function loadCss(href: string) {
    if (document.querySelector(`link[href="${href}"]`)) return
    const l = document.createElement('link')
    l.rel = 'stylesheet'
    l.href = href
    document.head.appendChild(l)
}

export default function RichEditor({ name, initialValue = '' }: RichEditorProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const quillRef = useRef<any>(null)
    const [htmlValue, setHtmlValue] = useState(initialValue)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        async function init() {
            loadCss('https://cdn.quilljs.com/1.3.7/quill.snow.css')
            await loadScript('https://cdn.quilljs.com/1.3.7/quill.min.js')

            if (cancelled || !containerRef.current || quillRef.current) return

            const QuillLib = (window as any).Quill
            const Quill = QuillLib?.default ?? QuillLib
            quillRef.current = new Quill(containerRef.current, {
                theme: 'snow',
                placeholder: 'Escribe tu mensaje aquí. Puedes insertar imágenes, cambiar colores, añadir enlaces y mucho más...',
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ color: [] }, { background: [] }],
                        [{ font: [] }],
                        [{ align: [] }],
                        ['blockquote'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link', 'image', 'video'],
                        ['clean'],
                    ],
                    clipboard: { matchVisual: false },
                },
            })

            if (initialValue) {
                quillRef.current.clipboard.dangerouslyPasteHTML(initialValue)
            }

            quillRef.current.on('text-change', () => {
                const html = quillRef.current.root.innerHTML
                setHtmlValue(html === '<p><br></p>' ? '' : html)
            })

            if (!cancelled) setLoading(false)
        }

        init().catch(console.error)

        return () => { cancelled = true }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <input type="hidden" name={name} value={htmlValue} />

            {loading && (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                    Cargando editor...
                </div>
            )}

            <div style={{ display: loading ? 'none' : 'block', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', background: 'white' }}>
                <div ref={containerRef} style={{ minHeight: '420px', fontSize: '1rem' }} />
            </div>
        </div>
    )
}
