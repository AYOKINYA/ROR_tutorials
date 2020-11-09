<script type="text/template" name="searched-users-item-tmpl">
{{= username}}
</script>

<div class="modal-body" id="view-searched-users">
				<form class="form-inline">
					<input class="form-control mr-sm-2" type="search" placeholder="type username" aria-label="Search" id="search-user-name">
					<button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
				</form>
				<br>
				<ul class="list-group list-group-flush" id="searched-user-list">
					<!-- tmpl-searched-users -->
				</ul>
</div>

const SearchedUsers = Backbone.Collection.extend({
    model: UserModel,
    url: '/search'
  });

  const SearchedUsersView = Backbone.View.extend({
    el: $("#view-searched-users"),
    template: _.template($('#searched-user-item-tmpl').html()),
    events: {
      "submit": "search_users"
    },
    initialize: function() {
      this.listenTo(this.collection, "remove", this.render);
    },
    render: function () {
      this.$el.find('#searched-user-list').html(this.template({
        users: searchedusers.toJSON(),
      }))
    },
    search_users: function (e) {
      e.preventDefault();
      const username = $("#search-user-name").val();
      console.log("heeee");
      if (!username)
        return;
      const self = this;
      searchedusers.fetch({
        data: $.param({ search: username }),
        success: function (collection, response, options) {
          self.render();
        },
      });
    },
  });

const searchedusers = new SearchedUsers;
var SearchView = new SearchedUsersView({collection: searchedusers});