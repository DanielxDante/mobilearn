// timeAgo used in NotificationItem.tsx to calculate time since notification

export const TimeAgo = (timestamp: string): string => {
    const now = new Date();
    const past = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000); // Years
    if (interval >= 1)
        return `${interval} year${interval === 1 ? "" : "s"} ago`;

    interval = Math.floor(seconds / 2592000); // Months
    if (interval >= 1)
        return `${interval} month${interval === 1 ? "" : "s"} ago`;

    interval = Math.floor(seconds / 86400); // Days
    if (interval >= 1) return `${interval} day${interval === 1 ? "" : "s"} ago`;

    interval = Math.floor(seconds / 3600); // Hours
    if (interval >= 1)
        return `${interval} hour${interval === 1 ? "" : "s"} ago`;

    interval = Math.floor(seconds / 60); // Minutes
    if (interval >= 1) return `${interval} min${interval === 1 ? "" : "s"} ago`;

    return "Just now";
};
