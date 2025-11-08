import { getLegalDoc } from '@/lib/legal/getLegalDoc'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface LegalDocPageProps {
  docKey: string
  title: string
}

export default async function LegalDocPage({ docKey, title }: LegalDocPageProps) {
  const doc = await getLegalDoc(docKey)

  if (!doc) {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-4">Документ не найден</h1>
        <p className="text-gray-600">Запрашиваемый документ не найден на сервере.</p>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
          ← На главную
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-4xl py-6 px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            На главную
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {doc.content}
            </ReactMarkdown>
          </div>

          {/* Document meta */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
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
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">Другие документы</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-blue-600 hover:underline"
                >
                  Политика обработки ПДн
                </Link>
              </li>
              <li>
                <Link href="/legal/offer" className="text-blue-600 hover:underline">
                  Публичная оферта
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="text-blue-600 hover:underline">
                  Политика cookie
                </Link>
              </li>
              <li>
                <Link href="/legal/consent" className="text-blue-600 hover:underline">
                  Согласие на обработку ПДн
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/promo-rules"
                  className="text-blue-600 hover:underline"
                >
                  Правила розыгрыша
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
