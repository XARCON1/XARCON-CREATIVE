import * as THREE from "three";

/** Extrude the outline and diamond cutout used by the XARCON brand symbol. */
export function createBrandGeometry(maxEdge = .5, bevelSegments = 5) {
  const outline = [[4, 4], [16, 4], [24, 16], [32, 4], [44, 4], [30, 24], [44, 44], [32, 44], [24, 32], [16, 44], [4, 44], [18, 24]];
  const diamond = [[24, 18], [28, 24], [24, 30], [20, 24]];
  const trace = (path: THREE.Path, points: number[][]) => {
    points.forEach(([x, y], i) => {
      const px = (x - 24) * .26, py = (24 - y) * .26;
      if (i === 0) path.moveTo(px, py); else path.lineTo(px, py);
    });
    path.closePath();
  };
  const shape = new THREE.Shape(); trace(shape, outline);
  const cutout = new THREE.Path(); trace(cutout, diamond); shape.holes.push(cutout);
  const extrusion = new THREE.ExtrudeGeometry(shape, {
    depth: 1.25, steps: 1, bevelEnabled: true,
    bevelThickness: .16, bevelSize: .12, bevelSegments,
  });
  extrusion.translate(0, 0, -.625);
  // Small surface triangles keep cursor dissolution local on the broad faces.
  const vertices = extrusion.getAttribute("position"), normals = extrusion.getAttribute("normal");
  const positions: number[] = [], directions: number[] = [];
  const edgeSquared = maxEdge * maxEdge;
  function triangle(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, na: THREE.Vector3, nb: THREE.Vector3, nc: THREE.Vector3) {
    const ab = a.distanceToSquared(b), bc = b.distanceToSquared(c), ca = c.distanceToSquared(a);
    if (Math.max(ab, bc, ca) <= edgeSquared) {
      for (const vertex of [a, b, c]) positions.push(vertex.x, vertex.y, vertex.z);
      for (const normal of [na, nb, nc]) directions.push(normal.x, normal.y, normal.z);
      return;
    }
    if (ab >= bc && ab >= ca) {
      const mid = a.clone().add(b).multiplyScalar(.5), normal = na.clone().add(nb).normalize();
      triangle(a, mid, c, na, normal, nc); triangle(mid, b, c, normal, nb, nc);
    } else if (bc >= ca) {
      const mid = b.clone().add(c).multiplyScalar(.5), normal = nb.clone().add(nc).normalize();
      triangle(a, b, mid, na, nb, normal); triangle(a, mid, c, na, normal, nc);
    } else {
      const mid = c.clone().add(a).multiplyScalar(.5), normal = nc.clone().add(na).normalize();
      triangle(a, b, mid, na, nb, normal); triangle(mid, b, c, normal, nb, nc);
    }
  }
  for (let i = 0; i < vertices.count; i += 3) {
    triangle(
      new THREE.Vector3().fromBufferAttribute(vertices, i), new THREE.Vector3().fromBufferAttribute(vertices, i + 1), new THREE.Vector3().fromBufferAttribute(vertices, i + 2),
      new THREE.Vector3().fromBufferAttribute(normals, i), new THREE.Vector3().fromBufferAttribute(normals, i + 1), new THREE.Vector3().fromBufferAttribute(normals, i + 2),
    );
  }
  extrusion.dispose();
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(directions, 3));
  // Present the mark at a three-quarter angle as the first cards enter the scene.
  geometry.rotateY(.9);
  return geometry;
}
