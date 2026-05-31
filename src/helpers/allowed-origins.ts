export function getAllowedOrigins() {
  return [
    process.env.ACCESS_CONTROLLER_FRONT_END,
    process.env.ACCESS_CONTROLLER_ALLOWED_ORIGINS,
  ]
    .flatMap((origin) => origin?.split(',') ?? [])
    .map((origin) => origin.trim())
    .filter(Boolean);
}
