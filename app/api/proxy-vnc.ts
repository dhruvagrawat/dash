// // app/api/proxy-vnc/[...path]/route.ts
// import { NextRequest, NextResponse } from 'next/server';

// // Handle all HTTP methods for the proxy
// export async function GET(
//     request: NextRequest,
//     { params }: { params: { path: string[] } }
// ) {
//     // Get the target path from params
//     const targetPath = params.path ? `/${params.path.join('/')}` : '/vnc.html';

//     // Build the VNC server URL with the correct port (6080)
//     const targetUrl = `http://44.218.170.241:6080${targetPath}`;

//     console.log(`Proxying to: ${targetUrl}`);

//     try {
//         const response = await fetch(targetUrl, {
//             method: request.method,
//             headers: {
//                 'User-Agent': request.headers.get('User-Agent') || '',
//                 'Accept': request.headers.get('Accept') || '*/*',
//                 'Accept-Language': request.headers.get('Accept-Language') || '',
//                 // Add other headers as needed
//             },
//             // Include the body for methods that support it
//             ...(request.method !== 'GET' && request.method !== 'HEAD' ? { body: request.body } : {}),
//         });

//         // Create a response without the headers that could block iframe embedding
//         const newHeaders = new Headers(response.headers);
//         newHeaders.delete('x-frame-options');
//         newHeaders.delete('content-security-policy');

//         // Return the proxied response
//         return new NextResponse(response.body, {
//             status: response.status,
//             statusText: response.statusText,
//             headers: newHeaders,
//         });
//     } catch (error: any) {
//         console.error(`Proxy error: ${error.message}`);
//         return new NextResponse(`Proxy error: ${error.message}`, { status: 500 });
//     }
// }

// // Support all other HTTP methods
// export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
//     return handleMethod(request, { params }, 'POST');
// }

// export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
//     return handleMethod(request, { params }, 'PUT');
// }

// export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
//     return handleMethod(request, { params }, 'DELETE');
// }

// export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
//     return handleMethod(request, { params }, 'PATCH');
// }

// export async function HEAD(request: NextRequest, { params }: { params: { path: string[] } }) {
//     return handleMethod(request, { params }, 'HEAD');
// }

// export async function OPTIONS(request: NextRequest, { params }: { params: { path: string[] } }) {
//     return handleMethod(request, { params }, 'OPTIONS');
// }

// // Helper to handle all methods
// async function handleMethod(
//     request: NextRequest,
//     { params }: { params: { path: string[] } },
//     method: string
// ) {
//     const targetPath = params.path ? `/${params.path.join('/')}` : '/vnc.html';
//     const targetUrl = `http://44.218.170.241:6100/vnc.html`;

//     try {
//         const response = await fetch(targetUrl, {
//             method: method,
//             headers: {
//                 'User-Agent': request.headers.get('User-Agent') || '',
//                 'Accept': request.headers.get('Accept') || '*/*',
//                 'Content-Type': request.headers.get('Content-Type') || 'application/octet-stream',
//                 // Add other headers as needed
//             },
//             body: request.body,
//         });

//         const newHeaders = new Headers(response.headers);
//         newHeaders.delete('x-frame-options');
//         newHeaders.delete('content-security-policy');

//         return new NextResponse(response.body, {
//             status: response.status,
//             statusText: response.statusText,
//             headers: newHeaders,
//         });
//     } catch (error: any) {
//         console.error(`Proxy error: ${error.message}`);
//         return new NextResponse(`Proxy error: ${error.message}`, { status: 500 });
//     }
// }