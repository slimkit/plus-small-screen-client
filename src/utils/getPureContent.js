export default function (str) {
  if(!str) return '';
  let content = str.replace(/@!\[.*?]\((\d+)\)/g, "[图片]");
  return content;
};
