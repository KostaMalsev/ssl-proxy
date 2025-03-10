export default async function handler(req, res) {
  try {
    const response = await fetch("https://crm-rails-kosta-production.up.railway.app/health")
    const data = await response.text()
    res.status(response.status).send(data)
  } catch (error) {
    res.status(500).json({ error: "Failed to proxy request" })
  }
}
