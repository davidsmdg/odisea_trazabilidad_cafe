#!/bin/bash
# Script to run the project locally using the installed node_runtime

# Get the absolute path of the project directory
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Add the local node_runtime to the PATH
export PATH="$PROJECT_DIR/node_runtime/bin:$PATH"

# Run the development server
echo "Starting development server..."
npm run dev
