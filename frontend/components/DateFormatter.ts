export const formatTime = (date: Date) => {
    const formatter = new Intl.DateTimeFormat("en-SG", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });

    return formatter.format(date);
};
