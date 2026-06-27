// =========================
// Año footer
// =========================
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// =========================
// FORMULARIO -> API (SQLite)
// =========================
const form = document.getElementById("contactForm");
const msg = document.getElementById("formMsg");

if (form && msg) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.elements["name"]?.value.trim();
    const email = form.elements["email"]?.value.trim();
    const message = form.elements["message"]?.value.trim();

    if (!name || !email || !message) {
      msg.textContent = "Por favor, completa todos los campos.";
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      msg.textContent = "Introduce un email válido.";
      return;
    }

    msg.textContent = "Enviando...";

    try {
      const res = await fetch("http://localhost:3000/api/contactos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        msg.textContent = data.msg || "Error enviando. Inténtalo de nuevo.";
        return;
      }

      msg.textContent = "¡Gracias! Tu mensaje se ha guardado ✅";
      form.reset();
    } catch (err) {
      msg.textContent = "No se puede conectar con el servidor (¿está en localhost:3000?).";
      console.error(err);
    }
  });
}

// =========================
// MODAL RECETAS
// =========================
const recipes = {
  ostra: {
    title: "Ostra + caviar cítrico",
    body:
      "Abrir la ostra en frío. Añadir una cucharadita de caviar cítrico justo antes de servir. Termina con ralladura de lima (opcional).",
    img: "assets/img/ostra1.jpg",
  },
  tartar: {
    title: "Tartar de salmón",
    body:
      "Salmón fresco cortado a cuchillo, aceite suave, sal, pimienta y perlas cítricas al final para mantener el estallido.",
    img: "assets/img/salmon.jpg",
  },
  gintonic: {
    title: "Gin tonic cítrico",
    body:
      "Gin premium + tónica neutra. Añade perlas cítricas al final (como garnish) para un toque sorprendente.",
    img: "assets/img/bebida.jpg",
  },
};

const modal = document.getElementById("recipeModal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalImg = document.getElementById("modalImg");
const closeBtn = document.querySelector(".modal-close");

function openModal(key) {
  const r = recipes[key];
  if (!r || !modal) return;

  modalTitle.textContent = r.title;
  modalBody.textContent = r.body;

  if (r.img) {
    modalImg.src = r.img;
    modalImg.style.display = "block";
  } else {
    modalImg.style.display = "none";
  }

  modal.classList.add("is-open");
}

function closeModal() {
  modal?.classList.remove("is-open");
}

// IMPORTANTE: tus cards deben tener data-recipe="ostra|tartar|gintonic"
document.querySelectorAll(".recipe-card").forEach((card) => {
  card.addEventListener("click", () => {
    const key = card.dataset.recipe;
    openModal(key);
  });
});

closeBtn?.addEventListener("click", closeModal);

modal?.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
