import { PaymentResultPage } from '@/features/booking-flow'
export function PaymentReturnPage({mode='success'}:{mode?:'success'|'cancel'}){return <PaymentResultPage cancelled={mode==='cancel'}/>}
