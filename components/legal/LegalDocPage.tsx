import { getLegalDoc } from '@/lib/legal/getLegalDoc'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import Navbar from '@/app/_components/Navbar'
import BigFooter from '@/app/_components/BigFooter'

interface LegalDocPageProps {
  docKey: string
  title: string
}

export default async function LegalDocPage({ docKey, title }: LegalDocPageProps) {
  const doc = await getLegalDoc(docKey)

  if (!doc) {
    return (
      <div className="min-h-screen" style={{background:'var(--bg)',color:'var(--text)'}}>
        <Navbar />
        <div className="container mx-auto max-w-4xl py-12 px-4">
          <h1 className="text-3xl font-bold mb-4">Документ не найден</h1>
          <p style={{color:'var(--muted)'}}>Запрашиваемый документ не найден на сервере.</p>
          <Link href="/" style={{color:'var(--accent)'}} className="hover:underline mt-4 inline-block">
            ← На главную
          </Link>
        </div>
        <BigFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{background:'var(--bg)',color:'var(--text)'}}>
      <Navbar />

      {/* Content */}
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-6"
          style={{color:'var(--muted)'}}
        >
          ← На главную
        </Link>
        <h1 className="font-display" style={{fontSize:'40px',marginBottom:32}}>{title}</h1>

        <div className="tile doc-content" style={{padding:40,borderRadius:28}}>
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {doc.content}
            </ReactMarkdown>
          </div>

          {/* Document meta */}
          <div className="mt-12 pt-6" style={{borderTop:'1px solid var(--ring)'}}>
            <div className="flex flex-wrap gap-6 text-sm" style={{color:'#000'}}>
              <div>
                <span className="font-semibold">Версия:</span> {doc.version}
              </div>
              <div>
                <span className="font-semibold">Дата публикации:</span>{' '}
                {new Date(doc.publishedAt).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <div className="mt-8 p-4 rounded-lg" style={{background:'var(--surface)',color:'#000'}}>
            <h3 className="font-semibold mb-3" style={{color:'#000'}}>Другие документы</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <li>
                <Link
                  href="/legal/privacy"
                  className="hover:underline"
                  style={{color:'var(--accent)'}}
                >
                  Политика обработки ПДн
                </Link>
              </li>
              <li>
                <Link href="/legal/offer" className="hover:underline" style={{color:'var(--accent)'}}>
                  Публичная оферта
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="hover:underline" style={{color:'var(--accent)'}}>
                  Политика cookie
                </Link>
              </li>
              <li>
                <Link href="/legal/consent" className="hover:underline" style={{color:'var(--accent)'}}>
                  Согласие на обработку ПДн
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/promo-rules"
                  className="hover:underline"
                  style={{color:'var(--accent)'}}
                >
                  Правила розыгрыша
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <BigFooter />
    </div>
  )
}
