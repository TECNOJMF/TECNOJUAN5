console.log("sitio.js cargado");

let lastScroll = 0;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  let currentScroll = window.pageYOffset;

  if (currentScroll > lastScroll) {
    header.style.top = "-100px";
  } else {
    header.style.top = "0";
  }

  lastScroll = currentScroll;
});

document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // CHATBOT
  // ==============================

  const chatbotBtn = document.getElementById("chatbot-btn");
  const chatbot = document.getElementById("chatbot");
  const closeChat = document.getElementById("close-chat");
  const chatBody = document.getElementById("chat-body");
  const chatInput = document.getElementById("chat-input");

  chatbot.style.display = "none";

  chatbotBtn.addEventListener("click", () => {
    chatbot.style.display = "block";
    chatInput.focus();
  });

  closeChat.addEventListener("click", () => {
    chatbot.style.display = "none";
  });

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  window.sendMessage = function () {
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage(message, "user");
    chatInput.value = "";

    setTimeout(() => {
      addMessage(generateResponse(message), "bot");
    }, 500);
  };

  function addMessage(text, sender) {
    const div = document.createElement("div");
    div.classList.add("message", sender === "user" ? "user-message" : "bot-message");
    div.textContent = text;

    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function generateResponse(input) {
    const text = input.toLowerCase();

    if (text.includes("hola")) return "👋 ¡Hola! Bienvenido a TecnoJuan.web.";
    if (text.includes("curso")) return "📚 Ve a la sección Tutorial.";
    if (text.includes("html")) return "💻 HTML es la base de la web.";
    if (text.includes("video")) return "🎥 Mira la sección de videos.";
    if (text.includes("contacto")) return "📧 tecnobarca2015@gmail.com";

    return "🤖 No entendí tu pregunta.";
  }

  // ==============================
  // 💬 COMENTARIOS FIREBASE
  // ==============================

  const form = document.getElementById("commentForm");
  const commentsList = document.getElementById("commentsList");

  if (!form || !commentsList) return;

  const COLLECTION = "comments"; // 🔥 UNIFICADO

  // GUARDAR COMENTARIO
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const comment = document.getElementById("commentText").value;

    try {
      await window.addDoc(window.collection(window.db, COLLECTION), {
        username,
        comment,
        createdAt: new Date()
      });

      form.reset();
      loadComments();

    } catch (error) {
      console.error("Error al guardar comentario:", error);
    }
  });

  // CARGAR COMENTARIOS
  async function loadComments() {
    try {
      const snapshot = await window.getDocs(
        window.collection(window.db, COLLECTION)
      );

      commentsList.innerHTML = "";

      snapshot.forEach((doc) => {
        const data = doc.data();

        const div = document.createElement("div");
        div.classList.add("comment");

        div.innerHTML = `
          <strong>${data.username}</strong>
          <p>${data.comment}</p>
        `;

        commentsList.appendChild(div);
      });

    } catch (error) {
      console.error("Error cargando comentarios:", error);
    }
  }

  loadComments();
});