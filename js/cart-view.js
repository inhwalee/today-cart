import { convertFormat, toMoveScrollDown } from "./utils.js";

export default class CartViewBuilder {
  setStorage(storage) {
    this.storage = storage;
    return this;
  }

  setContainerWithID(containerId) {
    this.container = document.getElementById(containerId);
    return this;
  }

  setTemplate(template) {
    this.template = template;
    return this;
  }

  build() {
    return new CartView(this.storage, this.container, this.template);
  }
}

class CartView {
  #storage;
  #container;
  #template;
  #htmlList;
  #dragTargetEl;
  #dropTargetEl;
  #dropTargetId;
  #formEl;

  constructor(storage, container, template) {
    this.#storage = storage;
    this.#container = container;
    this.#template = template;
    this.#htmlList = [];
    this.#dragTargetEl;
    this.#dropTargetEl;
    this.#dropTargetId;
    this.#formEl = document.querySelector(".form");
    this.#formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addItem();
    });

    this.init();
  }

  init() {
    this.setDragAndDropEvent();
    this.render();
  }

  addItem() {
    const nameInput = document.getElementById("name");
    const priceInput = document.getElementById("price");
    const isValidNameInput = nameInput.value.trim("").length > 0;
    if (!isValidNameInput) {
      alert("상품명에 한 글자 이상 입력해주세요.");
      nameInput.value = "";
      nameInput.focus();
      return;
    }

    this.#storage.setItem(nameInput.value, priceInput.value);
    this.render();
    toMoveScrollDown(".cart");

    nameInput.value = "";
    priceInput.value = 0;
    nameInput.focus();
  }

  updateHtmlList() {
    this.#htmlList = "";
    const data = this.#storage.getAllItems();

    for (let item of data) {
      this.#htmlList = [...this.#htmlList, this.setRenderTemplate(item)];
    }
  }

  setRenderTemplate(item) {
    if (!item) return;

    let renderTemplate = this.#template;

    renderTemplate = renderTemplate.replace("{{__id__}}", item.id);
    renderTemplate = renderTemplate.replace("{{__name__}}", item.name);
    renderTemplate = renderTemplate.replace(
      "{{__price__}}",
      convertFormat.price(Number(item.price))
    );

    if (item.purchased) {
      renderTemplate = renderTemplate.replace("{{__checked__}}", "checked");
      renderTemplate = renderTemplate.replace(
        "radio_button_unchecked",
        "check_circle"
      );
    } else {
      renderTemplate = renderTemplate.replace("{{__checked__}}", "");
      renderTemplate = renderTemplate.replace(
        "check_circle",
        "radio_button_unchecked"
      );
    }

    return renderTemplate;
  }

  render() {
    if (this.#storage.getNumberOfItems() <= 0) return;

    this.updateHtmlList();
    this.#container.innerHTML = this.#htmlList.join("");

    const liEls = document.querySelectorAll(".cart-item ");

    for (let liEl of liEls) {
      const checkBtn = liEl.querySelector(".button--check");
      const removeBtn = liEl.querySelector(".button--remove");

      checkBtn.addEventListener("click", (e) => {
        const targetId = e.target.parentNode.getAttribute("data-id");

        this.#storage.handlePurchased(targetId);
        this.render();
      });

      removeBtn.addEventListener("click", (e) => {
        const targetId = e.target.parentNode.getAttribute("data-id");
        this.#storage.removeItem(targetId);
        this.render();
      });
    }

    const calculatePurchased = () => {
      if (this.#storage.getNumberOfItems === 0) return;
      const purchasedCountEl = document.querySelector(".purchased__count");
      const purchasedPriceEl = document.querySelector(".purchased__price");

      const purchasedItems = this.#storage
        .getAllItems()
        .filter((item) => item.purchased === true);

      purchasedCountEl.innerText = `${
        purchasedItems.length
      }/${this.#storage.getNumberOfItems()}`;

      purchasedPriceEl.innerText = convertFormat.price(
        purchasedItems.reduce((acc, crr) => acc + Number(crr.price), 0)
      );
    };
    calculatePurchased();
  }

  setDragAndDropEvent() {
    const cartListEl = document.querySelector(".cart__list");

    const onDragStart = (e) => {
      this.#dragTargetEl = e.target.closest("li");
      if (!this.#dragTargetEl) return;

      this.#dragTargetEl.classList.add("drag-target");
      e.dataTransfer.setData("text/plain", this.#dragTargetEl.dataset.id);
    };
    const onDragEnter = (e) => {
      this.#dropTargetEl = e.target.closest("li");
      if (!this.#dropTargetEl) return;

      document
        .querySelectorAll(".cart-item")
        .forEach((cartItemEl) => cartItemEl.classList.remove("drag-hover"));

      this.#dropTargetEl.classList.add("drag-hover");
      this.#dropTargetId = this.#dropTargetEl.dataset.id;
    };
    const onDragOver = (e) => {
      e.preventDefault();
    };
    const onDragEnd = (e) => {
      this.#dragTargetEl.classList.remove("drag-target");
    };
    const onDrop = (e) => {
      const dragTargetId = e.dataTransfer.getData("text/plain");
      const copyDragTargetData = this.#storage.getItem(dragTargetId);
      const dropTargetIndex = this.#storage.getItemIndex(this.#dropTargetId);
      const dragTargetIndex = this.#storage.getItemIndex(dragTargetId);

      if (dragTargetIndex > dropTargetIndex) {
        this.#storage.changeItemOrder(copyDragTargetData, dropTargetIndex + 1);
      } else {
        this.#storage.changeItemOrder(copyDragTargetData, dropTargetIndex);
      }

      this.render();
    };

    cartListEl.addEventListener("dragstart", onDragStart, false);
    cartListEl.addEventListener("dragenter", onDragEnter, false);
    cartListEl.addEventListener("dragover", onDragOver, false);
    cartListEl.addEventListener("dragend", onDragEnd, false);
    cartListEl.addEventListener("drop", onDrop, false);
  }
}
