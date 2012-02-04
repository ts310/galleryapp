require 'net/https'

class GalleryController < ApplicationController
  def index
  end
  
  def data
    res = nil
    http = Net::HTTP.new('api.instagram.com', 443)
    http.use_ssl = true;
    http.start {
      res = http.get('/v1/tags/goyard/media/recent?client_id=619fc9c4a28942a4879bf1d462b61c8d&count=40')
      # res = http.get('/v1/media/popular?client_id=619fc9c4a28942a4879bf1d462b61c8d')
    }
    render :json => res.body
  end
end
