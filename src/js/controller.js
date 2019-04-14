export default class Controller {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this._editMode = false;

    view.switchTogglerHandler(this.hideDoneItems.bind(this));
    view.toggleItem(this.toggleItem.bind(this));
    view.removeBtnHandler(this.removeItem.bind(this));
    view.editIconHandler(this.editItem.bind(this));
    view.sortItemsByDate(this.sortItemsByDate.bind(this));
    view.handleItem(this.handleItem.bind(this));
    view.selectStatusHandler(this.handleStatus.bind(this));
  }

  init() {
    this.filter();
  }

  handleItem(item) {
    if (this._editMode) {
      const updatedItem = { ...item, done: false, updated: true };

      this.model.update(updatedItem, () => {
        this.view.clearFields();
        this.view.disableEditMode();
        this.view.clearFields();
        this.view.setBtnText("Add item");
        this.filter();
      });

      this._editMode = !this._editMode;
    } else {
      const newItem = {
        ...item,
        id: Date.now(),
        done: false,
        status: "pending"
      };

      this.model.add(newItem, () => {
        this.view.clearFields();
        this.filter();
      });
    }
  }

  editItem(id) {
    this._editMode = !this._editMode;

    if (this._editMode) {
      this.model.edit(id, item => {
        this.view.editItem(item);
        this.view.setBtnText("Edit item");
        this.view.enableEditMode();
      });
    } else {
      this.view.disableEditMode();
      this.view.clearFields();
      this.view.setBtnText("Add item");
    }
  }

  removeItem(id) {
    this.model.remove(id, () => {
      this.view.removeItem(id);
      this.view.clearFields();
      this.filter();
    });
  }

  sortItemsByDate(options) {
    this.model.sort(options, () => {
      this.filter();
    });
  }

  handleStatus(id, status) {
    this.model.update({ id, status }, () => {
      this.filter();
    });
  }

  hideDoneItems(done) {
    this.model.completeAll(done, () => {
      this.filter();
    });
    if (done) {
      this.view.setSwitcherText("Uncheck all");
    } else {
      this.view.setSwitcherText("Check all");
    }
  }

  uncheck() {
    this.view.uncheckSwitcher();
    this.view.setSwitcherText("Check all");
  }

  check() {
    this.view.checkSwitcher();
    this.view.setSwitcherText("Uncheck all");
  }

  toggleItem(id, done) {
    this.model.update({ id, done }, () => {
      this.view.clearFields();
      this.filter();

      if (done) {
        this.check();
        this.view.checkItem(id);
      }
    });
  }

  filter() {
    this.model.get(this.view.renderTodoItems.bind(this.view));

    this.model.count((total, active, done) => {
      this.view.renderItemsLeft(active);
      this.view.setElsVisibility(total);

      if (done !== 0 && total === done) {
        this.check();
      } else {
        this.uncheck();
      }
    });
  }
}
