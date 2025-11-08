import LegalDocPage from '@/components/legal/LegalDocPage'

export const metadata = {
  title: 'Политика обработки персональных данных | SoVAni',
  description: 'Политика обработки персональных данных в соответствии с 152-ФЗ'
}

export default function PrivacyPage() {
  return <LegalDocPage docKey="privacy" title="Политика обработки персональных данных" />
}
