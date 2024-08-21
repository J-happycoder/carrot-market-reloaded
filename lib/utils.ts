export function formatPrice(price: number) {
  return price.toLocaleString("ko-KR");
}

export function formatDate(date: Date) {
  const passedMs = new Date().getTime() - new Date(date).getTime();
  const passed = {
    seconds: Math.floor(passedMs / 1000),
    minutes: Math.floor(passedMs / (1000 * 60)),
    hours: Math.floor(passedMs / (1000 * 60 * 60)),
    days: Math.floor(passedMs / (1000 * 60 * 60 * 24)),
    years: Math.floor(passedMs / (1000 * 60 * 60 * 24 * 365)),
  };

  const relativeTimeFormatter = new Intl.RelativeTimeFormat("ko");

  const formatted = {
    seconds: relativeTimeFormatter.format(-passed.seconds, "seconds"),
    minutes: relativeTimeFormatter.format(-passed.minutes, "minutes"),
    hours: relativeTimeFormatter.format(-passed.hours, "hours"),
    days: relativeTimeFormatter.format(-passed.days, "days"),
    years: relativeTimeFormatter.format(-passed.years, "years"),
  };
  return passed.years >= 1
    ? formatted.years
    : passed.days >= 1
    ? formatted.days
    : passed.hours >= 1
    ? formatted.hours
    : passed.minutes >= 1
    ? formatted.minutes
    : passed.seconds >= 1
    ? formatted.seconds
    : undefined;
}

function generateRandomCharacter() {
  const characters =
    "qwertyuiopasdfghjklzxcvbnm1234567890QWERTYUIOPASDFGHJKLZXCVBNM";
  return characters[Math.floor(Math.random() * characters.length)];
}

export function generateRandomText(length: number) {
  let text: string = "";
  for (let i = 0; i < length; i++) {
    text += generateRandomCharacter();
  }
  return text;
}
