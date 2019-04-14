export function formatDateHuman(stringDate) {
  const date = new Date(stringDate);

  return new Intl.DateTimeFormat("en-US").format(date);
}

export function formatDateISO(stringDate) {
  const date = new Date(stringDate);
  let month = "" + (date.getMonth() + 1);
  let day = "" + date.getDate();
  let year = date.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
