import { expect, type Page } from '@playwright/test'

// The SDK and checkout page are intercepted: these tests never create a PayOS transaction.
export const sdkFixture = `
window.PayOSCheckout = {
  usePayOS(config) {
    let frame;
    const receive = (event) => {
      if (!frame || event.source !== frame.contentWindow || event.origin !== 'https://pay.payos.vn') return;
      if (event.data.status === 'PAID') config.onSuccess(event.data);
      if (event.data.status === 'CANCELLED') config.onCancel(event.data);
    };
    return {
      open() {
        frame = document.createElement('iframe');
        frame.src = config.CHECKOUT_URL.replace('/web/', '/embedded/');
        document.getElementById(config.ELEMENT_ID).appendChild(frame);
        window.addEventListener('message', receive);
      },
      exit() {
        window.removeEventListener('message', receive);
        frame?.remove();
      }
    };
  }
};`

export const checkoutFixture = `<!doctype html><html lang="vi"><head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:20px;box-sizing:border-box;font-family:system-ui;text-align:center">
<h2>PayOS · Môi trường kiểm thử</h2><p>Fixture QR — không chuyển tiền thật</p>
<svg role="img" aria-label="QR kiểm thử" width="180" height="180" viewBox="0 0 180 180"><rect width="180" height="180" fill="white"/><path d="M10 10h50v50H10z M120 10h50v50h-50z M10 120h50v50H10z M80 80h25v25H80z M130 130h35v35h-35z" fill="#102234"/></svg>
<p><button id="paid">Thông báo đã quét (fixture)</button></p>
<p><button id="cancel">Hủy thanh toán (fixture)</button></p>
<script>document.getElementById('paid').onclick=()=>parent.postMessage({status:'PAID'},'*');document.getElementById('cancel').onclick=()=>parent.postMessage({status:'CANCELLED'},'*');</script>
</body></html>`

// Payment and SDK responses are local fixtures; no real transaction is created.
export async function mockPayOSDeposit(page: Page, bookingId: number, confirmDeposit: () => void) {
  await page.route('**/api/v1/payments', async (route) => {
    expect(route.request().method()).toBe('POST')
    expect(route.request().postDataJSON()).toEqual({ bookingId, paymentType: 'DEPOSIT' })
    await route.fulfill({ json: { data: `https://pay.payos.vn/web/fixture-${bookingId}` } })
  })
  await page.route('**/api/v1/payments/sync', async (route) => {
    expect(route.request().postDataJSON()).toEqual({ bookingId })
    confirmDeposit()
    await route.fulfill({ json: { data: { status: 'SUCCESS' } } })
  })
  await page.route('https://cdn.payos.vn/**', (route) =>
    route.fulfill({ contentType: 'application/javascript', body: sdkFixture }),
  )
  await page.route('https://pay.payos.vn/**', (route) =>
    route.fulfill({ contentType: 'text/html; charset=utf-8', body: checkoutFixture }),
  )
}
