/**
 * Main Todo Module
 * @module main
 * @description The primary todo controller, loads, and edits todos from `todos.json`.
 */

// Imports
import inquirer from "npm:inquirer";

// Interfaces
interface Todo {
  name: string;
  id: string;
}

/**
 * @async
 * @method loadTodos
 * @description Loads the todo's.
 * @param {string} filePath - The path of the `todos.json` file.
 * @returns {Array}
 */
async function loadTodos(filePath: string) {
  try {
    return JSON.parse(await Deno.readTextFile(filePath));
  } catch (error) {
    console.log(`${filePath}: ${error}`);
  }
}

/**
 * @async
 * @method saveTodos
 * @description Saves the todo's.
 * @param {string} filePath - The path of the `todos.json` file.
 * @param {Array} data - The JSON Data/Array that is being saved to `filePath`.
 */
async function saveTodos(filePath: string, data: Array<string>) {
  try {
    await Deno.writeTextFile(filePath, JSON.stringify(data));
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
}

/**
 * @async
 * @method removeTodo
 * @description Removes a selected todo based on `ID`.
 * @param {string} id - The `ID` of the todo to remove.
 * @param {Todo[]} todos - The todos.
 */
async function removeTodo(id: string, todos: Todo[]) {
  return todos.filter(todo => todo.value !== id);
}

/**
 * @async
 * @method start
 * @description Starts the todo application.
 */
async function start() {
  let isRunning = true;
  const loadedTodos: Todo[] = await loadTodos("src/todos.json");
  while (isRunning) {
    console.clear();

    const todos = loadedTodos.map((todo, index) => ({
      name: todo.name,
      value: todo.id // Use unique ID for selection
    }));
    // Adding 'Save & Exit' to the list
    todos.push({
      name: "Save & Exit",
      value: "exit"
    });
    // Adding 'Add a Todo' to the list
    todos.push({
      name: "Add a Todo",
      value: "add"
    });


    const action = await inquirer.prompt({
      type: "list",
      name: "selectedTodo",
      message: "Select a todo:",
      choices: todos,
    });

    
    if (action.selectedTodo === "exit") {
      let updatedTodos = await removeTodo('exit', todos);
      updatedTodos = await removeTodo('add', updatedTodos);
      saveTodos("src/todos.json", updatedTodos);
      break;
    } else if (action.selectedTodo === "add") {
      const newTodo = await inquirer.prompt({
        type: 'input',
        name: 'newTodo',
        message: 'New Todo:',
      });
      const newTodoID = newTodo.newTodo.replace(/\s+/g, "").toLowerCase();

      const newTodoObject: Todo = {
        name: newTodo.newTodo,
        id: newTodoID,
      }

      todos.push(newTodoObject);
      console.log(todos);
      await saveTodos('src/todos.json', todos);
    } else {
      let updatedTodos = await removeTodo(action.selectedTodo, todos);
      updatedTodos = await removeTodo('exit', updatedTodos);
      updatedTodos = await removeTodo('add', updatedTodos);
      await saveTodos('src/todos.json', updatedTodos);
    }
  }
}

await start();
close();
