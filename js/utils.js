export const convertFormat = {
  date(date) {
    return date.toLocaleDateString("ko");
  },
  day(day) {
    switch (day) {
      case 0:
        return "SUN";
      case 1:
        return "MON";
      case 2:
        return "TUE";
      case 3:
        return "WED";
      case 4:
        return "THU";
      case 5:
        return "FRI";
      case 6:
        return "SAT";
      default:
        throw new Error("0~6 사이의 숫자 중 하나를 입력해주세요.");
    }
  },
  price(price) {
    return price.toLocaleString("ko");
  },
  getFormatedDate(oneDay) {
    const date = this.date(oneDay);
    const day = this.day(oneDay.getDay());
    return `${date} ${day}`;
  },
};

export function toMoveScrollDown(containerSelector) {
  const container = document.querySelector(containerSelector);
  container.scrollTop = container.scrollHeight;
}
