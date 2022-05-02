const inquirer = require("inquirer");
const db = require("./db.js");
module.exports.add = async (title) => {
  // 读取任务
  const list = await db.read();
  // 添加任务
  list.push({ title, done: false });
  // 存储任务
  await db.write(list);
};
module.exports.clear = async () => {
  await db.write([]);
};
function askForCreate(list) {
  inquirer
    .prompt({
      type: "input",
      name: "title",
      message: "创建什么任务？？",
    })
    .then((createAnswer) => {
      list.push({
        title: createAnswer.title,
        done: false,
      });
      db.write(list);
    });
}

function markDone(list, index) {
  list[index].done = true;
  db.write(list);
}
function markUndone(list, index) {
  list[index].done = false;
  db.write(list);
}
function remove(list, index) {
  list.splice(index, 1);
  db.write(list);
}
function update(list, index) {
  inquirer
    .prompt({
      type: "input",
      name: "title",
      message: "新的标题",
      default: list[index].title,
    })
    .then((inputAnswer) => {
      list[index].title = inputAnswer.title;
      db.write(list);
    });
}
function askAction(list, index) {
  const actions = { markDone, markUndone, remove, update };
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "选择操作",
      choices: [
        { name: ">exit", value: "exit" },
        { name: "已完成", value: "markDone" },
        { name: "未完成", value: "markUndone" },
        { name: "删除", value: "remove" },
        { name: "修改", value: "update" },
      ],
    })
    .then((innerAnswers) => {
      const action = actions[innerAnswers.action];
      action && action(list, index);
    });
}
function printTask(list) {
  inquirer
    .prompt({
      type: "list",
      name: "index",
      message: "请选择你要操作的任务？",
      choices: [
        { name: ">exit", value: "-1" },
        ...list.map((task, index) => {
          return {
            name: `>${task.done ? "[x]" : "[_]"} ${index + 1}--${task.title}`,
            value: index.toString(),
          };
        }),
        { name: "+ create", value: "-2" },
      ],
    })
    .then((answers) => {
      const index = parseInt(answers.index);
      if (index >= 0) {
        // 选中任务
        askAction(list, index);
      } else if (index === -2) {
        // 创建任务
        askForCreate(list);
      }
    });
}
module.exports.showAll = async (title) => {
  const list = await db.read();

  printTask(list);
};
