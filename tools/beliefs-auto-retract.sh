#!/usr/bin/env bash
# beliefs-auto-retract.sh — Wrapper that calls the Python implementation
# The Python version is free of the duplicate-marker sed bugs.
# Preserves the same CLI interface for backward compatibility.
exec python3 "$(dirname "$0")/beliefs-auto-retract.py" "$@"
