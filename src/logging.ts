import { configure, getConsoleSink } from "@logtape/logtape";

await configure({
  sinks: {
    console: getConsoleSink(),
  },
  filters: {},
  loggers: [
    { category: "test", level: "debug", sinks: ["console"] },
    { category: "fedify", level: "info", sinks: ["console"] },
    { category: "logtape", level: "warning", sinks: ["console"] },
    { category: "fresh", level: "debug", sinks: ["console"] },
  ],
});
