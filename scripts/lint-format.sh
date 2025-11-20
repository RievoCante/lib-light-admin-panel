#!/bin/bash
# Script to run linting and formatting in sequence

set -e  # Exit on error

echo "🔍 Running linter with auto-fix..."
npm run lint:fix
echo "✅ Linting completed"
echo ""

echo "💅 Formatting code..."
npm run format
echo "✅ Formatting completed"
echo ""

echo "✨ All done! Code is linted and formatted."


