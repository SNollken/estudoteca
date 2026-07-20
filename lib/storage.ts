export async function getCertificateBucket() {
  const { env } = await import("cloudflare:workers");
  if (!env.BUCKET) throw new Error("O armazenamento de certificados está indisponível.");
  return env.BUCKET;
}
