import $ from 'jquery';
import _ from "underscore"
import Backbone from 'backbone';

//jQuery when DOM loads run this
$(function(){
  
    //Backbone Model
  
    window.Todo = Backbone.Model.extend({
      url: function() {
        return this.id ? '/todos/' + this.id : '/todos'; //Ternary, look it up if you aren't sure
      },
    
      defaults: { todo: {
        title: "None entered",
        order: 0
      }},
    
      initialize: function(){
        //Can be used to initialize Model attributes
      }
    });
  
    //Collection
  
    window.TodoCollection = Backbone.Collection.extend({
      model: Todo,
      url: '/todos'
    });
  
    window.Todos = new TodoCollection;
  
    //View
  
    window.TodoView = Backbone.View.extend({
      tagName: "tr",
    
      events: { 
        //Can be used for handling events on the template 
      },
    
      initialize: function(){
        this.render();
      },
    
      render: function(){
        var todo = this.model.toJSON();
        //Template stuff goes here
        $(this.el).html(ich.todo_template(todo));
        return this;
      }
    });
  
    //Application View
  
    window.AppView = Backbone.View.extend({
    
      el: $("#todos_app"),
    
      events: {
        "submit form#new_todo": "createTodo"
      },
    
      initialize: function(){
        _.bindAll(this, 'addOne', 'addAll');
        
        Todos.bind('add', this.addOne);
        Todos.bind('refresh', this.addAll);
        Todos.bind('all', this.render);
        
        Todos.fetch({success: function(mod, response) {
          console.log("Thats cool: " + JSON.stringify(mod));
        }}); //This Gets the Model from the Server
      },
      
      addOne: function(todo) {
        var view = new TodoView({model: todo});
        this.$("todo_table").append(view.render().el);
      },
      
      addAll: function(){
        Todos.each(this.addOne);
      },
      
      newAttributes: function(event) {
        var new_todo_form = $(event.currentTarget).serializeObject();
        //alert (JSON.stringify(new_dog_form));
        return { todo: {
            title: new_todo_form["todo[title]"],
            order: new_todo_form["todo[order]"]
          }}
      },
      
      createTodo: function(e) {
        e.preventDefault(); //This prevents the form from submitting normally
        
        var params = this.newAttributes(e);
        
        Todos.create(params);
        
        //TODO - Clear the form fields after submitting
      }
    
    });
  
    //START THE BACKBONE APP
    window.App = new AppView;
  
  });