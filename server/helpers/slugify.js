export const slugify = (str, id = "") => {
  // Chuyển đổi tất cả sang chữ thường
  str = str.toLowerCase();

  // Loại bỏ dấu
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ế|ề|ệ|ễ|ể/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ơ|ớ|ờ|ợ|ở|ỡ|ô|ố|ồ|ộ|ổ|ỗ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ứ|ừ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");

  // Loại bỏ khoảng trắng và ký tự đặc biệt
  str = str.replace(/ /g, "-");
  str = str.replace(/[^a-z0-9-]/g, "");

  // Thêm id vào cuối slug
  str = str + "-" + id;

  return str;
}