/* global PIXI */

class PixiRenderer {
  constructor () {
    this.scene = null
    this.mesh = null
    this.uvs = []
    this.pos = []
    this.colors = []
    this.ib = []
    this.size = []
  }

  addJob (job) {
    const { ranges } = job

    for (const range of ranges) {
      const { beginTimestamp, endTimestamp, processorId } = range

      const width = parseFloat(endTimestamp - beginTimestamp)
      const height = 20.0

      const offset = this.pos.length / 2

      this.pos.push(
        beginTimestamp, processorId * 28,
        beginTimestamp, processorId * 28 - 20,
        beginTimestamp + width, processorId * 28 - 20,
        beginTimestamp + width, processorId * 28
      )
      this.colors.push(
        0.7, 0.1, 0.1,
        0.7, 0.1, 0.1,
        0.7, 0.1, 0.1,
        0.7, 0.1, 0.1
      )
      this.uvs.push(
        0, 0,
        0, 1,
        1, 1,
        1, 0
      )
      this.ib.push(
        offset, offset + 1, offset + 2,
        offset, offset + 2, offset + 3
      )
      this.size.push(
        width, height,
        width, height,
        width, height,
        width, height
      )
    }
  }

  addRange (x, y, width, color) {
    this.scalableContainer.beginFill(color)
    this.scalableContainer.drawRect(x, y, width, 20)
    this.scalableContainer.endFill()
  }

  transformRanges (translateStart, translateFactor, scaleFactor) {
    // this.scalableContainer.setTransform(
    //   -translateStart - translateFactor,
    //   0,
    //   scaleFactor
    // )
    this.mesh.setTransform(
      -translateStart - translateFactor,
      0,
      scaleFactor
    )
  }

  scaleRanges (scaleFactor) {
    this.scalableContainer.scale = scaleFactor
  }

  translateRange (translateStart, translateFactor) {
    // this.scalableContainer.translate(-translateFactor)
    // this.scalableContainer.translate(-translateStart)
    // this.nonScalableContainer.translate(-translateFactor)
    // this.nonScalableContainer.translate(-translateStart)
  }

  initMesh () {
    const geometry = new PIXI.Geometry()
      .addAttribute(
        'aPos',
        this.pos,
        2
      )
      .addAttribute(
        'aUv',
        this.uvs,
        2
      )
      .addAttribute(
        'aSize',
        this.size,
        2
      )
      .addAttribute(
        'aColor',
        this.colors,
        3
      )
      .addIndex(this.ib)

    const vertexSrc = `
      #version 300 es
      precision mediump float;

      in vec2 aPos;
      in vec2 aUv;
      in vec3 aColor;
      in vec2 aSize;

      uniform mat3 translationMatrix;
      uniform mat3 projectionMatrix;

      out vec2 uv;
      out vec3 color;
      out vec2 size;

      void main() {
        uv = aUv;
        color = aColor;
        size = aSize;
        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aPos, 1.0)).xy, 0.0, 1.0);
      }
    `

    const fragmentSrc = `
      #version 300 es
      precision mediump float;

      in vec2 uv;
      in vec3 color;
      in vec2 size;

      out vec4 fragColor;

      uniform float borderWidth;

      void main() {
        float uvDx = fwidth(uv.x);
        float uvDy = fwidth(uv.y);

        float w = 1.0 / uvDx;
        float h = 1.0 / uvDy;

        float a1 = smoothstep((borderWidth + 0.1) * uvDx, (borderWidth - 0.1) * uvDx, uv.x);
        float a2 = smoothstep((w - borderWidth - 0.1) * uvDx, (w - borderWidth + 0.1) * uvDx, uv.x);
        float a3 = smoothstep((borderWidth + 0.1) * uvDy, (borderWidth - 0.1) * uvDy, uv.y);
        float a4 = smoothstep((h - borderWidth - 0.1) * uvDy, (h - borderWidth + 0.1) * uvDy, uv.y);
        float a = max(a1, max(a2, max(a3, a4)));

        vec3 col = mix(color, vec3(0.0), 0.3);

        col = mix(color, col, a);

        fragColor = vec4(col, 1.0);
      }
    `

    const uniforms = {
      borderWidth: 1.0
    }

    const shader = PIXI.Shader.from(vertexSrc, fragmentSrc, uniforms)

    this.mesh = new PIXI.Mesh(geometry, shader)

    this.scene.stage.addChild(this.mesh)
  }

  getScene () {
    return this.scene?.view
  }

  setScene (width, height) {
    this.scene = new PIXI.Application({ transparent: true, width, height })

    console.log(this)

    this.initMesh()
  }

  clearScene () {
    this.scalableContainer.clear()
    this.nonScalableContainer.clear()
  }
}

export { PixiRenderer }
