import { assert } from "https://deno.land/std@0.120.0/testing/asserts.ts"
import sinon from "https://cdn.skypack.dev/sinon"
import filesystemApi, { actions } from './api.ts'

Deno.test("Given a data source and an action, when requesting to trigger action then calls corresponding action", async () => {
  const spy = (sinon as any).spy(actions, "getFile")
  await filesystemApi.api("aDataSource", {path: "aPath"}, "aUserId", "getFile")
  assert(spy.called)
})