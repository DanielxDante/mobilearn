export const formatTime = (dateString: string) => {

    const date = new Date(dateString)
    const formatter = new Intl.DateTimeFormat("en-SG", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });

    return formatter.format(date);
};
