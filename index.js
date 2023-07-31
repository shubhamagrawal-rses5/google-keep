const createNoteArea = document.querySelector(".createNoteArea");
const modal = document.querySelector(".editable-note-modal");
const modalBackground = document.querySelector(".note-modal-background");
const mainContainer = document.querySelector(".main-container");
const createNodeFile = document.querySelector(".create-note-image-file");
const createNodeBGColor = document.querySelector(".creating-background-color");

let isModalOpen = false;
let modelOpenContentId;
let isCreatingPinnedNote = false;
let backgroundPopupOpenId;
let isCreatingBGColorPopupOpen = false;
let creatingBGColor;

const noteBackgroundColors = [
  "ffffff",
  "faafa8",
  "fff8b8",
  "e2f6d3",
  "b4ddd3",
  "aeccdc",
  "f6e2dd",
  "efeff1",
];

displayNotes();

const creatingPin = document.querySelector("#creating-pin");
creatingPin.addEventListener("click", () => {
  togglePinCreatingNote();
});

createNoteArea.addEventListener("click", () => {
  const createNodeTitle = document.querySelector(".create-title");
  createNodeTitle.style.display = "block";
  const createNodeOptionsContainer = document.querySelector(
    ".create-options-container"
  );
  createNodeOptionsContainer.style.display = "block";
});

const creatingBackgroundColor = document.querySelector(
  "#creating-background-color"
);

creatingBackgroundColor.addEventListener("click", () => {
  let colorButtons = "";
  for (let color of noteBackgroundColors) {
    colorButtons += `<button class="color-btn" onClick="setCreatingNoteBGColor(${parseInt(
      color,
      16
    )})" style='background-color:${"#" + color}'>
    </button>`;
  }

  let creatingBackgroundColor = document.querySelector(
    ".creating-background-color"
  );
  creatingBackgroundColor.children[0].innerHTML = colorButtons;

  if (isCreatingBGColorPopupOpen) {
    isCreatingBGColorPopupOpen = false;
    creatingBackgroundColor.style.display = "none";
  } else {
    isCreatingBGColorPopupOpen = true;
    creatingBackgroundColor.style.display = "flex";
  }
});

createNodeFile.addEventListener("change", (event) => {
  const image_file = event.target.files[0];
  let fileReader = new FileReader();
  fileReader.readAsDataURL(image_file);

  const targetArea = document.querySelector(".create-note-image");

  fileReader.addEventListener("load", function (e) {
    targetArea.innerHTML = `<img src="${e.target.result}" alt="" />
                  `;
  });
});

function createNote(
  createNodeTitle,
  createNodeDescription,
  createNodeImage,
  iscreateNodePinned = false,
  backgroundColor = "white"
) {
  if (createNodeTitle || createNodeDescription || createNodeImage) {
    let notesCount = JSON.parse(window.localStorage.getItem("notesCount")) ?? 0;
    let notesIDGiver =
      JSON.parse(window.localStorage.getItem("notesIDGiver")) ?? 1;

    const note = {
      id: notesIDGiver,
      title: createNodeTitle,
      description: createNodeDescription,
      imageURL: createNodeImage,
      isPinned: iscreateNodePinned,
      backgroundColor: backgroundColor,
    };

    let notes = JSON.parse(window.localStorage.getItem("notes"));

    if (notes) {
      notes.push(note);
    } else {
      notes = [note];
    }

    window.localStorage.setItem("notes", JSON.stringify(notes));
    window.localStorage.setItem("notesCount", notesCount + 1);
    window.localStorage.setItem("notesIDGiver", notesIDGiver + 1);
    displayNotes();
  }
}

function updateNoteContent(noteId) {
  let notes = JSON.parse(window.localStorage.getItem("notes"));
  let node = document.querySelector(".editable-note-modal");

  const [titlePlaceholder, descriptionPlaceholder] = [
    node.querySelector(".note-title").getAttribute("data-placeholder"),
    node.querySelector(".note-description").getAttribute("data-placeholder"),
  ];

  const [title, description] = [
    node.querySelector(".note-title").innerText == titlePlaceholder
      ? ""
      : node.querySelector(".note-title").innerText,
    node.querySelector(".note-description").innerText == descriptionPlaceholder
      ? ""
      : node.querySelector(".note-description").innerText,
  ];

  for (let note of notes) {
    if (
      note.id == noteId &&
      (note.title != title || note.description != description)
    ) {
      note.title = title;
      note.description = description;
      break;
    }
  }

  window.localStorage.setItem("notes", JSON.stringify(notes));
  displayNotes();
}

function deleteNote(noteId) {
  let notes = JSON.parse(window.localStorage.getItem("notes"));
  let notesCount = JSON.parse(window.localStorage.getItem("notesCount"));

  notes = notes.filter((note) => note.id != noteId);

  window.localStorage.setItem("notes", JSON.stringify(notes));
  window.localStorage.setItem("notesCount", Math.max(notesCount - 1, 0));
  closeModal();
  displayNotes();
}

