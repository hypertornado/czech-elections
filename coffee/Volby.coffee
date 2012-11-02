

window.onload = ->
  #new Volby($("canvas").width(), $("canvas").height(), 0, 0, "kraje", "kraje")
  #new Volby($("canvas").width(), $("canvas").height(), 0, 0, "okresy", "okresy")
  new Volby($("canvas").width(), $("canvas").height(), 0, 0, "obce", "obce")

class Volby

  constructor: (width, height, top, left, id, name) ->
    @width = width
    @height = height
    @top = top
    @left = left
    el = document.getElementById(id)
    @ctx = el.getContext("2d")
    @load_mapa(name)

  load_mapa: (name) =>
    $.ajax "geo_data/" + name + ".json"
      cache: false
      success: (data) =>
        console.log data
        bb = [data.bbox[2], data.bbox[3], data.bbox[0], data.bbox[1]]
        @bounds = @bounding_box(bb)
        for feature in data.features
          for coord in feature.geometry.coordinates
            @draw_path(coord)# if coord.length > 0 #TODO: proc se toto dostane do dat?

  bounding_box: (borders) =>
    width_box = borders[0] - borders[2]
    height_box = borders[1] - borders[3]
    console.log "WB: #{width_box}, HB: #{height_box}, W: #{@width}, H: #{@height}"
    #alert height_box / width_box
    if height_box / width_box < @height / @width
      alpha = (@height - (@width * height_box / width_box)) * (width_box / @width)
      #borders[1] += alpha / 2
      #borders[3] -= alpha / 2
    else
      alpha = (@width - (@height * width_box / height_box)) * (height_box / @height)
      #borders[0] += alpha / 2
      #borders[2] -= alpha / 2
    #console.log borders
    return borders

  draw_path: (path) =>
    first = path[0]
    color = "rgb(0, 0, #{parseInt(256 * Math.random())})"
    @ctx.fillStyle = color;
    @ctx.beginPath()
    trans = @translate_coord(first[0], first[1])
    @ctx.moveTo(trans[0], trans[1])
    for p in path
      trans = @translate_coord(p[0], p[1])
      @ctx.lineTo(trans[0], trans[1])
    @ctx.fill()

  translate_coord: (x, y, borders) =>
    t_x = @left + @width - (@width * ( (x - @bounds[0]) / (@bounds[2] - @bounds[0]) ))
    t_y = @top + @height - (@height * ( (y - @bounds[3]) / (@bounds[1] - @bounds[3]) ))
    return [t_x, t_y]

