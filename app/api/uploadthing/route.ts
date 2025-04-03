import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
    router: ourFileRouter,
    config: {
        callbackUrl: `${process.env.NEXT_PUBLIC_UPLOADTHING_URL}/api/uploadthing`,
    },
});