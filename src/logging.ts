import { configure, getConsoleSink } from "@logtape/logtape";

await configure({
  sinks: {
    console: getConsoleSink(),
  },
  filters: {},
  loggers: [
    { category: "fedify", level: "info", sinks: ["console"] },
    { category: "logtape", level: "warning", sinks: ["console"] },
    { category: "fresh", level: "debug", sinks: ["console"] },
    { category: "outer-ring", level: "debug", sinks: ["console"] },
  ],
});
