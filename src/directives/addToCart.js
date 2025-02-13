export default {
  mounted (el, binding) {
    el.addEventListener('click', function () {
      const value = binding.value;
      
      const store = value.$store;
      const item = { ...value.item }; // Tạo bản sao để tránh thay đổi trực tiếp

      let totalPrice = item.price;
      
      console.log("Thêm sản phẩm vào giỏ hàng:", item);

      // Xử lý loại sản phẩm (choosedType)
      if (!item.choosedType) {
        item.choosedType = item.types.length ? item.types[0] : null;
      }
      if (item.choosedType) {
        totalPrice += item.choosedType.price;
      }

      // Xử lý tùy chọn bổ sung (choosedOptions)
      if (!Array.isArray(item.choosedOptions)) {
        item.choosedOptions = [];
      }
      item.choosedOptions.forEach(option => {
        totalPrice += option.price;
      });

      // Kiểm tra nếu tổng giá <= 0
      if (totalPrice <= 0) {
        store.dispatch('addNotification', "Bạn không thể thêm sản phẩm có giá 0 vào giỏ hàng.");
        return;
      }

      // Cập nhật giá và thêm vào giỏ hàng
      item.totalPrice = totalPrice;
      store.dispatch('addToCart', item);
      store.dispatch('addNotification', "Bạn đã thêm sản phẩm vào giỏ hàng.");
    });
  }
};
