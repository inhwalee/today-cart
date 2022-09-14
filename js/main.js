import { convertFormat } from "./utils.js";
import Storage from "./storage.js";
import CartViewBuilder from "./cart-view.js";

const storage = new Storage("items");
const template = `
  <li class="cart-item {{__checked__}}" data-id='{{__id__}}' draggable="true">
    <button class="button--check material-symbols-outlined">radio_button_unchecked</button>
    <b><span class='name'>{{__name__}}</span><span class="price">{{__price__}}</span></b>
    <button class="button--remove material-symbols-outlined">delete</button>
  </li>
`;

new CartViewBuilder()
  .setStorage(storage)
  .setContainerWithID("cart-list")
  .setTemplate(template)
  .build();

setHeaderView();
function setHeaderView() {
  document.querySelector(".date").innerText = convertFormat.getFormatedDate(
    new Date()
  );

  document
    .querySelector(".button--capture")
    .addEventListener("click", onCaptureCartList);
  function onCaptureCartList() {
    document
      .querySelectorAll(".button--remove")
      .forEach((el) => (el.style.display = "none"));

    const target = document.querySelector(".app");
    const options = {
      scale: 2,
      width: 480,
      windowWidth: 480,
      height:
        document.querySelector("header").offsetHeight +
        document.querySelector(".cart").scrollHeight +
        document.querySelector(".cart__purchased").offsetHeight,
      windowHeight:
        document.querySelector("header").offsetHeight +
        document.querySelector(".cart").scrollHeight +
        document.querySelector(".cart__purchased").offsetHeight,
    };

    html2canvas(target, options)
      .then((canvas) => {
        const currentDate = `${new Date().getFullYear()}${
          new Date().getMonth() + 1
        }${new Date().getDate()}`;

        const imgData = canvas.toDataURL();
        const imgName = currentDate + "_cartlist";
        captureAndSaveImage(imgData, imgName);

        function captureAndSaveImage(uri, name) {
          const link = document.createElement("a");
          link.href = uri;
          document.body.appendChild(link);
          link.download = `${name}.png`;
          link.click();
          window.alert("캡쳐 완료 📸✔");
        }
      })
      .then(
        document
          .querySelectorAll(".button--remove")
          .forEach((el) => (el.style.display = "block"))
      );
  }
}
