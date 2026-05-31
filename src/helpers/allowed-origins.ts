export function getAllowedOrigins() {
  return [
    process.env.ACCESS_CONTROLLER_FRONT_END,
    process.env.ACCESS_CONTROLLER_ALLOWED_ORIGINS,
  ]
    .flatMap((origin) => origin?.split(',') ?? [])
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function isOriginAllowed(origin?: string) {
  if (!origin) {
    return true;
  }

  const allowedOrigins = getAllowedOrigins();

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  try {
    const { hostname } = new URL(origin);

    return hostname === 'amplifyapp.com' || hostname.endsWith('.amplifyapp.com');
  } catch {
    return false;
  }
}

export function corsOrigin(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
  callback(null, isOriginAllowed(origin));
}
