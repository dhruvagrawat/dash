
// export default async function handler(req, res) {
//     if (req.method === "POST") {
//         const response = await fetch("http://your-ec2-ip:5000/start-server", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//         });
//         const data = await response.json();
//         res.status(response.status).json(data);
//     } else {
//         res.status(405).json({ error: "Method Not Allowed" });
//     }
// }

// export default async function handler(req, res) {
//     if (req.method === "POST") {
//         const response = await fetch("http://your-ec2-ip:5000/stop-server", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//         });
//         const data = await response.json();
//         res.status(response.status).json(data);
//     } else {
//         res.status(405).json({ error: "Method Not Allowed" });
//     }
// }
