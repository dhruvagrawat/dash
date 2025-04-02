import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
    router: ourFileRouter,
    config: {
        // Removed invalid property 'uploadthingId'
        // uploadthingSecret: process.env.UPLOADTHING_SECRET,
    },
});