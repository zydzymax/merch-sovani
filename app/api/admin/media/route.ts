import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/getUser'
import { logger } from '@/lib/utils/logger'
import { writeFile, unlink, readdir, stat } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

const MEDIA_DIR = path.join(process.cwd(), 'public', 'images')

// Allowed file extensions for upload
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Ensure media directory exists
    if (!existsSync(MEDIA_DIR)) {
      return NextResponse.json({ files: [] })
    }

    // Read all files from the images directory
    const files = await readdir(MEDIA_DIR)
    const fileStats = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(MEDIA_DIR, file)
        const stats = await stat(filePath)

        // Determine file type
        const ext = path.extname(file).toLowerCase()
        let type = 'application/octet-stream'
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
          type = `image/${ext.substring(1)}`
        }

        return {
          name: file,
          path: `/images/${file}`,
          size: stats.size,
          modified: stats.mtime.toISOString(),
          type,
        }
      })
    )

    // Sort by modified date (newest first)
    fileStats.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())

    return NextResponse.json({ files: fileStats })
  } catch (error) {
    logger.error('Error fetching media', error)
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    const uploadedFiles = []

    for (const file of files) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds maximum size of 10MB` },
          { status: 400 }
        )
      }

      // Validate file extension
      const ext = path.extname(file.name).toLowerCase()
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return NextResponse.json(
          { error: `File type ${ext} not allowed. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}` },
          { status: 400 }
        )
      }

      // Validate MIME type
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
      if (!allowedMimeTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `MIME type ${file.type} not allowed` },
          { status: 400 }
        )
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Create safe filename - remove path traversal attempts
      const baseName = path.basename(file.name) // Remove any directory components
      const safeName = baseName.replace(/[^a-zA-Z0-9.-]/g, '_')

      // Double check no path traversal
      if (safeName.includes('..') || safeName.includes('/') || safeName.includes('\\')) {
        return NextResponse.json(
          { error: 'Invalid filename' },
          { status: 400 }
        )
      }

      const filePath = path.join(MEDIA_DIR, safeName)

      // Final security check - ensure path is within MEDIA_DIR
      const resolvedPath = path.resolve(filePath)
      if (!resolvedPath.startsWith(path.resolve(MEDIA_DIR))) {
        return NextResponse.json(
          { error: 'Invalid file path' },
          { status: 400 }
        )
      }

      await writeFile(filePath, buffer)
      uploadedFiles.push({
        name: safeName,
        path: `/images/${safeName}`,
      })

      logger.info('Media file uploaded', { adminId: user.id, fileName: safeName })
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
    })
  } catch (error) {
    logger.error('Error uploading media', error)
    return NextResponse.json(
      { error: 'Failed to upload media' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUser()

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { path: filePath } = body

    if (!filePath || !filePath.startsWith('/images/')) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      )
    }

    // Extract filename and sanitize
    const fileName = path.basename(filePath.replace('/images/', ''))

    // Check for path traversal attempts
    if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      )
    }

    const fullPath = path.join(MEDIA_DIR, fileName)

    // Security check - ensure resolved path is within media directory
    const resolvedPath = path.resolve(fullPath)
    const resolvedMediaDir = path.resolve(MEDIA_DIR)
    if (!resolvedPath.startsWith(resolvedMediaDir + path.sep) && resolvedPath !== resolvedMediaDir) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      )
    }

    // Check file exists before deleting
    if (!existsSync(fullPath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    await unlink(fullPath)

    logger.info('Media file deleted', { adminId: user.id, fileName })

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    })
  } catch (error) {
    logger.error('Error deleting media', error)
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    )
  }
}
