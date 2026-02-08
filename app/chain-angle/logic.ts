// 3D Chain-Angle Solver 計算ロジック

import type { Vector3, InputParams, CalculationResult, ThreeDData } from './types';

// ベクトル演算ユーティリティ
function add(v1: Vector3, v2: Vector3): Vector3 {
  return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
}

function subtract(v1: Vector3, v2: Vector3): Vector3 {
  return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
}

function scale(v: Vector3, s: number): Vector3 {
  return [v[0] * s, v[1] * s, v[2] * s];
}

function dot(v1: Vector3, v2: Vector3): number {
  return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}

function cross(v1: Vector3, v2: Vector3): Vector3 {
  return [
    v1[1] * v2[2] - v1[2] * v2[1],
    v1[2] * v2[0] - v1[0] * v2[2],
    v1[0] * v2[1] - v1[1] * v2[0],
  ];
}

function magnitude(v: Vector3): number {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

function normalize(v: Vector3): Vector3 | null {
  const mag = magnitude(v);
  if (mag < 1e-10) return null;
  return scale(v, 1 / mag);
}

function distance(v1: Vector3, v2: Vector3): number {
  return magnitude(subtract(v1, v2));
}

// Rodriguesの回転公式で点を回転
function rotatePoint(point: Vector3, axis: Vector3, angleRad: number): Vector3 {
  const cosTheta = Math.cos(angleRad);
  const sinTheta = Math.sin(angleRad);
  const dotProduct = dot(axis, point);
  
  const term1 = scale(point, cosTheta);
  const term2 = scale(cross(axis, point), sinTheta);
  const term3 = scale(axis, dotProduct * (1 - cosTheta));
  
  return add(add(term1, term2), term3);
}

// B(θ) の位置を計算
function calculateB(B0_prime: Vector3, d_norm: Vector3, P: Vector3, thetaDeg: number): Vector3 {
  const thetaRad = (thetaDeg * Math.PI) / 180;
  const B_prime = rotatePoint(B0_prime, d_norm, thetaRad);
  return add(P, B_prime);
}

// f(θ) = ||A - B(θ)|| - L
function distanceFunction(thetaDeg: number, A: Vector3, B0_prime: Vector3, d_norm: Vector3, P: Vector3, L: number): number {
  const B_theta = calculateB(B0_prime, d_norm, P, thetaDeg);
  const dist = distance(A, B_theta);
  return dist - L;
}

// 二分法で解を探索
function bisectionMethod(
  A: Vector3,
  B0_prime: Vector3,
  d_norm: Vector3,
  P: Vector3,
  L: number,
  thetaMin: number,
  thetaMax: number,
  tolerance: number = 1e-6,
  maxIterations: number = 100
): number | null {
  let a = thetaMin;
  let b = thetaMax;
  let fa = distanceFunction(a, A, B0_prime, d_norm, P, L);
  let fb = distanceFunction(b, A, B0_prime, d_norm, P, L);
  
  // 解が存在しない場合
  if (fa * fb > 0) return null;
  
  for (let i = 0; i < maxIterations; i++) {
    const c = (a + b) / 2;
    const fc = distanceFunction(c, A, B0_prime, d_norm, P, L);
    
    if (Math.abs(fc) < tolerance || (b - a) / 2 < tolerance) {
      return c;
    }
    
    if (fa * fc < 0) {
      b = c;
      fb = fc;
    } else {
      a = c;
      fa = fc;
    }
  }
  
  return (a + b) / 2;
}

// ニュートン法で精密化
function newtonMethod(
  initialGuess: number,
  A: Vector3,
  B0_prime: Vector3,
  d_norm: Vector3,
  P: Vector3,
  L: number,
  tolerance: number = 1e-6,
  maxIterations: number = 50
): number {
  let theta = initialGuess;
  const h = 0.001; // 数値微分のステップ
  
  for (let i = 0; i < maxIterations; i++) {
    const f = distanceFunction(theta, A, B0_prime, d_norm, P, L);
    
    if (Math.abs(f) < tolerance) {
      return theta;
    }
    
    // 数値微分で f'(θ) を計算
    const fPlus = distanceFunction(theta + h, A, B0_prime, d_norm, P, L);
    const fMinus = distanceFunction(theta - h, A, B0_prime, d_norm, P, L);
    const df = (fPlus - fMinus) / (2 * h);
    
    if (Math.abs(df) < 1e-10) break;
    
    theta = theta - f / df;
  }
  
  return theta;
}

// 軌道円を生成（36分割）
function generateOrbitCircle(B0_prime: Vector3, d_norm: Vector3, P: Vector3, segments: number = 36): Vector3[] {
  const circle: Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i * 360) / segments;
    const B = calculateB(B0_prime, d_norm, P, angle);
    circle.push(B);
  }
  return circle;
}