function duplicateNote(noteId) {
  let notes = JSON.parse(window.localStorage.getItem("notes"));
  currentNote = notes.find((note) => note.id == noteId);
  createNote(
    currentNote.title,
    currentNote.description,
    currentNote.imageURL,
    currentNote.isPinned,
    currentNote.backgroundColor
  );
}

function togglePinNote(noteId) {
  let notes = JSON.parse(window.localStorage.getItem("notes"));

  for (let note of notes) {
    if (note.id == noteId) {
      note.isPinned = !note.isPinned;
      break;
    }
  }

  window.localStorage.setItem("notes", JSON.stringify(notes));

  displayNotes();
}

function addImage(nodeId) {
  let notes = JSON.parse(window.localStorage.getItem("notes"));
  let node = Array.from(document.querySelectorAll(".note")).find(
    (n) => n.id == nodeId
  );
  const imageInNotes = node.querySelector(".note-image").querySelector("img");
  for (let note of notes) {
    if (note.id == nodeId) {
      note.imageURL = imageInNotes.src;
      break;
    }
  }

  if (modal.querySelector(".note-image")) {
    modal.querySelector(
      ".note-image"
    ).innerHTML = `<img src="${imageInNotes.src}" alt=" "></img>`;
  }

  window.localStorage.setItem("notes", JSON.stringify(notes));
  displayNotes();
}

function setCreatingNoteBGColor(bgColor = "white") {
  creatingBGColor = "#" + bgColor.toString(16);
  createNoteArea.style.backgroundColor = creatingBGColor;
}

function discardCreatingNote() {
  let createNodeTitle = document.querySelector(".create-title");
  let createNodeDescription = document.querySelector(".create-description");
  let createNodeImage = document.querySelector(".create-note-image");

  createNodeTitle.innerHTML = "";
  createNodeDescription.innerHTML = "";
  createNodeImage.innerHTML = "";
}

function togglePinCreatingNote() {
  isCreatingPinnedNote = !isCreatingPinnedNote;
  creatingPin.style.color = isCreatingPinnedNote ? "black" : "grey";
}

function setNoteBGColor(backgroundColor) {
  let notes = JSON.parse(window.localStorage.getItem("notes"));

  for (let note of notes) {
    if (note.id == backgroundPopupOpenId) {
      note.backgroundColor = "#" + backgroundColor.toString(16);
      break;
    }
  }
  console.log(backgroundPopupOpenId, backgroundColor);

  window.localStorage.setItem("notes", JSON.stringify(notes));

  backgroundPopupOpenId = null;
  displayNotes();
}

function closeModal() {
  modal.classList.remove("transition");
  modalBackground.style.display = "none";
  isModalOpen = false;
  modelOpenContentId = null;
}

function openModal() {
  modal.classList.add("transition");
  modalBackground.style.display = "inherit";
  isModalOpen = true;
}

function saveNote(noteId) {
  updateNoteContent(noteId);
  closeModal();
}

function test() {
  console.log("test");
}

function generateBGColorPopup() {
  let popup = document.createElement("div");
  popup.classList.add("popup");
  let backgroundColorPopup = document.createElement("div");
  backgroundColorPopup.classList.add("background-color-popup");

  popup.appendChild(backgroundColorPopup);

  let colorButtons = "";
  for (let color of noteBackgroundColors) {
    colorButtons += `<button class="color-btn" onClick="setNoteBGColor(${parseInt(
      color,
      16
    )})" style='background-color:${"#" + color}'>
    </button>`;
  }

  backgroundColorPopup.innerHTML = colorButtons;

  return popup;
}

function toggleBackgroundColorPopup(noteId) {
  let popup = generateBGColorPopup();

  let noteNodes = document.querySelectorAll(".note-content-container");
  let currentNote = Array.from(noteNodes).find(
    (node) => node.parentElement.getAttribute("id") == noteId
  );

  currentNote.parentNode.appendChild(popup);

  if (noteId != backgroundPopupOpenId) {
    popup.style.display = "flex";
    backgroundPopupOpenId = noteId;
  } else {
    popup.style.display = "none";
    backgroundPopupOpenId = null;
  }
}

