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
  const data = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok) {
    const msg = data.error?.message ?? `Meta API error ${res.status}`;
    throw new Error(msg);
  }
  return data;
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
    components.push({
      type: "HEADER",
      format: params.headerType,
      ...(params.headerType === "TEXT" && params.headerContent ? { text: params.headerContent } : {}),
    });
  }

  components.push({ type: "BODY", text: params.body });

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
