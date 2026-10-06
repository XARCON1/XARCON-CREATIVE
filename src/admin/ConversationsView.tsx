import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Bot,
  Building2,
  CheckCircle2,
  Clock3,
  Mail,
  MessageCircleMore,
  MessageSquareText,
  Search,
  Send,
  UserPlus,
  UserRound,
} from "lucide-react";
import type { CrmConversationStatus } from "./data";
import { divisionMeta } from "./data";
import type { ReturnTypeWorkspace } from "./workspaceTypes";
import { ViewHeader } from "./OperationsViews";

const statusLabels: Record<CrmConversationStatus, string> = {
  new: "Nueva",
  open: "Abierta",
  pending: "Pendiente",
  resolved: "Resuelta",
  archived: "Archivada",
};

export default function ConversationsView({
  workspace,
  ownerName,
}: {
  workspace: ReturnTypeWorkspace;
  ownerName: string;
}) {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"all" | "unread" | "open">("all");
  const [selectedId, setSelectedId] = useState(workspace.conversations[0]?.id || "");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return workspace.conversations.filter((item) => {
      if (scope === "unread" && item.unreadCount < 1) return false;
      if (scope === "open" && !["new", "open", "pending"].includes(item.status)) return false;
      if (!needle) return true;
      return `${item.contactName} ${item.email} ${item.company || ""} ${item.subject} ${item.preview}`
        .toLowerCase()
        .includes(needle);
    });
  }, [query, scope, workspace.conversations]);

  const selected =
    workspace.conversations.find((item) => item.id === selectedId) ??
    visible[0] ??
    workspace.conversations[0];

  const messages = selected
    ? workspace.crmMessages.filter((item) => item.conversationId === selected.id)
    : [];

  const linkedClient = selected?.clientId
    ? workspace.clients.find((item) => item.id === selected.clientId)
    : workspace.clients.find(
        (item) => item.email.toLowerCase() === selected?.email.toLowerCase(),
      );

  useEffect(() => {
    if (!selectedId && workspace.conversations[0]) {
      setSelectedId(workspace.conversations[0].id);
    }
  }, [selectedId, workspace.conversations]);

  useEffect(() => {
    if (selected?.unreadCount) {
      void workspace.markConversationRead(selected.id);
    }
  }, [selected?.id]);

  const saveNote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;
    const form = new FormData(event.currentTarget);
    const body = String(form.get("body") || "").trim();
    if (!body) return;
    await workspace.addConversationNote(selected.id, body, ownerName || "Owner XARCON");
    event.currentTarget.reset();
  };

  const createOrLinkClient = async () => {
    if (!selected) return;
    if (linkedClient) {
      await workspace.linkConversationToClient(selected.id, linkedClient.id);
      return;
    }

    const client = await workspace.addClient({
      name: selected.contactName,
      company: selected.company || undefined,
      phone: selected.phone || "—",
      email: selected.email,
      location: "Nicaragua",
      division: "creative",
      type: selected.company ? "Empresa" : "Particular",
      status: "Prospecto",
      nextAction: "Dar seguimiento a conversación CRM",
    });
    await workspace.linkConversationToClient(selected.id, client.id);
  };

  const unread = workspace.conversations.reduce((sum, item) => sum + item.unreadCount, 0);

  return (
    <div className="hq-view hq-crm-view">
      <ViewHeader
        kicker="CRM / CONVERSACIONES"
        title="Cada contacto entra en un solo hilo."
        description="Formularios web hoy; WhatsApp, correo y automatizaciones después, sobre la misma bandeja."
      />

      <section className="hq-crm-layout">
        <aside className="hq-crm-inbox">
          <div className="hq-crm-inbox-head">
            <div>
              <span className="hq-kicker">BANDEJA</span>
              <strong>{workspace.conversations.length} conversaciones</strong>
            </div>
            {unread > 0 && <b className="hq-crm-unread">{unread} nuevas</b>}
          </div>

          <label className="hq-inline-search">
            <Search size={15} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar contacto o mensaje…"
            />
          </label>

          <div className="hq-segmented">
            {([
              ["all", "Todas"],
              ["unread", "Nuevas"],
              ["open", "Activas"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                className={scope === value ? "active" : ""}
                onClick={() => setScope(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="hq-crm-thread-list">
            {visible.length === 0 && (
              <p className="hq-empty-state">No hay conversaciones en este filtro.</p>
            )}
            {visible.map((item) => (
              <button
                key={item.id}
                className={selected?.id === item.id ? "active" : ""}
                onClick={() => setSelectedId(item.id)}
              >
                <span className="hq-record-avatar">
                  {item.contactName.slice(0, 2).toUpperCase()}
                </span>
                <span className="hq-crm-thread-copy">
                  <span>
                    <strong>{item.contactName}</strong>
                    <small>{new Date(item.updatedAt).toLocaleDateString("es-NI")}</small>
                  </span>
                  <b>{item.subject}</b>
                  <p>{item.preview}</p>
                  <em>
                    <MessageSquareText size={12} />
                    {item.channel === "web_form" ? "Formulario web" : item.channel}
                  </em>
                </span>
                {item.unreadCount > 0 && <i className="hq-crm-dot" />}
              </button>
            ))}
          </div>
        </aside>

        <main className="hq-crm-conversation">
          {selected ? (
            <>
              <header className="hq-crm-conversation-head">
                <div>
                  <span className="hq-kicker">CONVERSACIÓN</span>
                  <h2>{selected.contactName}</h2>
                  <p>{selected.subject}</p>
                </div>
                <select
                  value={selected.status}
                  onChange={(event) =>
                    void workspace.setConversationStatus(
                      selected.id,
                      event.target.value as CrmConversationStatus,
                    )
                  }
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </header>

              <div className="hq-crm-messages">
                <article className="hq-message inbound">
                  <div>
                    <span>{selected.contactName}</span>
                    <small>{new Date(selected.createdAt).toLocaleString("es-NI")}</small>
                  </div>
                  <p>{selected.initialMessage}</p>
                  {selected.budget && <em>Presupuesto: {selected.budget}</em>}
                </article>

                {messages.map((message) => (
                  <article
                    key={message.id}
                    className={`hq-message ${message.direction === "internal" ? "internal" : message.direction}`}
                  >
                    <div>
                      <span>{message.authorName}</span>
                      <small>{new Date(message.createdAt).toLocaleString("es-NI")}</small>
                    </div>
                    <p>{message.body}</p>
                    <em>
                      {message.deliveryStatus === "internal"
                        ? "Nota interna"
                        : message.deliveryStatus}
                    </em>
                  </article>
                ))}
              </div>

              <form className="hq-crm-composer" onSubmit={(event) => void saveNote(event)}>
                <div className="hq-crm-channel-state">
                  <MessageCircleMore size={15} />
                  <span>Canal actual: formulario web</span>
                  <b>Respuesta externa pendiente de integración</b>
                </div>
                <textarea
                  name="body"
                  placeholder="Escribí una nota interna sobre esta conversación…"
                  rows={3}
                  maxLength={4000}
                  required
                />
                <div>
                  <small>
                    Estas notas sí se guardan en Firestore. No se envían al cliente todavía.
                  </small>
                  <button className="hq-primary-button" type="submit">
                    <Send size={15} /> Guardar nota
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="hq-crm-empty">
              <MessageSquareText size={30} />
              <strong>La bandeja está lista.</strong>
              <p>Cuando alguien envíe el formulario de la web, aparecerá aquí.</p>
            </div>
          )}
        </main>

        <aside className="hq-crm-context">
          {selected ? (
            <>
              <span className="hq-kicker">CONTEXTO CRM</span>
              <div className="hq-crm-contact-card">
                <span className="hq-record-avatar">
                  {selected.contactName.slice(0, 2).toUpperCase()}
                </span>
                <h3>{selected.contactName}</h3>
                <p>{selected.company || "Contacto individual"}</p>
              </div>

              <div className="hq-crm-contact-meta">
                <span><Mail size={15} /> {selected.email}</span>
                <span><Building2 size={15} /> {selected.company || "Sin empresa"}</span>
                <span><Clock3 size={15} /> {statusLabels[selected.status]}</span>
              </div>

              <button className="hq-primary-button" onClick={() => void createOrLinkClient()}>
                {linkedClient ? <CheckCircle2 size={15} /> : <UserPlus size={15} />}
                {linkedClient ? "Vincular al cliente existente" : "Convertir en cliente"}
              </button>

              {linkedClient && (
                <div className="hq-crm-linked">
                  <UserRound size={16} />
                  <div>
                    <span>Cliente CRM</span>
                    <strong>{linkedClient.name}</strong>
                    <small>{divisionMeta[linkedClient.division].short}</small>
                  </div>
                </div>
              )}

              <div className="hq-crm-automation">
                <Bot size={18} />
                <div>
                  <span>WHATSAPP AUTOMATION</span>
                  <strong>Arquitectura preparada</strong>
                  <p>
                    El futuro canal reutilizará esta conversación, este cliente y el contexto
                    comercial para responder con información autorizada de XARCON.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p className="hq-empty-state">Seleccioná una conversación para ver su contexto.</p>
          )}
        </aside>
      </section>
    </div>
  );
}
