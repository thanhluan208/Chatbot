import { VariablesOut } from "@/Types/workflow";

export interface NodeDataHTTPRequest {
  name?: string;
  type: string;
  title: string;
  desc: string;
  iteration_id?: string;
  position: string;
  method: string;
  url: string;
  authorization: Authorization;
  headers: string;
  params: string;
  body: Body;
  timeout: Timeout;
  variable_out: VariablesOut[];
}

export interface Authorization {
  type: AuthorType;
  config: Config;
}

export interface Config {
  type: AuthorConfigType;
  api_key?: string;
  header?: string;
}

export interface Body {
  type: BodyType;
  data?: string;
}

export interface Timeout {
  connect: number;
  read: number;
  write: number;
}

export enum HttpMethod {
  GET = "get",
  POST = "post",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
  HEAD = "head",
}

export enum BodyType {
  NONE = "none",
  FORM_DATA = "form-data",
  X_WWW_FORM_URLENCODED = "x-www-form-urlencoded",
  RAW_TEXT = "raw-text",
  JSON = "json",
}

export enum AuthorType {
  NO_AUTH = "no-auth",
  API_KEY = "api-key",
}

export enum AuthorConfigType {
  BASIC = "basic",
  BEARER = "bearer",
  CUSTOM = "custom",
}

export interface KeyAndValueType {
  id: string;
  key: string;
  value: string;
  type?: BodyDataType;
}

export enum BodyDataType {
  STRING = "string",
  FILE = "file",
}
