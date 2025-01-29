import { Timestamp } from 'firebase/firestore';


const RELATIVE_TIME_FORMATTER = new Intl.RelativeTimeFormat('en-gb', {
	style: 'short',
	numeric: 'auto'
});

type Units = Readonly<Partial<Record<Intl.RelativeTimeFormatUnit, number>>>;

const UNITS: Units = {
	day: 24 * 60 * 60 * 1000,
	hour: 60 * 60 * 1000,
	minute: 60 * 1000
};

export function formatDate(targetDate: Timestamp, mode: 'tweet' | 'message' | 'full' | 'joined'): string {


    // Ensure targetDate is a Timestamp and convert it
	const date = targetDate.toDate();

    if (mode === 'full') return getFullTime(date);
    if (mode === 'tweet') return getPostTime(date);
    if (mode === 'joined') return getJoinedTime(date);

    return getShortTime(date);
}
export function formatNumber(number: number): string {
	return new Intl.NumberFormat('en-GB', {
		notation: number > 10_000 ? 'compact' : 'standard',
		maximumFractionDigits: 1
	}).format(number);
}

function getFullTime(date: Date): string {
	const fullDate = new Intl.DateTimeFormat('en-gb', {
		hour: 'numeric',
		minute: 'numeric',
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	}).format(date);

	const splittedDate = fullDate.split(', ');

	const formattedDate =
		splittedDate.length === 2
			? [...splittedDate].reverse().join(' · ')
			: [splittedDate.slice(0, 2).join(', '), splittedDate.slice(-1)].reverse().join(' · ');

	return formattedDate;
}

function getPostTime(date: Date): string {
	if (isToday(date)) return getRelativeTime(date);
	if (isYesterday(date))
		return new Intl.DateTimeFormat('en-gb', {
			day: 'numeric',
			month: 'short'
		}).format(date);

	return new Intl.DateTimeFormat('en-gb', {
		day: 'numeric',
		month: 'short',
		year: isCurrentYear(date) ? undefined : 'numeric'
	}).format(date);
}

function getJoinedTime(date: Date): string {
	return new Intl.DateTimeFormat('en-gb', {
		month: 'long',
		year: 'numeric'
	}).format(date);
}

function getShortTime(date: Date): string {
	const isNear = isToday(date) ? 'today' : isYesterday(date) ? 'yesterday' : null;

	return isNear
		? `${isNear === 'today' ? 'Today' : 'Yesterday'} at ${date.toLocaleTimeString('en-gb').slice(0, -3)}`
		: getFullTime(date);
}

function getRelativeTime(date: Date): string {
	const relativeTime = calculateRelativeTime(date);

	if (relativeTime === 'now') return relativeTime;

	const [number, unit] = relativeTime.split(' ');

	return `${number}${unit[0]}`;
}

function calculateRelativeTime(date: Date): string {
	const elapsed = +date - +new Date();

	if (elapsed > 0) return 'now';

	const unitsItems = Object.entries(UNITS) as [keyof Units, number][];

	for (const [unit, millis] of unitsItems)
		if (Math.abs(elapsed) > millis) return RELATIVE_TIME_FORMATTER.format(Math.round(elapsed / millis), unit);

	return RELATIVE_TIME_FORMATTER.format(Math.round(elapsed / 1000), 'second');
}

function isToday(date: Date): boolean {
	return new Date().toDateString() === date.toDateString();
}

function isYesterday(date: Date): boolean {
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	return yesterday.toDateString() === date.toDateString();
}

function isCurrentYear(date: Date): boolean {
	return date.getFullYear() === new Date().getFullYear();
}


export const formatDateTime = (dateTime: string | Date): string => {
    try {
        // Ensure the input is parsed as a Date object
        const date =
            typeof dateTime === "string"
                ? new Date(dateTime)
                : dateTime;

        if (isNaN(date.getTime())) {
            throw new Error("Invalid Date");
        }

        // Format the date into dd/mm/yyyy
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    } catch (error) {
        console.error("Invalid DateTime object:", error);
        return ""; // Fallback to an empty string on error
    }
}




export const timeSince = (timestamp: string | Date): string => {
    const now = new Date();
    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;

    if (isNaN(date.getTime())) {
        console.error("Invalid Date:", timestamp);
        return "Invalid date";
    }

    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) {
        return `${seconds}s`;
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours}h`;
    }

    const days = Math.floor(hours / 24);
    if (days < 7) {
        return `${days}d`;
    }

    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
        return `${weeks}w`;
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
        return `${months}m`;
    }

    const years = Math.floor(days / 365);
    return `${years}y`;
};
