export default class Model {
  constructor(name, cb) {
    this._name = name;

    if (cb) {
      cb();
    }
  }

  getFromLocalStorage() {
    return JSON.parse(window.localStorage.getItem(this._name) || "[]");
  }

  setToLocalStorage(items) {
    window.localStorage.setItem(this._name, JSON.stringify(items));
  }

  add(item, cb) {
    const items = this.getFromLocalStorage();
    items.push(item);
    this.setToLocalStorage(items);

    if (cb) {
      cb();
    }
  }

  edit(id, cb) {
    const items = this.getFromLocalStorage();
    const item = items.find(item => parseInt(item.id) === parseInt(id));

    if (cb) {
      cb(item);
    }
  }

  remove(id, cb) {
    const items = this.getFromLocalStorage();
    const i = items.findIndex(item => parseInt(item.id) === parseInt(id));
    const filteredItems = items
      .slice(0, i)
      .concat(items.slice(i + 1, items.length));

    this.setToLocalStorage(filteredItems);

    if (cb) {
      cb();
    }
  }

  sort({ direction, filterType }, cb) {
    const items = this.getFromLocalStorage();

    if (filterType === "date") {
      items.sort((a, b) => {
        const prev = parseInt(a.date.split("-").join(""));
        const next = parseInt(b.date.split("-").join(""));

        if (direction === "up") {
          return prev - next;
        } else if (direction === "down") {
          return next - prev;
        }
      });
    } else if (filterType === "name") {
      items.sort((a, b) => {
        if (direction === "up") {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        } else if (direction === "down") {
          if (a.name < b.name) {
            return 1;
          }
          if (a.name > b.name) {
            return -1;
          }
          return 0;
        }
      });
    }

    this.setToLocalStorage(items);

    if (cb) {
      cb();
    }
  }

  get(cb) {
    const todoList = this.getFromLocalStorage();

    if (cb) {
      cb(todoList);
    }
  }

  count(cb) {
    this.get(data => {
      const total = data.length;
      let done = 0;
      let i = total;

      while (i--) {
        done += data[i].done;
      }

      cb(total, total - done, done === total);
    });
  }

  checkForComplete(cb) {
    const items = this.getFromLocalStorage();
    const done = items.every(item => item.done);

    if (done) cb();
  }

  completeAll(done, cb) {
    const items = this.getFromLocalStorage();

    if (done) {
      items.map(item => (item.done = true));
    } else {
      items.map(item => (item.done = false));
    }

    this.setToLocalStorage(items);

    if (cb) {
      cb();
    }
  }

  update(updatedItem, cb) {
    const items = this.getFromLocalStorage();
    let i = items.length;

    while (i--) {
      if (parseInt(items[i].id) === parseInt(updatedItem.id)) {
        for (const key in updatedItem) {
          items[i][key] = updatedItem[key];
        }
        break;
      }
    }

    this.setToLocalStorage(items);

    if (cb) {
      cb();
    }
  }
}
