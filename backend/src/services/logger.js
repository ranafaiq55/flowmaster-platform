function format(level, message, meta) {
  const time = new Date().toISOString();
  const payload = meta ? ` ${JSON.stringify(meta)}` : "";
  return `${time} ${level} ${message}${payload}`;
}

const logger = {
  info(message, meta) {
    console.log(format("INFO", message, meta));
  },
  warn(message, meta) {
    console.warn(format("WARN", message, meta));
  },
  error(message, meta) {
    console.error(format("ERROR", message, meta));
  },
  debug(message, meta) {
    if (process.env.NODE_ENV !== "production") {
      console.log(format("DEBUG", message, meta));
    }
  }
};

module.exports = logger;
