const normalizePoints = (points) => {
  let refZ = points[0].z;
  const lastPt = points[points.length -1];

  if (lastPt.x === 0.0 && lastPt.y === 0.0) {
    refZ = lastPt.z;
  }

  return points.reduce( (lst, pt) => {
    lst.push({x: pt.x, y: pt.y, z: pt.z - refZ});
    return lst;
  }, []);
};