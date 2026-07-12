# Project Brief — Workspace MCP

## Description

Generic secure local development platform exposing controlled developer capabilities to AI clients through MCP.

## Project Type

`mcp-server` — local-first platform with optional extensions

## Current State

**Phase 0 Discovery COMPLETE** (architecture pivot 2026-07-11). MCP **not implemented**.

## Problem

AI assistants need safe, consistent access to diverse repositories—studio, client, personal, OSS, ADOS and non-ADOS—without over-exposing the host.

## Solution

Generic **core** (FS, Git, search, commands, audit, permissions, capability detection) + **optional extensions** (ADOS, hDS, MJS, Docker, languages, etc.).

## Architectural Pivot

Replaced `merciless-janitors-workspace-mcp`. MJS is a **consumer**, not product owner.

## Authorized Roots

Initial: `~/Documents/dev`. Explicit workspace registration. Deny-by-default.

## First Proof (M1)

Core read-only + capability detection report. **No extensions.**

## Core Responsibilities

Workspace discovery, FS, Git, search, safe commands, inspection, docs, workflows, audit, permissions, config, testing, tool discovery, client compatibility.

## Extensions (Future)

Agentic Delivery OS, hDS, Merciless Janitors Studios, Universe Engine, Docker, GitHub, Figma, PostgreSQL, Node, Python, Rust, React.

## Key Docs

`docs/PROJECT_CONTEXT.md`, `docs/hds/architecture/extension-architecture.md`, `docs/PROOF_PLAN.md`
