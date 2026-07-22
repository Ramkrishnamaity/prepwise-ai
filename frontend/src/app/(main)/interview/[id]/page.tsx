import { InterviewRoom } from '@/components/interview/InterviewRoom'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function InterviewPage({ params }: PageProps) {
  const { id } = await params
  return <InterviewRoom resumeId={id} />
}
