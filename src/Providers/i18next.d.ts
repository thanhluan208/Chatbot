import store from "@/locales/en/store.json";
import node from "@/locales/en/node.json";

const resources = {
  store,
  node,
} as const;

declare module "i18next" {
  interface CustomTypeOptions {
    resources: typeof resources;
  }
}
