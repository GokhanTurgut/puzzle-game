"use strict";

const randomContainer = document.getElementById("randomContainer");
const correctContainer = document.getElementById("correctContainer");
const message = document.getElementById("message");

const puzzlePieces = [];
const emptySpots = [];

let draggedPiece;

for (let i = 0; i < 25; i++) {
  const imageContainer = document.createElement("div");
  imageContainer.id = `${i}`;
  imageContainer.draggable = false;
  const pieceElement = document.createElement("img");
  pieceElement.src = `./assets/piece-${i}.webp`;
  pieceElement.draggable = true;
  pieceElement.classList.add("piece");
  pieceElement.dataset.index = i;
  imageContainer.appendChild(pieceElement);
  const piece = {
    order: i,
    element: imageContainer,
  };
  puzzlePieces.push(piece);
}

for (let i = 0; i < 25; i++) {
  const divElement = document.createElement("div");
  divElement.classList.add("correct--div");
  emptySpots.push(divElement);
  correctContainer.appendChild(divElement);
}

eventListeners();

const randomPieces = randomizer(puzzlePieces);

randomPieces.forEach((piece) => {
  randomContainer.appendChild(piece.element);
});

function eventListeners() {
  puzzlePieces.forEach((piece) => {
    piece.element.addEventListener("dragstart", onDragStart);
    piece.element.addEventListener("dragend", onDragEnd);
  });

  emptySpots.forEach((spot) => {
    spot.addEventListener("dragstart", onDragStart);
    spot.addEventListener("dragend", onDragEnd);
    spot.addEventListener("dragenter", onDragEnter);
    spot.addEventListener("dragleave", onDragLeave);
    spot.addEventListener("drop", onDragDrop);
    spot.addEventListener("dragover", onDragOver);
  });
}

function onDragStart(event) {
  this.classList.add("dragged");
  draggedPiece = this;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/html", this.innerHTML);
}

function onDragEnd(event) {
  this.classList.remove("dragged");
}

function onDragEnter(event) {
  this.classList.add("dragEntered");
}

function onDragLeave(event) {
  this.classList.remove("dragEntered");
}

function onDragDrop(event) {
  event.stopPropagation();
  if (draggedPiece !== this) {
    draggedPiece.innerHTML = this.innerHTML;
    this.innerHTML = event.dataTransfer.getData("text/html");
  }
  classRemover();
  resultChecker();
  this.classList.remove("dragEntered");
  this.classList.remove("dragged");
}

function onDragOver(event) {
  event.preventDefault();
}

function resultChecker() {
  let correctOrder = true;
  let filled = true;
  emptySpots.forEach((spot, index) => {
    if (spot.firstChild) {
      if (+spot.firstChild.dataset.index !== index) {
        correctOrder = false;
      }
    } else filled = false;
  });
  if (correctOrder && filled) {
    message.innerText = `Nice job! That's the correct order!`;
  } else if (!correctOrder && filled) {
    message.innerText = `Wrong order! Try Again!`;
  }
}

function classRemover() {
  emptySpots.forEach((spot) => {
    spot.classList.remove("dragged");
  });
  puzzlePieces.forEach((piece) => {
    piece.element.classList.remove("dragged");
  });
}

function randomizer(array) {
  const randomArr = [...array];
  for (let i = 0; i < randomArr.length; i++) {
    const randomIndex = Math.floor(Math.random() * randomArr.length);
    let temp = randomArr[i];
    randomArr[i] = randomArr[randomIndex];
    randomArr[randomIndex] = temp;
  }
  return randomArr;
}
