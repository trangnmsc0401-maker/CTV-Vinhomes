const form = document.getElementById("register-form");
const message = document.getElementById("form-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  message.textContent = "";
  message.className = "form-message";

  const payload = {
    fullName: form.fullName.value,
    phone: form.phone.value,
    email: form.email.value,
    city: form.city.value,
    experience: form.experience.value,
  };

  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      message.textContent = data.error || "Có lỗi xảy ra, vui lòng thử lại.";
      message.classList.add("error");
      return;
    }

    message.textContent = "Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.";
    message.classList.add("success");
    form.reset();
  } catch (err) {
    message.textContent = "Không thể kết nối máy chủ, vui lòng thử lại.";
    message.classList.add("error");
  }
});
