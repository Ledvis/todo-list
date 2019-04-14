import Template from "./template.js";
import View from "./view.js";
import Controller from "./controller.js";
import Model from "./model.js";

const template = new Template();
const view = new View(template);
const model = new Model("todo-list");
const controller = new Controller(view, model);

window.addEventListener("load", () => {
  controller.init();
});
