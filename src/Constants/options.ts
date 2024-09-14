import Personal from "../assets/personal.png";
import Team from "../assets/team.png";

export interface WorkSpaceOption {
  label: string;
  avatar: string;
  value: string;
  type?: string;
}

export const workSpaceOptions = [
  {
    label: "Personal",
    avatar: Personal,
    value: "personal",
  },
  {
    label: "Team 1",
    avatar: Team,
    type: "team",
    value: "team1",
  },
  {
    label: "Team 2",
    avatar: Team,
    type: "team",
    value: "team2",
  },
  {
    label: "Team 3",
    avatar: Team,
    type: "team",
    value: "team3",
  },
];

export interface ModelOption {
  name: string;
  history_turn: FrequencyPenalty;
  max_tokens: FrequencyPenalty;
  temperature: FrequencyPenalty;
  top_p?: FrequencyPenalty;
  frequency_penalty?: FrequencyPenalty;
  presence_penalty?: FrequencyPenalty;
  img: string;
  label: string;
  value: string;
  group?: Group;
}

export interface FrequencyPenalty {
  default: number;
  min: number;
  max: number;
}

export enum Group {
  AnthropicAI = "Anthropic_LLM",
  Google = "Google",
  OpenAI = "OpenAI",
}

export const outputFormatOptions = [
  {
    label: "Text",
    value: "text",
  },
  {
    label: "JSON",
    value: "json",
  },
  {
    label: "Markdown",
    value: "markdown",
  },
];

export const configures = [
  {
    title: "Skills",
    items: [
      {
        title: "Plugins",
        content:
          "Plugins allow the bot to call external APIs that enable it to search for information, browse web pages, generate images, and more, expanding the bot's capabilities and applications.",
      },
      {
        title: "Workflows",
        content:
          "Workflow supports the combination of plugins, LLMs, code blocks, and other features through a visual interface, enabling the orchestration of complex and stable business processes, such as travel planning and report analysis.",
      },
      {
        title: "Triggers",
        content: "Allow users to create scheduled triggers during chatting",
      },
    ],
  },
  {
    title: "Knowledge",
    items: [
      {
        title: "Text",
        content:
          "After uploading documents, URLs, and third-party data sources into a text knowledge base, Bot can source the content in the text knowledge to answer user questions.",
      },
      {
        title: "Table",
        content:
          "Table supports matching appropriate rows according to a certain column of the table. It also supports querying and calculating the database based on natural language.",
      },
      {
        title: "Images",
        content:
          "After uploading the image, you can choose to automatically or manually add the semantic description. Then, the bot can match the most appropriate image based on its description.",
      },
    ],
  },
  {
    title: "Memory",
    items: [
      {
        title: "Variable",
        content:
          "After setting the memory, the bot will recall those memories during chats, which enables the bot to provide personalized responses.",
      },
      {
        title: "Database",
        content:
          "Organize your data in a tabular structure to implement features such as bookmarks and book management.",
      },
      {
        title: "Long-term Memory",
        content:
          "Summarize chat conversations and utilize them for enhanced user message responses.",
      },
      {
        title: "Filebox",
        content:
          "Filebox has been disabled. If you want to enable automatic saving files, please turn the Filebox on",
      },
    ],
  },
  {
    title: "Dialog",
    items: [
      {
        title: "Opening Dialog",
        content: "",
      },
      {
        title: "Auto suggestion",
        content: "",
      },
      {
        title: "Shortcut",
        content:
          "Shortcut are buttons fixed to the bot's input above. Once added, users can quickly execute queries by clicking them.",
      },
    ],
  },
];

export const chartData = {
  chart: {
    type: "spline",
  },
  credits: {
    enabled: false,
  },
  xAxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    accessibility: {
      description: "Months of the year",
    },
  },
  yAxis: {
    title: {
      text: "Temperature",
    },
    labels: {
      format: "{value}°",
    },
  },
  tooltip: {
    crosshairs: true,
    shared: true,
  },
  plotOptions: {
    spline: {
      marker: {
        radius: 4,
        lineColor: "#666666",
        lineWidth: 1,
      },
    },
  },
  series: [
    {
      name: "Tokyo",
      marker: {
        symbol: "square",
      },
      data: [
        5.2, 5.7, 8.7, 13.9, 18.2, 21.4, 25.0, 26.4, 22.8, 17.5, 12.1, 7.6,
      ],
    },
  ],
};

