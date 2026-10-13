// POST /api/contact: verify Turnstile, email Earl (Reply-To the visitor),
// then send the visitor a fixed confirmation. Never echoes visitor text to
// the visitor's address, so the form can't be used to mail arbitrary content.

const EMAIL_RE = /^[^\s@<>"]{1,64}@[^\s@<>"]{1,190}\.[a-z]{2,}$/i;
const TOPICS = ["Software", "An app", "Something else"];

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

async function sendEmail(env, payload) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`resend ${r.status}`);
}

export default {
  async fetch(request, env) {
    if (request.method !== "POST") return json(405, { error: "method" });
    const origin = request.headers.get("Origin");
    if (origin !== "https://elsewhereindex.com") return json(403, { error: "origin" });

    let d;
    try { d = await request.json(); } catch { return json(400, { error: "body" }); }

    // Honeypot: bots fill it, people never see it. Pretend success.
    if (d.website) return json(200, { ok: true });

    const email = String(d.email || "").trim();
    const message = String(d.message || "").trim().slice(0, 5000);
    const topic = TOPICS.includes(d.topic) ? d.topic : "Something else";
    if (!EMAIL_RE.test(email) || !message) return json(400, { error: "fields" });

    const form = new FormData();
    form.append("secret", env.TURNSTILE_SECRET);
    form.append("response", String(d["cf-turnstile-response"] || ""));
    form.append("remoteip", request.headers.get("CF-Connecting-IP") || "");
    const ts = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
    if (!(await ts.json()).success) return json(403, { error: "turnstile" });

    try {
      await sendEmail(env, {
        from: env.FROM,
        to: [env.TO],
        reply_to: email,
        subject: `elsewhereindex.com: ${topic}`,
        text: `From: ${email}\nTopic: ${topic}\n\n${message}`,
      });
      await sendEmail(env, {
        from: env.FROM,
        to: [email],
        subject: "Got your note",
        text: "Thanks for writing to Elsewhere Index. Your message reached Earl, and he replies from earl@elsewhereindex.com.\n\nIf you didn't send this, ignore it.",
      });
    } catch {
      return json(502, { error: "send" });
    }
    return json(200, { ok: true });
  },
};
