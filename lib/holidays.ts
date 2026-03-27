export type MilitaryHoliday = {
  name: string;
  country: string;
  description: string;
  tone: "solemn" | "celebratory" | "reflective";
};

type FixedHoliday = MilitaryHoliday & {
  month: number;
  day: number;
};

type FloatingHolidayFn = (year: number) => { month: number; day: number };

type FloatingHoliday = MilitaryHoliday & {
  getDate: FloatingHolidayFn;
};

const FIXED_HOLIDAYS: FixedHoliday[] = [
  {
    month: 1,
    day: 27,
    name: "International Holocaust Remembrance Day",
    country: "International",
    description:
      "Anniversary of the liberation of Auschwitz-Birkenau. Honors the memory of the six million Jewish victims of the Holocaust.",
    tone: "solemn",
  },
  {
    month: 5,
    day: 8,
    name: "Victory in Europe Day",
    country: "UK/Norway",
    description:
      "Marks the formal acceptance of Germany's unconditional surrender in WWII. Norway celebrates Liberation Day.",
    tone: "reflective",
  },
  {
    month: 6,
    day: 6,
    name: "D-Day Anniversary",
    country: "US/UK",
    description:
      "Anniversary of the Normandy landings in 1944 — the largest seaborne invasion in history.",
    tone: "solemn",
  },
  {
    month: 6,
    day: 8,
    name: "Norwegian Armed Forces Day",
    country: "Norway",
    description:
      "Celebrates the Norwegian Armed Forces and honors those who serve and have served.",
    tone: "celebratory",
  },
  {
    month: 6,
    day: 25,
    name: "Armed Forces Day",
    country: "UK",
    description:
      "A chance for the nation to show support for the men and women who make up the Armed Forces community.",
    tone: "celebratory",
  },
  {
    month: 7,
    day: 4,
    name: "Independence Day",
    country: "US",
    description:
      "Celebrates the adoption of the Declaration of Independence. For veterans, a day to reflect on the freedoms they swore to defend.",
    tone: "celebratory",
  },
  {
    month: 8,
    day: 7,
    name: "Purple Heart Day",
    country: "US",
    description:
      "Honors the men and women who were wounded or killed while serving. The Purple Heart is the oldest military award still given.",
    tone: "solemn",
  },
  {
    month: 10,
    day: 25,
    name: "Veterandagen",
    country: "Norway",
    description:
      "Norway's Veterans' Day, honoring all who have served in Norwegian military operations at home and abroad.",
    tone: "reflective",
  },
  {
    month: 11,
    day: 10,
    name: "Marine Corps Birthday",
    country: "US",
    description:
      "Celebrates the founding of the United States Marine Corps on November 10, 1775. Semper Fi.",
    tone: "celebratory",
  },
  {
    month: 11,
    day: 11,
    name: "Veterans Day / Remembrance Day",
    country: "US/UK",
    description:
      "Honors all who have served in the armed forces. In the UK, marked by two minutes of silence at the 11th hour.",
    tone: "solemn",
  },
  {
    month: 12,
    day: 13,
    name: "National Guard Birthday",
    country: "US",
    description:
      "Marks the founding of the National Guard in 1636 — the oldest component of the US Armed Forces.",
    tone: "celebratory",
  },
];

// Helper: get nth weekday of a month (e.g., last Monday of May)
function nthWeekday(
  year: number,
  month: number,
  weekday: number,
  n: number
): { month: number; day: number } {
  if (n === -1) {
    // Last occurrence
    const lastDay = new Date(year, month, 0).getDate();
    for (let d = lastDay; d >= 1; d--) {
      if (new Date(year, month - 1, d).getDay() === weekday) {
        return { month, day: d };
      }
    }
  }
  let count = 0;
  for (let d = 1; d <= 31; d++) {
    const date = new Date(year, month - 1, d);
    if (date.getMonth() !== month - 1) break;
    if (date.getDay() === weekday) {
      count++;
      if (count === n) return { month, day: d };
    }
  }
  return { month, day: 1 };
}

const FLOATING_HOLIDAYS: FloatingHoliday[] = [
  {
    name: "Memorial Day",
    country: "US",
    description:
      "Honors the men and women who died while serving in the U.S. military. Not to be confused with Veterans Day, which honors all who served.",
    tone: "solemn",
    getDate: (year) => nthWeekday(year, 5, 1, -1), // Last Monday in May
  },
  {
    name: "Gold Star Mother's and Family's Day",
    country: "US",
    description:
      "Honors the families of those who died in service to the United States Armed Forces.",
    tone: "solemn",
    getDate: (year) => nthWeekday(year, 9, 0, -1), // Last Sunday in September
  },
  {
    name: "Remembrance Sunday",
    country: "UK",
    description:
      "Held on the second Sunday of November, the Sunday nearest to Armistice Day. The nation pauses to remember.",
    tone: "solemn",
    getDate: (year) => nthWeekday(year, 11, 0, 2), // Second Sunday of November
  },
  {
    // Yom HaZikaron falls on 4th of Iyar in the Hebrew calendar.
    // Approximation: usually falls in April or early May.
    // We hardcode known dates for upcoming years.
    name: "Yom HaZikaron",
    country: "Israel",
    description:
      "Israel's Memorial Day for fallen soldiers and victims of terrorism. One of the most solemn days in the Israeli calendar.",
    tone: "solemn",
    getDate: (year) => {
      const dates: Record<number, { month: number; day: number }> = {
        2025: { month: 4, day: 30 },
        2026: { month: 4, day: 21 },
        2027: { month: 4, day: 11 },
        2028: { month: 5, day: 1 },
        2029: { month: 4, day: 18 },
        2030: { month: 4, day: 7 },
      };
      return dates[year] ?? { month: 4, day: 21 };
    },
  },
  {
    name: "Yom HaAtzmaut",
    country: "Israel",
    description:
      "Israel's Independence Day, celebrated the day after Yom HaZikaron. A day of pride and celebration.",
    tone: "celebratory",
    getDate: (year) => {
      const dates: Record<number, { month: number; day: number }> = {
        2025: { month: 5, day: 1 },
        2026: { month: 4, day: 22 },
        2027: { month: 4, day: 12 },
        2028: { month: 5, day: 2 },
        2029: { month: 4, day: 19 },
        2030: { month: 4, day: 8 },
      };
      return dates[year] ?? { month: 4, day: 22 };
    },
  },
];

export function getHolidayForDate(date: Date): MilitaryHoliday | null {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();

  // Check fixed holidays
  for (const holiday of FIXED_HOLIDAYS) {
    if (holiday.month === month && holiday.day === day) {
      return holiday;
    }
  }

  // Check floating holidays
  for (const holiday of FLOATING_HOLIDAYS) {
    const hDate = holiday.getDate(year);
    if (hDate.month === month && hDate.day === day) {
      return holiday;
    }
  }

  return null;
}