// メイン計算関数
export function calculateChainAngle(params: InputParams): CalculationResult {
  const { A, B0, P, d, L, theta0, tolerances } = params;
  
  // 1. 回転軸の正規化
  const d_norm = normalize(d);
  if (!d_norm) {
    return {
      success: false,
      error: '回転軸ベクトルがゼロです。有効な方向ベクトルを入力してください。',
    };
  }
  
  // 2. 座標変換（内部計算用に原点をPに移動）
  const A_prime = subtract(A, P);
  const B0_prime = subtract(B0, P);
  
  // 3. 解1を探索（0° 〜 90°）
  const theta1_raw = bisectionMethod(A_prime, B0_prime, d_norm, [0, 0, 0], L, 0, 90);
  let theta1: number | null = null;
  let B_theta1: Vector3 | null = null;
  let distance1: number | null = null;
  
  if (theta1_raw !== null) {
    theta1 = newtonMethod(theta1_raw, A_prime, B0_prime, d_norm, [0, 0, 0], L);
    B_theta1 = calculateB(B0_prime, d_norm, P, theta1);
    distance1 = distance(A, B_theta1);
  }
  
  // 4. 解2を探索（90° 〜 180°）
  const theta2_raw = bisectionMethod(A_prime, B0_prime, d_norm, [0, 0, 0], L, 90, 180);
  let theta2: number | null = null;
  let B_theta2: Vector3 | null = null;
  let distance2: number | null = null;
  
  if (theta2_raw !== null) {
    theta2 = newtonMethod(theta2_raw, A_prime, B0_prime, d_norm, [0, 0, 0], L);
    B_theta2 = calculateB(B0_prime, d_norm, P, theta2);
    distance2 = distance(A, B_theta2);
  }
  
  // 解が存在しない場合
  if (theta1 === null && theta2 === null) {
    return {
      success: false,
      error: `指定されたチェーン長 L=${L}mm では解が存在しません。`,
    };
  }
  
  // 5. 公差解析
  let toleranceAngles: { thetaMin: number; thetaMax: number } | undefined;
  let B_min: Vector3 | null = null;
  let B_max: Vector3 | null = null;
  
  if (tolerances?.L) {
    const { min: Lmin, max: Lmax } = tolerances.L;
    
    // Lmin での角度
    const thetaMin_raw = bisectionMethod(A_prime, B0_prime, d_norm, [0, 0, 0], Lmin, 0, 180);
    const thetaMin = thetaMin_raw !== null ? newtonMethod(thetaMin_raw, A_prime, B0_prime, d_norm, [0, 0, 0], Lmin) : null;
    
    // Lmax での角度
    const thetaMax_raw = bisectionMethod(A_prime, B0_prime, d_norm, [0, 0, 0], Lmax, 0, 180);
    const thetaMax = thetaMax_raw !== null ? newtonMethod(thetaMax_raw, A_prime, B0_prime, d_norm, [0, 0, 0], Lmax) : null;
    
    if (thetaMin !== null && thetaMax !== null) {
      toleranceAngles = { thetaMin, thetaMax };
      B_min = calculateB(B0_prime, d_norm, P, thetaMin);
      B_max = calculateB(B0_prime, d_norm, P, thetaMax);
    }
  }
  
  // 6. 3D表示用データ生成
  const orbitCircle = generateOrbitCircle(B0_prime, d_norm, P);
  
  // 軸の表示範囲を計算
  const maxDist = Math.max(
    magnitude(A_prime),
    magnitude(B0_prime),
    L
  );
  const axisLength = maxDist * 1.5;
  const axisStart = add(P, scale(d_norm, -axisLength));
  const axisEnd = add(P, scale(d_norm, axisLength));
  
  const chainLines: [Vector3, Vector3][] = [];
  if (B_theta1) chainLines.push([A, B_theta1]);
  if (B_theta2) chainLines.push([A, B_theta2]);
  
  const threeDData: ThreeDData = {
    axisLine: { start: axisStart, end: axisEnd },
    orbitCircle,
    points: {
      A,
      B0,
      B_theta1,
      B_theta2,
      B_min,
      B_max,
    },
    chainLines,
  };
  
  // 7. 結果を返す
  return {
    success: true,
    error: null,
    result: {
      theta1: theta1 ?? 0,
      theta2: theta2 ?? 0,
      deltaTheta1: (theta1 ?? 0) - theta0,
      deltaTheta2: (theta2 ?? 0) - theta0,
      B_theta1: B_theta1 ?? [0, 0, 0],
      B_theta2: B_theta2 ?? [0, 0, 0],
      distance1: distance1 ?? 0,
      distance2: distance2 ?? 0,
      toleranceAngles,
    },
    threeDData,
  };
}
