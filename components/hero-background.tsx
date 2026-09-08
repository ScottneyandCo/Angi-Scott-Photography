'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

/**
 * Renders the hero photograph and, when WebGL + motion are available, overlays a
 * canvas that ripples ONLY the flowing red fabric. The fabric is isolated from the
 * flattened image by color (saturated red), so the dancer's face, skin, leotard,
 * floor, and background stay perfectly still. Displacement is a smooth flow field
 * whose phase advances with scroll (and drifts on its own when idle), giving the
 * cloth an elegant, cinematic breathing motion instead of translating the picture.
 */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  // Flip Y so vUv (0,0) is the top-left of the image.
  vUv = vec2(aPos.x * 0.5 + 0.5, 1.0 - (aPos.y * 0.5 + 0.5));
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;

varying vec2 vUv;

uniform sampler2D uTex;
uniform float uCanvasAspect;
uniform float uImageAspect;
uniform vec2  uFocus;
uniform float uTime;
uniform float uScroll;
uniform float uAmp;

// object-fit: cover mapping with a focal point.
vec2 coverUv(vec2 uv) {
  vec2 s = vec2(1.0);
  if (uCanvasAspect > uImageAspect) {
    s = vec2(1.0, uImageAspect / uCanvasAspect);
  } else {
    s = vec2(uCanvasAspect / uImageAspect, 1.0);
  }
  vec2 offset = (1.0 - s) * vec2(uFocus.x, uFocus.y);
  return uv * s + offset;
}

// Layered flow field. Different frequencies make different parts of the cloth
// travel at slightly different speeds, which reads as natural fabric motion.
vec2 flow(vec2 p, float t) {
  vec2 d = vec2(0.0);
  d.x += sin(p.y *  6.0 + t * 1.05) * 0.60;
  d.x += sin(p.y * 15.0 - t * 0.73 + p.x * 4.0) * 0.28;
  d.x += sin(p.x *  9.0 + p.y * 5.0 + t * 0.5) * 0.18;
  d.y += cos(p.x *  8.0 + t * 0.9) * 0.42;
  d.y += cos(p.y * 13.0 + t * 1.31 + p.x * 3.0) * 0.20;
  return d;
}

void main() {
  vec2 cuv = coverUv(vUv);
  vec4 base = texture2D(uTex, cuv);

  // Isolate ONLY the saturated red dress. Skin is also reddish, so the red
  // channel must dominate BOTH other channels strongly, green must be low
  // (skin has high green, red cloth does not), and the pixel must be vivid.
  float maxC = max(base.r, max(base.g, base.b));
  float minC = min(base.r, min(base.g, base.b));
  float sat = (maxC - minC) / max(maxC, 0.001);      // HSV saturation
  float redDom = base.r - max(base.g, base.b);        // how much red leads
  float lowGreen = 1.0 - smoothstep(0.30, 0.55, base.g); // reject skin (high green)

  float mask =
      smoothstep(0.22, 0.42, redDom) *   // red must clearly lead
      smoothstep(0.45, 0.70, sat) *      // must be vivid, not a muted skin tone
      smoothstep(0.20, 0.35, base.r) *   // must actually be bright red
      lowGreen;

  // "Freedom" grows away from the waist/body anchor so free-hanging cloth moves
  // more than fabric held close to the dancer.
  vec2 anchor = vec2(0.46, 0.60);
  vec2 rel = (cuv - anchor) * vec2(uImageAspect, 1.0);
  float freedom = clamp(length(rel) * 1.7, 0.18, 1.0);

  float t = uTime * 0.6 + uScroll * 7.0;
  vec2 disp = flow(cuv * 3.0, t) * uAmp * mask * freedom;

  vec4 color = texture2D(uTex, cuv + disp);
  gl_FragColor = color;
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.log('[v0] shader error:', gl.getShaderInfoLog(sh))
    gl.deleteShader(sh)
    return null
  }
  return sh
}

export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduce.matches) return

    const canvas = canvasRef.current
    if (!canvas) return

    const gl = (canvas.getContext('webgl', {
      premultipliedAlpha: false,
      antialias: true,
    }) ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    if (!gl) return

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.log('[v0] program link error:', gl.getProgramInfoLog(prog))
      return
    }
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    )
    const aPos = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const u = {
      tex: gl.getUniformLocation(prog, 'uTex'),
      canvasAspect: gl.getUniformLocation(prog, 'uCanvasAspect'),
      imageAspect: gl.getUniformLocation(prog, 'uImageAspect'),
      focus: gl.getUniformLocation(prog, 'uFocus'),
      time: gl.getUniformLocation(prog, 'uTime'),
      scroll: gl.getUniformLocation(prog, 'uScroll'),
      amp: gl.getUniformLocation(prog, 'uAmp'),
    }

    let imageAspect = 1
    let raf = 0
    let running = false
    let disposed = false

    // Smoothed scroll state for easing.
    let targetScroll = window.scrollY
    let curScroll = targetScroll
    const start = performance.now()

    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    function resize() {
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl!.viewport(0, 0, canvas.width, canvas.height)
    }

    function render(now: number) {
      if (disposed) return
      resize()
      const cAspect = canvas!.width / canvas!.height

      targetScroll = window.scrollY
      curScroll += (targetScroll - curScroll) * 0.08

      const heroH = canvas!.clientHeight || window.innerHeight
      const scrollNorm = curScroll / Math.max(1, heroH)

      gl!.uniform1i(u.tex, 0)
      gl!.uniform1f(u.canvasAspect, cAspect)
      gl!.uniform1f(u.imageAspect, imageAspect)
      gl!.uniform2f(u.focus, 0.5, 0.2)
      gl!.uniform1f(u.time, (now - start) / 1000)
      gl!.uniform1f(u.scroll, scrollNorm)
      gl!.uniform1f(u.amp, 0.009)

      gl!.drawArrays(gl!.TRIANGLES, 0, 3)
      raf = requestAnimationFrame(render)
    }

    function play() {
      if (running || disposed) return
      running = true
      raf = requestAnimationFrame(render)
    }
    function pause() {
      running = false
      cancelAnimationFrame(raf)
    }

    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = '/gallery/hero.png'
    img.onload = () => {
      if (disposed) return
      imageAspect = img.naturalWidth / img.naturalHeight
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      resize()
      setReady(true)
      play()
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) play()
          else pause()
        }
      },
      { threshold: 0 },
    )
    io.observe(canvas)

    const onResize = () => resize()
    window.addEventListener('resize', onResize)

    return () => {
      disposed = true
      pause()
      io.disconnect()
      window.removeEventListener('resize', onResize)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buf)
      gl.deleteTexture(tex)
    }
  }, [])

  return (
    <>
      <Image
        src="/gallery/hero.png"
        alt="Lifestyle photography by Angi Scott"
        fill
        priority
        className="object-cover object-[center_20%]"
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </>
  )
}
