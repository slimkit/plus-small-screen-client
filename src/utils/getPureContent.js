export default function (str) {
  let content = str.replace(/@!\[.*?]\((\d+)\)/g, "[图片]");
  return content;
};
