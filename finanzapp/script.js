// ======================
// DATOS
// ======================
let data = JSON.parse(localStorage.getItem("finanzapp_data")) || {
  sueldo: 0,
  diaSueldo: 1,
  recurrentes: [],
  gastos: [],
  ingresos: []
};

// ======================
// INICIALIZAR
// ======================
document.addEventListener("DOMContentLoaded", () => {
  actualizarBalance();
  renderMovimientos();
});

// ======================
// BALANCE
// ======================
function actualizarBalance() {
  const totalRecurrentes = data.recurrentes.reduce((s, i) => s + Number(i.monto), 0);
  const totalGastos = data.gastos.reduce((s, i) => s + Number(i.monto), 0);
  const totalIngresos = data.ingresos.reduce((s, i) => s + Number(i.monto), 0);

  const disponible = (Number(data.sueldo) + totalIngresos) - (totalRecurrentes + totalGastos);

  document.getElementById("balance").textContent =
    "$" + disponible.toLocaleString("es-MX", { minimumFractionDigits: 2 });
}

// ======================
// GUARDAR
// ======================
function save() {
  localStorage.setItem("finanzapp_data", JSON.stringify(data));
  actualizarBalance();
  renderMovimientos();
  closeModal();
}

// ======================
// MODAL
// ======================
function openModal(tipo) {
  const modal = document.getElementById("modal");
  const title = document.getElementById("modalTitle");
  const body = document.getElementById("modalBody");

  modal.classList.add("active");

  if (tipo === "sueldo") {
    title.textContent = "Agregar / Editar Sueldo";
    body.innerHTML = `
      <div class="form-group">
        <label>Monto del sueldo</label>
        <input type="number" id="inputMonto" placeholder="Ej: 15000" value="${data.sueldo || ""}">
      </div>
      <div class="form-group">
        <label>Día del mes que cobras (1-31)</label>
        <input type="number" id="inputDia" min="1" max="31" placeholder="Ej: 15" value="${data.diaSueldo || ""}">
      </div>
      <button class="btn-save" onclick="guardarSueldo()">Guardar sueldo</button>
    `;
  }

  if (tipo === "recurrentes") {
    title.textContent = "Gasto Recurrente (semanal)";
    body.innerHTML = `
      <div class="form-group">
        <label>Descripción</label>
        <input type="text" id="inputDesc" placeholder="Ej: Transporte, Netflix...">
      </div>
      <div class="form-group">
        <label>Monto semanal</label>
        <input type="number" id="inputMonto" placeholder="Ej: 450">
      </div>
      <button class="btn-save" onclick="guardarRecurrente()">Guardar</button>
    `;
  }

  if (tipo === "gastos") {
    title.textContent = "Gasto Extra";
    body.innerHTML = `
      <div class="form-group">
        <label>Descripción</label>
        <input type="text" id="inputDesc" placeholder="Ej: Cena, Regalo...">
      </div>
      <div class="form-group">
        <label>Monto</label>
        <input type="number" id="inputMonto" placeholder="Ej: 320">
      </div>
      <button class="btn-save" onclick="guardarGasto()">Guardar gasto</button>
    `;
  }

  if (tipo === "ingresos") {
    title.textContent = "Ingreso Extra";
    body.innerHTML = `
      <div class="form-group">
        <label>Descripción</label>
        <input type="text" id="inputDesc" placeholder="Ej: Freelance, Regalo...">
      </div>
      <div class="form-group">
        <label>Monto</label>
        <input type="number" id="inputMonto" placeholder="Ej: 800">
      </div>
      <button class="btn-save" onclick="guardarIngreso()">Guardar ingreso</button>
    `;
  }
}

function closeModal() {
  document.getElementById("modal").classList.remove("active");
}

// ======================
// GUARDAR DATOS
// ======================
function guardarSueldo() {
  const monto = document.getElementById("inputMonto").value;
  const dia = document.getElementById("inputDia").value;

  if (!monto) return alert("Escribe el monto del sueldo");

  data.sueldo = Number(monto);
  data.diaSueldo = Number(dia) || 1;
  save();
}

function guardarRecurrente() {
  const desc = document.getElementById("inputDesc").value.trim();
  const monto = document.getElementById("inputMonto").value;

  if (!desc || !monto) return alert("Completa todos los campos");

  data.recurrentes.push({
    id: Date.now(),
    desc,
    monto: Number(monto),
    tipo: "recurrente"
  });
  save();
}

function guardarGasto() {
  const desc = document.getElementById("inputDesc").value.trim();
  const monto = document.getElementById("inputMonto").value;

  if (!desc || !monto) return alert("Completa todos los campos");

  data.gastos.push({
    id: Date.now(),
    desc,
    monto: Number(monto),
    tipo: "gasto"
  });
  save();
}

function guardarIngreso() {
  const desc = document.getElementById("inputDesc").value.trim();
  const monto = document.getElementById("inputMonto").value;

  if (!desc || !monto) return alert("Completa todos los campos");

  data.ingresos.push({
    id: Date.now(),
    desc,
    monto: Number(monto),
    tipo: "ingreso"
  });
  save();
}

// ======================
// RENDER MOVIMIENTOS
// ======================
function renderMovimientos() {
  const contenedor = document.getElementById("listaMovimientos");
  contenedor.innerHTML = "";

  const todos = [
    ...data.recurrentes.map(i => ({...i, tipo: "gasto"})),
    ...data.gastos,
    ...data.ingresos
  ].reverse().slice(0, 8);

  if (todos.length === 0) {
    contenedor.innerHTML = `<p style="color:#666; font-size:0.9rem;">Aún no hay movimientos</p>`;
    return;
  }

  todos.forEach(item => {
    const div = document.createElement("div");
    div.className = "movimiento";
    div.innerHTML = `
      <span class="desc">${item.desc}</span>
      <span class="monto ${item.tipo === "ingreso" ? "ingreso" : "gasto"}">
        ${item.tipo === "ingreso" ? "+" : "-"}$${Number(item.monto).toLocaleString("es-MX")}
      </span>
    `;
    contenedor.appendChild(div);
  });
}
