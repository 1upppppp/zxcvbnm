(function (){
  "use strict";
  var textSize = 10;
  var glitcher = {

    init: function () {
      setTimeout((function () {
        this.canvas = document.getElementById('stage');
        this.context = this.canvas.getContext('2d');

        this.initOptions();
        this.resize();
        this.tick();
      }).bind(this), 100);
    },

    initOptions: function () {
      this.width = document.documentElement.offsetWidth;
      this.height = document.documentElement.offsetHeight;

      this.textSize = Math.floor(this.width / 4);

      if (this.textSize > this.height) {
        this.textSize = Math.floor(this.height/1.5); }

        this.font = '100 ' + this.textSize + 'px "1UP"';
        this.context.font = this.font;
        this.text = 'A';
        this.textWidth = (this.context.measureText(this.text)).width;

        this.fps = 60;

      this.channel = 0; // 0 = red, 1 = green, 2 = blue
      this.compOp = 'lighter'; // CompositeOperation = lighter || darker || xor
      this.phase = 0.0;
      this.phaseStep = 0.9; //determines how often we will change channel and amplitude
      this.amplitude = 0.0;
      this.amplitudeBase = 4.0;
      this.amplitudeRange = 4.0;
      this.alphaMin = 0.9;
      this.glitchAmplitude = 5.0;
      this.glitchThreshold = 0.90;
      this.scanlineBase = 40;
      this.scanlineRange = 40;
      this.scanlineShift = 15;
    },

    tick: function () {
      setTimeout((function () {
        this.phase += this.phaseStep;

        if (this.phase > 1) {
          this.phase = 0.0;
          this.channel = (this.channel === 2) ? 0 : this.channel + 1;
          this.amplitude = this.amplitudeBase + (this.amplitudeRange * Math.random());
        }

        this.render();
        this.tick();

      }).bind(this), 1000 / this.fps);
    },

    render: function () {
      var x0 = this.amplitude * Math.sin((Math.PI * 2) * this.phase) >> 0,
      x1, x2, x3;

      if (Math.random() >= this.glitchThreshold) {
        x0 *= this.glitchAmplitude;
      }

      x1 = this.width - this.textWidth >> 1;
      x2 = x1 + x0;
      x3 = x1 - x0;

      this.context.clearRect(0, 0, this.width, this.height);
      this.context.globalAlpha = this.alphaMin + ((1 - this.alphaMin) * Math.random());

      switch (this.channel) {
        case 0:
        this.renderChannels(x1, x2, x3);
        break;
        case 1:
        this.renderChannels(x2, x3, x1);
        break;
        case 2:
        this.renderChannels(x3, x1, x2);
        break;
      }
      this.renderScanline();
      if (Math.floor(Math.random() * 2) > 1) {
        this.renderScanline();
          // renders a second scanline 50% of the time
        }
      },

      renderChannels: function (x1, x2, x3) {
        var red = "rgb(255, 0, 66)";
        var orange = "rgb(255, 123, 0)";
        var pink = "rgb(251, 0, 255)";
        var cyane = "rgb(0, 255, 187)";
        const channelYPos = (this.height / 2) + (this.textSize / 2);
        this.context.font = this.font;
        this.context.fillStyle = cyane;
        this.context.fillText(this.text, x1 - (this.width*0.035), channelYPos);
        this.context.globalCompositeOperation = this.compOp;
        this.context.fillStyle = red;
        this.context.fillText(this.text, x2 - (this.width*0.035), channelYPos);
        this.context.fillStyle = pink;
        this.context.fillText(this.text, x3 - (this.width*0.035), channelYPos);
      },

      renderScanline: function () {
        var y = this.height * Math.random() >> 0,
        o = this.context.getImageData(0, y, this.width, 1),
        d = o.data,
        i = d.length,
        s = this.scanlineBase + this.scanlineRange * Math.random() >> 0,
        x = -this.scanlineShift + this.scanlineShift * 2 * Math.random() >> 0;

        while (i-- > 0) {
          d[i] += s;
        }

        this.context.putImageData(o, x, y);
      },

      resize: function () {
        this.width = document.documentElement.offsetWidth;
        this.height = window.innerHeight;
            // this.height = document.documentElement.offsetHeight;
            if (this.canvas) {
              this.canvas.height = this.height;
              document.documentElement.offsetHeight;
              this.canvas.width = this.width;
              document.documentElement.offsetWidth;
              this.textSize = Math.floor(this.canvas.width / 4);
        // RE-sets text size based on window size
        if (this.textSize > this.height) {
          this.textSize = Math.floor(this.canvas.height/1.5);
        }
          // tries to make text fit if window is very wide, but not very tall
          this.font = '100 ' + this.textSize + 'px "1UP"';
          this.context.font = this.font;
        }
      }
    };

    document.onload = glitcher.init();
    window.onresize = glitcher.resize();
  // return;
 // executes anonymous function onload
})();