
;(function($, _, Backbone){

  var PhotoModel = Backbone.Model.extend({
  });

  var PhotoCollection = Backbone.Collection.extend({
    model: PhotoModel,
    parse: function(response) {
      return response.data;
    },
    url: function() {
      return '/gallery/data/';
    }
  });

  var GalleryView = Backbone.View.extend({
    el: '#gallery',

    initialize: function() {
      this.tpl = $('#gallery_index').html();
      this.photo = new PhotoModel();
      this.photos = new PhotoCollection();
      return this;
    },

    render: function(){
      var html = Mustache.to_html(this.tpl, {});
      $(this.el).html(html);

      $.fn.fadeInImage = function() {
        return this.each(function(){
          var div = $(this).find('.image');
          var img = $(this).find('img');
          img.load(function(event){
            div.css('opacity', '1.0');
          });
        });
      }

      var self = this;
      this.photos.fetch({
        success: function(collection, response) {
          console.log([ collection, response ]);
          var html = Mustache.to_html(self.tpl, collection);
          $(self.el).html(html);
          $(self.el).find('.photo').fadeInImage();
        },
        error: function(collection, response) {
          console.log([ collection, response ]);
        }
      });

      return this;
    }
  });

  var AppRouter = Backbone.Router.extend({
    routes:{
      "": "index",
      "photo:id": 'view'
    },

    index: function() {
      var view = new GalleryView();
      view.initialize();
      view.render();
    },

    view: function(id) {
    }
  });

  $(function(){
    var app = new AppRouter();
    try {
      Backbone.history.start();
    } catch (ex) {}
  });

})(jQuery, _, Backbone);
