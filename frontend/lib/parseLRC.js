export function parseLRC(lrc) {
  const lines = lrc.split("\n");
  const result = [];

  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})]/;

  for (let line of lines) {
    const match = timeRegex.exec(line);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const millis = parseInt(match[3].padEnd(3, "0"), 10);

      const time = minutes * 60 + seconds + millis / 1000;
      const text = line.replace(timeRegex, "").trim();
      result.push({ time, text });
    }
  }

  return result.sort((a, b) => a.time - b.time);
}
