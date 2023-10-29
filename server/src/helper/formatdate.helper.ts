export const formatDayMonthYear = (isoDate: string): string => {
  const date = new Date(isoDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day < 10 ? '0' : ''}${day} ${month < 10 ? '0' : ''}${month} ${year}`;
};

export const formatMonthYear = (isoDate: string): string => {
  const date = new Date(isoDate);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${month < 10 ? '0' : ''}${month} ${year}`;
};

export const formatDateTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}Th${month} lúc ${hours}:${minutes} `;
};
