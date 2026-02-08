// 3D Chain-Angle Solver 型定義

export type Vector3 = [number, number, number];

export interface InputParams {
  A: Vector3;
  B0: Vector3;
  P: Vector3;
  d: Vector3;
  L: number;
  theta0: number; // 度
  tolerances?: {
    L?: { min: number; max: number };
    A?: Vector3;
    B0?: Vector3;
  };
}

export interface CalculationResult {
  success: boolean;
  error: string | null;
  result?: {
    theta1: number; // 度
    theta2: number; // 度
    deltaTheta1: number; // 度
    deltaTheta2: number; // 度
    B_theta1: Vector3;
    B_theta2: Vector3;
    distance1: number;
    distance2: number;
    toleranceAngles?: {
      thetaMin: number; // 度
      thetaMax: number; // 度
    };
  };
  threeDData?: ThreeDData;
}

export interface ThreeDData {
  axisLine: { start: Vector3; end: Vector3 };
  orbitCircle: Vector3[];
  points: {
    A: Vector3;
    B0: Vector3;
    B_theta1: Vector3 | null;
    B_theta2: Vector3 | null;
    B_min: Vector3 | null;
    B_max: Vector3 | null;
  };
  chainLines: [Vector3, Vector3][];
}

export interface DisplayOptions {
  showAxis: boolean;
  showOrbit: boolean;
  showPoints: boolean;
  showChains: boolean;
  showTolerance: boolean;
}
