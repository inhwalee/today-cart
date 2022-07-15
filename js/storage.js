let _instance;

export default class Storage {
  #uniqueId;
  #storageName;
  #data;

  constructor(storageName) {
    this.#uniqueId = 0;
    this.#storageName = storageName;
    this.#data = [];

    if (_instance) {
      throw new Error("해당 클래스의 인스턴스는 하나만 생성할 수 있습니다.");
    }
    if (JSON.parse(localStorage.getItem("uniqueId"))) {
      this.#uniqueId = JSON.parse(localStorage.getItem("uniqueId"));
    }
    if (JSON.parse(localStorage.getItem(this.#storageName))) {
      this.#data = JSON.parse(localStorage.getItem(this.#storageName));
    }

    _instance = this;
  }

  setItem(name, price) {
    const newItem = {
      id: this.#uniqueId,
      name,
      price,
      purchased: false,
    };

    this.#data = [...this.#data, newItem];
    this.#uniqueId += 1;
    this.setStorage();
  }

  getItem(id) {
    return this.getAllItems().find((item) => item.id === Number(id));
  }

  getItemIndex(id) {
    let result;
    for (let i = 0; i < this.getNumberOfItems(); i++) {
      if (this.#data[i].id === Number(id)) {
        result = i;
      }
    }
    return result;
  }

  getAllItems() {
    return this.#data;
  }

  getNumberOfItems() {
    if (this.getAllItems() === null) return 0;
    return this.getAllItems().length;
  }

  getMostRecentItem() {
    return this.getAllItems[this.getNumberOfItems() - 1];
  }

  removeItem(id) {
    const clickedItem = this.getItem(id);
    if (clickedItem) {
      this.#data = this.getAllItems().filter((item) => item.id !== Number(id));
      this.setStorage();
    }
  }

  changeItemOrder(itemData, order = this.getNumberOfItems()) {
    this.removeItem(itemData.id);
    this.#data.splice(order, 0, itemData);
    this.setStorage();
  }

  handlePurchased(id) {
    const clickedItem = this.getItem(id);
    if (clickedItem) {
      clickedItem.purchased = !clickedItem.purchased;
      this.setStorage();
    }
  }

  setStorage() {
    localStorage.setItem(this.#storageName, JSON.stringify(this.#data));
    localStorage.setItem("uniqueId", JSON.stringify(this.#uniqueId));
  }
}
