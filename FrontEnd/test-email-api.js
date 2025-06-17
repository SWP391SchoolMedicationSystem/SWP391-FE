// Test script for Email API
import axios from "axios";

async function testEmailAPI() {
  console.log("🧪 Testing Email API...");

  try {
    const response = await axios.post(
      "https://api-schoolhealth.purintech.id.vn/api/Email/sendEmail",
      {
        to: "test@example.com",
        subject: "Test Email từ Medlearn - Reset Password",
        body: "demo",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email API Success!");
    console.log("📧 Response:", response.data);
    console.log("📊 Status:", response.status);
  } catch (error) {
    console.log("❌ Email API Error:");

    if (error.response) {
      console.log("📊 Status:", error.response.status);
      console.log("📧 Response:", error.response.data);
      console.log("🔧 Headers:", error.response.headers);
    } else if (error.request) {
      console.log("📡 No response received:", error.request);
    } else {
      console.log("⚠️ Error:", error.message);
    }
  }
}

// Test với email thật
async function testWithRealEmail() {
  console.log("\n🧪 Testing with real email format...");

  try {
    const response = await axios.post(
      "https://api-schoolhealth.purintech.id.vn/api/Email/sendEmail",
      {
        to: "user@gmail.com",
        subject: "Đặt lại mật khẩu - Medlearn School Health System",
        body: "demo",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Real Email Test Success!");
    console.log("📧 Response:", response.data);
  } catch (error) {
    console.log("❌ Real Email Test Error:");

    if (error.response) {
      console.log("📊 Status:", error.response.status);
      console.log("📧 Error Data:", error.response.data);
    } else {
      console.log("⚠️ Error:", error.message);
    }
  }
}

// Run tests
async function runTests() {
  await testEmailAPI();
  await testWithRealEmail();

  console.log("\n🏁 Test completed!");
  console.log(
    "💡 Tip: Nếu API hoạt động, bạn có thể test trực tiếp trên trang Reset Password"
  );
  console.log("🌐 URL: http://localhost:5177/reset-password");
}

runTests();
