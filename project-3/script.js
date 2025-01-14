const inputBox = document.getElementById("inputBox");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");

const addTodo = () => {
  const todoText = inputBox.value.trim();
  if (todoText.length <= 0) {
    alert("Please enter a todo");
    return false;
  }

  const li = document.createElement("li");
  const p = document.createElement("p");
  p.innerHTML = todoText;
  li.appendChild(p);

  //   creating DELETE button

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Done";
  deleteBtn.classList.add("btn", "deleteBtn");
  li.appendChild(deleteBtn);

  todoList.appendChild(li);
  inputBox.value = "";
};

const updateTodo = (a) => {
  if (a.target.innerHTML === "Done") {
    todoList.removeChild(a.target.parentElement);
  }
};

addBtn.addEventListener("click", addTodo);
todoList.addEventListener("click", updateTodo);
