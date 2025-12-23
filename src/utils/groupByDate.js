export function groupAnnouncementsByDate(announcements) {
  return announcements.reduce((groups, item) => {
    const dateObj = item.createdAt?.toDate();
    if (!dateObj) return groups;

    const dateKey = dateObj.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }

    groups[dateKey].push(item);
    return groups;
  }, {});
}
