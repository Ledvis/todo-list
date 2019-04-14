import { formatDateISO } from "./helpers.js";

export default class View {
  constructor(template) {
    this.template = template;
    this.todoWrapper = document.querySelector(".todo");
    this.todoContainer = this.todoWrapper.querySelector(".todo__container");
    this.todoPanel = this.todoWrapper.querySelector(".todo__panel");
    this.todoList = this.todoWrapper.querySelector(".todo__list");
    this.todoItem = this.todoWrapper.querySelector(".todo__item");
    this.todoItemsLeft = this.todoWrapper.querySelector(".todo__counter");
    this.todoForm = this.todoWrapper.querySelector(".form");
    this.todoFormBtn = this.todoWrapper.querySelector(".form__btn");
    this.authorName = this.todoWrapper.querySelector("#name");
    this.todoTitle = this.todoWrapper.querySelector("#title");
    this.todoDate = this.todoWrapper.querySelector("#date");
    this.viewSwitcher = this.todoWrapper.querySelector(".switch__input");
    this.switchLabel = this.todoWrapper.querySelector(".todo__check");
    this.editBtn = this.todoWrapper.querySelector(".todo__edit");
    this.removeBtn = this.todoWrapper.querySelector(".todo__remove");
    this.sortByDateBtn = this.todoWrapper.querySelector(".todo__sort-date");
    this.sortBtns = this.todoWrapper.querySelectorAll(".todo__sort");

    this.setMinAllowedDate();
  }

  handleItem(handler) {
    this.todoForm.addEventListener("submit", evt => {
      evt.preventDefault();

      const formData = new FormData(this.todoForm);
      const item = {};

      for (const [key, value] of formData.entries()) {
        item[key] = value;
      }

      const editedItem = document.querySelector(".todo__item--edited");

      if (editedItem) {
        item.id = editedItem.dataset.id;
      }

      handler(item);
    });
  }

  switchTogglerHandler(handler) {
    this.viewSwitcher.addEventListener("change", ({ target }) => {
      handler(target.checked);
    });
  }

  selectStatusHandler(handler) {
    this.todoList.addEventListener("click", ({ target }) => {
      if (target.classList.contains("select")) {
        if (window.matchMedia("(min-width: 768px)").matches) {
          handler(target.parentNode.parentNode.dataset.id, target.value);
        } else {
          target.addEventListener("change", () => {
            handler(target.parentNode.parentNode.dataset.id, target.value);
          });
        }
      }
    });
  }

  toggleItem(handler) {
    this.todoList.addEventListener("click", ({ target }) => {
      if (target.id) {
        handler(target.id, target.checked);
      }
    });
  }

  editIconHandler(handler) {
    this.todoList.addEventListener("click", ({ target }) => {
      if (target.classList.contains("todo__edit")) {
        handler(target.parentNode.parentNode.dataset.id);
      }
    });
  }

  editItem(item) {
    const todoItem = document.querySelector(`[data-id="${item.id}"]`);
    todoItem.classList.add("todo__item--edited");
    this.authorName.value = item.name;
    this.todoTitle.value = item.title;
    this.todoDate.value = item.date;
  }

  checkItem(id) {
    const checkedTodo = document.querySelector(`[data-id="${id}"]`);
    checkedTodo
      .querySelector(".todo__edit")
      .classList.add("todo__edit--disabled");
  }

  enableEditMode() {
    document.querySelectorAll(".todo__item").forEach(item => {
      if (!item.classList.contains("todo__item--edited")) {
        item.classList.add("disabled");
        item.querySelector(".select").setAttribute("disabled", true);
      } else if (item.classList.contains("todo__item--edited")) {
        item.querySelector("label").classList.add("disabled");
        item.querySelector(".select").setAttribute("disabled", true);
      }
    });

    document.querySelector(".switch").classList.add("switch--disabled");
    this.todoPanel.classList.add("todo__panel--disabled");
  }

  disableEditMode() {
    document.querySelectorAll(".todo__item").forEach(item => {
      item.classList.remove("disabled");
      item.classList.remove("todo__item--edited");
      item.querySelector("label").classList.remove("disabled");
      item.querySelector(".select").removeAttribute("disabled");
    });

    document.querySelector(".switch").classList.remove("switch--disabled");
    this.todoPanel.classList.remove("todo__panel--disabled");
  }

  removeItem(id) {
    const item = this.todoWrapper.querySelector(`[data-id="${id}"]`);
    item.remove();
  }

  setBtnText(text) {
    this.todoFormBtn.innerHTML = text;
  }

  setSwitcherText(text) {
    this.switchLabel.innerHTML = text;
  }

  removeBtnHandler(handler) {
    this.todoList.addEventListener("click", ({ target }) => {
      if (target.classList.contains("todo__remove")) {
        handler(target.parentNode.parentNode.dataset.id);
      }
    });
  }

  editBtnHandler(handler) {
    this.todoList.addEventListener("click", ({ target }) => {
      if (target.classList.contains("todo__edit")) {
        handler(target.parentNode.parentNode.dataset.id);
      }
    });
  }

  sortItemsByDate(handler) {
    this.sortBtns.forEach(btn => {
      btn.addEventListener("click", ({ target }) => {
        handler({
          direction: target.dataset.direction,
          filterType: target.dataset.filter
        });
        target.dataset.direction =
          target.dataset.direction === "up" ? "down" : "up";
      });
    });
  }

  renderTodoItems(items) {
    this.todoList.innerHTML = this.template.generateItemList(items);
  }

  renderItemsLeft(count) {
    this.todoItemsLeft.innerHTML = this.template.itemCounter(count);
  }

  setElsVisibility(visible) {
    this.todoContainer.style.display = !!visible ? "flex" : "none";
    this.todoPanel.style.display = !!visible ? "flex" : "none";
  }

  clearFields() {
    this.todoTitle.value = "";
    this.authorName.value = "";
    this.todoDate.value = "";
  }

  setMinAllowedDate() {
    this.todoDate.setAttribute("min", formatDateISO(Date.now()));
  }
}
