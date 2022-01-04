"use strict";

// DOM Elements
const puzzleSelector = document.getElementById("puzzleSelector");
const gameContainer = document.getElementById("gameContainer");
const randomContainer = document.getElementById("randomContainer");
const correctContainer = document.getElementById("correctContainer");
const message = document.getElementById("message");
const resetBtn = document.getElementById("resetBtn");
const puzzle0Btn = document.getElementById("puzzle-0");
const puzzle1Btn = document.getElementById("puzzle-1");
const puzzle2Btn = document.getElementById("puzzle-2");

const puzzlePieces = [];
const emptySpots = [];
let randomPieces = [];

let draggedPiece;

btnEventListeners();

// Creating an img element and configuring it then appending it to the container
function getPuzzlePieces(puzzleId) {
  for (let i = 0; i < 25; i++) {
    const imageContainer = document.createElement("div");
    imageContainer.id = `${i}`;
    imageContainer.draggable = true;
    const pieceElement = document.createElement("img");
    pieceElement.src = `./assets/puzzle-${puzzleId}/piece-${i}.webp`;
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
}

function createEmptySpots() {
  for (let i = 0; i < 25; i++) {
    const divElement = document.createElement("div");
    divElement.classList.add("correct--div");
    emptySpots.push(divElement);
    correctContainer.appendChild(divElement);
  }
}

// Creates the shuffled array with the help of randomizer function
function getRandomPieces() {
  randomPieces = randomizer(puzzlePieces);
  randomPieces.forEach((piece) => {
    randomContainer.appendChild(piece.element);
  });
}

function gameStateHandler() {
  puzzleSelector.classList.add("display-none");
  gameContainer.classList.remove("display-none");
  resetBtn.classList.remove("display-none");
  createEmptySpots();
  getRandomPieces();
  puzzleEventListeners();
}

function btnEventListeners() {
  puzzle0Btn.addEventListener("click", () => {
    getPuzzlePieces(0);
    gameStateHandler();
  });
  puzzle1Btn.addEventListener("click", () => {
    getPuzzlePieces(1);
    gameStateHandler();
  });
  puzzle2Btn.addEventListener("click", () => {
    getPuzzlePieces(2);
    gameStateHandler();
  });
}

function puzzleEventListeners() {
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

// Storing the dragged element in data transfer
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
    // Another approach
    // let temp = this.innerHTML;
    // this.innerHTML = draggedPiece.innerHTML;
    // draggedPiece.innerHTML = temp;
  }
  classRemover();
  resultChecker();
  draggedPiece.classList.remove("dragged");
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
        message.innerText = "";
      }
    } else {
      filled = false;
      message.innerText = "";
    }
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
