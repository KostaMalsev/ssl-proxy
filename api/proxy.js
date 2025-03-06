// This is a serverless function, not an Edge Function
export default async function handler(req, res) {
  const { path = [] } = req.query
  const pathString = Array.isArray(path) ? path.join("/") : path

  // Get the target path from the URL or use the path from the query
  const targetPath = req.url.replace(/^\/api\/proxy/, "") || `/${pathString}`

  // Log the request details
  console.log("Request path:", targetPath)
  console.log("Method:", req.method)

  try {
    // Forward the request to your EC2 instance
    const targetUrl = `http://18.207.232.153:3003${targetPath}`
    console.log("Forwarding to:", targetUrl)

    // Create headers object without host
    const headers = { ...req.headers }
    delete headers.host

    // Forward the request
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : JSON.stringify(req.body),
    })

    // Get response data
    const data = await response.text()

    // Set response headers
    for (const [key, value] of Object.entries(response.headers.raw())) {
      res.setHeader(key, value)
    }

    // Send response
    res.status(response.status).send(data)
  } catch (error) {
    console.error("Proxy error:", error)
    res.status(500).json({ error: "Failed to proxy request", details: error.message })
  }
}


