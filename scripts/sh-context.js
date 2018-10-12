	var scene;
	var camera;
	var renderer;
	var paused = false;

	var shaderCode;
	var w = 800;
	var h = 600;
	var rdr;
	var f;
	var t0;
	var codeNode = document.createTextNode("");
	document.getElementById('sh-code').appendChild(codeNode);
	document.getElementById("sh-btn-load").addEventListener('click', reload); 	
	document.getElementById("sh-btn-pause").addEventListener('click', function() {
	    paused = !paused;
	    this.textContent = paused ? "Run" : "Pause";  
	    render(); 
	}); 	
	// ============================================================
	function handleFileSelect(e) {
      f = e.target.files[0];
      rdr = new FileReader();
      rdr.readAsText(f);
      // test when read
      rdr.onloadend = function(e) {
	      if (e.target.readyState == FileReader.DONE) {
	      	shaderCode = rdr.result;
	      	codeNode.textContent = shaderCode;
	      	reset();
	      	render();
	      }
  	  }
    }
    // ============================================================
		
	function scene_setup(){
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( 75, w / h, 0.1, 1000 );
	}

	document.getElementById('sh-code-input').addEventListener('change', handleFileSelect, false);
     
	var renderer = new THREE.WebGLRenderer( { canvas: shcanv } );
		renderer.setSize(w, h);		
	scene_setup();
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00} );//We make it green
	
	var uniforms = {};
	uniforms.iResolution = {type:'v2',value:new THREE.Vector2(500, 400)};
	uniforms.iTime = {type:'f',value:0.0};
	reset();
	render();

function reset() {
	t0 = Date.now();
	var material = new THREE.ShaderMaterial({uniforms:uniforms,fragmentShader:shaderCode})
	var geometry = new THREE.PlaneGeometry( 10, 10 );
	var sprite = new THREE.Mesh( geometry,material );
	scene.add( sprite );
	sprite.position.z = -1;
}

function render() {
	if (!paused) {
		uniforms.iTime.value = 0.001 * (Date.now() - t0);
		uniforms.iResolution.value.x = w;
		uniforms.iResolution.value.y = h;      		
		requestAnimationFrame( render );
		renderer.render( scene, camera );
	}
}

function reload() {
	shaderCode = codeNode.textContent;
	reset();
	render();
}