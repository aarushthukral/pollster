export type Poll = {
  key: string;
  title: string;
  description?: string;
  image?: string;
  webhook?: string;
  archived: boolean;
  createdAt: number;
  endsAt?: number;
  options: {
    key: string;
    title: string;
    description?: string;
    image?: string;
  }[];
  slug: string;
  security: "none" | "ipAddress" | "session";
};

export type Vote = {
  key: string;
  poll: string;
  option: string;
  createdAt: number;
  ipAddress?: string;
};

export type VoteResponse = {
  voted: boolean;
  results: Record<string, number>;
};

export type DetaEvent = {
  id: string;
  trigger: string;
};
