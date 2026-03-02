
/**
 * Calculates the RUT/RUN check digit (DV)
 */
export function calculateDV(rut: number): string {
  let m = 0, s = 1;
  for (; rut; rut = Math.floor(rut / 10)) {
    s = (s + (rut % 10) * (9 - (m++ % 6))) % 11;
  }
  return s ? (s - 1).toString() : 'K';
}

/**
 * Generates a random RUN (10MM to 25MM)
 */
export function generateRandomRUN(): string {
  const num = Math.floor(Math.random() * (25000000 - 10000000) + 10000000);
  const dv = calculateDV(num);
  return `${num}-${dv}`;
}

/**
 * Generates a random Serial (9 digits)
 */
export function generateRandomSerial(): string {
  return Math.floor(Math.random() * 900000000 + 100000000).toString();
}

/**
 * Generates a random MRZ numeric string (20 digits)
 */
export function generateRandomMRZ(): string {
  let res = '';
  for(let i = 0; i < 20; i++) {
    res += Math.floor(Math.random() * 10).toString();
  }
  return res;
}

export function buildUrl(run: string, serial: string, mrz: string): string {
  return `https://portal.nuevosidiv.registrocivil.cl/document-validity?RUN=${run}&type=CEDULA&serial=${serial}&mrz=${mrz}`;
}
