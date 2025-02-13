// exampleDirective.js

export default {
  mounted(el, binding) {
    el.addEventListener("click", function () {
      alert("Bạn đã click vào tôi!");
    });
  },
};