export const botModel = {
  "gpt-3.5-turbo": {
    name: "GPT-3.5 Turbo",
    history_turn: { default: 5, min: 0, max: 100 },
    max_tokens: { default: 256, min: 5, max: 16384 },
    temperature: { default: 0.5, min: 0.0, max: 2.0 },
    top_p: { default: 1.0, min: 0.0, max: 1.0 },
    frequency_penalty: { default: 0, min: -2.0, max: 2.0 },
    presence_penalty: { default: 0, min: -2.0, max: 2.0 },
    img: "https://sf-coze-web-cdn.coze.com/obj/coze-web-sg/MODEL_ICON/GPT-4.png",
  },
  "gpt-4-turbo": {
    name: "GPT-4 Turbo",
    history_turn: { default: 5, min: 0, max: 100 },
    max_tokens: { default: 256, min: 5, max: 4096 },
    temperature: { default: 0.5, min: 0.0, max: 2.0 },
    top_p: { default: 1.0, min: 0.0, max: 1.0 },
    frequency_penalty: { default: 0, min: -2.0, max: 2.0 },
    presence_penalty: { default: 0, min: -2.0, max: 2.0 },
    img: "https://sf-coze-web-cdn.coze.com/obj/coze-web-sg/MODEL_ICON/GPT-4.png",
  },
  "gpt-4o": {
    name: "GPT-4o",
    history_turn: { default: 5, min: 0, max: 100 },
    max_tokens: { default: 256, min: 5, max: 4096 },
    temperature: { default: 0.5, min: 0.0, max: 2.0 },
    top_p: { default: 1.0, min: 0.0, max: 1.0 },
    frequency_penalty: { default: 0, min: -2.0, max: 2.0 },
    presence_penalty: { default: 0, min: -2.0, max: 2.0 },
    img: "https://sf-coze-web-cdn.coze.com/obj/coze-web-sg/MODEL_ICON/GPT-4.png",
  },
  "gpt-4o-mini": {
    name: "GPT-4o Mini",
    history_turn: { default: 5, min: 0, max: 100 },
    max_tokens: { default: 256, min: 5, max: 8192 },
    temperature: { default: 0.5, min: 0.0, max: 2.0 },
    top_p: { default: 1.0, min: 0.0, max: 1.0 },
    frequency_penalty: { default: 0, min: -2.0, max: 2.0 },
    presence_penalty: { default: 0, min: -2.0, max: 2.0 },
    img: "https://sf-coze-web-cdn.coze.com/obj/coze-web-sg/MODEL_ICON/GPT-4.png",
  },
  "models/gemini-1.5-flash": {
    name: "Gemini 1.5 Flash",
    history_turn: { default: 5, min: 0, max: 100 },
    max_tokens: { default: 256, min: 5, max: 8192 },
    temperature: { default: 0.5, min: 0.0, max: 2.0 },
    img: "https://sf-coze-web-cdn.coze.com/obj/coze-web-sg/MODEL_ICON/gemini.png",
  },
  "models/gemini-1.5-pro": {
    name: "Gemini 1.5 Pro",
    history_turn: { default: 5, min: 0, max: 100 },
    max_tokens: { default: 256, min: 5, max: 8192 },
    temperature: { default: 0.5, min: 0.0, max: 2.0 },
    img: "https://sf-coze-web-cdn.coze.com/obj/coze-web-sg/MODEL_ICON/gemini.png",
  },
  "claude-3-5-sonnet-20240620": {
    name: "Claude 3.5 Sonnet",
    history_turn: { default: 5, min: 0, max: 100 },
    max_tokens: { default: 256, min: 5, max: 8192 },
    temperature: { default: 0.5, min: 0.0, max: 2.0 },
    img: "https://foxfio.com/wp-content/uploads/2023/09/4682316783575_bbab0cdcdb3685eb5c87_512.png",
  },
  "claude-3-opus-20240229": {
    name: "Claude 3 Opus",
    history_turn: { default: 5, min: 0, max: 100 },
    max_tokens: { default: 256, min: 5, max: 4096 },
    temperature: { default: 0.5, min: 0.0, max: 2.0 },
    img: "https://foxfio.com/wp-content/uploads/2023/09/4682316783575_bbab0cdcdb3685eb5c87_512.png",
  },
  "claude-3-sonnet-20240229": {
    name: "Claude 3 Sonnet",
    history_turn: { default: 5, min: 0, max: 100 },
    max_tokens: { default: 256, min: 5, max: 4096 },
    temperature: { default: 0.5, min: 0.0, max: 2.0 },
    img: "https://foxfio.com/wp-content/uploads/2023/09/4682316783575_bbab0cdcdb3685eb5c87_512.png",
  },
  "claude-3-haiku-20240307": {
    name: "Claude 3 Haiku",
    history_turn: { default: 5, min: 0, max: 100 },
    max_tokens: { default: 256, min: 5, max: 4096 },
    temperature: { default: 0.5, min: 0.0, max: 2.0 },
    img: "https://foxfio.com/wp-content/uploads/2023/09/4682316783575_bbab0cdcdb3685eb5c87_512.png",
  },
};

const attachedGroup: string[] = [];

export const modelOptions = Object.entries(botModel).map(([key, value]) => {
  let group = "OpenAI";
  if (key.includes("gemini")) {
    group = "Google";
  }
  if (key.includes("claude")) {
    group = "Anthropic_LLM";
  }
  const option: ModelOption = {
    ...value,
    label: value.name,
    value: key,
  };

  if (!attachedGroup.includes(group)) {
    option.group = group as Group;
    attachedGroup.push(group);
  }

  return option;
});
