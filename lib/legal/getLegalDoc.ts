import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

/**
 * Читает юридический документ из content/legal/*.md
 * @param docKey - ключ документа ('privacy', 'offer', 'cookies', etc.)
 * @returns content markdown и metadata
 */
export async function getLegalDoc(docKey: string) {
  const filePath = path.join(process.cwd(), 'content', 'legal', `${docKey}.md`)

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      content,
      metadata: data,
      version: data.version || '1.0',
      publishedAt: data.publishedAt || new Date().toISOString(),
    }
  } catch (error) {
    console.error(`Error reading legal document ${docKey}:`, error)
    return null
  }
}

/**
 * Логирует согласие пользователя в БД
 */
export async function logConsent(data: {
  userId?: string
  formType: string
  docKey: string
  docVersion: string
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, any>
}) {
  const { prisma } = await import('@/lib/db/prisma')

  try {
    await prisma.consent.create({
      data: {
        userId: data.userId,
        formType: data.formType,
        docKey: data.docKey,
        docVersion: data.docVersion,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        metadata: data.metadata || {},
      },
    })
  } catch (error) {
    console.error('Error logging consent:', error)
  }
}
