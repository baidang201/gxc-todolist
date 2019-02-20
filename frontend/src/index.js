import React from 'react';
import ReactDOM from 'react-dom';
import update from 'immutability-helper';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import GScatterutil from './gscatterutil'

class TodoForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { descripion: "" }
    }

    updateInput(e){
        this.setState({ description: e.target.value })
    }

    saveTodo(e) {
        e.preventDefault();
        this.props.onSubmit(this.state.description)
        this.setState({ description: "" })
    }

    render() {
        return(
        <form onSubmit={this.saveTodo.bind(this)}>
            <input type="text" value={this.state.description} placeholder="Add a new TODO" onChange={this.updateInput.bind(this) }/>
            <button type="submit">Save</button>
        </form>
        )
    }
}

class TodoList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            todos: []
        }
        
    }

    async componentWillMount(){
        await GScatterutil.init()
        this.loadTodos();
    }

    loadTodos() {        
        GScatterutil.getTodoList().then((result)=> {
            console.log(result)
            this.setState({ todos: result })
        })
        .catch((err) => { 
            console.log(err) 
        })
    }

    async addNewTodo(description){
        this.setState({ loading: true })
        GScatterutil.login()
    
        // const newTodos = update(this.state.todos, {$push: [
        //     { id: (this.state.todos.length + 1), description: description, completed: false },
        // ]});    
        // this.setState({ todos: newTodos })

        GScatterutil.create(description).then((res) => { 
            this.loadTodos();
            console.log("create ok!!!")
            this.setState({ loading: false }) 
        })
        .catch((err) => { 
            this.setState({ loading: false }); console.log(err) 
        })
    }

    async completeTodo(id, e) {
        e.preventDefault();
        this.setState({ loading: true })
        GScatterutil.login()

        var todoIndex = this.state.todos.findIndex((todo) => { return todo.id === id });

        // this.setState({
        // todos: update(this.state.todos, {
        //     [todoIndex]: { $merge: { completed: true }}
        // })
        // })

        console.log('todoIndex', todoIndex)
        console.log('this id:', id)
        console.log('this e', e)
        GScatterutil.complete((id), ).then((res) => {
            this.loadTodos();
            this.setState({ loading: false }) 
        })
        .catch((err) => { 
            this.setState({ loading: false }); 
            console.log(err) 
        })
    }

    async removeTodo(id, e) {
        e.preventDefault();
        this.setState({ loading: true })

        GScatterutil.login()

        var todoIndex = this.state.todos.findIndex((todo) => { return todo.id === id });
        // this.setState({ todos: this.state.todos.filter(todo => todo.id !== id) })

        GScatterutil.destory((id)).then((res) => { 
            this.loadTodos();
            this.setState({ loading: false }) 
        })
        .catch((err) => { 
            this.setState({ loading: false }); 
            console.log(err) 
        })
    }

    renderTodoItem(todo) {
        return (
            <li key={todo.id}>
            {todo.id}
            {todo.completed ?
            <span>[x] </span> :
            <input type="checkbox" onClick={this.completeTodo.bind(this, todo.id)} defaultChecked={false} /> }
            {todo.description}
            { " " }
            {todo.completed ? <a href="#" onClick={this.removeTodo.bind(this, todo.id)}>(remove)</a> : ""}
            </li>
        );
    }

    render() {
        return (
            <div>
            <h3>My TODOs: {this.state.loading ? <small>(saving...)</small> : ""}</h3>
            {this.state.todos.map(this.renderTodoItem.bind(this))}
            <br />
            <TodoForm onSubmit={this.addNewTodo.bind(this)} />
            </div>
        );
    }
}

ReactDOM.render(<TodoList />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
