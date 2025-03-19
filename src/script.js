class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
            <form>
                <input type="text" id="title" placeholder="Title" required>
                <textarea id="body" placeholder="Write your note here..." required></textarea>
                <button type="submit">Add Note</button>
            </form>
        `;
    this.shadowRoot
      .querySelector("form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = this.shadowRoot.querySelector("#title").value;
        const body = this.shadowRoot.querySelector("#body").value;

        try {
          const res = await fetch("https://notes-api.dicoding.dev/v2/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, body }),
          });
          const result = await res.json();
          console.log(result);

          this.dispatchEvent(
            new CustomEvent("note-added", {
              detail: { title, body },
              bubbles: true,
              composed: true,
            })
          );
        } catch (error) {
          console.error("Error adding note:", error);
        }

        this.shadowRoot.querySelector("form").reset();
      });
  }
}
customElements.define("note-form", NoteForm);

class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  set noteData(note) {
    this.shadowRoot.innerHTML = `
            <div class="note">
                <h2>${note.title}</h2>
                <p>${note.body}</p>
                <small>${new Date(note.createdAt).toLocaleDateString()}</small>
                <button id="delete-btn">Delete</button>
            </div>
        `;

    this.shadowRoot
      .querySelector("#delete-btn")
      .addEventListener("click", async () => {
        try {
          const res = await fetch(
            `https://notes-api.dicoding.dev/v2/notes/${note.id}`,
            {
              method: "DELETE",
            }
          );
          const result = await res.json();
          console.log(result);

          document.dispatchEvent(new CustomEvent("note-added"));
        } catch (error) {
          console.error("Error deleting note:", error);
        }
      });
  }
}
customElements.define("note-item", NoteItem);

class NoteList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.notesData = [];
  }
  async connectedCallback() {
    await this.fetchNotes();
    this.render();
    document.addEventListener("note-added", async (e) => {
      await this.fetchNotes();
      this.render();
    });
  }
  async fetchNotes() {
    try {
      const res = await fetch("https://notes-api.dicoding.dev/v2/notes");
      const data = await res.json();
      this.notesData = data.data;
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  }
  render() {
    this.shadowRoot.innerHTML = "";
    this.notesData.forEach((note) => {
      const noteElement = document.createElement("note-item");
      noteElement.noteData = note;
      this.shadowRoot.appendChild(noteElement);
    });
  }
}
customElements.define("note-list", NoteList);
