<template>
  <section class="newsletter p-5 text-center text-white">
    <div class="my-5">
      <div class="col-md-12 mb-3">
        <h1>KHÔNG BỎ LỠ BẤT KỲ CẬP NHẬT NÀO</h1>
        <p>Đăng ký ngay để nhận thông tin mới nhất về xu hướng thời trang, ưu đãi độc quyền và nhiều hơn nữa.</p>
      </div>
      <div class="col-md-6 offset-md-3">
        <form action="">
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Nhập địa chỉ email">
            <button class="btn btn-primary">ĐĂNG KÝ</button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
</script>

<style scoped>
.newsletter {
  padding: 50px 0;
  background-image: url('/images/banner2.jpg');
  background-size: cover;
  background-position: center;
  box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.6);
}

.newsletter h1 {
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 20px;
}

.newsletter p {
  font-size: 18px;
  font-weight: 300;
  line-height: 1.5;
  margin-bottom: 30px;
}

.newsletter form input[type="text"] {
  font-size: 15px;
  padding: 10px;
  border-radius: 0;
  border: none;
  border-bottom: 1px solid #ccc;
}

.newsletter form button {
  font-size: 18px;
  font-weight: bold;
  padding: 20px;
  border-radius: 0;
  border: none;
  background-color: #b9722f;
  color: #fff;
  transition: all 0.3s ease;
}

.newsletter form button:hover {
  background-color: #855717;
}

.newsletter label {
  font-weight: 300;
  font-size: 18px;
  margin-bottom: 10px;
  display: block;
}
</style>
