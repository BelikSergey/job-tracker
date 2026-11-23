// @vitest-environment node
import { existsSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadDatabaseUrl } from "@/db/load-env";

vi.mock("node:fs", () => ({ existsSync: vi.fn() }));

const existsSyncMock = vi.mocked(existsSync);

describe("loadDatabaseUrl", () => {
  const original = process.env.DATABASE_URL;
  let loadEnvFile: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    delete process.env.DATABASE_URL;
    loadEnvFile = vi.spyOn(process, "loadEnvFile").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    existsSyncMock.mockReset();
    if (original === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = original;
  });

  it("loads .env.local when the file exists", () => {
    existsSyncMock.mockReturnValue(true);
    loadEnvFile.mockImplementation(() => {
      process.env.DATABASE_URL = "postgres://from-file";
    });

    expect(loadDatabaseUrl()).toBe("postgres://from-file");
    expect(loadEnvFile).toHaveBeenCalledWith(".env.local");
  });

  it("uses the environment when .env.local is missing (CI)", () => {
    existsSyncMock.mockReturnValue(false);
    process.env.DATABASE_URL = "postgres://from-env";

    expect(loadDatabaseUrl()).toBe("postgres://from-env");
    expect(loadEnvFile).not.toHaveBeenCalled();
  });

  it("throws when DATABASE_URL is not set anywhere", () => {
    existsSyncMock.mockReturnValue(false);

    expect(() => loadDatabaseUrl()).toThrow(/DATABASE_URL is not set/);
  });
});
