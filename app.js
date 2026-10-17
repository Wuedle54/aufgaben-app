// Elemente aus der Seite holen
const formular = document.getElementById("aufgaben-formular");
const eingabe = document.getElementById("aufgaben-eingabe");
const liste = document.getElementById("aufgaben-liste");
const leerHinweis = document.getElementById("leer-hinweis");

// Aufgaben aus dem Browser-Speicher laden (damit sie nach dem Neuladen noch da sind)
let aufgaben = ladeAufgaben();

function ladeAufgaben() {
  try {
    return JSON.parse(localStorage.getItem("aufgaben")) || [];
  } catch {
    return [];
  }
}

function speichereAufgaben() {
  try {
    localStorage.setItem("aufgaben", JSON.stringify(aufgaben));
  } catch {
    // Speichern nicht möglich (z. B. privater Modus) – App funktioniert trotzdem
  }
}

// Die Liste auf der Seite neu aufbauen
function zeigeAufgaben() {
  liste.innerHTML = "";

  aufgaben.forEach((aufgabe, index) => {
    const eintrag = document.createElement("li");
    if (aufgabe.erledigt) {
      eintrag.classList.add("erledigt");
    }

    const label = document.createElement("label");

    const haekchen = document.createElement("input");
    haekchen.type = "checkbox";
    haekchen.checked = aufgabe.erledigt;
    haekchen.addEventListener("change", () => {
      aufgaben[index].erledigt = haekchen.checked;
      speichereAufgaben();
      zeigeAufgaben();
    });

    const text = document.createElement("span");
    text.textContent = aufgabe.text;

    const loeschen = document.createElement("button");
    loeschen.className = "loeschen";
    loeschen.textContent = "✕";
    loeschen.title = "Aufgabe löschen";
    loeschen.addEventListener("click", () => {
      aufgaben.splice(index, 1);
      speichereAufgaben();
      zeigeAufgaben();
    });

    label.append(haekchen, text);
    eintrag.append(label, loeschen);
    liste.append(eintrag);
  });

  leerHinweis.hidden = aufgaben.length > 0;
}

// Neue Aufgabe hinzufügen, wenn das Formular abgeschickt wird
formular.addEventListener("submit", (ereignis) => {
  ereignis.preventDefault(); // verhindert, dass die Seite neu lädt

  const text = eingabe.value.trim();
  if (text === "") {
    return;
  }

  aufgaben.push({ text: text, erledigt: false });
  speichereAufgaben();
  zeigeAufgaben();

  eingabe.value = "";
  eingabe.focus();
});

zeigeAufgaben();
