export function eventLog(event: string, message: string, status?: string) {
  const now = new Date().toLocaleString()
  const format = `[eventinfo] ${message} ${now} - ${event} ${status}`
  console.info(format)
}