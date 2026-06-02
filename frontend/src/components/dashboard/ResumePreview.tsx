'use client'

import { PDFPreview }  from '@/components/dashboard/PDFPreview'
import { DOCXPreview } from '@/components/dashboard/DOCXPreview'

interface ResumePreviewProps {
  file: File
  url:  string
}

export function ResumePreview({ file, url }: ResumePreviewProps) {
  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return <DOCXPreview file={file} />
  }
  return <PDFPreview url={url} />
}
