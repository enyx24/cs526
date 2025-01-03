// checkBank.js

const bankData = {
  "MoMo": [
    "momo",
    "ngan hang ban viet"
  ],
  "Techcombank": [
    "tcb",
    "techcombank",
    "ngan hang ky thuong"
  ],
  "ACB": [
    "acb",
    "á châu bank",
    "ngan hang a chau",
    "a chau bank"
  ],
  "Vietcombank": [
    "vcb",
    "vietcombank",
    "ngan hang thuong mai"
  ],
  "Agribank": [
    "agribank",
    "agb",
    "ngan hang nong nghiep"
  ],
  "Sacombank": [
    "sacombank",
    "sai gon thuong tin"
  ],
  "BIDV": [
    "bidv",
    "ngan hang dau tu va phat trien"
  ],
  "MB": [
    "mb",
    "mbbank",
    "ngan hang quan doi"
  ],
  "HDBank": [
    "hdbank",
    "ngan hang hdbank"
  ],
  "Vietinbank": [
    "vietinbank",
    "ngan hang vietinbank"
  ]
};

// Hàm kiểm tra ngân hàng
const checkBank = (input) => {
  console.log(input)
  for (let bank in bankData) {
    const regexList = bankData[bank];
    for (let regex of regexList) {
      const regExp = new RegExp(regex, 'i'); // Thêm flag 'i' vào đối tượng RegExp
      if (regExp.test(input)) {
        return bank; // Trả về tên ngân hàng đầu tiên khớp
      }
    }
  }
  return null; // Không tìm thấy ngân hàng nào khớp
};

export default checkBank;
