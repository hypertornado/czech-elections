var Volby,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

window.onload = function() {
  new Volby($("canvas").width(), $("canvas").height(), 0, 0, "kraje", "kraje");
  new Volby($("canvas").width(), $("canvas").height(), 0, 0, "okresy", "okresy");
  return new Volby($("canvas").width(), $("canvas").height(), 0, 0, "obce", "obce");
};

Volby = (function() {

  function Volby(width, height, top, left, id, name) {
    this.translate_coord = __bind(this.translate_coord, this);
    this.draw_path = __bind(this.draw_path, this);
    this.bounding_box = __bind(this.bounding_box, this);
    this.load_mapa = __bind(this.load_mapa, this);
    var el;
    this.width = width;
    this.height = height;
    this.top = top;
    this.left = left;
    el = document.getElementById(id);
    this.ctx = el.getContext("2d");
    this.load_mapa(name);
  }

  Volby.prototype.load_mapa = function(name) {
    var _this = this;
    return $.ajax("geo_data/" + name + ".json", {
      cache: false,
      success: function(data) {
        var bb, coord, feature, _i, _len, _ref, _results;
        console.log(data);
        bb = [data.bbox[2], data.bbox[3], data.bbox[0], data.bbox[1]];
        _this.bounds = _this.bounding_box(bb);
        _ref = data.features;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          feature = _ref[_i];
          _results.push((function() {
            var _j, _len2, _ref2, _results2;
            _ref2 = feature.geometry.coordinates;
            _results2 = [];
            for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
              coord = _ref2[_j];
              _results2.push(this.draw_path(coord));
            }
            return _results2;
          }).call(_this));
        }
        return _results;
      }
    });
  };

  Volby.prototype.bounding_box = function(borders) {
    var alpha, height_box, width_box;
    width_box = borders[0] - borders[2];
    height_box = borders[1] - borders[3];
    console.log("WB: " + width_box + ", HB: " + height_box + ", W: " + this.width + ", H: " + this.height);
    if (height_box / width_box < this.height / this.width) {
      alpha = (this.height - (this.width * height_box / width_box)) * (width_box / this.width);
    } else {
      alpha = (this.width - (this.height * width_box / height_box)) * (height_box / this.height);
    }
    return borders;
  };

  Volby.prototype.draw_path = function(path) {
    var color, first, p, trans, _i, _len;
    first = path[0];
    color = "rgb(" + (100 + parseInt(100 * Math.random())) + ", 0, 0)";
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    trans = this.translate_coord(first[0], first[1]);
    this.ctx.moveTo(trans[0], trans[1]);
    for (_i = 0, _len = path.length; _i < _len; _i++) {
      p = path[_i];
      trans = this.translate_coord(p[0], p[1]);
      this.ctx.lineTo(trans[0], trans[1]);
    }
    return this.ctx.fill();
  };

  Volby.prototype.translate_coord = function(x, y, borders) {
    var t_x, t_y;
    t_x = this.left + this.width - (this.width * ((x - this.bounds[0]) / (this.bounds[2] - this.bounds[0])));
    t_y = this.top + this.height - (this.height * ((y - this.bounds[3]) / (this.bounds[1] - this.bounds[3])));
    return [t_x, t_y];
  };

  return Volby;

})();
