document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quote-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const company = document.getElementById("company").value.trim();

    try {
      const response = await fetch("https://cleaning-website-phi-pied.vercel.app/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, message, company })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Your message was sent successfully!");
        form.reset();
      } else {
        alert("There was an error sending your message. Please try again.");
        console.error("Server error:", data);
      }
    } catch (error) {
      alert("Network error. Please try again.");
      console.error("Network error:", error);
    }
  });
});