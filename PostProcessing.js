// Three.js r160 Post-Processing Addons (converted from ESM to global)
(function(){
// === Pass ===

class Pass {

	constructor() {

		this.isPass = true;

		// if set to true, the pass is processed by the composer
		this.enabled = true;

		// if set to true, the pass indicates to swap read and write buffer after rendering
		this.needsSwap = true;

		// if set to true, the pass clears its buffer before rendering
		this.clear = false;

		// if set to true, the result of the pass is rendered to screen. This is set automatically by EffectComposer.
		this.renderToScreen = false;

	}

	setSize( /* width, height */ ) {}

	render( /* renderer, writeBuffer, readBuffer, deltaTime, maskActive */ ) {

		console.error( 'THREE.Pass: .render() must be implemented in derived pass.' );

	}

	dispose() {}

}

// Helper for passes that need to fill the viewport with a single quad.

const _camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );

// https://github.com/mrdoob/three.js/pull/21358

class FullscreenTriangleGeometry extends THREE.BufferGeometry {

	constructor() {

		super();

		this.setAttribute( 'position', new THREE.Float32BufferAttribute( [ - 1, 3, 0, - 1, - 1, 0, 3, - 1, 0 ], 3 ) );
		this.setAttribute( 'uv', new THREE.Float32BufferAttribute( [ 0, 2, 0, 0, 2, 0 ], 2 ) );

	}

}

const _geometry = new FullscreenTriangleGeometry();

class FullScreenQuad {

	constructor( material ) {

		this._mesh = new THREE.Mesh( _geometry, material );

	}

	dispose() {

		this._mesh.geometry.dispose();

	}

	render( renderer ) {

		renderer.render( this._mesh, _camera );

	}

	get material() {

		return this._mesh.material;

	}

	set material( value ) {

		this._mesh.material = value;

	}

}


// === CopyShader ===
/**
 * Full-screen textured quad shader
 */

const CopyShader = {

	name: 'CopyShader',

	uniforms: {

		'tDiffuse': { value: null },
		'opacity': { value: 1.0 }

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`

};


// === LuminosityHighPassShader ===

/**
 * Luminosity
 * http://en.wikipedia.org/wiki/Luminosity
 */

const LuminosityHighPassShader = {

	name: 'LuminosityHighPassShader',

	shaderID: 'luminosityHighPass',

	uniforms: {

		'tDiffuse': { value: null },
		'luminosityThreshold': { value: 1.0 },
		'smoothWidth': { value: 1.0 },
		'defaultColor': { value: new THREE.Color( 0x000000 ) },
		'defaultOpacity': { value: 0.0 }

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );

			float v = dot( texel.xyz, luma );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`

};


// === EffectComposer ===

class EffectComposer {

	constructor( renderer, renderTarget ) {

		this.renderer = renderer;

		this._pixelRatio = renderer.getPixelRatio();

		if ( renderTarget === undefined ) {

			const size = renderer.getSize( new THREE.Vector2() );
			this._width = size.width;
			this._height = size.height;

			renderTarget = new THREE.WebGLRenderTarget( this._width * this._pixelRatio, this._height * this._pixelRatio, { type: THREE.HalfFloatType } );
			renderTarget.texture.name = 'EffectComposer.rt1';

		} else {

			this._width = renderTarget.width;
			this._height = renderTarget.height;

		}

		this.renderTarget1 = renderTarget;
		this.renderTarget2 = renderTarget.clone();
		this.renderTarget2.texture.name = 'EffectComposer.rt2';

		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;

		this.renderToScreen = true;

		this.passes = [];

		this.copyPass = new ShaderPass( CopyShader );
		this.copyPass.material.blending = THREE.NoBlending;

		this.clock = new THREE.Clock();

	}

	swapBuffers() {

		const tmp = this.readBuffer;
		this.readBuffer = this.writeBuffer;
		this.writeBuffer = tmp;

	}

	addPass( pass ) {

		this.passes.push( pass );
		pass.setSize( this._width * this._pixelRatio, this._height * this._pixelRatio );

	}

	insertPass( pass, index ) {

		this.passes.splice( index, 0, pass );
		pass.setSize( this._width * this._pixelRatio, this._height * this._pixelRatio );

	}

	removePass( pass ) {

		const index = this.passes.indexOf( pass );

		if ( index !== - 1 ) {

			this.passes.splice( index, 1 );

		}

	}

	isLastEnabledPass( passIndex ) {

		for ( let i = passIndex + 1; i < this.passes.length; i ++ ) {

			if ( this.passes[ i ].enabled ) {

				return false;

			}

		}

		return true;

	}

	render( deltaTime ) {

		// deltaTime value is in seconds

		if ( deltaTime === undefined ) {

			deltaTime = this.clock.getDelta();

		}

		const currentRenderTarget = this.renderer.getRenderTarget();

		let maskActive = false;

		for ( let i = 0, il = this.passes.length; i < il; i ++ ) {

			const pass = this.passes[ i ];

			if ( pass.enabled === false ) continue;

			pass.renderToScreen = ( this.renderToScreen && this.isLastEnabledPass( i ) );
			pass.render( this.renderer, this.writeBuffer, this.readBuffer, deltaTime, maskActive );

			if ( pass.needsSwap ) {

				if ( maskActive ) {

					const context = this.renderer.getContext();
					const stencil = this.renderer.state.buffers.stencil;

					//context.stencilFunc( context.NOTEQUAL, 1, 0xffffffff );
					stencil.setFunc( context.NOTEQUAL, 1, 0xffffffff );

					this.copyPass.render( this.renderer, this.writeBuffer, this.readBuffer, deltaTime );

					//context.stencilFunc( context.EQUAL, 1, 0xffffffff );
					stencil.setFunc( context.EQUAL, 1, 0xffffffff );

				}

				this.swapBuffers();

			}

			if ( MaskPass !== undefined ) {

				if ( pass instanceof MaskPass ) {

					maskActive = true;

				} else if ( pass instanceof ClearMaskPass ) {

					maskActive = false;

				}

			}

		}

		this.renderer.setRenderTarget( currentRenderTarget );

	}

	reset( renderTarget ) {

		if ( renderTarget === undefined ) {

			const size = this.renderer.getSize( new THREE.Vector2() );
			this._pixelRatio = this.renderer.getPixelRatio();
			this._width = size.width;
			this._height = size.height;

			renderTarget = this.renderTarget1.clone();
			renderTarget.setSize( this._width * this._pixelRatio, this._height * this._pixelRatio );

		}

		this.renderTarget1.dispose();
		this.renderTarget2.dispose();
		this.renderTarget1 = renderTarget;
		this.renderTarget2 = renderTarget.clone();

		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;

	}

	setSize( width, height ) {

		this._width = width;
		this._height = height;

		const effectiveWidth = this._width * this._pixelRatio;
		const effectiveHeight = this._height * this._pixelRatio;

		this.renderTarget1.setSize( effectiveWidth, effectiveHeight );
		this.renderTarget2.setSize( effectiveWidth, effectiveHeight );

		for ( let i = 0; i < this.passes.length; i ++ ) {

			this.passes[ i ].setSize( effectiveWidth, effectiveHeight );

		}

	}

	setPixelRatio( pixelRatio ) {

		this._pixelRatio = pixelRatio;

		this.setSize( this._width, this._height );

	}

	dispose() {

		this.renderTarget1.dispose();
		this.renderTarget2.dispose();

		this.copyPass.dispose();

	}

}


// === RenderPass ===

class RenderPass extends Pass {

	constructor( scene, camera, overrideMaterial = null, clearColor = null, clearAlpha = null ) {

		super();

		this.scene = scene;
		this.camera = camera;

		this.overrideMaterial = overrideMaterial;

		this.clearColor = clearColor;
		this.clearAlpha = clearAlpha;

		this.clear = true;
		this.clearDepth = false;
		this.needsSwap = false;
		this._oldClearColor = new THREE.Color();

	}

	render( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {

		const oldAutoClear = renderer.autoClear;
		renderer.autoClear = false;

		let oldClearAlpha, oldOverrideMaterial;

		if ( this.overrideMaterial !== null ) {

			oldOverrideMaterial = this.scene.overrideMaterial;

			this.scene.overrideMaterial = this.overrideMaterial;

		}

		if ( this.clearColor !== null ) {

			renderer.getClearColor( this._oldClearColor );
			renderer.setClearColor( this.clearColor );

		}

		if ( this.clearAlpha !== null ) {

			oldClearAlpha = renderer.getClearAlpha();
			renderer.setClearAlpha( this.clearAlpha );

		}

		if ( this.clearDepth == true ) {

			renderer.clearDepth();

		}

		renderer.setRenderTarget( this.renderToScreen ? null : readBuffer );

		if ( this.clear === true ) {

			// TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
			renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );

		}

		renderer.render( this.scene, this.camera );

		// restore

		if ( this.clearColor !== null ) {

			renderer.setClearColor( this._oldClearColor );

		}

		if ( this.clearAlpha !== null ) {

			renderer.setClearAlpha( oldClearAlpha );

		}

		if ( this.overrideMaterial !== null ) {

			this.scene.overrideMaterial = oldOverrideMaterial;

		}

		renderer.autoClear = oldAutoClear;

	}

}


// === ShaderPass ===

class ShaderPass extends Pass {

	constructor( shader, textureID ) {

		super();

		this.textureID = ( textureID !== undefined ) ? textureID : 'tDiffuse';

		if ( shader instanceof THREE.ShaderMaterial ) {

			this.uniforms = shader.uniforms;

			this.material = shader;

		} else if ( shader ) {

			this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

			this.material = new THREE.ShaderMaterial( {

				name: ( shader.name !== undefined ) ? shader.name : 'unspecified',
				defines: Object.assign( {}, shader.defines ),
				uniforms: this.uniforms,
				vertexShader: shader.vertexShader,
				fragmentShader: shader.fragmentShader

			} );

		}

		this.fsQuad = new FullScreenQuad( this.material );

	}

	render( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {

		if ( this.uniforms[ this.textureID ] ) {

			this.uniforms[ this.textureID ].value = readBuffer.texture;

		}

		this.fsQuad.material = this.material;

		if ( this.renderToScreen ) {

			renderer.setRenderTarget( null );
			this.fsQuad.render( renderer );

		} else {

			renderer.setRenderTarget( writeBuffer );
			// TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
			if ( this.clear ) renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );
			this.fsQuad.render( renderer );

		}

	}

	dispose() {

		this.material.dispose();

		this.fsQuad.dispose();

	}

}


// === UnrealBloomPass ===

/**
 * UnrealBloomPass is inspired by the bloom pass of Unreal Engine. It creates a
 * mip map chain of bloom textures and blurs them with different radii. Because
 * of the weighted combination of mips, and because larger blurs are done on
 * higher mips, this effect provides good quality and performance.
 *
 * Reference:
 * - https://docs.unrealengine.com/latest/INT/Engine/Rendering/PostProcessEffects/Bloom/
 */
class UnrealBloomPass extends Pass {

	constructor( resolution, strength, radius, threshold ) {

		super();

		this.strength = ( strength !== undefined ) ? strength : 1;
		this.radius = radius;
		this.threshold = threshold;
		this.resolution = ( resolution !== undefined ) ? new THREE.Vector2( resolution.x, resolution.y ) : new THREE.Vector2( 256, 256 );

		// create color only once here, reuse it later inside the render function
		this.clearColor = new THREE.Color( 0, 0, 0 );

		// render targets
		this.renderTargetsHorizontal = [];
		this.renderTargetsVertical = [];
		this.nMips = 5;
		let resx = Math.round( this.resolution.x / 2 );
		let resy = Math.round( this.resolution.y / 2 );

		this.renderTargetBright = new THREE.WebGLRenderTarget( resx, resy, { type: THREE.HalfFloatType } );
		this.renderTargetBright.texture.name = 'UnrealBloomPass.bright';
		this.renderTargetBright.texture.generateMipmaps = false;

		for ( let i = 0; i < this.nMips; i ++ ) {

			const renderTargetHorizonal = new THREE.WebGLRenderTarget( resx, resy, { type: THREE.HalfFloatType } );

			renderTargetHorizonal.texture.name = 'UnrealBloomPass.h' + i;
			renderTargetHorizonal.texture.generateMipmaps = false;

			this.renderTargetsHorizontal.push( renderTargetHorizonal );

			const renderTargetVertical = new THREE.WebGLRenderTarget( resx, resy, { type: THREE.HalfFloatType } );

			renderTargetVertical.texture.name = 'UnrealBloomPass.v' + i;
			renderTargetVertical.texture.generateMipmaps = false;

			this.renderTargetsVertical.push( renderTargetVertical );

			resx = Math.round( resx / 2 );

			resy = Math.round( resy / 2 );

		}

		// luminosity high pass material

		const highPassShader = LuminosityHighPassShader;
		this.highPassUniforms = THREE.UniformsUtils.clone( highPassShader.uniforms );

		this.highPassUniforms[ 'luminosityThreshold' ].value = threshold;
		this.highPassUniforms[ 'smoothWidth' ].value = 0.01;

		this.materialHighPassFilter = new THREE.ShaderMaterial( {
			uniforms: this.highPassUniforms,
			vertexShader: highPassShader.vertexShader,
			fragmentShader: highPassShader.fragmentShader
		} );

		// gaussian blur materials

		this.separableBlurMaterials = [];
		const kernelSizeArray = [ 3, 5, 7, 9, 11 ];
		resx = Math.round( this.resolution.x / 2 );
		resy = Math.round( this.resolution.y / 2 );

		for ( let i = 0; i < this.nMips; i ++ ) {

			this.separableBlurMaterials.push( this.getSeperableBlurMaterial( kernelSizeArray[ i ] ) );

			this.separableBlurMaterials[ i ].uniforms[ 'invSize' ].value = new THREE.Vector2( 1 / resx, 1 / resy );

			resx = Math.round( resx / 2 );

			resy = Math.round( resy / 2 );

		}

		// composite material

		this.compositeMaterial = this.getCompositeMaterial( this.nMips );
		this.compositeMaterial.uniforms[ 'blurTexture1' ].value = this.renderTargetsVertical[ 0 ].texture;
		this.compositeMaterial.uniforms[ 'blurTexture2' ].value = this.renderTargetsVertical[ 1 ].texture;
		this.compositeMaterial.uniforms[ 'blurTexture3' ].value = this.renderTargetsVertical[ 2 ].texture;
		this.compositeMaterial.uniforms[ 'blurTexture4' ].value = this.renderTargetsVertical[ 3 ].texture;
		this.compositeMaterial.uniforms[ 'blurTexture5' ].value = this.renderTargetsVertical[ 4 ].texture;
		this.compositeMaterial.uniforms[ 'bloomStrength' ].value = strength;
		this.compositeMaterial.uniforms[ 'bloomRadius' ].value = 0.1;

		const bloomFactors = [ 1.0, 0.8, 0.6, 0.4, 0.2 ];
		this.compositeMaterial.uniforms[ 'bloomFactors' ].value = bloomFactors;
		this.bloomTintColors = [ new THREE.Vector3( 1, 1, 1 ), new THREE.Vector3( 1, 1, 1 ), new THREE.Vector3( 1, 1, 1 ), new THREE.Vector3( 1, 1, 1 ), new THREE.Vector3( 1, 1, 1 ) ];
		this.compositeMaterial.uniforms[ 'bloomTintColors' ].value = this.bloomTintColors;

		// blend material

		const copyShader = CopyShader;

		this.copyUniforms = THREE.UniformsUtils.clone( copyShader.uniforms );

		this.blendMaterial = new THREE.ShaderMaterial( {
			uniforms: this.copyUniforms,
			vertexShader: copyShader.vertexShader,
			fragmentShader: copyShader.fragmentShader,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			depthWrite: false,
			transparent: true
		} );

		this.enabled = true;
		this.needsSwap = false;

		this._oldClearColor = new THREE.Color();
		this.oldClearAlpha = 1;

		this.basic = new THREE.MeshBasicMaterial();

		this.fsQuad = new FullScreenQuad( null );

	}

	dispose() {

		for ( let i = 0; i < this.renderTargetsHorizontal.length; i ++ ) {

			this.renderTargetsHorizontal[ i ].dispose();

		}

		for ( let i = 0; i < this.renderTargetsVertical.length; i ++ ) {

			this.renderTargetsVertical[ i ].dispose();

		}

		this.renderTargetBright.dispose();

		//

		for ( let i = 0; i < this.separableBlurMaterials.length; i ++ ) {

			this.separableBlurMaterials[ i ].dispose();

		}

		this.compositeMaterial.dispose();
		this.blendMaterial.dispose();
		this.basic.dispose();

		//

		this.fsQuad.dispose();

	}

	setSize( width, height ) {

		let resx = Math.round( width / 2 );
		let resy = Math.round( height / 2 );

		this.renderTargetBright.setSize( resx, resy );

		for ( let i = 0; i < this.nMips; i ++ ) {

			this.renderTargetsHorizontal[ i ].setSize( resx, resy );
			this.renderTargetsVertical[ i ].setSize( resx, resy );

			this.separableBlurMaterials[ i ].uniforms[ 'invSize' ].value = new THREE.Vector2( 1 / resx, 1 / resy );

			resx = Math.round( resx / 2 );
			resy = Math.round( resy / 2 );

		}

	}

	render( renderer, writeBuffer, readBuffer, deltaTime, maskActive ) {

		renderer.getClearColor( this._oldClearColor );
		this.oldClearAlpha = renderer.getClearAlpha();
		const oldAutoClear = renderer.autoClear;
		renderer.autoClear = false;

		renderer.setClearColor( this.clearColor, 0 );

		if ( maskActive ) renderer.state.buffers.stencil.setTest( false );

		// Render input to screen

		if ( this.renderToScreen ) {

			this.fsQuad.material = this.basic;
			this.basic.map = readBuffer.texture;

			renderer.setRenderTarget( null );
			renderer.clear();
			this.fsQuad.render( renderer );

		}

		// 1. Extract Bright Areas

		this.highPassUniforms[ 'tDiffuse' ].value = readBuffer.texture;
		this.highPassUniforms[ 'luminosityThreshold' ].value = this.threshold;
		this.fsQuad.material = this.materialHighPassFilter;

		renderer.setRenderTarget( this.renderTargetBright );
		renderer.clear();
		this.fsQuad.render( renderer );

		// 2. Blur All the mips progressively

		let inputRenderTarget = this.renderTargetBright;

		for ( let i = 0; i < this.nMips; i ++ ) {

			this.fsQuad.material = this.separableBlurMaterials[ i ];

			this.separableBlurMaterials[ i ].uniforms[ 'colorTexture' ].value = inputRenderTarget.texture;
			this.separableBlurMaterials[ i ].uniforms[ 'direction' ].value = UnrealBloomPass.BlurDirectionX;
			renderer.setRenderTarget( this.renderTargetsHorizontal[ i ] );
			renderer.clear();
			this.fsQuad.render( renderer );

			this.separableBlurMaterials[ i ].uniforms[ 'colorTexture' ].value = this.renderTargetsHorizontal[ i ].texture;
			this.separableBlurMaterials[ i ].uniforms[ 'direction' ].value = UnrealBloomPass.BlurDirectionY;
			renderer.setRenderTarget( this.renderTargetsVertical[ i ] );
			renderer.clear();
			this.fsQuad.render( renderer );

			inputRenderTarget = this.renderTargetsVertical[ i ];

		}

		// Composite All the mips

		this.fsQuad.material = this.compositeMaterial;
		this.compositeMaterial.uniforms[ 'bloomStrength' ].value = this.strength;
		this.compositeMaterial.uniforms[ 'bloomRadius' ].value = this.radius;
		this.compositeMaterial.uniforms[ 'bloomTintColors' ].value = this.bloomTintColors;

		renderer.setRenderTarget( this.renderTargetsHorizontal[ 0 ] );
		renderer.clear();
		this.fsQuad.render( renderer );

		// Blend it additively over the input texture

		this.fsQuad.material = this.blendMaterial;
		this.copyUniforms[ 'tDiffuse' ].value = this.renderTargetsHorizontal[ 0 ].texture;

		if ( maskActive ) renderer.state.buffers.stencil.setTest( true );

		if ( this.renderToScreen ) {

			renderer.setRenderTarget( null );
			this.fsQuad.render( renderer );

		} else {

			renderer.setRenderTarget( readBuffer );
			this.fsQuad.render( renderer );

		}

		// Restore renderer settings

		renderer.setClearColor( this._oldClearColor, this.oldClearAlpha );
		renderer.autoClear = oldAutoClear;

	}

	getSeperableBlurMaterial( kernelRadius ) {

		const coefficients = [];

		for ( let i = 0; i < kernelRadius; i ++ ) {

			coefficients.push( 0.39894 * Math.exp( - 0.5 * i * i / ( kernelRadius * kernelRadius ) ) / kernelRadius );

		}

		return new THREE.ShaderMaterial( {

			defines: {
				'KERNEL_RADIUS': kernelRadius
			},

			uniforms: {
				'colorTexture': { value: null },
				'invSize': { value: new THREE.Vector2( 0.5, 0.5 ) }, // inverse texture size
				'direction': { value: new THREE.Vector2( 0.5, 0.5 ) },
				'gaussianCoefficients': { value: coefficients } // precomputed Gaussian coefficients
			},

			vertexShader:
				`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,

			fragmentShader:
				`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`
		} );

	}

	getCompositeMaterial( nMips ) {

		return new THREE.ShaderMaterial( {

			defines: {
				'NUM_MIPS': nMips
			},

			uniforms: {
				'blurTexture1': { value: null },
				'blurTexture2': { value: null },
				'blurTexture3': { value: null },
				'blurTexture4': { value: null },
				'blurTexture5': { value: null },
				'bloomStrength': { value: 1.0 },
				'bloomFactors': { value: null },
				'bloomTintColors': { value: null },
				'bloomRadius': { value: 0.0 }
			},

			vertexShader:
				`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,

			fragmentShader:
				`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`
		} );

	}

}

UnrealBloomPass.BlurDirectionX = new THREE.Vector2( 1.0, 0.0 );
UnrealBloomPass.BlurDirectionY = new THREE.Vector2( 0.0, 1.0 );



// Assign to THREE namespace
THREE.Pass = Pass;
THREE.FullScreenQuad = FullScreenQuad;
THREE.CopyShader = CopyShader;
THREE.LuminosityHighPassShader = LuminosityHighPassShader;
THREE.EffectComposer = EffectComposer;
THREE.RenderPass = RenderPass;
THREE.ShaderPass = ShaderPass;
THREE.UnrealBloomPass = UnrealBloomPass;


// === FXAAShader ===
const FXAAShader = {
	uniforms: {
		'tDiffuse': { value: null },
		'resolution': { value: new THREE.Vector2( 1 / 1024, 1 / 512 ) }
	},
	vertexShader: /* glsl */`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,
	fragmentShader: /* glsl */`
		precision highp float;
		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		varying vec2 vUv;

		#define FXAA_REDUCE_MIN (1.0/128.0)
		#define FXAA_REDUCE_MUL (1.0/8.0)
		#define FXAA_SPAN_MAX 8.0

		void main() {
			vec2 res = resolution;
			vec3 rgbNW = texture2D(tDiffuse, vUv + vec2(-1.0, -1.0) * res).xyz;
			vec3 rgbNE = texture2D(tDiffuse, vUv + vec2(1.0, -1.0) * res).xyz;
			vec3 rgbSW = texture2D(tDiffuse, vUv + vec2(-1.0, 1.0) * res).xyz;
			vec3 rgbSE = texture2D(tDiffuse, vUv + vec2(1.0, 1.0) * res).xyz;
			vec3 rgbM  = texture2D(tDiffuse, vUv).xyz;

			vec3 luma = vec3(0.299, 0.587, 0.114);
			float lumaNW = dot(rgbNW, luma);
			float lumaNE = dot(rgbNE, luma);
			float lumaSW = dot(rgbSW, luma);
			float lumaSE = dot(rgbSE, luma);
			float lumaM  = dot(rgbM,  luma);

			float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
			float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));

			vec2 dir;
			dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
			dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));

			float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);
			float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);
			dir = min(vec2(FXAA_SPAN_MAX), max(vec2(-FXAA_SPAN_MAX), dir * rcpDirMin)) * res;

			vec3 rgbA = 0.5 * (
				texture2D(tDiffuse, vUv + dir * (1.0/3.0 - 0.5)).xyz +
				texture2D(tDiffuse, vUv + dir * (2.0/3.0 - 0.5)).xyz);
			vec3 rgbB = rgbA * 0.5 + 0.25 * (
				texture2D(tDiffuse, vUv + dir * -0.5).xyz +
				texture2D(tDiffuse, vUv + dir *  0.5).xyz);

			float lumaB = dot(rgbB, luma);
			if (lumaB < lumaMin || lumaB > lumaMax) {
				gl_FragColor = vec4(rgbA, 1.0);
			} else {
				gl_FragColor = vec4(rgbB, 1.0);
			}
		}`
};

// === ColorGradingShader ===
const ColorGradingShader = {
	uniforms: {
		'tDiffuse': { value: null },
		'brightness': { value: 0.0 },
		'contrast': { value: 1.05 },
		'saturation': { value: 1.15 },
		'vignetteAmount': { value: 0.3 },
		'vignetteFalloff': { value: 0.5 }
	},
	vertexShader: /* glsl */`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,
	fragmentShader: /* glsl */`
		precision highp float;
		uniform sampler2D tDiffuse;
		uniform float brightness;
		uniform float contrast;
		uniform float saturation;
		uniform float vignetteAmount;
		uniform float vignetteFalloff;
		varying vec2 vUv;

		void main() {
			vec4 color = texture2D(tDiffuse, vUv);
			// Brightness
			color.rgb += brightness;
			// Contrast
			color.rgb = (color.rgb - 0.5) * contrast + 0.5;
			// Saturation
			float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));
			color.rgb = mix(vec3(luminance), color.rgb, saturation);
			// Vignette
			vec2 uv = vUv * 2.0 - 1.0;
			float vig = 1.0 - dot(uv * vignetteAmount, uv * vignetteAmount);
			vig = clamp(pow(vig, vignetteFalloff), 0.0, 1.0);
			color.rgb *= vig;
			gl_FragColor = color;
		}`
};

