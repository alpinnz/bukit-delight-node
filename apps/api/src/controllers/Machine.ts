import type {
  FavoriteAnalysis,
  FavoriteMenuRecord,
} from "@bukit-delight/shared";

type MenuSummary = FavoriteMenuRecord & {
  no: number;
  name: string;
  total_transactions: number;
  price: number;
};
type MenuPoint = { no: number; name_menu: string; x: number; y: number };
type Centroid = { x: number; y: number };
type ClusterNumber = 1 | 2 | 3;
type DistanceRow = {
  c1: number;
  c2: number;
  c3: number;
  no: number;
  cluster: ClusterNumber;
};
type ClusterCoordinates = { x: number; y: number };
type ClusterPoint = {
  no: number;
  c1: ClusterCoordinates;
  c2: ClusterCoordinates;
  c3: ClusterCoordinates;
};
type ClusterAggregate = { x: number; y: number };
type ClusterDetail = {
  sum: Record<"c1" | "c2" | "c3", ClusterAggregate>;
  count: Record<"c1" | "c2" | "c3", ClusterAggregate>;
  avg: Record<"c1" | "c2" | "c3", Centroid>;
};
type KMeansIteration = {
  iterasi: number;
  data: DistanceRow[];
  new_data: { data: ClusterPoint[]; detail: ClusterDetail };
};

const err = (message: unknown, status = 500) =>
  Object.assign(new Error(String(message)), { status });

const selectExtreme = (
  points: MenuPoint[],
  direction: "max" | "min",
): MenuPoint => {
  return points.reduce((selected, point) => {
    const xIsBetter =
      direction === "max" ? point.x > selected.x : point.x < selected.x;
    const yBreaksTie =
      point.x === selected.x &&
      (direction === "max" ? point.y > selected.y : point.y < selected.y);
    return xIsBetter || yBreaksTie ? point : selected;
  });
};

const getMiddle = (points: MenuPoint[]): MenuPoint => {
  const random = Math.floor(Math.random() * points.length) + 1;
  const index =
    random === points.length || random === points.length - 1
      ? random - 2
      : random;
  return points[index];
};

const euclideanDistance = (point: Centroid, centroid: Centroid): number =>
  Math.sqrt((point.x - centroid.x) ** 2 + (point.y - centroid.y) ** 2);

const assignCluster = (
  distances: Pick<DistanceRow, "c1" | "c2" | "c3">,
): ClusterNumber => {
  const minimum = Math.min(distances.c1, distances.c2, distances.c3);
  if (distances.c1 === minimum) return 1;
  if (distances.c2 === minimum) return 2;
  if (distances.c3 === minimum) return 3;
  throw new Error("Unable to assign a cluster for invalid distances");
};

const createClusterPoints = (
  data: DistanceRow[],
  points: MenuPoint[],
): ClusterPoint[] =>
  data.map(({ cluster, no }) => {
    const point = points.find((candidate) => candidate.no === no)!;
    return {
      no,
      c1: cluster === 1 ? { x: point.x, y: point.y } : { x: 0, y: 0 },
      c2: cluster === 2 ? { x: point.x, y: point.y } : { x: 0, y: 0 },
      c3: cluster === 3 ? { x: point.x, y: point.y } : { x: 0, y: 0 },
    };
  });

const calculateDetail = (points: ClusterPoint[]): ClusterDetail => {
  const clusterNames = ["c1", "c2", "c3"] as const;
  const sum = Object.fromEntries(
    clusterNames.map((name) => [
      name,
      points.reduce(
        (total, point) => ({
          x: total.x + point[name].x,
          y: total.y + point[name].y,
        }),
        { x: 0, y: 0 },
      ),
    ]),
  ) as ClusterDetail["sum"];
  const count = Object.fromEntries(
    clusterNames.map((name) => [
      name,
      points.reduce(
        (total, point) => ({
          x: total.x + Number(point[name].x > 0),
          y: total.y + Number(point[name].y > 0),
        }),
        { x: 0, y: 0 },
      ),
    ]),
  ) as ClusterDetail["count"];
  const avg = Object.fromEntries(
    clusterNames.map((name) => [
      name,
      { x: sum[name].x / count[name].x, y: sum[name].y / count[name].y },
    ]),
  ) as ClusterDetail["avg"];
  return { sum, count, avg };
};

const clusterAssignmentsChanged = (
  previous: KMeansIteration,
  current: KMeansIteration,
): boolean =>
  previous.data.some(
    (assignment, index) => assignment.cluster !== current.data[index].cluster,
  );

const analyzeFavorites = (menus: MenuSummary[]): FavoriteAnalysis => {
  const points: MenuPoint[] = menus.map((menu) => ({
    no: menu.no,
    name_menu: menu.name,
    x: menu.total_transactions,
    y: menu.price,
  }));
  if (points.length === 0) throw err("No menu transaction data available");

  const initialMenus = [
    selectExtreme(points, "max"),
    getMiddle(points),
    selectExtreme(points, "min"),
  ];
  const initial = initialMenus.map(({ x, y }) => ({ x, y })) as [
    Centroid,
    Centroid,
    Centroid,
  ];
  let centroids = initial;
  const iterations: KMeansIteration[] = [];
  let hasChanged = true;

  while (hasChanged) {
    const data: DistanceRow[] = points.map((point) => {
      const distances = {
        c1: euclideanDistance(point, centroids[0]),
        c2: euclideanDistance(point, centroids[1]),
        c3: euclideanDistance(point, centroids[2]),
      };
      return { ...distances, no: point.no, cluster: assignCluster(distances) };
    });
    const newData = createClusterPoints(data, points);
    const detail = calculateDetail(newData);
    const iteration: KMeansIteration = {
      iterasi: iterations.length + 1,
      data,
      new_data: { data: newData, detail },
    };
    const previous = iterations[iterations.length - 1];
    iterations.push(iteration);
    centroids = [detail.avg.c1, detail.avg.c2, detail.avg.c3];
    hasChanged = previous
      ? clusterAssignmentsChanged(previous, iteration)
      : true;
  }

  const finalAssignments = iterations[iterations.length - 1].data;
  const menuClusters = {
    c1: finalAssignments
      .filter(({ cluster }) => cluster === 1)
      .map(({ no }) => menus.find((menu) => menu.no === no)!)
      .sort(
        (left, right) => right.total_transactions - left.total_transactions,
      ),
    c2: finalAssignments
      .filter(({ cluster }) => cluster === 2)
      .map(({ no }) => menus.find((menu) => menu.no === no)!)
      .sort(
        (left, right) => right.total_transactions - left.total_transactions,
      ),
    c3: finalAssignments
      .filter(({ cluster }) => cluster === 3)
      .map(({ no }) => menus.find((menu) => menu.no === no)!)
      .sort(
        (left, right) => right.total_transactions - left.total_transactions,
      ),
  };
  const favorites = [
    ...menuClusters.c1.slice(0, 2),
    ...menuClusters.c2.slice(0, 2),
    ...menuClusters.c3.slice(0, 2),
  ];
  const labeledCentroids = initialMenus.map((menu, index) => ({
    ...menus.find((candidate) => candidate.no === menu.no)!,
    c: `c${index + 1}`,
  }));

  return {
    c_awal: labeledCentroids,
    DataSet: points,
    data_kmeans: iterations,
    menu_cluster_akhir: menuClusters,
    menu_favorit: favorites,
  };
};

export = { analyzeFavorites };
