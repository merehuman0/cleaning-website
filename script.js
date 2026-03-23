document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quote-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const company = document.getElementById("company").value.trim(); // honeypot

    // Hide any previous messages
    document.getElementById("form-success").style.display = "none";
    document.getElementById("form-error").style.display = "none";

    try {
      const response = await fetch("https://cleaning-website-phi-pied.vercel.app/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, message, company })
      });

      const data = await response.json();

      if (data.success) {
        // Show success message
        document.getElementById("form-success").style.display = "block";
        document.getElementById("form-error").style.display = "none";

        // Reset form
        form.reset();

        // Auto-hide success message
        setTimeout(() => {
          document.getElementById("form-success").style.display = "none";
        }, 5000);
      } else {
        // Show error message
        document.getElementById("form-error").style.display = "block";
        document.getElementById("form-success").style.display = "none";

        setTimeout(() => {
          document.getElementById("form-error").style.display = "none";
        }, 5000);
      }
    } catch (error) {
      // Network or unexpected error
      document.getElementById("form-error").style.display = "block";
      document.getElementById("form-success").style.display = "none";

      setTimeout(() => {
        document.getElementById("form-error").style.display = "none";
      }, 5000);

      console.error("Network error:", error);
    }
  });
});