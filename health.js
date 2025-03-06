export default async function handler(req, res) {
  try {
    const response = await fetch("http://18.207.232.153:3003/health")
    const data = await response.text()
    res.status(response.status).send(data)
  } catch (error) {
    res.status(500).json({ error: "Failed to proxy request" })
  }
}

