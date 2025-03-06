export default async function handler(req, res) {
  // Only accept POST requests to this endpoint
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST for all requests." })
  }

  try {
    // Extract request details from the POST body
    const {
      targetPath, // The path to forward to (e.g., '/health', '/clients')
      method = "GET", // The HTTP method to use when forwarding (defaults to GET)
      params = {}, // Query parameters for GET requests
      body = null, // Body for POST/PUT/PATCH requests
      headers = {}, // Additional headers to forward
    } = req.body

    // Validate required fields
    if (!targetPath) {
      return res.status(400).json({ error: "Missing targetPath in request body" })
    }

    // Build the target URL with query parameters for GET requests
    let targetUrl = `http://18.207.232.153:3003${targetPath}`

    // Add query parameters for GET requests
    if (method === "GET" && Object.keys(params).length > 0) {
      const queryString = new URLSearchParams(params).toString()
      targetUrl = `${targetUrl}?${queryString}`
    }

    console.log(`Forwarding ${method} request to: ${targetUrl}`)

    // Set up request headers
    const requestHeaders = {
      "Content-Type": "application/json",
      ...headers,
    }

    // Forward the request to the EC2 instance
    const response = await fetch(targetUrl, {
      method: method,
      headers: requestHeaders,
      body: ["GET", "HEAD"].includes(method) ? undefined : JSON.stringify(body),
    })

    // Get response data
    let responseData
    const contentType = response.headers.get("content-type")

    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json()
    } else {
      responseData = await response.text()
    }

    // Return the response
    return res.status(response.status).json({
      status: response.status,
      statusText: response.statusText,
      data: responseData,
      headers: Object.fromEntries(response.headers.entries()),
    })
  } catch (error) {
    console.error("Proxy error:", error)
    return res.status(500).json({
      error: "Failed to proxy request",
      message: error.message,
    })
  }
}


