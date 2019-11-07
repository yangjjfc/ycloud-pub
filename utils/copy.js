const fs = require("fs");
const stat = fs.stat;

const getType = dst => {
  if (fs.existsSync(dst)) {
    if (fs.statSync(dst).isFile()) {
      return "file";
    } else if (fs.statSync(dst).isDirectory()) {
      return "dir";
    } else {
      return "unkonw";
    }
  }
  return false;
};

const copyDir = (src, dist) => {
    dist.split("/").reduce((str, item, index) => {
        str = str ?  str + "/" + item:item;
        if (!fs.existsSync(str)) {
          fs.mkdirSync(str);
        }
        return str;
      }, "");
  // 读取目录中的所有文件/目录
  fs.readdir(src, (err, paths) => {
    if (err) {
      throw err;
    }
    paths.forEach(function(path) {
      var _src = src + "/" + path,
        _dst = dist + "/" + path,
        readable,
        writable;
      stat(_src, function(err, st) {
        if (err) {
          throw err;
        }
        // 判断是否为文件
        if (st.isFile()) {
          // 创建读取流
          readable = fs.createReadStream(_src);
          // 创建写入流
          writable = fs.createWriteStream(_dst);
          // 通过管道来传输流
          readable.pipe(writable);
        }
        // 如果是目录则递归调用自身
        else if (st.isDirectory()) {
          copyDir(_src, _dst);
        }
      });
    });
  });
};

conyFile = (src, dist) => {
  dist.split("/").slice(0, -1).reduce((str, item, index) => {
      str = str ?  str + "/" + item:item;
      if (!fs.existsSync(str)) {
        fs.mkdirSync(str);
      }
      return str;
    }, "");
  readable = fs.createReadStream(src);
  // 创建写入流
  writable = fs.createWriteStream(dist);
  // 通过管道来传输流
  readable.pipe(writable);
};

const copy = (src, dist) => {
  src=src.replace(/\\/g,'/')
  dist=dist.replace(/\\/g,'/')
  let type = getType(src);
  switch (type) {
    case "file":
      conyFile(src, dist);
      break;
    case "dir":
      copyDir(src, dist);
      break;
    default:
      throw src + "文件不存在或无法识别改文件";
      break;
  }
};

module.exports = copy;