"use client";

import {
  WebContainer,
  configureAPIKey,
  type WebContainer as WebContainerInstance,
} from "@webcontainer/api";
import { initialProjectTree } from "./template";
import { setupWorkspace } from "./setup-workspace";

let bootPromise: Promise<WebContainerInstance> | null = null;

async function bootWebContainer(): Promise<WebContainerInstance> {
  const apiKey = process.env.NEXT_PUBLIC_WEBCONTAINER_API_KEY;
  if (apiKey) {
    configureAPIKey(apiKey);
  }

  const instance = await WebContainer.boot({
    coep: "credentialless",
    forwardPreviewErrors: true,
  });
  await instance.mount(initialProjectTree);
  await setupWorkspace(instance);
  return instance;
}

export function getWebContainer(): Promise<WebContainerInstance> {
  if (!bootPromise) {
    bootPromise = bootWebContainer();
  }
  return bootPromise;
}
