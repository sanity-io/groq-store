export function assertEnvSupport(): void {
  const [major] = process.version.replace(/^v/, '').split('.', 1).map(Number)
  if (major < 14) {
    throw new Error('Node.js version 14 or higher required')
  }
}
