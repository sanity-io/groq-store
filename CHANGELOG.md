<!-- markdownlint-disable --><!-- textlint-disable -->

# 📓 Changelog

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.2.0](https://github.com/sanity-io/groq-store/compare/v2.1.0...v2.2.0) (2023-06-27)

### Features

- parity between overlayDrafts and perspectives=previewDrafts ([#92](https://github.com/sanity-io/groq-store/issues/92)) ([4e85b4f](https://github.com/sanity-io/groq-store/commit/4e85b4f656a2cf774d8d50f9d7b407e720bed022))

### Bug Fixes

- **docs:** the default `listen` value is `false` ([7264c50](https://github.com/sanity-io/groq-store/commit/7264c509c33e3d7d495f2072f7900d7d89a2e343))

## [2.1.0](https://github.com/sanity-io/groq-store/compare/v2.0.9...v2.1.0) (2023-03-22)

### Features

- use `@sanity/eventsource` instead of `eventsource` ([7656c97](https://github.com/sanity-io/groq-store/commit/7656c974a1f79f5772cb848612e86664071fdef3))

## [2.0.9](https://github.com/sanity-io/groq-store/compare/v2.0.8...v2.0.9) (2023-03-22)

### Bug Fixes

- **deps:** dedupe `groq-js` ([9b471ff](https://github.com/sanity-io/groq-store/commit/9b471ff980f089e095a15f400f17923f3743bc24))
- **deps:** lock file maintenance ([#82](https://github.com/sanity-io/groq-store/issues/82)) ([ba1a086](https://github.com/sanity-io/groq-store/commit/ba1a0869ff6811e630c0af7bb22b036ed1a78ad9))

## [2.0.8](https://github.com/sanity-io/groq-store/compare/v2.0.7...v2.0.8) (2023-03-08)

### Bug Fixes

- **deps:** update dependency groq-js to ^1.1.8 ([#68](https://github.com/sanity-io/groq-store/issues/68)) ([c5739f5](https://github.com/sanity-io/groq-store/commit/c5739f5b742db75036ba3ddcda5d43a67eee12c8))

## [2.0.7](https://github.com/sanity-io/groq-store/compare/v2.0.6...v2.0.7) (2023-02-14)

### Bug Fixes

- bump `groq-js` to `1.1.7` ([57ea046](https://github.com/sanity-io/groq-store/commit/57ea046ed323129f7eaf3fb7ed8c2c6283e4c3ab))

## [2.0.6](https://github.com/sanity-io/groq-store/compare/v2.0.5...v2.0.6) (2023-02-01)

### Bug Fixes

- **deps:** lock file maintenance ([#57](https://github.com/sanity-io/groq-store/issues/57)) ([8f2d0c2](https://github.com/sanity-io/groq-store/commit/8f2d0c291634c9cd8a84f753c727b5cc030f9a0a))

## [2.0.5](https://github.com/sanity-io/groq-store/compare/v2.0.4...v2.0.5) (2023-01-23)

### Bug Fixes

- **deps:** update dependency @sanity/semantic-release-preset to v4 ([#54](https://github.com/sanity-io/groq-store/issues/54)) ([b218e3f](https://github.com/sanity-io/groq-store/commit/b218e3f35b0e89a1820fa64898a0355d9c8aaeaf))

## [2.0.4](https://github.com/sanity-io/groq-store/compare/v2.0.3...v2.0.4) (2023-01-14)

### Bug Fixes

- **deps:** update devdependencies (non-major) ([#47](https://github.com/sanity-io/groq-store/issues/47)) ([8025c37](https://github.com/sanity-io/groq-store/commit/8025c372962077f1ab7830a9b8fea2dbc152c521))

## [2.0.3](https://github.com/sanity-io/groq-store/compare/v2.0.2...v2.0.3) (2023-01-12)

### Bug Fixes

- **deps:** update `groq` ([#44](https://github.com/sanity-io/groq-store/issues/44)) ([36367e0](https://github.com/sanity-io/groq-store/commit/36367e0d709649f83a9c283e2703ae1f603ef669))

## [2.0.2](https://github.com/sanity-io/groq-store/compare/v2.0.1...v2.0.2) (2023-01-12)

### Bug Fixes

- use the beta of `groq-js` ([22acdfe](https://github.com/sanity-io/groq-store/commit/22acdfed0b54f2ed281c68f76d085f1364696c08))

## [2.0.1](https://github.com/sanity-io/groq-store/compare/v2.0.0...v2.0.1) (2023-01-12)

### Bug Fixes

- use correct `pkg.typings` path ([b73ebe8](https://github.com/sanity-io/groq-store/commit/b73ebe899466ff0219a72477e434fcd7779441b2))

## [2.0.0](https://github.com/sanity-io/groq-store/compare/v1.1.5...v2.0.0) (2023-01-12)

### ⚠ BREAKING CHANGES

- no longer shipping ES5 syntax, the new compile target
  is browsers capable of running ESM natively. The Node.js baseline is
  still v14.

### Features

- add 100% ESM support ([e2bb872](https://github.com/sanity-io/groq-store/commit/e2bb872b9e056d2d1aa1a2e1c604f4b74a49d3bd))

### Bug Fixes

- only specify the major version for dependencies that should dedupe well ([e970b07](https://github.com/sanity-io/groq-store/commit/e970b079af4eab8a35dec25d8de311dd228a79a9))

## [1.1.5](https://github.com/sanity-io/groq-store/compare/v1.1.4...v1.1.5) (2023-01-12)

### Bug Fixes

- **deps:** update sanity monorepo to v3 (major) ([#36](https://github.com/sanity-io/groq-store/issues/36)) ([4b3f284](https://github.com/sanity-io/groq-store/commit/4b3f2842c7661085bd54d1d66d47382c6a172f5f))

## [1.1.4](https://github.com/sanity-io/groq-store/compare/v1.1.3...v1.1.4) (2022-11-18)

### Bug Fixes

- support `swcMinify` in NextJS 13 ([f3063a4](https://github.com/sanity-io/groq-store/commit/f3063a423ca91697118ff6b8a16cbce0fe678869))

## [1.1.3](https://github.com/sanity-io/groq-store/compare/v1.1.2...v1.1.3) (2022-11-16)

### Bug Fixes

- bump `groq-js` ([8aad5a4](https://github.com/sanity-io/groq-store/commit/8aad5a424264d51eabce512c5e0182fa00ca878f))

## [1.1.2](https://github.com/sanity-io/groq-store/compare/v1.1.1...v1.1.2) (2022-11-16)

### Bug Fixes

- use tsdoc `@defaultValue` ([5c207d5](https://github.com/sanity-io/groq-store/commit/5c207d5bf7ddbf65b5f58575b4363b3b8b7baee5))

## [1.1.1](https://github.com/sanity-io/groq-store/compare/v1.1.0...v1.1.1) (2022-11-15)

### Bug Fixes

- improve error messages for invalid `token` and `EventSource` configs ([51aeb75](https://github.com/sanity-io/groq-store/commit/51aeb75394a3eb28287ede69f944aefc0ce86a95))

## [1.1.0](https://github.com/sanity-io/groq-store/compare/v1.0.4...v1.1.0) (2022-11-15)

### Features

- add support for fetching subset of dataset by type ([#2](https://github.com/sanity-io/groq-store/issues/2)) ([0171a06](https://github.com/sanity-io/groq-store/commit/0171a0668ad89a0d9e4098e11bbf84d7b9b93633))

## [1.1.0-add-type-allowlist.1](https://github.com/sanity-io/groq-store/compare/v1.0.4...v1.1.0-add-type-allowlist.1) (2022-11-14)

### Features

- add support for fetching subset of dataset by type ([0e06463](https://github.com/sanity-io/groq-store/commit/0e06463cb9b79669c541186f379ab2d7beccbcad))

## [1.0.4](https://github.com/sanity-io/groq-store/compare/v1.0.3...v1.0.4) (2022-11-10)

### Bug Fixes

- export `Config` typings ([70e8fcf](https://github.com/sanity-io/groq-store/commit/70e8fcf6c144796a7047b0fa0610c73497085f11))

## [1.0.3](https://github.com/sanity-io/groq-store/compare/v1.0.2...v1.0.3) (2022-10-28)

### Bug Fixes

- **deps:** update dependency groq-js to ^1.1.1 ([#25](https://github.com/sanity-io/groq-store/issues/25)) ([9c61b10](https://github.com/sanity-io/groq-store/commit/9c61b10ff1b8b7db3edaa008d6a1bc6dd8b50513))

## [1.0.2](https://github.com/sanity-io/groq-store/compare/v1.0.1...v1.0.2) (2022-10-27)

### Bug Fixes

- **README:** the min supported Node version is 14 ([0b717b2](https://github.com/sanity-io/groq-store/commit/0b717b232d3f769cf70946a735806eb47eaa378d))

### [1.0.1](https://github.com/sanity-io/groq-store/compare/v1.0.0...v1.0.1) (2022-10-27)

### Bug Fixes

- **deps:** update dependencies (non-major) ([#17](https://github.com/sanity-io/groq-store/issues/17)) ([2f1c7f6](https://github.com/sanity-io/groq-store/commit/2f1c7f61846eace223f8a2b69179919841d5f570))
- **deps:** update dependency eventsource to v2 ([#22](https://github.com/sanity-io/groq-store/issues/22)) ([c12c92d](https://github.com/sanity-io/groq-store/commit/c12c92da7a1a0599e4a032b15b8c669d01ba45df))

## [1.0.0](https://github.com/sanity-io/groq-store/compare/v0.4.1...v1.0.0) (2022-10-27)

### ⚠ BREAKING CHANGES

- adding `pkg.exports` can sometimes require changes in your build system. It should work exactly like before but we're making it a major release to ensure nobody pulls in this version accidentally

### Bug Fixes

- add `pkg.exports` ([c261392](https://github.com/sanity-io/groq-store/commit/c261392db7de9e0e18d23efddbdab0112534ba5f))

### [0.4.1](https://github.com/sanity-io/groq-store/compare/v0.4.0...v0.4.1) (2022-08-19)

### Bug Fixes

- **deps:** previous commit updated groq-js ([14cdf8c](https://github.com/sanity-io/groq-store/commit/14cdf8c439deda9f24298930de012875c0547bf2))
