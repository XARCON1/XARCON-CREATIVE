import type { CrmChannel } from "./data";

export type CrmChannelCapability = {
  id: CrmChannel;
  label: string;
  inbound: boolean;
  outbound: boolean;
  automation: boolean;
  configured: boolean;
};

export const crmChannels: Record<CrmChannel, CrmChannelCapability> = {
  web_form: {
    id: "web_form",
    label: "Formulario web",
    inbound: true,
    outbound: false,
    automation: false,
    configured: true,
  },
  whatsapp: {
    id: "whatsapp",
    label: "WhatsApp",
    inbound: true,
    outbound: true,
    automation: true,
    configured: false,
  },
  email: {
    id: "email",
    label: "Correo",
    inbound: true,
    outbound: true,
    automation: true,
    configured: false,
  },
  internal: {
    id: "internal",
    label: "Nota interna",
    inbound: false,
    outbound: false,
    automation: false,
    configured: true,
  },
};

export type NormalizedInboundMessage = {
  channel: CrmChannel;
  externalConversationId?: string;
  externalContactId?: string;
  contactName: string;
  email?: string;
  phone?: string;
  body: string;
  receivedAt: string;
};

export interface CrmChannelAdapter {
  channel: CrmChannel;
  normalizeInbound(payload: unknown): Promise<NormalizedInboundMessage>;
  sendMessage?(conversationId: string, body: string): Promise<{
    externalMessageId: string;
    sentAt: string;
  }>;
}
