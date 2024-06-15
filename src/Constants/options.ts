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
  label: string;
  avatar: string;
  group: string;
  value: string;
  tag: string;
}

export const modelOptions = [
  {
    label: "GPT-4",
    avatar:
      "https://sf-coze-web-cdn.coze.com/obj/coze-web-sg/MODEL_ICON/GPT-4.png",
    group: "OpenAI",
    value: "gpt-4",
    tag: "4k",
  },
  {
    label: "GPT-4o",
    avatar:
      "https://sf-coze-web-cdn.coze.com/obj/coze-web-sg/MODEL_ICON/GPT-4.png",
    value: "gpt-4o",
    tag: "128k",
  },
  {
    label: "GPT-4 Turbo",
    avatar:
      "https://sf-coze-web-cdn.coze.com/obj/coze-web-sg/MODEL_ICON/GPT-4.png",
    value: "gpt-4-turbo",
    tag: "128k",
  },
  {
    label: "Gemini 1.5 Pro",
    avatar:
      "https://sf-coze-web-cdn.coze.com/obj/coze-web-sg/MODEL_ICON/gemini.png",
    group: "Google",
    value: "gemini-1.5-pro",
    tag: "200k",
  },
  {
    label: "Gemini 1.5 Flash",
    avatar:
      "https://sf-coze-web-cdn.coze.com/obj/coze-web-sg/MODEL_ICON/gemini.png",
    value: "gemini-1.5-flash",
    tag: "200k",
  },
];

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
