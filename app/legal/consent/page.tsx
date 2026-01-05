import LegalDocPage from '@/components/legal/LegalDocPage'

export const metadata = {
  title: 'Согласие на обработку ПДн | GETNWIN',
  description: 'Согласие на обработку персональных данных'
}

export default function ConsentPage() {
  return <LegalDocPage docKey="consent" title="Согласие на обработку персональных данных" />
}
