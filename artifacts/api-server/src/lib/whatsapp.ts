/**
 * Thin wrapper around Meta's WhatsApp Cloud API (Graph API v20.0).
 * Reads credentials from environment variables so they never touch source code.
 */

const GRAPH_BASE = "https://graph.facebook.com/v20.0";

function creds() {
  const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
  const wabaId = process.env.META_WABA_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;
  if (!phoneNumberId || !wabaId || !accessToken) {
    throw new Error(
      "WhatsApp credentials not configured. Set META_PHONE_NUMBER_ID, META_WABA_ID, and META_ACCESS_TOKEN in Secrets.",
    );
  }
  return { phoneNumberId, wabaId, accessToken };
}

async function graphFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { accessToken } = creds();
  const url = `${GRAPH_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const data = (await res.json()) as T & {
    error?: { message?: string; error_user_msg?: string; error_user_title?: string; code?: number };
  };
  if (!res.ok) {
    // Prefer the human-readable user message Meta provides
    const msg =
      data.error?.error_user_msg ??
      data.error?.error_user_title ??
      data.error?.message ??
      `Meta API error ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

/** Extract variable indices from a template body string, e.g. "Hi {{1}}, your OTP is {{2}}" → [1, 2] */
function extractVariableIndices(text: string): number[] {
  const matches = [...text.matchAll(/\{\{(\d+)\}\}/g)];
  return [...new Set(matches.map((m) => parseInt(m[1]!, 10)))].sort((a, b) => a - b);
}

// ── Types ──────────────────────────────────────────────────────────────────────

export type TemplateCategory = "MARKETING" | "UTILITY" | "AUTHENTICATION";
export type HeaderType = "NONE" | "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT";

export interface CreateTemplateParams {
  name: string;
  category: TemplateCategory;
  language: string;
  headerType: HeaderType;
  headerContent?: string;
  body: string;
  footer?: string;
  /** Ordered sample values for body variables {{1}}, {{2}}, … */
  bodySamples?: string[];
  /** Sample value for a text header variable {{1}} */
  headerSample?: string;
}

export interface MetaTemplateRecord {
  id: string;
  name: string;
  status: string;
  category: string;
  language: string;
}

// ── Template operations ────────────────────────────────────────────────────────

/** Submit a new template to Meta for review. */
export async function createMetaTemplate(params: CreateTemplateParams) {
  const { wabaId } = creds();

  type Component = { type: string; format?: string; text?: string };
  const components: Component[] = [];

  if (params.headerType !== "NONE") {
    const headerComp: Component & { example?: { header_text: string[] } } = {
      type: "HEADER",
      format: params.headerType,
      ...(params.headerType === "TEXT" && params.headerContent ? { text: params.headerContent } : {}),
    };
    // Add header sample if provided
    if (params.headerType === "TEXT" && params.headerSample) {
      headerComp.example = { header_text: [params.headerSample] };
    }
    components.push(headerComp);
  }

  // Meta requires example values for every {{N}} variable in the body
  const varIndices = extractVariableIndices(params.body);
  const bodyComponent: Component & { example?: { body_text: string[][] } } = {
    type: "BODY",
    text: params.body,
  };
  if (varIndices.length > 0) {
    // Use user-provided sample values; fall back to generic placeholders so submission never fails
    const sampleValues = varIndices.map((i, pos) =>
      params.bodySamples?.[pos]?.trim() || `sample_value_${i}`,
    );
    bodyComponent.example = { body_text: [sampleValues] };
  }
  components.push(bodyComponent);

  if (params.footer) {
    components.push({ type: "FOOTER", text: params.footer });
  }

  const result = await graphFetch<{ id: string; status: string }>(
    `/${wabaId}/message_templates`,
    {
      method: "POST",
      body: JSON.stringify({
        name: params.name,
        category: params.category,
        language: params.language,
        components,
      }),
    },
  );

  return result;
}

/** Fetch all templates from Meta for this WABA. */
export async function getMetaTemplates(): Promise<MetaTemplateRecord[]> {
  const { wabaId } = creds();
  const result = await graphFetch<{ data: MetaTemplateRecord[] }>(
    `/${wabaId}/message_templates?fields=id,name,status,category,language`,
  );
  return result.data ?? [];
}

/** Delete a template from Meta by name (affects all languages). */
export async function deleteMetaTemplate(name: string): Promise<void> {
  const { wabaId } = creds();
  await graphFetch(`/${wabaId}/message_templates?name=${encodeURIComponent(name)}`, {
    method: "DELETE",
  });
}

// ── Messaging ─────────────────────────────────────────────────────────────────

/** Send a free-text message within the 24-hour customer-service window. */
export async function sendTextMessage(to: string, body: string) {
  const { phoneNumberId } = creds();
  const result = await graphFetch<{ messages: Array<{ id: string }> }>(
    `/${phoneNumberId}/messages`,
    {
      method: "POST",
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: to.replace(/\s+/g, ""),
        type: "text",
        text: { body },
      }),
    },
  );
  return result;
}

/** Send a template message to a phone number (E.164 format, e.g. +919876543210). */
export async function sendTemplateMessage(
  to: string,
  templateName: string,
  languageCode: string,
  components?: Array<{ type: string; parameters: Array<{ type: string; text?: string }> }>,
) {
  const { phoneNumberId } = creds();
  const result = await graphFetch<{ messages: Array<{ id: string }> }>(
    `/${phoneNumberId}/messages`,
    {
      method: "POST",
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: to.replace(/\s+/g, ""),
        type: "template",
        template: {
          name: templateName,
          language: { code: languageCode },
          ...(components?.length ? { components } : {}),
        },
      }),
    },
  );
  return result;
}
