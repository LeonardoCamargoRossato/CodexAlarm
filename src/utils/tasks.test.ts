import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCodexUrl, transitionTask, elapsed } from "./tasks";
import type { CodexTask } from "../types";
import {
  LocalAgentMonitoringProvider,
  MockMonitoringProvider,
} from "../providers/MonitoringProvider";
const task: CodexTask = {
  id: "test",
  name: "Test",
  ...parseCodexUrl("https://chatgpt.com/local/abc-123?hostId=local"),
  repository: "",
  status: "WAITING",
  createdAt: 1000,
  lastUpdatedAt: 1000,
  monitoringStartedAt: null,
  completedAt: null,
  acknowledgedAt: null,
  notifications: {
    sound: true,
    browser: false,
    email: false,
    mobilePush: false,
  },
};
test("parses authorized Codex URL and preserves query", () => {
  assert.deepEqual(parseCodexUrl(task.codexUrl), {
    codexUrl: task.codexUrl,
    codexTaskId: "abc-123",
    hostId: "local",
  });
});
test("rejects misleading hosts, credentials, protocols and unrelated paths", () => {
  for (const url of [
    "javascript:alert(1)",
    "https://chatgpt.com.evil.test/local/id",
    "http://chatgpt.com/local/id",
    "https://user@chatgpt.com/local/id",
    "https://chatgpt.com/c/id",
    "https://chatgpt.com/local/",
    "https://chatgpt.com/local/id/extra",
  ])
    assert.throws(() => parseCodexUrl(url));
});
test("timer derives from persisted timestamps and freezes at completion", () => {
  const active = transitionTask(task, "MONITORING", 1000);
  assert.equal(
    elapsed(JSON.parse(JSON.stringify(active)), 1_123_000),
    "00:18:42",
  );
  const complete = transitionTask(active, "COMPLETED", 1_123_000);
  assert.equal(elapsed(complete, 2_000_000), "00:18:42");
  assert.equal(complete.acknowledgedAt, null);
  assert.equal(transitionTask(complete, "COMPLETED", 2_000_000), complete);
});
test("mock state changes only explicitly; local agent stays disconnected", async () => {
  const mock = new MockMonitoringProvider();
  await mock.registerTask(task);
  assert.equal(await mock.getTaskStatus(task.id), "WAITING");
  mock.simulate(task.id, "COMPLETED");
  assert.equal(await mock.getTaskStatus(task.id), "COMPLETED");
  await mock.removeTask(task.id);
  assert.equal(await mock.getTaskStatus(task.id), "UNKNOWN");
  const local = new LocalAgentMonitoringProvider("http://127.0.0.1:43117");
  assert.equal(await local.connect(), "NOT_CONNECTED");
  await assert.rejects(() => local.registerTask(task));
});