THREE.FXAAShader = FXAAShader;
THREE.ColorGradingShader = ColorGradingShader;



// === Simple SSAO (Screen-Space Ambient Occlusion) ===
const SimpleSSAOShader = {
	uniforms: {
		'tDiffuse': { value: null },
		'tDepth': { value: null },
		'resolution': { value: new THREE.Vector2(1/1024, 1/512) },
		'cameraNear': { value: 0.5 },
		'cameraFar': { value: 700 },
		'aoStrength': { value: 0.5 },
		'aoRadius': { value: 0.15 }
	},
	vertexShader: /* glsl */`
		varying vec2 vUv;
		void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
	fragmentShader: /* glsl */`
		precision highp float;
		uniform sampler2D tDiffuse;
		uniform sampler2D tDepth;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform float aoStrength;
		uniform float aoRadius;
		varying vec2 vUv;

		float getDepth(vec2 uv) {
			float d = texture2D(tDepth, uv).x;
			return cameraNear * cameraFar / (cameraFar - d * (cameraFar - cameraNear));
		}

		void main() {
			vec4 color = texture2D(tDiffuse, vUv);
			float depth = getDepth(vUv);
			if(depth > cameraFar * 0.95) { gl_FragColor = color; return; }

			float ao = 0.0;
			float radius = aoRadius / depth;
			const int SAMPLES = 8;
			float angles[8];
			angles[0]=0.0;angles[1]=0.785;angles[2]=1.571;angles[3]=2.356;
			angles[4]=3.142;angles[5]=3.927;angles[6]=4.712;angles[7]=5.498;

			for(int i = 0; i < SAMPLES; i++) {
				float angle = angles[i];
				vec2 offset = vec2(cos(angle), sin(angle)) * radius;
				float sampleDepth = getDepth(vUv + offset);
				float diff = depth - sampleDepth;
				if(diff > 0.01 && diff < 1.0) ao += 1.0;
			}
			ao = 1.0 - (ao / float(SAMPLES)) * aoStrength;
			ao = clamp(ao, 0.0, 1.0);
			gl_FragColor = vec4(color.rgb * ao, color.a);
		}`
};

// === ChromaticAberrationShader ===
const ChromaticAberrationShader = {
	uniforms: {
		'tDiffuse': { value: null },
		'intensity': { value: 0.003 },
		'direction': { value: new THREE.Vector2(1.0, 0.0) }
	},
	vertexShader: /* glsl */`
		varying vec2 vUv;
		void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
	fragmentShader: /* glsl */`
		precision highp float;
		uniform sampler2D tDiffuse;
		uniform float intensity;
		uniform vec2 direction;
		varying vec2 vUv;
		void main() {
			vec2 offset = direction * intensity;
			vec2 uv = vUv;
			// Distance from center increases effect
			vec2 fromCenter = uv - 0.5;
			float dist = length(fromCenter);
			offset *= dist * 2.0;
			float r = texture2D(tDiffuse, uv + offset).r;
			float g = texture2D(tDiffuse, uv).g;
			float b = texture2D(tDiffuse, uv - offset).b;
			gl_FragColor = vec4(r, g, b, 1.0);
		}`
};

THREE.SimpleSSAOShader = SimpleSSAOShader;
THREE.ChromaticAberrationShader = ChromaticAberrationShader;



// === FilmGrainShader ===
const FilmGrainShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'time': { value: 0.0 },
        'intensity': { value: 0.06 }
    },
    vertexShader: /* glsl */`
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */`
        precision highp float;
        uniform sampler2D tDiffuse;
        uniform float time;
        uniform float intensity;
        varying vec2 vUv;
        float rand(vec2 co) { return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453); }
        void main() {
            vec4 color = texture2D(tDiffuse, vUv);
            float grain = rand(vUv + fract(time)) * 2.0 - 1.0;
            color.rgb += grain * intensity;
            gl_FragColor = color;
        }`
};
THREE.FilmGrainShader = FilmGrainShader;

})();
