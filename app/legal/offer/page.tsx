import LegalDocPage from '@/components/legal/LegalDocPage'

export const metadata = {
  title: 'Публичная оферта | SoVAni',
  description: 'Публичная оферта (пользовательское соглашение)'
}

export default function OfferPage() {
  return <LegalDocPage docKey="offer" title="Публичная оферта" />
}
