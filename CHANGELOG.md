# Changelog

All notable changes to the "htmx-tags" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive integration test suite
- Bundling with esbuild for improved performance
- Context-aware completions (only trigger inside HTML tags)
- Error handling and data validation
- Extension icon and gallery banner
- CI/CD workflow with GitHub Actions
- Support for untrusted workspaces
- Enhanced documentation with badges and requirements

### Changed
- Migrated from JavaScript to TypeScript
- Bumped minimum VSCode version to 1.74.0
- Improved completion provider with robust error handling
- Enhanced TypeScript configuration with stricter compiler options
- Updated to HTMX 2.0.8

### Fixed
- Typo in build-data.py ("documention" → "documentation")
- Improved logging in build script

## [1.0.0] - Initial Release

### Added
- HTMX attribute autocompletion for HTML files
- Support for django-html language
- Support for .htmx file extension
- Inline documentation for HTMX attributes
- Documentation links to official HTMX docs
