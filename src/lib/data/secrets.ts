/** Shapes returned by the secret-exchange database functions. */

export type ReceivedSecret = {
  deliveryId: string;
  secretId: string;
  body: string;
  receivedAt: string;
  replied: boolean;
  /** Your reply, on the inbox page. */
  reply?: string | null;
};

export type ExchangeState = {
  used: number;
  limit: number;
  /** When today's exchanges reset (midnight in the account's time zone). */
  resetsAt: string;
  /** Secrets given while nobody else's was available yet. */
  owed: number;
  unreadReplies: number;
  /** Secrets received today, newest first. */
  received: ReceivedSecret[];
};

export type MySecret = {
  id: string;
  body: string;
  status: "published" | "pending" | "hidden" | "removed";
  createdAt: string;
  timesDelivered: number;
  replies: { id: string; body: string; createdAt: string; unread: boolean }[];
};
