import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

type TabKey = 'tab1' | 'tab2' | 'tab3' | 'tab4'

interface TabContent {
  id: TabKey
  method: string
  methodColor: string
  endpoint: string
  rawCode: string
  render: () => React.JSX.Element
}

export function ApiTerminalSection() {
  const [activeTab, setActiveTab] = useState<TabKey>('tab1')
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState('')

  const tabs: TabContent[] = [
    {
      id: 'tab1',
      method: 'POST',
      methodColor: 'text-brand-orange',
      endpoint: '/api/v1/bookings',
      rawCode: `POST /api/v1/bookings HTTP/1.1
Host: api.smarttruckhub.vn
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "parkingLotId": 104,
  "vehicleId": 892,
  "vehicleType": "CONTAINER_40FT",
  "expectedCheckInTime": "2026-10-25T14:30:00Z",
  "durationHours": 6
}

// Response (201 Created) · Latency: 32ms
{
  "status": 200,
  "message": "Giữ chỗ thành công trong 10 phút",
  "data": {
    "bookingCode": "BK-2026-8941",
    "qrTicketUrl": "https://api.smarttruckhub.vn/qr/BK-8941.svg",
    "depositAmount": 100000,
    "gatePassStatus": "PENDING_CHECKIN"
  }
}`,
      render: () => (
        <>
          <div>
            <span className="text-brand-orange font-bold">POST</span> /api/v1/bookings HTTP/1.1
          </div>
          <div>
            <span className="text-api-muted">Host:</span> api.smarttruckhub.vn
          </div>
          <div>
            <span className="text-api-muted">Authorization:</span> Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
          </div>
          <div>
            <span className="text-api-muted">Content-Type:</span> application/json
          </div>
          <div className="my-2" />
          <div>
            <span className="text-api-muted">{'{'}</span>
          </div>
          <div className="pl-4">
            <span className="text-brand-orange">&quot;parkingLotId&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">104</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-4">
            <span className="text-brand-orange">&quot;vehicleId&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">892</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-4">
            <span className="text-brand-orange">&quot;vehicleType&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">&quot;CONTAINER_40FT&quot;</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-4">
            <span className="text-brand-orange">&quot;expectedCheckInTime&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">&quot;2026-10-25T14:30:00Z&quot;</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-4">
            <span className="text-brand-orange">&quot;durationHours&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">6</span>
          </div>
          <div>
            <span className="text-api-muted">{'}'}</span>
          </div>
          <div className="my-3 text-api-muted">
            // Response (201 Created) · Latency: 32ms
          </div>
          <div>
            <span className="text-api-muted">{'{'}</span>
          </div>
          <div className="pl-4">
            <span className="text-brand-orange">&quot;status&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">200</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-4">
            <span className="text-brand-orange">&quot;message&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">&quot;Giữ chỗ thành công trong 10 phút&quot;</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-4">
            <span className="text-brand-orange">&quot;data&quot;</span>
            <span className="text-api-muted">: {'{'}</span>
          </div>
          <div className="pl-8">
            <span className="text-brand-orange">&quot;bookingCode&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">&quot;BK-2026-8941&quot;</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-8">
            <span className="text-brand-orange">&quot;qrTicketUrl&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">&quot;https://api.smarttruckhub.vn/qr/BK-8941.svg&quot;</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-8">
            <span className="text-brand-orange">&quot;depositAmount&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">100000</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-8">
            <span className="text-brand-orange">&quot;gatePassStatus&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">&quot;PENDING_CHECKIN&quot;</span>
          </div>
          <div className="pl-4">
            <span className="text-api-muted">{'}'}</span>
          </div>
          <div>
            <span className="text-api-muted">{'}'}</span>
          </div>
        </>
      ),
    },
    {
      id: 'tab2',
      method: 'GET',
      methodColor: 'text-api-muted',
      endpoint: '/api/v1/parking-lots/search',
      rawCode: `GET /api/v1/parking-lots/search?lat=10.762622&lng=106.660172&radiusKm=15&vehicleType=CONTAINER_40FT HTTP/1.1
Host: api.smarttruckhub.vn
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Response (200 OK) · Latency: 28ms
{
  "totalMatches": 4,
  "items": [
    {
      "parkingLotId": 104,
      "name": "Bãi Xe Logistics Cát Lái 02",
      "availableSpots": 18,
      "distanceKm": 2.4,
      "shorePowerAvailable": true,
      "ratePerHour": 50000
    }
  ]
}`,
      render: () => (
        <>
          <div>
            <span className="text-api-muted font-bold">GET</span> /api/v1/parking-lots/search?lat=10.762622&amp;lng=106.660172&amp;radiusKm=15&amp;vehicleType=CONTAINER_40FT HTTP/1.1
          </div>
          <div>
            <span className="text-api-muted">Host:</span> api.smarttruckhub.vn
          </div>
          <div>
            <span className="text-api-muted">Authorization:</span> Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
          </div>
          <div className="my-3 text-api-muted">
            // Response (200 OK) · Latency: 28ms
          </div>
          <div>
            <span className="text-api-muted">{'{'}</span>
          </div>
          <div className="pl-4">
            <span className="text-brand-orange">&quot;totalMatches&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">4</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-4">
            <span className="text-brand-orange">&quot;items&quot;</span>
            <span className="text-api-muted">: [</span>
          </div>
          <div className="pl-8">
            <span className="text-api-muted">{'{'}</span>
          </div>
          <div className="pl-12">
            <span className="text-brand-orange">&quot;parkingLotId&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">104</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-12">
            <span className="text-brand-orange">&quot;name&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">&quot;Bãi Xe Logistics Cát Lái 02&quot;</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-12">
            <span className="text-brand-orange">&quot;availableSpots&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">18</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-12">
            <span className="text-brand-orange">&quot;distanceKm&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">2.4</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-12">
            <span className="text-brand-orange">&quot;shorePowerAvailable&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-brand-orange">true</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-12">
            <span className="text-brand-orange">&quot;ratePerHour&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">50000</span>
          </div>
          <div className="pl-8">
            <span className="text-api-muted">{'}'}</span>
          </div>
          <div className="pl-4">
            <span className="text-api-muted">]</span>
          </div>
          <div>
            <span className="text-api-muted">{'}'}</span>
          </div>
        </>
      ),
    },
    {
      id: 'tab3',
      method: 'POST',
      methodColor: 'text-brand-orange',
      endpoint: '/api/v1/merchant/check-in',
      rawCode: `POST /api/v1/merchant/check-in HTTP/1.1
Host: api.smarttruckhub.vn
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "gateId": "GATE-CATLAI-IN-01",
  "plateNumber": "51D-892.44",
  "rfidTag": "RF-998231",
  "alprConfidence": 0.992
}

// Response (200 OK) · Barie Trigger Opened
{
  "gateAction": "OPEN_BARRIER",
  "bookingId": 8941,
  "assignedBerth": "BERTH-B-14",
  "authorizedAt": "2026-10-25T14:28:12Z"
}`,
      render: () => (
        <>
          <div>
            <span className="text-brand-orange font-bold">POST</span> /api/v1/merchant/check-in HTTP/1.1
          </div>
          <div>
            <span className="text-api-muted">Host:</span> api.smarttruckhub.vn
          </div>
          <div>
            <span className="text-api-muted">Authorization:</span> Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
          </div>
          <div>
            <span className="text-api-muted">Content-Type:</span> application/json
          </div>
          <div className="my-2" />
          <div>
            <span className="text-api-muted">{'{'}</span>
          </div>
          <div className="pl-4">
            <span className="text-brand-orange">&quot;gateId&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">&quot;GATE-CATLAI-IN-01&quot;</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-4">
            <span className="text-brand-orange">&quot;plateNumber&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">&quot;51D-892.44&quot;</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-4">
            <span className="text-brand-orange">&quot;rfidTag&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">&quot;RF-998231&quot;</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-4">
            <span className="text-brand-orange">&quot;alprConfidence&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">0.992</span>
          </div>
          <div>
            <span className="text-api-muted">{'}'}</span>
          </div>
          <div className="my-3 text-api-muted">
            // Response (200 OK) · Barie Trigger Opened
          </div>
          <div>
            <span className="text-api-muted">{'{'}</span>
          </div>
          <div className="pl-4">
            <span className="text-brand-orange">&quot;gateAction&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">&quot;OPEN_BARRIER&quot;</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-4">
            <span className="text-brand-orange">&quot;bookingId&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">8941</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-4">
            <span className="text-brand-orange">&quot;assignedBerth&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">&quot;BERTH-B-14&quot;</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-4">
            <span className="text-brand-orange">&quot;authorizedAt&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">&quot;2026-10-25T14:28:12Z&quot;</span>
          </div>
          <div>
            <span className="text-api-muted">{'}'}</span>
          </div>
        </>
      ),
    },
    {
      id: 'tab4',
      method: 'HOOK',
      methodColor: 'text-brand-orange-hover',
      endpoint: 'booking.checked_in',
      rawCode: `POST /webhook/fretrix-events HTTP/1.1
Host: tms.partner-logistics.vn
X-Hub-Signature-256: sha256=9f830...cb81b
Content-Type: application/json

{
  "event": "booking.checked_in",
  "timestamp": 1792938492,
  "payload": {
    "bookingCode": "BK-2026-8941",
    "plateNumber": "51D-892.44",
    "parkingLotName": "Bãi Xe Logistics Cát Lái 02",
    "checkInTime": "2026-10-25T14:28:12Z",
    "status": "ACTIVE_PARKED"
  }
}`,
      render: () => (
        <>
          <div>
            <span className="text-brand-orange-hover font-bold">POST</span> /webhook/fretrix-events HTTP/1.1
          </div>
          <div>
            <span className="text-api-muted">Host:</span> tms.partner-logistics.vn
          </div>
          <div>
            <span className="text-api-muted">X-Hub-Signature-256:</span> sha256=9f830...cb81b
          </div>
          <div>
            <span className="text-api-muted">Content-Type:</span> application/json
          </div>
          <div className="my-2" />
          <div>
            <span className="text-api-muted">{'{'}</span>
          </div>
          <div className="pl-4">
            <span className="text-brand-orange">&quot;event&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">&quot;booking.checked_in&quot;</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-4">
            <span className="text-brand-orange">&quot;timestamp&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">1792938492</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-4">
            <span className="text-brand-orange">&quot;payload&quot;</span>
            <span className="text-api-muted">: {'{'}</span>
          </div>
          <div className="pl-8">
            <span className="text-brand-orange">&quot;bookingCode&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">&quot;BK-2026-8941&quot;</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-8">
            <span className="text-brand-orange">&quot;plateNumber&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">&quot;51D-892.44&quot;</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-8">
            <span className="text-brand-orange">&quot;parkingLotName&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">&quot;Bãi Xe Logistics Cát Lái 02&quot;</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-8">
            <span className="text-brand-orange">&quot;checkInTime&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">&quot;2026-10-25T14:28:12Z&quot;</span>
            <span className="text-api-muted">,</span>
          </div>
          <div className="pl-8">
            <span className="text-brand-orange">&quot;status&quot;</span>
            <span className="text-api-muted">: </span>
            <span className="text-white">&quot;ACTIVE_PARKED&quot;</span>
          </div>
          <div className="pl-4">
            <span className="text-api-muted">{'}'}</span>
          </div>
          <div>
            <span className="text-api-muted">{'}'}</span>
          </div>
        </>
      ),
    },
  ]

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0]

  const handleCopy = async () => {
    setCopyError('')
    setCopied(false)
    try {
      await navigator.clipboard.writeText(currentTab.rawCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopyError('Không thể sao chép. Hãy cho phép quyền clipboard hoặc chọn nội dung bên dưới để sao chép thủ công.')
    }
  }

  return (
    <section id="swagger-docs" className="w-full bg-brand-navy-light py-20 px-6 lg:px-12 flex justify-center border-b border-api-panel">
      <div className="max-w-[1240px] w-full flex flex-col gap-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-brand-orange tracking-wider uppercase block mb-2 font-semibold">
              SPECS &amp; RUNTIME RUNBOOK
            </span>
            <h2 className="font-sora font-bold text-2xl sm:text-3xl text-white">
              Kiến Trúc API Điểm Chốt Thực Nghiệm
            </h2>
          </div>
          <div className="text-api-muted text-sm sm:text-base max-w-md font-normal leading-relaxed">
            Chuẩn hóa RESTful JSON payload theo quy chuẩn TMS công nghiệp. Dễ dàng tích hợp cắm rút qua HTTP Client hoặc bộ SDK Fretrix.
          </div>
        </div>

        {/* Mac-Style Terminal Wrapper */}
        <div className="w-full bg-brand-navy rounded border border-api-border overflow-hidden shadow-2xl">
          {/* Terminal Header */}
          <div className="flex items-center justify-between flex-wrap gap-3 px-4 py-3 bg-brand-navy-light border-b border-api-border">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-api-body" />
              <span className="w-3 h-3 rounded-full bg-api-hover" />
              <span className="w-3 h-3 rounded-full bg-api-panel" />
              <span className="ml-1 break-all font-mono text-xs text-api-muted">
                terminal@smarttruckhub-core-v3.0.4
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block font-mono text-[11px] text-brand-orange bg-brand-navy px-2 py-0.5 rounded border border-api-border">
                HOST: api.smarttruckhub.vn
              </span>
              <button
                type="button"
                className="flex items-center gap-1.5 font-mono text-xs text-api-muted hover:text-white px-2.5 py-1 bg-api-panel hover:bg-api-hover rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-orange"
                id="copy-btn"
                onClick={handleCopy}
                aria-label={copied ? "Đã sao chép" : "Copy Payload — Sao chép payload API"}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-brand-orange" aria-hidden="true" />
                    <span>Đã sao chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copy Payload</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {copyError && <p role="status" className="px-4 py-3 text-sm text-api-muted">{copyError}</p>}

          {/* Terminal Tabs */}
          <div
            className="flex flex-wrap border-b border-api-border bg-brand-navy overflow-x-auto"
            id="endpoint-tabs"
            role="tablist"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`tab-button px-4 py-3 font-mono text-xs border-r border-api-border flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-orange ${
                    isActive
                      ? 'bg-brand-navy-light text-white border-b-2 border-b-brand-orange'
                      : 'text-api-muted hover:text-white hover:bg-brand-navy-light'
                  }`}
                  data-tab={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className={`${tab.methodColor} font-bold`}>{tab.method}</span>
                  <span>{tab.endpoint}</span>
                </button>
              )
            })}
          </div>

          {/* Code Block Viewport */}
          <div className="p-6 overflow-x-auto text-[13px] font-mono leading-relaxed bg-brand-navy min-h-[380px]">
            <pre className="text-white" id="code-display">
              {currentTab.render()}
            </pre>
          </div>

          {/* Terminal Status Bar */}
          <div className="px-4 py-2 bg-brand-navy-light border-t border-api-border flex flex-wrap items-center justify-between text-[11px] font-mono text-api-muted gap-2">
            <div className="flex items-center gap-4">
              <span>METHOD: REST / JSON</span>
              <span>ENCODING: UTF-8</span>
              <span>RATE-LIMIT: 5,000 REQ/MIN</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span>CORE NODE: SGN-01 ONLINE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
