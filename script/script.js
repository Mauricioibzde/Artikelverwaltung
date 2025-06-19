const amount = document.querySelector("#amount");
const form = document.querySelector("form");
const btnAdd = document.querySelector("#btnAdd"); //  Referenz auf den Formular-Button
let editandoItem = null; //  Kontrollvariable für Bearbeitungsmodus

// Preis automatisch im Euro-Format formatieren
amount.addEventListener('input', () => {
    let value = amount.value.replace(/\D/g, "");
    value = Number(value) / 100;
    amount.value = formatCurrencyEU(value);
});

// Funktion zur Formatierung des Betrags im deutschen Währungsstil
function formatCurrencyEU(value) {
    return value.toLocaleString("de-DE", {
        style: "currency",
        currency: "EUR"
    });
}

// Event Listener für das Formular
form.addEventListener("submit", (e) => {
    e.preventDefault(); // Verhindert das Neuladen der Seite

    const Artikelname = document.querySelector("#Artikelname").value.trim();
    const Kategorie = document.querySelector("#Kategorie").value.trim();
    const Menge = document.querySelector("#Menge").value.trim();
    const Artikelpreis = amount.value.trim();

    // Überprüfung auf leere Felder
    if (Artikelname === "" || Kategorie === "" || Menge === "") {
        alert('Fehler: Bitte füllen Sie das Formular aus');
        return;
    }

    // Wenn ein Artikel bearbeitet wird, aktualisieren wir ihn
    if (editandoItem) {
        editandoItem.querySelector(".item-name").textContent = Artikelname;
        editandoItem.querySelector(".item-menge").textContent = Menge;
        editandoItem.querySelector(".item-preis").textContent = Artikelpreis;
        editandoItem.querySelector(".item-kategorie").textContent = Kategorie;

        editandoItem = null; // Beendet den Bearbeitungsmodus
        btnAdd.textContent = "Produkt hinzufügen"; // Text zurücksetzen
        form.reset();
        return;
    }

    // Wenn kein Artikel bearbeitet wird, neuen erstellen
    const list = document.querySelector("#list");
    const newItem = document.createElement("tr");

    newItem.innerHTML = `
        <td><span class="item-name">${Artikelname}</span></td>
        <td><span class="item-menge">${Menge}</span></td>
        <td><span class="item-preis">${Artikelpreis}</span></td>
        <td><span class="item-kategorie">${Kategorie}</span></td>
        <td class="edit-delete">
            <button class="edit"><img src="assets/icons/edit.png" alt="Bearbeiten"></button>
            <button class="delete"><img src="assets/icons/delete.png" alt="Löschen"></button>
        </td>
    `;

    // Löschen-Funktion
    newItem.querySelector(".delete").addEventListener("click", () => {
        list.removeChild(newItem);
    });

    // Bearbeiten-Funktion
    newItem.querySelector(".edit").addEventListener("click", () => {
        const name = newItem.querySelector(".item-name").textContent;
        const menge = newItem.querySelector(".item-menge").textContent;
        const preis = newItem.querySelector(".item-preis").textContent;
        const kategorie = newItem.querySelector(".item-kategorie").textContent;

        // Werte in das Formular einfügen
        document.querySelector("#Artikelname").value = name;
        document.querySelector("#Menge").value = menge;
        amount.value = preis;
        document.querySelector("#Kategorie").value = kategorie;

        editandoItem = newItem; // Aktiviert den Bearbeitungsmodus
        btnAdd.textContent = "Produkt aktualisieren"; // Button-Text ändern
    });

    // Neues Element zur Liste hinzufügen
    list.appendChild(newItem);
    form.reset(); // Formular leeren
});
