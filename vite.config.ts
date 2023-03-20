import {defineConfig} from 'vitest/config'
import GithubActionsReporter from 'vitest-github-actions-reporter'

export default defineConfig({
  test: {
    // interopDefault is required for the CJS-only packages we still rely on, like eventsource
    deps: {interopDefault: true},
    // Enable rich PR failed test annotation on the CI
    reporters: process.env.GITHUB_ACTIONS ? ['default', new GithubActionsReporter()] : 'default',
  },
})
