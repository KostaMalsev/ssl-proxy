import type { NextRequest } from "next/server"

// Define the EC2 instance base URL
const EC2_BASE_URL = "http://18.207.232.153:3003"

// Support all HTTP methods
export async function GET(request: NextRequest) {
  return handleRequest(request)
}

export async function POST(request: NextRequest) {
  return handleRequest(request)
}

export async function PUT(request: NextRequest) {
  return handleRequest(request)
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request)
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request)
}

// Common handler function for all methods
async function handleRequest(request: NextRequest) {
  try {
    
    // Extract the path from the request URL
    const path = request.nextUrl.pathname.replace("/api/", "")
    console.log('The path in handle request:',path)

    // Get the search params (query string)
    const searchParams = request.nextUrl.search

    // Construct the target URL
    const targetUrl = `${EC2_BASE_URL}/${path}${searchParams}`

    // Clone headers to forward them
    const headers = new Headers()
    request.headers.forEach((value, key) => {
      // Skip host header to avoid conflicts
      if (key.toLowerCase() !== "host") {
        headers.append(key, value)
      }
    })

    // Forward the request to the EC2 instance
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.body ? request.body : undefined,
      // Don't follow redirects automatically, let the client handle them
      redirect: "manual",
    })
    
    conosle.log('got a responce:',response)

    // Clone the response headers
    const responseHeaders = new Headers()
    response.headers.forEach((value, key) => {
      responseHeaders.append(key, value)
    })

    // Get the response body
    const responseBody = await response.arrayBuffer()

    // Return the response with the same status, headers, and body
    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error("Proxy error:", error)
    return new Response(JSON.stringify({ error: "Failed to proxy request" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

// Set Edge runtime
export const config = {
  runtime: "edge",
}
