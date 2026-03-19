import { promises as fs } from "node:fs";
import path from "node:path";
import type { UserRole } from "@/lib/auth";

export type DemoUserRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

type DemoAuthStore = {
  users: DemoUserRecord[];
};

const STORE_PATH = path.join(process.cwd(), "data", "demo-auth-store.json");

async function ensureStoreFile() {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });

  try {
    await fs.access(STORE_PATH);
  } catch {
    const initialStore: DemoAuthStore = { users: [] };
    await fs.writeFile(STORE_PATH, JSON.stringify(initialStore, null, 2), "utf8");
  }
}

async function readStore(): Promise<DemoAuthStore> {
  await ensureStoreFile();
  const raw = await fs.readFile(STORE_PATH, "utf8");
  return JSON.parse(raw) as DemoAuthStore;
}

async function writeStore(store: DemoAuthStore) {
  await ensureStoreFile();
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function findDemoUserByEmail(email: string) {
  const store = await readStore();
  return store.users.find((user) => user.email === email) ?? null;
}

export async function createDemoUser(user: Omit<DemoUserRecord, "createdAt" | "updatedAt">) {
  const store = await readStore();
  const timestamp = new Date().toISOString();

  const nextUser: DemoUserRecord = {
    ...user,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  store.users.push(nextUser);
  await writeStore(store);

  return nextUser;
}

export async function updateDemoUser(currentEmail: string, patch: Partial<DemoUserRecord>) {
  const store = await readStore();
  const userIndex = store.users.findIndex((user) => user.email === currentEmail);

  if (userIndex === -1) {
    return null;
  }

  const currentUser = store.users[userIndex];
  const nextUser: DemoUserRecord = {
    ...currentUser,
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  store.users[userIndex] = nextUser;
  await writeStore(store);

  return nextUser;
}
