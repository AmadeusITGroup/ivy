import { $template } from '../../../iv';
import { value } from '../../../iv/inputs';
import { changeComplete, Data, computed, ref } from '../../../trax';
import './base.css';
import './index.css';
import { IvTemplate } from '../../../iv/types';

// Data model
@Data export class Todo {
    description = "";        // todo description
    editDescription = "";    // description in edit mode (prior to validation)
    completed = false;       // true if todo is completed
    editing = false;         // true when the todo is being edited
}

@Data export class TodoApp {
    newEntry = "";
    @ref filter: "ALL" | "ACTIVE" | "COMPLETED" = "ALL";
    list: Todo[];

    @computed get listView(): Todo[] {
        if (this.filter === "ALL") {
            return this.list;
        } else {
            let isComplete = (this.filter === "COMPLETED");
            return this.list.filter(item => item.completed === isComplete);
        }
    }

    @computed get itemsLeft(): number {
        let itemsLeft = 0;
        this.list.forEach(item => {
            itemsLeft += item.completed ? 0 : 1;
        });
        return itemsLeft;
    }
}

const todoApp = $template`(app:TodoApp, $template) => {
    $let todos = app.list;
    
    <section class="todoapp">
        <header class="header">
            <h1> todos </h1>
            <input #mainEdit type="text" class="new-todo" placeholder="What needs to be done?" autofocus
                autocomplete="off" @value={=app.newEntry} @onkeyup={e=>addTodoOnEnter(e.keyCode, app)} />
        </header>

        $if (todos.length) {
            <section class="main">
                <input id="toggle-all" class="toggle-all" type="checkbox" [checked]={app.itemsLeft===0}/>
                <label for="toggle-all" @onclick={=>toggleAllCompleted(app)}> Mark all as complete </label>
                <ul class="todo-list">
                    $for (let i=0;app.listView!.length>i;i++) {
                        $let todo=app.listView[i];
                        <li class={"todo " + (todo.editing? 'editing ':'') + (todo.completed?'completed':'')}>
                            <div class="view">
                                <input class="toggle" type="checkbox" [checked]={todo.completed} 
                                    @onclick={=>todo.completed = !todo.completed} 
                                />
                                <label @ondblclick={=>startEditing(app, todo, $template)}> {todo.description} </label>
                                <button class="destroy" @onclick={=>deleteTodo(app, todo, $template)}></button>
                            </div>
                            $if (todo.editing) {
                                <input #editField type="text" class="edit" @value={=todo.editDescription} 
                                    @onkeyup={e=>editTodo(e.keyCode, app, todo, $template)} 
                                    @onblur={=>stopEditing(todo, true, $template)}/>
                            }
                        </li>
                    }
                </ul>
            </section>
            <footer class="footer">
                <span class="todo-count">
                    // note: (really) bad i18n practice...
                    <strong> {app.itemsLeft} </strong> item{app.itemsLeft > 1?'s':''} left
                </span>
                <ul class="filters">
                    <*filter {app} filterCode="ALL"> All </>
                    <*filter {app} filterCode="ACTIVE"> Active </>
                    <*filter {app} filterCode="COMPLETED"> Completed </>
                </ul>
    
                $if (todos.length > app.itemsLeft) {
                    <button class="clear-completed" @onclick={=>clearCompleted(app)}> Clear completed </button>
                }
          </footer>
        }
    </section>

    <*infoFooter/>
}`;

const filter = $template`(app, filterCode:string, $content: IvContent) => {
    <li>
        <a class={app.filter===filterCode? 'selected':''} 
            href={"#/"+filterCode.toLowerCase()}
            @onclick={=>app.filter = filterCode} @content/>
    </li>
}`;

const infoFooter = $template`() => {
    <footer class="info">
        <p> Double-click to edit a todo </p>
        <p> Template by <a href="http://sindresorhus.com"> Sindre Sorhus </a></p>
        <p> Created with <a href="https://github.com/amadeusITGroup/ivy"> ivy </a></p>
        <p> Part of <a href="http://todomvc.com"> TodoMVC </a></p>
  </footer>
}`;


const ENTER_KEY = 13, ESCAPE_KEY = 27;

function addTodoOnEnter(keyCode: number, app: TodoApp) {
    if (keyCode == ENTER_KEY) {
        let todoDesc = app.newEntry = app.newEntry.trim();
        if (todoDesc.length) {
            let item = new Todo();
            item.description = todoDesc;
            app.list.push(item);
        }
        app.newEntry = "";
    }
}

function editTodo(keyCode: number, app: TodoApp, todo: Todo, tpl: IvTemplate) {
    if (keyCode === ENTER_KEY) {
        if (todo.editDescription.trim() === "") {
            deleteTodo(app, todo, tpl);
        } else {
            stopEditing(todo, true, tpl);
        }
    } else if (keyCode === ESCAPE_KEY) {
        stopEditing(todo, false, tpl);
    }
}

async function startEditing(app: TodoApp, todo: Todo | null, tpl: IvTemplate) {
    // called when an item is clicked
    app.list.forEach((item) => {
        item.editing = (item === todo);
        if (item.editing) {
            item.editDescription = item.description;
        }
    });
    focus("#editField", tpl);
};

async function focus(label: string, tpl: IvTemplate) {
    await changeComplete(tpl.api); // wait for the template refresh completion
    // focus element here
    let elt = tpl.query(label);
    if (elt) {
        elt.focus();
    }
}

function stopEditing(todo: Todo, validateCurrentInput: boolean, tpl: IvTemplate) {
    if (validateCurrentInput) {
        todo.description = todo.editDescription.trim();
    } else {
        todo.editDescription = todo.description;
    }
    todo.editing = false;
    focus("#mainEdit", tpl);
}

function deleteTodo(app: TodoApp, todo: Todo, tpl: IvTemplate) {
    const index = app.list.indexOf(todo);
    app.list.splice(index, 1);
    focus("#mainEdit", tpl);
}

function clearCompleted(app: TodoApp) {
    app.list = app.list.filter((todo) => !todo.completed);
}

// toggle all complete or uncompleted if all items are completed
function toggleAllCompleted(app: TodoApp) {
    const toBeCompleted = app.list.filter((todo) => !todo.completed).length > 0;
    app.list.forEach((todo) => { todo.completed = toBeCompleted });
}

// --------------------------------------------------------------------------------------------------
// bootstrap todoApp in the page body
todoApp().attach(document.body).render();
