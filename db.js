const homedir = require("os").homedir();
const home = process.env.HOME || homedir;
const fs = require("fs");
const path = require("path");
const dbPath = path.join(home, ".TodoList");
const db = {
  read(path = dbPath) {
    return new Promise((resolve, reject) => {
      fs.readFile(dbPath, { flag: "a+" }, (error, data) => {
        if (error) {
          return reject(error);
        }
        let list;
        try {
          list = JSON.parse(data.toString());
        } catch (error_2) {
          list = [];
        }
        resolve(list);
      });
    });
  },
  write(list, path = dbPath) {
    return new Promise((resolve, reject) => {
      const string = JSON.stringify(list);
      fs.writeFile(dbPath, string + "\n", (error) => {
        if (error) {
          return reject(error);
        }
        resolve();
      });
    });
  },
};
module.exports = db;