function displayNotes() {
  const notes = JSON.parse(window.localStorage.getItem("notes"));
  let displayNoteArea = document.querySelector(".displayNoteArea");
  let displayPinnedNoteArea = document.querySelector(".displayPinnedNoteArea");

  displayNoteArea.innerHTML = "";
  displayPinnedNoteArea.innerHTML = ``;

  let pinnedNoteCount = 0;

  notes?.forEach((note) => {
    let isNoteContentNotHidden = note.title || note.description;
    let pinColor = note.isPinned ? "black" : "grey";

    let newNoteNode = `<div class="note" id=${
      note.id
    } style='background-color:${note.backgroundColor}'>
     <button class="icon-btn pin" style='color:${pinColor}' onClick="togglePinNote(${
      note.id
    })"><i class="fa fa-thumb-tack"></i></button>  
        <div class="note-content-container">
            <div class="note-image"> 
                ${
                  note.imageURL
                    ? `<img src="${note.imageURL}" alt=" "></img>`
                    : ""
                }      
            </div>
            <div class="note-content" style='display:${
              !isNoteContentNotHidden ? "none" : "inherit"
            }'>
                <div class="editable note-title line-clamp-properties-2" tabindex="0" data-placeholder="Title"><pre>${
                  note.title
                }</pre></div>
                <div class="editable note-description line-clamp-properties-7" tabindex="0" data-placeholder="Note description.."><pre>${
                  note.description
                }</pre></div>
            </div>
        </div>
        <div class="notes-options-container">
                <div class="note-options">
                    <div class="note-actions">
                        <button class="icon-btn" onClick="deleteNote(${
                          note.id
                        })"><i class="fa fa-trash"></i></button>
                        <input type='file' accept="image/*" class="note-image-file" id="note-image-file-${
                          note.id
                        }" hidden></input>
                        <label for="note-image-file-${
                          note.id
                        }" class='icon-btn'><i class="fa fa-image"></i></label>
                        <button class="icon-btn" onClick="duplicateNote(${
                          note.id
                        })"><i class="fa fa-copy"></i></button>    
                        <button class="icon-btn" onClick="toggleBackgroundColorPopup(${
                          note.id
                        })"><i class="fa-solid fa-palette"></i></button>       
                    </div>
                    <button class="saveButton" onClick='saveNote(${
                      note.id
                    })'>Save</button>    
                </div>
        </div>
        </div>
        `;

    if (note.isPinned) {
      displayPinnedNoteArea.innerHTML += newNoteNode;
      pinnedNoteCount += 1;
    } else {
      displayNoteArea.innerHTML += newNoteNode;
    }
  });
  document.querySelectorAll(".headings").forEach((n) => {
    n.style.display = pinnedNoteCount < 1 ? "none" : "block";
  });
  noteClickHandler();
  imageUploadHandler();
}

function imageUploadHandler() {
  let noteNodesOptions = document.querySelectorAll(".note");

  for (let node of noteNodesOptions) {
    node
      .querySelector(".note-image-file")
      .addEventListener("change", (event) => {
        const image_file = event.target.files[0];
        let fileReader = new FileReader();
        fileReader.readAsDataURL(image_file);

        const targetArea = node.querySelector(".note-image");

        fileReader.addEventListener("load", function (e) {
          targetArea.innerHTML = `<img src="${e.target.result}" alt="" />
                `;
          let nodeId = node.getAttribute("id");
          addImage(nodeId);
        });
      });
  }
}

function placeholderHelper(element) {
  const placeholder = element.getAttribute("data-placeholder");

  if (!element.children[0].innerHTML)
    element.children[0].innerHTML = placeholder;

  element.addEventListener("focus", function (e) {
    const value = e.target.innerText;
    value === placeholder && (e.target.innerText = "");
  });

  element.addEventListener("blur", function (e) {
    const value = e.target.innerText;
    value === "" && (e.target.innerText = placeholder);
  });
}

function noteClickHandler() {
  let noteNodes = document.querySelectorAll(".note-content-container");
  const notes = JSON.parse(window.localStorage.getItem("notes"));

  noteNodes.forEach((node) => {
    node.addEventListener("click", () => {
      let nodeId = node.parentElement.getAttribute("id");
      openModal();
      modelOpenContentId = nodeId;

      modal.innerHTML = node.parentElement.innerHTML;

      modal.style.backgroundColor = node.parentElement.style.backgroundColor;

      modal.querySelector(".saveButton").style.display = "inherit";
      modal.querySelector(".note-content").style.display = "inherit";

      const title = modal.querySelector(".note-title");
      title.setAttribute("contenteditable", true);
      placeholderHelper(title);

      const description = modal.querySelector(".note-description");
      description.setAttribute("contenteditable", true);
      placeholderHelper(description);
    });
  });
}

window.addEventListener("click", (event) => {
  if (
    document.contains(event.target) &&
    !createNoteArea.contains(event.target) &&
    !isModalOpen
  ) {
    let createNodeTitle = document.querySelector(".create-title");
    let createNodeDescription = document.querySelector(".create-description");
    let createNodeImage = document.querySelector(".create-note-image");
    let createNodeOptionsContainer = document.querySelector(
      ".create-options-container"
    );
    createNodeOptionsContainer.style.display = "none";
    createNote(
      createNodeTitle.innerText,
      createNodeDescription.innerText,
      createNodeImage.children[0]?.src,
      isCreatingPinnedNote,
      creatingBGColor
    );
    createNodeTitle.style.display = "none";
    createNodeTitle.innerHTML = "";
    createNodeDescription.innerHTML = "";
    createNodeImage.innerHTML = "";
    createNodeBGColor.style.display = "none";
    if (isCreatingPinnedNote) togglePinCreatingNote();
    isCreatingBGColorPopupOpen = false;
    createNoteArea.style.backgroundColor = "white";
    createNodeBGColor = "white";
  }
});

modalBackground.addEventListener("click", (event) => {
  saveNote(modelOpenContentId);
});
