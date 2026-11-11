import { DriverDisputesPage } from './pages/DriverDisputesPage'
import { PortalDisputesView } from './components/PortalDisputesView'

export { DriverDisputesPage } from './pages/DriverDisputesPage'
export * from './api/driverDisputesApi'

export function DisputesPage({
  role,
  detail = false,
}: {
  role: 'driver' | 'merchant' | 'admin'
  detail?: boolean
}) {
  if (role === 'driver') {
    return <DriverDisputesPage detail={detail} />
  }
  return <PortalDisputesView role={role} detail={detail} />
}
