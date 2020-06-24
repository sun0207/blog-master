const m3D = function () {

	/* ---- private vars ---- */

	var diapo = [],
		
		// imb,

		scr,

		bar,

		selected,

		urlInfo,

		imagesPath = "",

		camera = {x:0, y:0, z:-650, s:0, fov: 500},

		nw = 0,

		nh = 0,
		
		timer = null;

	/* ==== camera tween methods ==== */

	camera.setTarget = function (c0, t1, p) {

		if (Math.abs(t1 - c0) > .1) {

			camera.s = 1;

			camera.p = 0;

			camera.d = t1 - c0;

			if (p) {

				camera.d *= 2;

				camera.p = 9;

			}

		}

	}

	camera.tween = function (v) {

		if (camera.s !== 0) {

			camera.p += camera.s;

			camera[v] += camera.d * camera.p * .01;

			if (camera.p === 10) camera.s = -1;

			else if (camera.p === 0) camera.s = 0;

		}

		return camera.s;

	}

	/* ==== diapo constructor ==== */

	var Diapo = function (n, img, x, y, z) {

		if (img) {

			this.url = img.url;

			this.title = img.title;

			this.color = img.color;

			this.isLoaded = false;

			if (document.createElement("canvas").getContext) {

				/* ---- using canvas in place of images (performance trick) ---- */

				this.srcImg = new Image();

				this.srcImg.src = imagesPath + img.photo_url;

				this.img = document.createElement("canvas");

				this.canvas = true;

				scr.appendChild(this.img);

			} else {

				/* ---- normal image ---- */

				this.img = document.createElement('img');

				this.img.src = imagesPath + img.photo_url;

				scr.appendChild(this.img);

			}

			/* ---- on click event ---- */

			this.img.onclick = function () {

				if (camera.s) return;

				if (this.diapo.isLoaded) {

					if (this.diapo.urlActive) {

						/* ---- jump hyperlink ---- */

						window.open(this.diapo.url);
						// window.location.href = this.diapo.url;

					} else {

						/* ---- target positions ---- */

						camera.tz = this.diapo.z - camera.fov;

						camera.tx = this.diapo.x;

						camera.ty = this.diapo.y;

						/* ---- disable previously selected img ---- */

						if (selected) {

							selected.but.className = "button viewed";

							selected.img.className = "";

							selected.img.style.cursor = "pointer";

							selected.urlActive = false;

							urlInfo.style.visibility = "hidden";

						}

						/* ---- select current img ---- */

						this.diapo.but.className = "button selected";

						interpolation(false);

						selected = this.diapo;

					}

				}

			}

			/* ---- command bar buttons ---- */

			this.but = document.createElement('div');

			this.but.className = "button";

			bar.appendChild(this.but);

			this.but.diapo = this;

			this.but.style.left = Math.round((this.but.offsetWidth  * 1.2) * (n % 4)) + 'px';

			this.but.style.top  = Math.round((this.but.offsetHeight * 1.2) * Math.floor(n / 4)) + 'px';

			this.but.onclick = this.img.onclick;

			// imb = this.img;

			this.img.diapo = this;

			this.zi = 25000;

		} else {

			/* ---- transparent div ---- */

			this.img = document.createElement('div');

			this.isLoaded = true;

			this.img.className = "fog";

			scr.appendChild(this.img);

			this.w = 300;

			this.h = 300;

			this.zi = 15000;

		}

		/* ---- object variables ---- */

		this.x = x;

		this.y = y;

		this.z = z;

		this.css = this.img.style;

	}

	/* ==== main 3D animation ==== */

	Diapo.prototype.anim = function () {

		if (this.isLoaded) {

			/* ---- 3D to 2D projection ---- */

			var x = this.x - camera.x;

			var y = this.y - camera.y;

			var z = this.z - camera.z;

			if (z < 20) z += 5000;

			var p = camera.fov / z;

			var w = this.w * p;

			var h = this.h * p;

			/* ---- HTML rendering ---- */

			this.css.left   = Math.round(nw + x * p - w * .5) + 'px';

			this.css.top    = Math.round(nh + y * p - h * .5) + 'px';  

			this.css.width  = Math.round(w) + 'px';

			this.css.height = Math.round(h) + 'px';

			this.css.zIndex = this.zi - Math.round(z);

		} else {

			/* ---- image is loaded? ---- */

			this.isLoaded = this.loading();

		}

	}

	/* ==== onload initialization ==== */

	Diapo.prototype.loading = function () {

		if ((this.canvas && this.srcImg.complete) || this.img.complete) {

			if (this.canvas) {
				/* ---- canvas version ---- */
                let ratio  =this.srcImg.width / this.srcImg.height ;
                
				this.h = this.srcImg.height>600?600:this.srcImg.height;

				this.w = this.h * ratio>1000?1000:this.h * ratio;

				this.img.width = this.w;

				this.img.height = this.h;
				
				var context = this.img.getContext("2d");

				context.drawImage(this.srcImg, 0, 0, this.w, this.h);

			} else {

				/* ---- plain image version ---- */

				this.w = this.img.width;

				this.h = this.img.height;

			}

			/* ---- button loaded ---- */

			this.but.className += " loaded";

			return true;

		}

		return false;

	}

	////////////////////////////////////////////////////////////////////////////

	/* ==== screen dimensions ==== */

	var resize = function (scr) {
		nw = scr.offsetWidth * .5;

		nh = scr.offsetHeight * .5;

	}

	/* ==== disable interpolation during animation ==== */

	var interpolation = function (bicubic) {

		var i = 0, o;

		while( o = diapo[i++] ) {

			if (o.but) {

				o.css.msInterpolationMode = bicubic ? 'bicubic' : 'nearest-neighbor'; // makes IE8 happy

				o.css.imageRendering = bicubic ? 'optimizeQuality' : 'optimizeSpeed'; // does not really work...

			}

		}

	}

	/* ==== init script ==== */

	var init = function (_scr,_bar,_urlInfo,data) {

		/* ---- containers ---- */
		scr = _scr;
		bar = _bar;

		urlInfo = _urlInfo;

		resize(scr);

		/* ---- loading images ---- */

		var i = 0, 

		    o,

			n = data.length;

		while( o = data[i++] ) {

			/* ---- images ---- */

			var x = 1000 * ((i % 4) - 1.5);

			var y = Math.round(Math.random() * 4000) - 2000;

			var z = i * (5000 / n);

			diapo.push( new Diapo(i - 1, o, x, y, z));

			/* ---- transparent frames ---- */

			var k = diapo.length - 1;

			for (var j = 0; j < 3; j++) {

				var x2 = Math.round(Math.random() * 4000) - 2000;

				var y2 = Math.round(Math.random() * 4000) - 2000;

				diapo.push( new Diapo(k, null, x2, y2, z + 100));

			}

		}

		/* ---- start engine ---- */

		run();

	}

	var destroy = function(_scr,_bar,callback){
		var elements = document.getElementsByClassName('fog');
		var elementsCanvas = document.getElementsByTagName('canvas');
		for(var i = elements.length - 1; i >= 0; i--) { 
			elements[i].parentNode.removeChild(elements[i]); 
		}
		for(var k = elementsCanvas.length - 1; k >= 0; k--) { 
			elementsCanvas[k].parentNode.removeChild(elementsCanvas[k]); 
		}
		var elementsBars = document.getElementsByClassName('button');
		for(var j = elementsBars.length - 1; j >= 0; j--) { 
			elementsBars[j].parentNode.removeChild(elementsBars[j]); 
		}
		callback();
	}

	////////////////////////////////////////////////////////////////////////////

	/* ==== main loop ==== */

	var run = function () {

		clearTimeout(timer);
		/* ---- x axis move ---- */

		if (camera.tx) {

			if (!camera.s) camera.setTarget(camera.x, camera.tx);

			var m = camera.tween('x');

			if (!m) camera.tx = 0;

		/* ---- y axis move ---- */

		} else if (camera.ty) {

			if (!camera.s) camera.setTarget(camera.y, camera.ty); 

			var m2 = camera.tween('y');

			if (!m2) camera.ty = 0;

		/* ---- z axis move ---- */

		} else if (camera.tz) {

			if (!camera.s) camera.setTarget(camera.z, camera.tz);

			var m3 = camera.tween('z');

			if (!m3) {

				/* ---- animation end ---- */

				camera.tz = 0;

				interpolation(true);

				/* ---- activate hyperlink ---- */

				if (selected.url) {

					selected.img.style.cursor = "pointer";

					selected.urlActive = true;

					selected.img.className = "href";

					urlInfo.diapo = selected;

					urlInfo.onclick = selected.img.onclick;

					urlInfo.innerHTML = selected.title || selected.url;

					urlInfo.style.visibility = "visible";

					urlInfo.style.color = selected.color || "#fff";

					urlInfo.style.top = Math.round(selected.img.offsetTop + selected.img.offsetHeight - urlInfo.offsetHeight - 5) + "px";

					urlInfo.style.left = Math.round(selected.img.offsetLeft + selected.img.offsetWidth - urlInfo.offsetWidth - 5) + "px";

				} else {

					selected.img.style.cursor = "default";

				}

			}

		}

		/* ---- anim images ---- */

		var i = 0, o;

		while( o = diapo[i++] ) {
			o.anim()
		};

		/* ---- loop ---- */

        timer = setTimeout(run, 32);
        // requestAnimationFrame(run);

	}

	return {

		/* ==== initialize script ==== */

		init : init,

		destroy: destroy
	}

}()
export default m3D;