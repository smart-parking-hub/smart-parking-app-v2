// Test fixtures only. Read codes from a loopback-only SMTP inbox, never from auth API responses.
export async function readLocalEmailCode(email, purpose = 'register') {
  const inbox = 'http://127.0.0.1:8025'
  for (let attempt = 0; attempt < 30; attempt++) {
    const response = await fetch(`${inbox}/api/v1/messages?limit=100`)
    if (!response.ok) throw new Error('Local email inbox is unavailable')
    const { messages = [] } = await response.json()
    const message = messages.find(item => item.To?.some(recipient => recipient.Address.toLowerCase() === email.toLowerCase())
      && item.Subject.includes(purpose === 'register' ? 'đăng ký' : 'mật khẩu'))
    if (message) {
      const detail = await (await fetch(`${inbox}/api/v1/message/${encodeURIComponent(message.ID)}`)).json()
      const code = detail.Text?.match(/\b[0-9]{6}\b/)?.[0]
      if (code) return code
    }
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  throw new Error('No OTP email received in the local SMTP inbox')
}
