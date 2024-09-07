function isUrl(url: string) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return false;
    }

    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function addCorsIfNeeded(response: Response) {
    const headers = new Headers(response.headers);

    if (!headers.has("access-control-allow-origin")) {
        headers.set("access-control-allow-origin", "https://beer-psi.github.io");
        headers.set("access-control-allow-credentials", "true");
        headers.set("access-control-allow-headers", "Authorization, Content-Type");
    }

    return headers;
}

Deno.serve(async (request: Request) => {
    const { pathname, search } = new URL(request.url);
    const url = pathname.substring(1) + search; 

    if (!isUrl(url)) {
        return new Response("", { status: 404, statusText: "Not Found" });
    }

    const corsHeaders = addCorsIfNeeded(new Response());
    if (request.method.toUpperCase() === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    const response = await fetch(url, request);
    const headers = addCorsIfNeeded(response);
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
});
